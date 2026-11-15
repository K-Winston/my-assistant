export interface PotionDef {
  name: string;
  icon: string;
  color: string;
}

/** Potions par niveau (index 0 = niveau 1). Fusionner deux potions identiques donne le niveau suivant. */
export const POTIONS: PotionDef[] = [
  { name: 'Tisane des prés', icon: '🌿', color: '#7bc96f' },
  { name: 'Eau de source', icon: '💧', color: '#4fb3e8' },
  { name: 'Philtre du trèfle', icon: '🍀', color: '#3fa34d' },
  { name: 'Potion de vigueur', icon: '🔥', color: '#f07b3f' },
  { name: 'Baume lunaire', icon: '🌙', color: '#9b8cf0' },
  { name: 'Élixir de foudre', icon: '⚡', color: '#f5c518' },
  { name: "Essence d'étoile", icon: '⭐', color: '#ffd76a' },
  { name: 'Philtre du dragon', icon: '🐉', color: '#d6453d' },
  { name: 'Nectar céleste', icon: '☁️', color: '#a9d8ff' },
  { name: 'Larme de phénix', icon: '🪶', color: '#ff8a5c' },
  { name: "Élixir d'éternité", icon: '♾️', color: '#c86bfa' },
  { name: 'Pierre philosophale', icon: '💎', color: '#3fe0d0' },
];

export const MAX_LEVEL = POTIONS.length;
export const BOARD_SIZE = 16;
export const CUSTOMER_SLOTS = 3;
export const OFFLINE_CAP_SECONDS = 8 * 3600;
export const OFFLINE_RATE = 0.5;

export type UpgradeId = 'garden' | 'quality' | 'sign';

export interface UpgradeDef {
  id: UpgradeId;
  name: string;
  icon: string;
  describe: (level: number) => string;
  baseCost: number;
  growth: number;
  max: number;
}

export const UPGRADES: UpgradeDef[] = [
  {
    id: 'garden',
    name: 'Jardin fertile',
    icon: '🌱',
    describe: (l) => `Une potion toutes les ${spawnInterval(l).toFixed(1)} s`,
    baseCost: 25,
    growth: 1.55,
    max: 25,
  },
  {
    id: 'quality',
    name: 'Chaudron enchanté',
    icon: '🫕',
    describe: (l) => `${Math.round(upgradeChance(l) * 100)} % de chance de potion niv. 2`,
    baseCost: 80,
    growth: 1.9,
    max: 10,
  },
  {
    id: 'sign',
    name: 'Enseigne dorée',
    icon: '🪧',
    describe: (l) => `Revenus ×${incomeMultiplier(l).toFixed(2)}`,
    baseCost: 150,
    growth: 1.75,
    max: 50,
  },
];

export function spawnInterval(gardenLevel: number): number {
  return Math.max(0.6, 5 * Math.pow(0.9, gardenLevel));
}

export function upgradeChance(qualityLevel: number): number {
  return Math.min(0.5, qualityLevel * 0.05);
}

export function incomeMultiplier(signLevel: number): number {
  return 1 + signLevel * 0.25;
}

export function upgradeCost(def: UpgradeDef, level: number): number {
  return Math.ceil(def.baseCost * Math.pow(def.growth, level));
}

/** Or par seconde produit par une potion posée sur l'étagère. */
export function potionIncome(level: number): number {
  return 0.5 * Math.pow(2.2, level - 1);
}

/** Récompense d'un client = environ 60 s de production de la potion demandée. */
export function customerReward(level: number): number {
  return Math.ceil(potionIncome(level) * 60);
}

const SUFFIXES = ['', 'K', 'M', 'B', 'T'];

export function fmt(n: number): string {
  if (n < 10) return (Math.floor(n * 10) / 10).toString();
  if (n < 1000) return Math.floor(n).toString();
  let i = 0;
  while (n >= 1000) {
    n /= 1000;
    i++;
  }
  let suffix: string;
  if (i < SUFFIXES.length) {
    suffix = SUFFIXES[i];
  } else {
    const idx = i - SUFFIXES.length;
    suffix = String.fromCharCode(97 + Math.floor(idx / 26)) + String.fromCharCode(97 + (idx % 26));
  }
  const digits = n < 10 ? 2 : n < 100 ? 1 : 0;
  return n.toFixed(digits).replace(/\.?0+$/, '') + suffix;
}

export function fmtDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h} h ${m.toString().padStart(2, '0')}`;
  if (m > 0) return `${m} min`;
  return `${Math.floor(seconds)} s`;
}
