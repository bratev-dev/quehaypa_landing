/* Controles compartidos por todas las páginas: modo claro/oscuro, menú de idioma y barra con fondo. */
(function () {
  'use strict';
  var root = document.documentElement;
  var I = window.QHPi18n;
  var qs = function (s, c) { return (c || document).querySelector(s); };
  var qsa = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- modo claro / oscuro ---------- */
  var themeMeta = qs('meta[name="theme-color"]');
  function setMode(m, save) {
    root.setAttribute('data-mode', m);
    qsa('.js-mode-switch').forEach(function (b) { b.setAttribute('aria-checked', m === 'dark' ? 'true' : 'false'); });
    if (themeMeta) themeMeta.setAttribute('content', m === 'dark' ? '#0B1437' : '#FCD413');
    if (save) store.set('qhp-mode', m);
  }
  setMode(root.getAttribute('data-mode') === 'dark' ? 'dark' : 'light', false);
  qsa('.js-mode-switch').forEach(function (b) {
    b.addEventListener('click', function () { setMode(root.getAttribute('data-mode') === 'dark' ? 'light' : 'dark', true); });
  });

  /* ---------- menú de idioma ---------- */
  var langBtn = qs('.js-lang-toggle'), langList = qs('#langList');
  function openLang(open, focusBack) {
    langList.hidden = !open;
    langBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { var cur = qs('.js-lang[aria-pressed="true"]', langList) || qs('.js-lang', langList); cur.focus(); }
    else if (focusBack) langBtn.focus();
  }
  langBtn.addEventListener('click', function () { openLang(langList.hidden); });
  langList.addEventListener('keydown', function (e) {
    var items = qsa('.js-lang', langList), i = items.indexOf(document.activeElement);
    if (e.key === 'Escape') { e.preventDefault(); openLang(false, true); }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); items[(i + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length].focus(); }
  });
  document.addEventListener('click', function (e) { if (!langList.hidden && !e.target.closest('.langmenu')) openLang(false); });
  document.addEventListener('focusin', function (e) { if (!langList.hidden && !e.target.closest('.langmenu')) openLang(false); });

  /* ---------- idioma ---------- */
  qsa('.js-lang').forEach(function (b) {
    b.addEventListener('click', function () {
      var l = b.getAttribute('data-lang');
      if (l === I.lang()) { openLang(false, true); return; }
      store.set('qhp-lang', l);
      I.apply(l);
      openLang(false, true);
    });
  });


  var nav = qs('#nav');
  if (nav && nav.hasAttribute('data-solid')) nav.classList.add('is-scrolled');
})();
