/* Pizz'Burger — fonctionnalités de démonstration
   1. Commande click & collect (DÉMO : rien n'est envoyé au restaurant)
   2. Carrousel des avis (mobile)
   3. Bloc « Le moment » alimenté par moment.json
*/
(function () {
  'use strict';

  function store(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
  function load(key, def) { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch (e) { return def; } }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var live = document.getElementById('live-status');
  function say(msg) { live.textContent = ''; setTimeout(function () { live.textContent = msg; }, 50); }

  /* ------------------------------------------------------------------
     1. COMMANDE CLICK & COLLECT
     ------------------------------------------------------------------ */
  var cart = load('pb-cart', {});           // { "Cheese Burger": 2, ... }
  var dialog = document.getElementById('order');
  var fab = document.getElementById('cart-fab');
  var list = document.getElementById('cart-list');
  var empty = document.getElementById('cart-empty');
  var form = document.getElementById('order-form');
  var stepCart = document.getElementById('step-cart');
  var stepDone = document.getElementById('step-done');

  function count() { return Object.keys(cart).reduce(function (n, k) { return n + cart[k]; }, 0); }

  function itemName(item) {
    var h = item.querySelector('h3');
    return h.firstChild.textContent.trim();
  }

  // bouton « Ajouter » sur chaque produit de la carte
  document.querySelectorAll('#carte .item').forEach(function (item) {
    var name = itemName(item);
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'add';
    b.innerHTML = '<span aria-hidden="true">+</span> Ajouter<span class="visually-hidden"> ' + esc(name) + ' à la commande</span>';
    b.addEventListener('click', function () {
      cart[name] = (cart[name] || 0) + 1;
      save();
      b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
      say(name + ' ajouté. ' + count() + ' article' + (count() > 1 ? 's' : '') + ' dans la commande.');
    });
    item.appendChild(b);
    item.dataset.name = name;
  });

  function save() { store('pb-cart', cart); render(); }

  function render() {
    var n = count();
    fab.hidden = n === 0;
    fab.querySelector('.count').textContent = n;
    document.querySelectorAll('#carte .item').forEach(function (item) {
      var q = cart[item.dataset.name] || 0;
      item.classList.toggle('in-cart', q > 0);
      item.querySelector('.add').dataset.qty = q ? '×' + q : '';
    });
    list.innerHTML = '';
    Object.keys(cart).forEach(function (name) {
      var li = document.createElement('li');
      li.innerHTML =
        '<span class="cart-name">' + esc(name) + '</span>' +
        '<span class="stepper" role="group" aria-label="Quantité de ' + esc(name) + '">' +
        '<button type="button" data-op="-1" aria-label="Retirer un ' + esc(name) + '">−</button>' +
        '<output aria-live="polite">' + cart[name] + '</output>' +
        '<button type="button" data-op="1" aria-label="Ajouter un ' + esc(name) + '">+</button></span>' +
        '<span class="cart-price">— €</span>';
      li.querySelectorAll('button').forEach(function (btn) {
        btn.addEventListener('click', function () {
          cart[name] += +btn.dataset.op;
          if (cart[name] <= 0) {
            delete cart[name];
            say(name + ' retiré de la commande.');
            save();
            var first = list.querySelector('button') || dialog.querySelector('.order-close');
            first.focus();
            return;
          }
          save();
          var again = [].find.call(list.querySelectorAll('li'), function (l) { return l.querySelector('.cart-name').textContent === name; });
          if (again) again.querySelector('[data-op="' + btn.dataset.op + '"]').focus();
        });
      });
      list.appendChild(li);
    });
    empty.hidden = n > 0;
    form.hidden = n === 0;
  }

  // créneaux de retrait à partir des horaires (heure de Paris), +20 min de préparation, toutes les 15 min
  function slots() {
    var H = window.PB_HOURS, JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    var o = {};
    new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
    var day = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'].indexOf(o.weekday);
    var now = +o.hour * 60 + +o.minute;
    function m(t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; }
    function f(x) { return Math.floor(x / 60) + 'h' + String(x % 60).padStart(2, '0'); }
    var groups = [];
    for (var d = 0; d < 7 && groups.length < 2; d++) {
      var wd = (day + d) % 7, opts = [];
      (H[wd] || []).forEach(function (sl) {
        var start = m(sl[0]) + 15, end = m(sl[1]) - 15;
        if (d === 0) start = Math.max(start, Math.ceil((now + 20) / 15) * 15);
        for (var t = start; t <= end; t += 15) opts.push(t);
      });
      if (opts.length) groups.push({ label: d === 0 ? "Aujourd'hui" : d === 1 ? 'Demain' : JOURS[wd], day: d, opts: opts.map(f) });
    }
    return groups;
  }

  function fillSlots() {
    var sel = form.elements.creneau;
    sel.innerHTML = '<option value="">Choisir un créneau</option>';
    slots().forEach(function (g) {
      var og = document.createElement('optgroup'); og.label = g.label;
      g.opts.forEach(function (t) { var op = document.createElement('option'); op.value = g.label + ' à ' + t; op.textContent = t; og.appendChild(op); });
      sel.appendChild(og);
    });
  }

  function open() {
    fillSlots();
    stepCart.hidden = false; stepDone.hidden = true;
    render();
    dialog.showModal();
  }
  fab.addEventListener('click', open);
  document.querySelectorAll('[data-open-order]').forEach(function (b) { b.addEventListener('click', open); });
  dialog.querySelectorAll('.order-close').forEach(function (b) { b.addEventListener('click', function () { dialog.close(); }); });
  // fermeture par clic sur le fond, pour les navigateurs sans closedby="any"
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  }

  // validation : messages explicites, affichés après interaction (:user-invalid) ou à l'envoi
  var messages = {
    creneau: 'Choisissez une heure de retrait.',
    nom: 'Indiquez le nom à donner au comptoir.',
    tel: 'Indiquez un numéro de téléphone à 10 chiffres, par exemple 06 12 34 56 78.'
  };
  ['creneau', 'nom', 'tel'].forEach(function (n) {
    var el = form.elements[n], err = document.getElementById('err-' + n);
    function check(show) {
      var bad = !el.checkValidity();
      if (show) { err.textContent = bad ? messages[n] : ''; el.setAttribute('aria-invalid', bad ? 'true' : 'false'); }
      return !bad;
    }
    el.addEventListener('blur', function () { if (el.value) check(true); });
    el.addEventListener('change', function () { check(true); });
    el.addEventListener('input', function () { if (el.getAttribute('aria-invalid') === 'true') check(true); });
    el._check = check;
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstBad = null;
    ['creneau', 'nom', 'tel'].forEach(function (n) { var el = form.elements[n]; if (!el._check(true) && !firstBad) firstBad = el; });
    if (firstBad) { firstBad.focus(); return; }
    var btn = form.querySelector('[type=submit]'); btn.disabled = true;
    var num = 'PB-' + String(Math.floor(1000 + Math.random() * 9000));
    var lines = Object.keys(cart).map(function (k) { return '<li>' + cart[k] + ' × ' + esc(k) + '</li>'; }).join('');
    document.getElementById('done-num').textContent = num;
    document.getElementById('done-when').textContent = form.elements.creneau.value;
    document.getElementById('done-name').textContent = form.elements.nom.value;
    document.getElementById('done-list').innerHTML = lines;
    stepCart.hidden = true; stepDone.hidden = false;
    stepDone.focus();
    cart = {}; save(); form.reset(); btn.disabled = false;
    ['creneau', 'nom', 'tel'].forEach(function (n) { form.elements[n].removeAttribute('aria-invalid'); document.getElementById('err-' + n).textContent = ''; });
  });

  render();

  /* ------------------------------------------------------------------
     2. CARROUSEL DES AVIS (actif seulement quand la piste défile, sur mobile)
     ------------------------------------------------------------------ */
  (function () {
    var root = document.querySelector('.reviews-carousel');
    if (!root) return;
    var track = root.querySelector('.reviews');
    var slides = [].slice.call(track.children);
    var markers = root.querySelector('.carousel-markers');
    var status = root.querySelector('.carousel-status');
    var pending = null, settled = 0, ticking = false;
    var smooth = matchMedia('(prefers-reduced-motion: no-preference)').matches ? 'smooth' : 'instant';

    slides.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Voir l\'avis ' + (i + 1));
      b.addEventListener('click', function () { go(i); });
      markers.appendChild(b);
    });
    var dots = [].slice.call(markers.children);

    function nearest() {
      var c = track.scrollLeft + track.clientWidth / 2, best = 0, d = Infinity;
      slides.forEach(function (s, i) { var x = Math.abs(s.offsetLeft - track.offsetLeft + s.offsetWidth / 2 - c); if (x < d) { d = x; best = i; } });
      return best;
    }
    function mark(i) { dots.forEach(function (b, j) { b.setAttribute('aria-current', j === i ? 'true' : 'false'); }); }
    function go(i) {
      i = (i + slides.length) % slides.length;           // boucle : après le dernier, retour au premier
      pending = i; mark(i);
      var s = slides[i];
      track.scrollTo({ left: s.offsetLeft - track.offsetLeft - (track.clientWidth - s.offsetWidth) / 2, behavior: smooth });
    }
    root.querySelector('[data-dir="prev"]').addEventListener('click', function () { go((pending !== null ? pending : nearest()) - 1); });
    root.querySelector('[data-dir="next"]').addEventListener('click', function () { go((pending !== null ? pending : nearest()) + 1); });

    track.addEventListener('scroll', function () {
      if (pending !== null || ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; mark(nearest()); });
    }, { passive: true });

    function onSettle() {
      var i = nearest(); pending = null; mark(i);
      if (i !== settled) { settled = i; status.textContent = 'Avis ' + (i + 1) + ' sur ' + slides.length; }
    }
    if ('onscrollend' in window) track.addEventListener('scrollend', onSettle);
    else { var t; track.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(onSettle, 120); }, { passive: true }); }
    mark(0);
  })();

  /* ------------------------------------------------------------------
     3. BLOC « LE MOMENT » depuis moment.json (le HTML reste en secours)
     ------------------------------------------------------------------ */
  (function () {
    var grid = document.querySelector('.events-grid');
    if (!grid || !window.fetch) return;
    fetch('moment.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (data) {
      if (!data || !Array.isArray(data.cartes) || !data.cartes.length) return;
      grid.innerHTML = data.cartes.map(function (c) {
        var parts = (c.etiquette || '').match(/^(\S+)\s+(.*)$/) || [null, '', c.etiquette || ''];
        var tag = '<span class="when">' + (parts[1] ? '<span aria-hidden="true">' + esc(parts[1]) + '</span> ' : '') + esc(parts[2]) + '</span>';
        var p = c.texte ? '<p>' + esc(c.texte) + '</p>' : '';
        if (c.style === 'match') {
          return '<div class="event match"><span class="ball" aria-hidden="true">⚽</span>' + tag +
            '<h3>' + esc(c.titre || '') + (c.titre_pinceau ? '<br><span class="brush">' + esc(c.titre_pinceau) + '</span>' : '') + '</h3>' + p + '</div>';
        }
        if (c.style === 'promo') {
          return '<div class="event promo"><div class="big">' + esc(c.accroche || '').replace(' ', '<br>') + '</div>' + tag + '<h3>' + esc(c.titre || '') + '</h3>' + p + '</div>';
        }
        var img = c.image ? '<picture><source type="image/avif" srcset="img/' + esc(c.image) + '.avif"><source type="image/webp" srcset="img/' + esc(c.image) + '.webp">' +
          '<img src="img/' + esc(c.image) + '.jpg" alt="' + esc(c.image_alt || '') + '" loading="lazy"></picture>' : '';
        return '<div class="event">' + img + tag + '<h3>' + esc(c.titre || '') + '</h3>' + p + '</div>';
      }).join('');
    }).catch(function () { /* on garde le contenu HTML */ });
  })();
})();
