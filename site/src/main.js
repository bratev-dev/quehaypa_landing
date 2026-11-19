(function () {
  'use strict';
  var root = document.documentElement;
  var CFG = window.QHP || {};
  var I = window.QHPi18n;
  var qs = function (s, c) { return (c || document).querySelector(s); };
  var qsa = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var coarse = window.matchMedia('(pointer: coarse)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var motion = hasGsap && !reduce;
  var vw = function () { return window.innerWidth; };
  var vh = function () { return window.innerHeight; };

  /* ---------- nav con fondo al hacer scroll ---------- */
  var nav = qs('#nav');
  var onScrollNav = function () { nav.classList.toggle('is-scrolled', window.scrollY > 30); };
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- tamaño del celular según la pantalla ---------- */
  function fitPhone() {
    var fit = qs('#phoneFit');
    var small = vw() <= 960;
    var avail = small ? vh() * 0.42 : Math.min(vh() * 0.74, 600);
    fit.style.setProperty('--pz', Math.max(0.5, Math.min(1, avail / 580)).toFixed(3));
  }
  fitPhone();
  window.addEventListener('resize', fitPhone);

  /* ---------- aviso y confeti ---------- */
  var toast = qs('#toast');
  var toastTimer;
  function showToast(msg) {
    toast.textContent = '';
    setTimeout(function () { toast.textContent = msg; }, 60);
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-on'); }, 7500);
  }
  var canvas = qs('#confetti');
  var ctx = canvas.getContext('2d');
  var parts = [], rafId = null;
  var COLORS = ['#FCD413', '#0A47ED', '#EB4A9A', '#8331C4', '#C77FFF', '#FFFFFF', '#FFB800'];
  function sizeCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = vw() * dpr; canvas.height = vh() * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);
  function burst(x, y) {
    var n = vw() < 600 ? 80 : 140;
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, v = 6 + Math.random() * 10;
      parts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 7, w: 6 + Math.random() * 8, h: 4 + Math.random() * 6,
        r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, c: COLORS[(Math.random() * COLORS.length) | 0], life: 0, round: Math.random() < 0.35 });
    }
    if (!rafId) rafId = requestAnimationFrame(tick);
  }
  function tick() {
    ctx.clearRect(0, 0, vw(), vh());
    parts = parts.filter(function (p) { return p.life < 130 && p.y < vh() + 40; });
    parts.forEach(function (p) {
      p.life++; p.vy += 0.32; p.vx *= 0.985; p.vy *= 0.985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, 1 - p.life / 130);
      if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.w / 2.4, 0, Math.PI * 2); ctx.fill(); } else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    rafId = parts.length ? requestAnimationFrame(tick) : null;
    if (!rafId) ctx.clearRect(0, 0, vw(), vh());
  }

  /* ---------- descarga ---------- */
  var celebrate = function () {};
  var dlUrl = (CFG.release && CFG.release.url) || '#descargar';
  qsa('.js-download').forEach(function (btn) {
    btn.setAttribute('href', dlUrl);
    btn.addEventListener('click', function (e) {
      if (CFG.prototype) e.preventDefault();
      var r = btn.getBoundingClientRect();
      if (!reduce && !paused) burst(r.left + r.width / 2, r.top + r.height / 2);
      celebrate();
      showToast(I.t(CFG.prototype ? 'toastProto' : 'toastStart'));
    });
  });

  /* ---------- pasos de "Cómo funciona" ---------- */
  var steps = qsa('.step');
  function setStep(i) {
    steps.forEach(function (s, k) {
      s.classList.toggle('is-active', k === i);
      var b = qs('.step__btn', s);
      if (b) { if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); }
    });
  }

  /* ---------- pausar animaciones ---------- */
  var paused = false;
  var loops = [];
  var pauseBtns = qsa('.js-pause');
  var onPause = function () {};
  function labelPause() {
    pauseBtns.forEach(function (b) {
      b.setAttribute('aria-pressed', paused ? 'true' : 'false');
      var lab = qs('.js-pause-label', b);
      if (lab) { lab.setAttribute('data-i18n', paused ? 'play' : 'pause'); lab.textContent = I.t(paused ? 'play' : 'pause'); }
      if (b.hasAttribute('data-i18n-attr')) { b.setAttribute('data-i18n-attr', 'aria-label:' + (paused ? 'play' : 'pause')); b.setAttribute('aria-label', I.t(paused ? 'play' : 'pause')); }
    });
  }
  function setPaused(p) {
    paused = p;
    root.classList.toggle('is-paused', p);
    labelPause();
    loops.forEach(function (l) { if (p) l.pause(); else l.resume(); });
    onPause(p);
    store.set('qhp-paused', p ? '1' : '0');
  }
  pauseBtns.forEach(function (b) { b.addEventListener('click', function () { setPaused(!paused); }); });
  if (reduce) pauseBtns.forEach(function (b) { b.hidden = true; });
  // Los pasos solo son botones cuando la sección se fija; si no, quedan como títulos.
  function unbutton() {
    qsa('.step__btn').forEach(function (b) {
      var d = document.createElement('div'); d.className = 'step__head';
      while (b.firstChild) d.appendChild(b.firstChild);
      b.parentNode.replaceChild(d, b);
    });
  }

  var pinOK = vh() >= 680;
  if (!motion || !pinOK) unbutton();
  if (!motion) {
    if (store.get('qhp-paused') === '1') setPaused(true);
    return;
  }

  /* =========================================================== animaciones */
  root.classList.add('motion');
  var small = vw() <= 960;
  root.classList.add(small ? 'fx-fade' : 'fx-clip');
  var gsap = window.gsap, ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);
  ST.config({ ignoreMobileResize: true });

  function splitWords(el) {
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement('span'); w.className = 'w';
            var inner = document.createElement('span'); inner.className = 'w__in'; inner.textContent = part;
            w.appendChild(inner); frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(el);
  }
  qsa('[data-split]').forEach(splitWords);

  /* 1. Entrada */
  var bob = qs('.guide__bob');
  var intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro
    .from('.logo-anim .l', {
      yPercent: function (i) { return -180 - (i % 5) * 18; },
      rotation: function (i) { return [-28, 22, -14, 30, -20, 16, -32, 24, -18, 26, -22][i % 11]; },
      scale: 0.6, duration: 1.05, ease: 'bounce.out', stagger: { each: 0.06 }
    })
    .from('.logo-anim .sp', { scale: 0, rotation: -180, duration: 0.6, ease: 'back.out(3)', stagger: 0.08, transformOrigin: '50% 50%' }, '-=0.5')
    .from('.hero__title .w__in', { yPercent: 115, rotation: 6, duration: 0.7, stagger: 0.035 }, '-=0.5')
    .from('[data-rise]', { y: 24, opacity: 0, duration: 0.6, stagger: 0.08 }, '-=0.5')
    .from('.blob', { scale: 0.6, duration: 0.9, ease: 'elastic.out(1, 0.55)' }, 0.25)
    .from('.hero__art .deco', { scale: 0, rotation: -40, duration: 0.6, ease: 'back.out(2.4)', stagger: 0.07 }, 0.55)
    .from(bob, { scale: 0, y: 60, duration: 1, ease: 'elastic.out(1, 0.5)' }, 0.45);

  loops.push(gsap.to('.js-twinkle, .logo-anim .sp', { scale: 1.25, rotation: 20, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { each: 0.3, from: 'random' }, delay: 1.6, transformOrigin: '50% 50%' }));
  qsa('.js-float').forEach(function (el, i) {
    loops.push(gsap.to(el, { y: -8 - i * 3, rotation: [-5, 5, -4][i % 3], duration: 2 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.2 }));
    gsap.to(el, { yPercent: -60 - i * 25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  });

  /* 3. Celular fijo que cuenta la historia */
  var stepIndex = 0;
  var hop = function () {};
  var how = gsap.timeline({ defaults: { ease: 'none' } });
  if (small) {
    how
      .to('.screen--2', { opacity: 1, duration: 0.1 }, 0.27)
      .fromTo('.screen--2 .plan', { y: 26, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.025, duration: 0.07 }, 0.31)
      .to('.notif', { yPercent: 140, duration: 0.08, ease: 'back.out(2)' }, 0.42)
      .to('.screen--3', { opacity: 1, duration: 0.1 }, 0.62)
      .fromTo('.mpin', { yPercent: -200, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.07, ease: 'back.out(2)', stagger: 0.03 }, 0.7)
      .fromTo('.s3-sheet', { yPercent: 160 }, { yPercent: 0, duration: 0.08, ease: 'back.out(1.6)' }, 0.8)
      .to({}, { duration: 0.06 }, 0.94);
  } else {
    how
      .fromTo('#phoneFit', { rotation: 5 }, { rotation: -3, duration: 1 }, 0)
      .to('.screen--2', { clipPath: 'circle(150% at 85% 8%)', duration: 0.12, ease: 'power2.inOut' }, 0.27)
      .to('.notif', { yPercent: 140, duration: 0.08, ease: 'back.out(2)' }, 0.42)
      .to('.screen--3', { clipPath: 'circle(150% at 20% 92%)', duration: 0.12, ease: 'power2.inOut' }, 0.6)
      .fromTo('.mpin', { yPercent: -260, scale: 0.4 }, { yPercent: 0, scale: 1, duration: 0.07, ease: 'bounce.out', stagger: 0.04 }, 0.68)
      .fromTo('.s3-sheet', { yPercent: 160 }, { yPercent: 0, duration: 0.08, ease: 'back.out(1.6)' }, 0.8)
      .to({}, { duration: 0.06 }, 0.94);
  }
  if (pinOK) root.classList.add('how-pinned');
  else { how.progress(0).kill(); }
  // Con poca altura (zoom, celular horizontal) la sección no se fija: así todo el texto queda visible.
  var howST = pinOK ? ST.create({
    trigger: '#como', start: 'top top',
    end: function () { return '+=' + Math.round(vh() * (small ? 2.1 : 2.4)); },
    pin: true, anticipatePin: 1, scrub: small ? 0.25 : 0.6, animation: how,
    onUpdate: function (self) {
      var i = self.progress < 0.3 ? 0 : self.progress < 0.63 ? 1 : 2;
      if (i !== stepIndex) { stepIndex = i; setStep(i); hop(); }
    }
  }) : ST.create({ trigger: '#como', start: 'top top', end: 'bottom top' });
  var STEP_AT = [0, 0.5, 0.92];
  steps.forEach(function (s, i) {
    var btn = qs('.step__btn', s);
    if (btn) btn.addEventListener('click', function () {
      window.scrollTo({ top: howST.start + (howST.end - howST.start) * STEP_AT[i] + 2, behavior: 'smooth' });
    });
  });
  // En pantallas táctiles cada paso es un punto de parada: un deslizón rápido no se salta la sección.
  var marks = [];
  if (coarse && pinOK) {
    root.classList.add('snap');
    var box = document.createElement('div');
    box.setAttribute('aria-hidden', 'true');
    document.body.appendChild(box);
    marks = STEP_AT.map(function () { var m = document.createElement('div'); m.className = 'snap-mark'; box.appendChild(m); return m; });
  }
  function placeMarks() {
    marks.forEach(function (m, i) { m.style.top = Math.round(howST.start + (howST.end - howST.start) * STEP_AT[i]) + 'px'; });
  }

  /* 4. Cintas cruzadas */
  var tapeA = gsap.to('.tape--a .tape__track', { xPercent: -50, duration: 26, ease: 'none', repeat: -1 });
  var tapeB = gsap.fromTo('.tape--b .tape__track', { xPercent: -50 }, { xPercent: 0, duration: 30, ease: 'none', repeat: -1 });
  loops.push(tapeA, tapeB);
  var lastBoost = 0;
  ST.create({
    start: 0, end: 'max',
    onUpdate: function (self) {
      if (paused) return;
      var now = performance.now();
      if (now - lastBoost < 120) return;
      lastBoost = now;
      var v = Math.min(Math.abs(self.getVelocity()) / 350, 5);
      gsap.to([tapeA, tapeB], { timeScale: self.direction * (1 + v), duration: 0.2, overwrite: true });
      gsap.to([tapeA, tapeB], { timeScale: self.direction, duration: 1.2, delay: 0.25, ease: 'power2.out' });
    }
  });

  /* 5. Stickers de negocios */
  gsap.from('.sticker', { y: 90, rotation: function (i) { return [-14, 12, -10, 14][i]; }, scale: 0.8, duration: 0.8, ease: 'back.out(1.8)', stagger: 0.12, scrollTrigger: { trigger: '.stickers', start: 'top 85%' } });
  gsap.from('.biz__art img', { rotation: -8, scale: 0.85, duration: 1, ease: 'elastic.out(1, 0.6)', scrollTrigger: { trigger: '.biz', start: 'top 70%' } });

  /* Pasos de instalación: cada uno se marca al llegar al centro de la pantalla */
  gsap.to('.rail__fill', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.isteps', start: 'top 55%', end: 'bottom 55%', scrub: 0.4 } });
  qsa('.istep').forEach(function (li) {
    ST.create({
      trigger: li, start: 'center 58%',
      onEnter: function () { li.classList.add('is-done'); gsap.fromTo(li, { scale: 0.96 }, { scale: 1, duration: 0.7, ease: 'back.out(3)', delay: 0.5 }); },
      onLeaveBack: function () { li.classList.remove('is-done'); }
    });
  });
  gsap.from('.final__logo', { scale: 0.7, rotation: -4, duration: 1, ease: 'elastic.out(1, 0.5)', scrollTrigger: { trigger: '.final', start: 'top 75%' } });

  /* 2 y 6. El pin guía */
  var guide = qs('#guide');
  var tilt = qs('.guide__tilt');
  var bubble = qs('#bubble');
  var BASE = 160;
  gsap.set(guide, { transformOrigin: '0 0' });
  function rect(el) { return el.getBoundingClientRect(); }
  function live(sel) { return function () { var r = rect(qs(sel)); return { x: r.left, y: r.top, s: r.width / BASE, o: 1 }; }; }
  function fixed(v) { return function () { return v; }; }
  // En celulares el pin acompaña desde una esquina; en los más angostos se oculta para no tapar texto.
  function corner() { var size = 84; return { x: vw() - size - 10, y: vh() - size - 24, s: size / BASE, o: vw() <= 560 ? 0 : 1 }; }
  function centered(anchorSel, secSel) {
    var a = rect(qs(anchorSel)), sec = rect(qs(secSel));
    return { x: a.left, y: vh() / 2 - sec.height / 2 + (a.top - sec.top), s: a.width / BASE, o: 1 };
  }
  function realMax() { return Math.max(0, document.documentElement.scrollHeight - vh()); }
  function dockLive() { var r = rect(qs('#pinDock')); return { x: r.left, y: r.top + window.scrollY - realMax(), s: r.width / BASE, o: 1 }; }

  var bizST = ST.create({ trigger: '#negocios', start: 'center center' });
  var instST = ST.create({ trigger: '#instalar', start: 'center center' });
  var keys = [];
  var ease = gsap.parseEase('power1.inOut');
  var drive = { t: window.scrollY };
  var dockProgress = 0;
  var setX = gsap.quickSetter(guide, 'x', 'px'), setY = gsap.quickSetter(guide, 'y', 'px');
  var setSX = gsap.quickSetter(guide, 'scaleX'), setSY = gsap.quickSetter(guide, 'scaleY'), setO = gsap.quickSetter(guide, 'opacity');

  function buildKeys() {
    var hr = rect(qs('#pinHome'));
    var homeCenter = hr.top + window.scrollY + hr.height / 2;
    // El pin se queda pegado al círculo hasta que este llega a la mitad de la pantalla; luego despega.
    var tAttach = gsap.utils.clamp(0, howST.start * 0.7, homeCenter - vh() * 0.5);
    var howRect = rect(qs('#pinHow')), howSec = rect(qs('#como'));
    var howV = { x: howRect.left, y: howRect.top - howSec.top, s: howRect.width / BASE, o: 1 };
    var howGet = pinOK ? fixed(howV) : live('#pinHow');
    keys = [
      { at: 0, get: live('#pinHome') },
      { at: tAttach, get: live('#pinHome') },
      { at: howST.start, get: howGet },
      { at: howST.end, get: howGet },
      { at: bizST.start, get: small ? corner : fixed(centered('#pinBiz', '#negocios')) },
      { at: instST.start, get: small ? corner : fixed(centered('#pinInstall', '#instalar')) },
      { at: -1, get: dockLive }
    ];
  }
  // Mientras está en el hero el pin vive dentro del círculo (se desplaza con la página, sin vibrar).
  var homeBox = qs('#pinHome'), atHome = null;
  function setHome(on) {
    if (on === atHome) return;
    atHome = on;
    if (on) { homeBox.appendChild(guide); guide.classList.add('at-home'); }
    else { document.body.appendChild(guide); guide.classList.remove('at-home'); }
  }
  function placeAt(t) {
    if (!keys.length) return;
    keys[keys.length - 1].at = realMax();
    var i = 0;
    while (i < keys.length - 2 && t > keys[i + 1].at) i++;
    var a = keys[i], b = keys[i + 1];
    if (i === 0 || t <= keys[1].at) {
      setHome(true);
      setO(paused ? 0 : 1);
      dockProgress = 0;
      if (bubbleOn) bubble.style.visibility = paused ? 'hidden' : '';
      return;
    }
    setHome(false);
    var span = b.at - a.at;
    var p = span <= 0 ? 1 : ease(gsap.utils.clamp(0, 1, (t - a.at) / span));
    if (i === keys.length - 2 && window.scrollY >= realMax() - 2) p = 1;
    var va = a.get(), vb = b.get();
    setX(va.x + (vb.x - va.x) * p);
    setY(va.y + (vb.y - va.y) * p);
    var s = va.s + (vb.s - va.s) * p; setSX(s); setSY(s);
    var o = (va.o == null ? 1 : va.o) + ((vb.o == null ? 1 : vb.o) - (va.o == null ? 1 : va.o)) * p;
    setO(paused ? 0 : o);
    if (bubbleOn) bubble.style.visibility = (o < 0.5 || paused) ? 'hidden' : '';
    dockProgress = i === keys.length - 2 ? p : 0;
  }
  function refreshAll() { buildKeys(); placeMarks(); drive.t = window.scrollY; placeAt(drive.t); }
  ST.addEventListener('refresh', refreshAll);
  ST.create({ start: 0, end: 'max', onUpdate: function (self) { gsap.to(drive, { t: self.scroll(), duration: small ? 0.45 : 0.7, ease: 'power3', overwrite: true }); } });
  gsap.ticker.add(function () { placeAt(drive.t); });
  refreshAll();

  // inclinación según la velocidad del scroll
  var tiltTo = gsap.quickTo(tilt, 'rotation', { duration: 0.6, ease: 'power3' });
  var tiltReset;
  var pupX = gsap.quickTo('#gPupils', 'x', { duration: 0.35, ease: 'power3' });
  var pupY = gsap.quickTo('#gPupils', 'y', { duration: 0.35, ease: 'power3' });
  function lookTo(x, y) { pupX(x); pupY(y); }
  ST.create({
    start: 0, end: 'max',
    onUpdate: function (self) {
      tiltTo(gsap.utils.clamp(-16, 16, self.getVelocity() / -140));
      clearTimeout(tiltReset);
      tiltReset = setTimeout(function () { tiltTo(0); }, 140);
      if (!finePointer) lookTo(0, self.direction > 0 ? 7 : -7);
    }
  });
  if (finePointer) {
    window.addEventListener('pointermove', function (e) {
      var r = guide.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width * 0.5), dy = e.clientY - (r.top + r.height * 0.42);
      var d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 260);
      lookTo(dx / d * 9 * k, dy / d * 9 * k);
    }, { passive: true });
  }

  // reposo: flota, parpadea, saluda
  loops.push(gsap.to(bob, { y: -8, duration: 1.3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.5 }));
  var armIdle = gsap.fromTo('#gArmR', { rotation: -8 }, { rotation: 14, svgOrigin: '472 334', duration: 0.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  loops.push(armIdle);
  loops.push(gsap.fromTo('#gArmL', { rotation: 4 }, { rotation: -6, svgOrigin: '128 334', duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
  (function blink() {
    if (!paused) gsap.to('#gEyes', { scaleY: 0.1, svgOrigin: '300 244', duration: 0.07, yoyo: true, repeat: 1 });
    gsap.delayedCall(gsap.utils.random(2.2, 5), blink);
  })();

  hop = function () {
    if (paused) return;
    gsap.timeline().to(bob, { y: -34, scaleY: 1.06, duration: 0.22, ease: 'power2.out' }).to(bob, { y: 0, scaleY: 1, duration: 0.5, ease: 'bounce.out' });
  };
  celebrate = function () {
    say('bubParty', 1800);
    if (paused) return;
    armIdle.pause();
    gsap.timeline({ onComplete: function () { if (!paused) armIdle.resume(); } })
      .to(bob, { y: -70, scaleY: 1.08, duration: 0.3, ease: 'power2.out' }, 0)
      .to(bob, { y: 0, scaleY: 1, duration: 0.7, ease: 'bounce.out' }, 0.3)
      .to('#gArmR', { rotation: -40, svgOrigin: '472 334', duration: 0.12, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 0)
      .to('#gArmL', { rotation: 40, svgOrigin: '128 334', duration: 0.12, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 0)
      .to('#gMouth', { scale: 1.25, svgOrigin: '300 300', duration: 0.2, yoyo: true, repeat: 1 }, 0);
  };

  // globo de diálogo (en todos los tamaños de pantalla)
  var bubbleOn = false, bubbleKey = '', bubbleCall = null;
  function say(key, ms) {
    bubble.textContent = I.t(key); bubbleKey = key;
    if (!bubbleOn) { bubbleOn = true; gsap.fromTo(bubble, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2.4)' }); }
    if (bubbleCall) bubbleCall.kill();
    bubbleCall = ms ? gsap.delayedCall(ms / 1000, function () { if (bubbleKey === key) hush(); }) : null;
  }
  function hush() {
    if (!bubbleOn) return;
    bubbleOn = false; bubbleKey = '';
    gsap.to(bubble, { scale: 0.4, opacity: 0, duration: 0.25, ease: 'power2.in' });
  }
  gsap.ticker.add(function () {
    if (!bubbleOn) return;
    var gr = guide.getBoundingClientRect(), gx = gr.left, gy = gr.top, size = gr.width;
    var bw = bubble.offsetWidth, bh = bubble.offsetHeight;
    var left = gx + size * 0.66 + bw > vw() - 10;
    bubble.classList.toggle('is-left', left);
    var bx = left ? gx + size * 0.3 - bw : gx + size * 0.7;
    bx = Math.max(8, Math.min(bx, vw() - bw - 8));
    var by = Math.max(8, gy + size * 0.06 - bh);
    bubble.style.transform = 'translate(' + Math.round(bx) + 'px,' + Math.round(by) + 'px) scale(' + gsap.getProperty(bubble, 'scale') + ')';
  });
  var greeted = false;
  function greet() { if (greeted) return; greeted = true; say('bubHello', 3200); }
  var art = rect(qs('.hero__art'));
  if (art.top + art.height / 2 < vh() * 0.85) gsap.delayedCall(2.2, greet);
  else ST.create({ trigger: '.hero__art', start: 'center 80%', once: true, onEnter: function () { gsap.delayedCall(0.4, greet); } });
  ST.create({ trigger: '#como', start: 'top 60%', onEnter: function () { if (bubbleKey === 'bubHello') hush(); } });
  var docked = false;
  gsap.ticker.add(function () {
    if (dockProgress > 0.9 && !docked) { docked = true; say('bubDock'); hop(); }
    else if (dockProgress <= 0.9 && docked) { docked = false; if (bubbleKey === 'bubDock') hush(); }
  });

  /* cambio de idioma con animaciones activas */
  I.onChange(function () {
    qsa('[data-split]').forEach(splitWords);
    if (bubbleOn) bubble.textContent = I.t(bubbleKey);
    labelPause();
    ST.refresh();
  });

  if (store.get('qhp-paused') === '1') setPaused(true);
  window.addEventListener('load', function () { ST.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
})();
