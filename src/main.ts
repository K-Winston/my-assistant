import './style.css';
import { MAX_LEVEL, POTIONS, UPGRADES, fmt, fmtDuration, potionIncome, spawnInterval, upgradeCost } from './data';
import {
  GameState,
  buyUpgrade,
  dropOnCell,
  findPotion,
  incomePerSecond,
  load,
  newGame,
  offlineEarnings,
  resetSave,
  save,
  serve,
  stir,
  tick,
} from './state';

let state: GameState = load();

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const goldEl = $('gold');
const rateEl = $('rate');
const boardEl = $('board');
const customersEl = $('customers');
const upgradesEl = $('upgrades');
const spawnFill = $('spawn-fill');
const cauldronBtn = $<HTMLButtonElement>('cauldron');
const modal = $('modal');
const modalCard = $('modal-card');

function vibrate(ms: number) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* non supporté */
  }
}

/* ---------- Rendu ---------- */

function potionHTML(level: number): string {
  const p = POTIONS[level - 1];
  return `<div class="potion" style="--c:${p.color}"><span class="p-icon">${p.icon}</span><span class="p-lvl">${level}</span></div>`;
}

function renderBoard(highlight: number[] = [], pop: number[] = []) {
  boardEl.innerHTML = state.board
    .map((lvl, i) => {
      const cls = ['cell'];
      if (highlight.includes(i)) cls.push('spawn');
      if (pop.includes(i)) cls.push('pop');
      return `<div class="${cls.join(' ')}" data-cell="${i}">${lvl ? potionHTML(lvl) : ''}</div>`;
    })
    .join('');
}

function renderCustomers() {
  customersEl.innerHTML = state.customers
    .map((c, i) => {
      if (!c) return `<div class="customer empty" data-slot="${i}"><span class="waiting">…</span></div>`;
      const p = POTIONS[c.want - 1];
      const ready = findPotion(state, c.want) >= 0;
      return `<button class="customer${ready ? ' ready' : ''}" data-slot="${i}" aria-label="Client veut ${p.name}">
        <span class="avatar">${c.avatar}</span>
        <span class="bubble">${potionHTML(c.want)}</span>
        <span class="reward">🪙 ${fmt(c.reward)}</span>
      </button>`;
    })
    .join('');
}

/** Met à jour la surbrillance des clients servables sans recréer les boutons. */
function updateCustomersReady() {
  customersEl.querySelectorAll<HTMLElement>('.customer[data-slot]').forEach((el) => {
    const c = state.customers[Number(el.dataset.slot)];
    el.classList.toggle('ready', !!c && findPotion(state, c.want) >= 0);
  });
}

function renderUpgrades() {
  upgradesEl.innerHTML = UPGRADES.map((u) => {
    const lvl = state.upgrades[u.id];
    const maxed = lvl >= u.max;
    const cost = upgradeCost(u, lvl);
    const can = !maxed && state.gold >= cost;
    return `<button class="upgrade${can ? ' can' : ''}" data-up="${u.id}" ${maxed ? 'disabled' : ''}>
      <span class="u-icon">${u.icon}</span>
      <span class="u-text"><strong>${u.name} <small>niv. ${lvl}</small></strong><small>${u.describe(lvl)}</small></span>
      <span class="u-cost">${maxed ? 'MAX' : '🪙 ' + fmt(cost)}</span>
    </button>`;
  }).join('');
}

function renderHud() {
  goldEl.textContent = fmt(state.gold);
  rateEl.textContent = fmt(incomePerSecond(state));
  const pct = Math.min(1, state.spawnProgress / spawnInterval(state.upgrades.garden));
  spawnFill.style.width = `${pct * 100}%`;
  // mise à jour légère de l'état "achetable" des améliorations
  upgradesEl.querySelectorAll<HTMLButtonElement>('.upgrade').forEach((btn) => {
    const def = UPGRADES.find((u) => u.id === btn.dataset.up)!;
    const lvl = state.upgrades[def.id];
    btn.classList.toggle('can', lvl < def.max && state.gold >= upgradeCost(def, lvl));
  });
}

function floatText(x: number, y: number, text: string) {
  const el = document.createElement('div');
  el.className = 'float-text';
  el.textContent = text;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

function centerOf(el: Element) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/* ---------- Modales ---------- */

function openModal(html: string, onClick?: (target: HTMLElement) => void) {
  modalCard.innerHTML = html;
  modal.classList.remove('hidden');
  modalCard.onclick = (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!t) return;
    if (t.dataset.action === 'close') closeModal();
    else onClick?.(t);
  };
}

function closeModal() {
  modal.classList.add('hidden');
}

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

function showRecipeBook() {
  const rows = POTIONS.map((p, i) => {
    const lvl = i + 1;
    const known = lvl <= state.discovered;
    return `<li class="${known ? '' : 'unknown'}">
      ${known ? potionHTML(lvl) : '<div class="potion locked"><span class="p-icon">❓</span></div>'}
      <span><strong>${known ? p.name : '???'}</strong><small>${known ? `🪙 ${fmt(potionIncome(lvl))}/s` : 'Fusionnez pour découvrir'}</small></span>
    </li>`;
  }).join('');
  openModal(
    `<h2>📖 Livre de recettes</h2>
     <p class="muted">${state.discovered} / ${MAX_LEVEL} potions découvertes · ${state.served} clients servis</p>
     <ul class="recipes">${rows}</ul>
     <div class="modal-actions">
       <button class="btn ghost" data-action="reset">Recommencer</button>
       <button class="btn" data-action="close">Fermer</button>
     </div>`,
    (t) => {
      if (t.dataset.action === 'reset' && confirm('Effacer votre progression et recommencer ?')) {
        resetSave();
        state = newGame();
        save(state);
        renderAll();
        closeModal();
      }
    },
  );
}

