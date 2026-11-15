import {
  BOARD_SIZE,
  CUSTOMER_SLOTS,
  MAX_LEVEL,
  OFFLINE_CAP_SECONDS,
  OFFLINE_RATE,
  UPGRADES,
  UpgradeId,
  customerReward,
  incomeMultiplier,
  potionIncome,
  spawnInterval,
  upgradeChance,
  upgradeCost,
} from './data';

export interface Customer {
  want: number;
  reward: number;
  avatar: string;
}

export interface GameState {
  version: 1;
  gold: number;
  /** 0 = case vide, sinon niveau de la potion */
  board: number[];
  /** progression vers la prochaine potion, en secondes écoulées */
  spawnProgress: number;
  customers: (Customer | null)[];
  /** secondes restantes avant l'arrivée d'un client dans chaque emplacement vide */
  customerTimers: number[];
  upgrades: Record<UpgradeId, number>;
  discovered: number;
  served: number;
  lastSeen: number;
}

const SAVE_KEY = 'potion-tycoon-save-v1';
const AVATARS = ['🧙', '🧝', '🧛', '🧚', '🧜', '🤴', '👸', '🧞', '🦹', '🥷', '👨‍🌾', '👩‍🔬'];

export function newGame(): GameState {
  const board = new Array(BOARD_SIZE).fill(0);
  board[0] = 1;
  board[1] = 1;
  return {
    version: 1,
    gold: 0,
    board,
    spawnProgress: 0,
    customers: new Array(CUSTOMER_SLOTS).fill(null),
    customerTimers: [1, 4, 8],
    upgrades: { garden: 0, quality: 0, sign: 0 },
    discovered: 1,
    served: 0,
    lastSeen: Date.now(),
  };
}

export function load(): GameState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const s = JSON.parse(raw) as GameState;
      if (s.version === 1 && Array.isArray(s.board) && s.board.length === BOARD_SIZE) {
        return { ...newGame(), ...s, upgrades: { ...newGame().upgrades, ...s.upgrades } };
      }
    }
  } catch {
    /* stockage indisponible ou sauvegarde corrompue : on repart de zéro */
  }
  return newGame();
}

export function save(s: GameState): void {
  s.lastSeen = Date.now();
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(s));
  } catch {
    /* navigation privée, quota… le jeu continue sans sauvegarde */
  }
}

export function resetSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* ignore */
  }
}

export function incomePerSecond(s: GameState): number {
  let total = 0;
  for (const lvl of s.board) if (lvl > 0) total += potionIncome(lvl);
  return total * incomeMultiplier(s.upgrades.sign);
}

/** Calcule les gains hors ligne depuis la dernière sauvegarde, sans les appliquer. */
export function offlineEarnings(s: GameState): { seconds: number; gold: number } {
  const seconds = Math.min(OFFLINE_CAP_SECONDS, Math.max(0, (Date.now() - s.lastSeen) / 1000));
  return { seconds, gold: incomePerSecond(s) * seconds * OFFLINE_RATE };
}

function freeCell(s: GameState): number {
  return s.board.indexOf(0);
}

/** Ajoute une nouvelle potion sur l'étagère. Renvoie l'index ou -1 si l'étagère est pleine. */
export function spawnPotion(s: GameState): number {
  const idx = freeCell(s);
  if (idx < 0) return -1;
  s.board[idx] = Math.random() < upgradeChance(s.upgrades.quality) ? 2 : 1;
  s.discovered = Math.max(s.discovered, s.board[idx]);
  return idx;
}

function makeCustomer(s: GameState): Customer {
  const top = Math.min(MAX_LEVEL, s.discovered);
  const low = Math.max(1, top - 2);
  const want = low + Math.floor(Math.random() * (top - low + 1));
  const reward = Math.ceil(customerReward(want) * incomeMultiplier(s.upgrades.sign));
  return { want, reward, avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)] };
}

export interface TickEvents {
  spawned: number[];
  customersChanged: boolean;
}

export function tick(s: GameState, dt: number): TickEvents {
  const ev: TickEvents = { spawned: [], customersChanged: false };
  s.gold += incomePerSecond(s) * dt;

  const interval = spawnInterval(s.upgrades.garden);
  s.spawnProgress += dt;
  while (s.spawnProgress >= interval) {
    if (freeCell(s) < 0) {
      s.spawnProgress = interval; // étagère pleine : on attend
      break;
    }
    s.spawnProgress -= interval;
    ev.spawned.push(spawnPotion(s));
  }

  for (let i = 0; i < s.customers.length; i++) {
    if (s.customers[i]) continue;
    s.customerTimers[i] -= dt;
    if (s.customerTimers[i] <= 0) {
      s.customers[i] = makeCustomer(s);
      ev.customersChanged = true;
    }
  }
  return ev;
}

/** Accélère le chaudron quand on tape dessus. */
export function stir(s: GameState): void {
  s.spawnProgress += spawnInterval(s.upgrades.garden) * 0.34;
}

export type DropResult = 'merge' | 'move' | 'swap' | 'none';

export function dropOnCell(s: GameState, from: number, to: number): DropResult {
  if (from === to) return 'none';
  const a = s.board[from];
  const b = s.board[to];
  if (!a) return 'none';
  if (b === 0) {
    s.board[to] = a;
    s.board[from] = 0;
    return 'move';
  }
  if (a === b && a < MAX_LEVEL) {
    s.board[to] = a + 1;
    s.board[from] = 0;
    s.discovered = Math.max(s.discovered, a + 1);
    return 'merge';
  }
  s.board[to] = a;
  s.board[from] = b;
  return 'swap';
}

/** Sert le client avec la potion de la case `from`. Renvoie l'or gagné (0 si impossible). */
export function serve(s: GameState, from: number, slot: number): number {
  const c = s.customers[slot];
  if (!c || s.board[from] !== c.want) return 0;
  s.board[from] = 0;
  s.gold += c.reward;
  s.customers[slot] = null;
  s.customerTimers[slot] = 6 + Math.random() * 6;
  s.served++;
  return c.reward;
}

export function findPotion(s: GameState, level: number): number {
  return s.board.indexOf(level);
}

export function buyUpgrade(s: GameState, id: UpgradeId): boolean {
  const def = UPGRADES.find((u) => u.id === id)!;
  const lvl = s.upgrades[id];
  if (lvl >= def.max) return false;
  const cost = upgradeCost(def, lvl);
  if (s.gold < cost) return false;
  s.gold -= cost;
  s.upgrades[id] = lvl + 1;
  return true;
}