function showDiscovery(level: number) {
  const p = POTIONS[level - 1];
  openModal(`<div class="discovery">${potionHTML(level)}</div>
    <h2>Nouvelle potion !</h2>
    <p><strong>${p.name}</strong></p>
    <p class="muted">Rapporte 🪙 ${fmt(potionIncome(level))}/s sur l'étagère.</p>
    <div class="modal-actions"><button class="btn" data-action="close">Génial !</button></div>`);
}

function showOffline() {
  const { seconds, gold } = offlineEarnings(state);
  if (seconds < 60 || gold < 1) return;
  openModal(
    `<h2>🌙 Bon retour !</h2>
     <p>Pendant votre absence (${fmtDuration(seconds)}), votre boutique a gagné :</p>
     <p class="big-gold">🪙 ${fmt(gold)}</p>
     <div class="modal-actions"><button class="btn" data-action="collect">Récupérer</button></div>`,
    (t) => {
      if (t.dataset.action === 'collect') {
        // TODO : bouton « ×2 » avec pub récompensée (AdMob via Capacitor)
        state.gold += gold;
        save(state);
        closeModal();
      }
    },
  );
}

/* ---------- Glisser-déposer ---------- */

interface Drag {
  from: number;
  ghost: HTMLElement;
  startX: number;
  startY: number;
  moved: boolean;
  pointerId: number;
}
let drag: Drag | null = null;

boardEl.addEventListener('pointerdown', (e) => {
  const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-cell]');
  if (!cell) return;
  const from = Number(cell.dataset.cell);
  if (!state.board[from]) return;
  e.preventDefault();
  const ghost = document.createElement('div');
  ghost.className = 'ghost';
  ghost.innerHTML = potionHTML(state.board[from]);
  document.body.appendChild(ghost);
  drag = { from, ghost, startX: e.clientX, startY: e.clientY, moved: false, pointerId: e.pointerId };
  moveGhost(e.clientX, e.clientY);
  cell.classList.add('dragging');
});

function moveGhost(x: number, y: number) {
  if (!drag) return;
  drag.ghost.style.transform = `translate(${x}px, ${y}px) translate(-50%, -60%)`;
}

window.addEventListener('pointermove', (e) => {
  if (!drag || e.pointerId !== drag.pointerId) return;
  if (Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 6) drag.moved = true;
  moveGhost(e.clientX, e.clientY);
});

function endDrag(e: PointerEvent, cancelled = false) {
  if (!drag || e.pointerId !== drag.pointerId) return;
  const d = drag;
  drag = null;
  d.ghost.remove();
  if (cancelled) return renderBoard();

  const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
  const cell = target?.closest<HTMLElement>('[data-cell]');
  const customer = target?.closest<HTMLElement>('[data-slot]');

  if (customer) {
    const gained = serve(state, d.from, Number(customer.dataset.slot));
    if (gained) {
      const c = centerOf(customer);
      floatText(c.x, c.y, `+${fmt(gained)}`);
      vibrate(20);
      renderAll();
      return;
    }
  } else if (cell && d.moved) {
    const to = Number(cell.dataset.cell);
    const before = state.discovered;
    const res = dropOnCell(state, d.from, to);
    if (res === 'merge') {
      vibrate(15);
      renderBoard([], [to]);
      renderCustomers();
      if (state.discovered > before) showDiscovery(state.discovered);
      return;
    }
  }
  renderBoard();
  renderCustomers();
}

window.addEventListener('pointerup', (e) => endDrag(e));
window.addEventListener('pointercancel', (e) => endDrag(e, true));

/* ---------- Autres interactions ---------- */

customersEl.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-slot]');
  if (!btn) return;
  const slot = Number(btn.dataset.slot);
  const c = state.customers[slot];
  if (!c) return;
  const idx = findPotion(state, c.want);
  if (idx < 0) {
    btn.classList.remove('shake');
    void btn.offsetWidth;
    btn.classList.add('shake');
    return;
  }
  const gained = serve(state, idx, slot);
  const pos = centerOf(btn);
  floatText(pos.x, pos.y, `+${fmt(gained)}`);
  vibrate(20);
  renderAll();
});

cauldronBtn.addEventListener('click', (e) => {
  stir(state);
  cauldronBtn.classList.remove('bump');
  void cauldronBtn.offsetWidth;
  cauldronBtn.classList.add('bump');
  floatText(e.clientX || centerOf(cauldronBtn).x, e.clientY || centerOf(cauldronBtn).y, '✨');
});

upgradesEl.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-up]');
  if (!btn) return;
  if (buyUpgrade(state, btn.dataset.up as never)) {
    vibrate(10);
    renderUpgrades();
    renderCustomers();
  }
});

$('btn-book').addEventListener('click', showRecipeBook);

/* ---------- Boucle de jeu ---------- */

function renderAll() {
  renderBoard();
  renderCustomers();
  renderUpgrades();
  renderHud();
}

let last = performance.now();

function frame(now: number) {
  const dt = Math.min(1, (now - last) / 1000);
  last = now;
  const ev = tick(state, dt);
  if (ev.spawned.length && !drag) renderBoard(ev.spawned);
  if (ev.customersChanged) renderCustomers();
  else if (ev.spawned.length) updateCustomersReady();
  renderHud();
  requestAnimationFrame(frame);
}

setInterval(() => save(state), 5000);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') save(state);
  else {
    showOffline();
    last = performance.now();
  }
});
window.addEventListener('pagehide', () => save(state));

renderAll();
showOffline();
requestAnimationFrame(frame);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* hors ligne non disponible */
    });
  });
}
