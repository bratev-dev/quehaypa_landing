(function () {
  'use strict';
  var T = {
    es: {
      skip: 'Saltar al contenido', homeLink: "¿Qué hay pa'? — inicio", navLabel: 'Principal',
      navHow: 'Cómo funciona', navBiz: 'Para negocios', navInstall: 'Instalar',
      langLabel: 'Idioma', modeLabel: 'Apariencia', modeLight: 'Modo claro', modeDark: 'Modo oscuro',
      navDownload: 'Descargar', navDownloadSr: 'Descargar la app para Android',
      h1: 'Todo lo que hay pa\' hacer cerca de ti, en <span class="hl">una sola app.</span>',
      h1plain: "Todo lo que hay pa' hacer cerca de ti, en una sola app.", finalH2: "Descarga ¿Qué hay pa'?",
      lead: 'Encuentra eventos, lugares y actividades según tus gustos. Guárdalos, organízalos y recibe recordatorios, sin saltar entre redes sociales.',
      cta: 'Descargar para Android', seeHow: 'Ver cómo funciona',
      noAccount: 'No necesitas crear una cuenta para descargarla.',
      relFree: 'APK gratuito', relVersion: 'Versión', relSize: 'MB', relOpens: 'se descarga desde GitHub',
      howTitle: 'Menos buscar, más salir.',
      s1t: 'Descubre lo que hay cerca', s1d: 'Explora eventos, lugares y actividades según tus intereses, tu presupuesto y dónde estás.',
      s2t: 'Guarda y organiza tus planes', s2d: 'Aparta lo que te gusta, arma tu plan y recibe recordatorios para que no se te pase nada.',
      s3t: 'Míralo en el mapa', s3d: 'Ubica cada plan en un mapa interactivo y decide cuál te queda mejor.',
      deviceNote: 'Pantallas de ejemplo con datos ficticios',
      ph1: 'Noche de salsa en el parque', ph2: 'Sáb · 8:00 p. m. · dato de ejemplo', ph3: 'Ver más',
      ph4: 'En 30 min: Noche de salsa', ph5: 'Parque central · dato de ejemplo', ph6: 'Mis planes',
      ph7: '<span class="on">L<br>1</span><span>M<br>2</span><span>M<br>3</span><span>J<br>4</span><span>V<br>5</span><span>S<br>6</span>',
      ph8: '8:00 – 11:00 p. m.', ph9: 'Feria gastronómica', ph10: '12:00 – 4:00 p. m.', ph11: 'Cine al aire libre', ph12: '7:00 – 9:00 p. m.',
      ph13: 'Buscar cerca de ti', ph14: '3 planes cerca de ti', ph15: 'Dato de ejemplo', ph16: 'Ver',
      tapeA: ['Conciertos', 'Salsa', 'Cine al parque', 'Comida', 'Ferias', 'Arte', "¿Qué hay pa' hoy?"],
      tapeB: ['Planes cerca', 'Recordatorios', 'Mapa', 'Eventos', 'Lugares', 'Amigos', 'Cerca de ti'],
      bizChip: 'Para negocios y organizadores', bizTitle: 'Muestra tu evento a quienes ya están buscando plan.',
      b1: 'Publica tus eventos y actividades en un canal local pensado para planes.',
      b2: 'Destaca tu evento con visibilidad prioritaria cuando lo necesites.',
      b3: 'Mira cuántas personas ven tu evento y cuántas terminan yendo.',
      b4: 'Organizadores verificados: tu público sabe en quién confiar.',
      bizCta: 'Quiero publicar mi evento', bizSubject: 'Quiero publicar mi evento',
      instTitle: 'Instálala en 3 pasos.', instLead: "Por ahora ¿Qué hay pa'? se instala desde un archivo APK, no desde Google Play.",
      i1t: 'Descarga el archivo', i1d: 'Toca el botón de descarga y guarda el APK en tu celular.',
      i2t: 'Permite la instalación', i2d: 'Al abrirlo, Android te pedirá autorizar la instalación desde tu navegador o gestor de archivos. Se hace una sola vez.',
      i3t: 'Abre la app y elige tus intereses', i3d: 'Listo: ya puedes explorar los planes cerca de ti.',
      notice: 'Descarga el APK solo desde esta página oficial.',
      finalText: 'Tu próximo plan está a un toque.',
      footerLabel: 'Legal y contacto', privacy: 'Política de privacidad', terms: 'Términos',
      pause: 'Pausar animaciones', play: 'Reanudar animaciones',
      bubHello: "¿Qué hay pa' hoy?", bubDock: '¡Descárgala aquí!', bubParty: '¡A disfrutar!',
      toastProto: 'Prototipo: aquí empezará la descarga del APK.', toastStart: 'Tu descarga está empezando.',
      metaDesc: 'Encuentra eventos, lugares y planes cerca de ti, guárdalos y recibe recordatorios. Descarga la app para Android.',
      title: "¿Qué hay pa'? · Descarga la app",
      privacyTitle: "Política de privacidad · ¿Qué hay pa'?", termsTitle: "Términos y condiciones · ¿Qué hay pa'?",
      backHome: 'Volver al inicio', otherDoc: 'Ver también'
    },
    en: {
      skip: 'Skip to content', homeLink: "¿Qué hay pa'? — home", navLabel: 'Main',
      navHow: 'How it works', navBiz: 'For businesses', navInstall: 'Install',
      langLabel: 'Language', modeLabel: 'Appearance', modeLight: 'Light mode', modeDark: 'Dark mode',
      navDownload: 'Download', navDownloadSr: 'Download the Android app',
      h1: 'Everything there is to do near you, in <span class="hl">one app.</span>',
      h1plain: 'Everything there is to do near you, in one app.', finalH2: "Download ¿Qué hay pa'?",
      lead: 'Find events, places and activities that match your interests. Save them, organize them and get reminders, without jumping between social networks.',
      cta: 'Download for Android', seeHow: 'See how it works',
      noAccount: "You don't need an account to download it.",
      relFree: 'Free APK', relVersion: 'Version', relSize: 'MB', relOpens: 'downloads from GitHub',
      howTitle: 'Less searching, more going out.',
      s1t: "Discover what's nearby", s1d: 'Explore events, places and activities based on your interests, your budget and where you are.',
      s2t: 'Save and organize your plans', s2d: "Keep what you like, build your plan and get reminders so you don't miss a thing.",
      s3t: 'See it on the map', s3d: 'Find every plan on an interactive map and pick the one that suits you best.',
      deviceNote: 'Sample screens with made-up data',
      ph1: 'Salsa night in the park', ph2: 'Sat · 8:00 p.m. · sample data', ph3: 'See more',
      ph4: 'In 30 min: Salsa night', ph5: 'Central park · sample data', ph6: 'My plans',
      ph7: '<span class="on">M<br>1</span><span>T<br>2</span><span>W<br>3</span><span>T<br>4</span><span>F<br>5</span><span>S<br>6</span>',
      ph8: '8:00 – 11:00 p.m.', ph9: 'Food fair', ph10: '12:00 – 4:00 p.m.', ph11: 'Open-air cinema', ph12: '7:00 – 9:00 p.m.',
      ph13: 'Search near you', ph14: '3 plans near you', ph15: 'Sample data', ph16: 'View',
      tapeA: ['Concerts', 'Salsa', 'Movies in the park', 'Food', 'Fairs', 'Art', "¿Qué hay pa' hoy?"],
      tapeB: ['Plans nearby', 'Reminders', 'Map', 'Events', 'Places', 'Friends', 'Near you'],
      bizChip: 'For businesses and organizers', bizTitle: 'Show your event to people who are already looking for plans.',
      b1: 'Post your events and activities on a local channel made for plans.',
      b2: 'Boost your event with priority visibility whenever you need it.',
      b3: 'See how many people view your event and how many actually show up.',
      b4: 'Verified organizers: your audience knows who to trust.',
      bizCta: 'I want to post my event', bizSubject: 'I want to post my event',
      instTitle: 'Install it in 3 steps.', instLead: "For now, ¿Qué hay pa'? installs from an APK file, not from Google Play.",
      i1t: 'Download the file', i1d: 'Tap the download button and save the APK on your phone.',
      i2t: 'Allow the installation', i2d: 'When you open it, Android will ask you to allow installs from your browser or file manager. You only do this once.',
      i3t: 'Open the app and pick your interests', i3d: 'Done: you can now explore plans near you.',
      notice: 'Only download the APK from this official page.',
      finalText: 'Your next plan is one tap away.',
      footerLabel: 'Legal and contact', privacy: 'Privacy policy', terms: 'Terms',
      pause: 'Pause animations', play: 'Resume animations',
      bubHello: "What's on today?", bubDock: 'Download it here!', bubParty: 'Enjoy!',
      toastProto: 'Prototype: the APK download will start here.', toastStart: 'Your download is starting.',
      metaDesc: 'Find events, places and plans near you, save them and get reminders. Download the Android app.',
      title: "¿Qué hay pa'? · Download the app",
      privacyTitle: "Privacy policy · ¿Qué hay pa'?", termsTitle: "Terms and conditions · ¿Qué hay pa'?",
      backHome: 'Back to home', otherDoc: 'See also'
    }
  };

  var SPARK = 'M0-26C3-8 8-3 26 0C8 3 3 8 0 26C-3 8-8 3-26 0C-8-3-3-8 0-26Z';
  var listeners = [];
  var current = document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'es';

  function t(key) { return (T[current] && T[current][key]) || T.es[key] || ''; }

  function releaseText() {
    var r = (window.QHP && window.QHP.release) || {};
    var parts = [t('relFree') + ' (' + t('relOpens') + ')'];
    if (r.version) parts.push(t('relVersion') + ' ' + r.version);
    if (r.sizeBytes) parts.push((r.sizeBytes / 1048576).toFixed(1).replace('.', current === 'es' ? ',' : '.') + ' ' + t('relSize'));
    return parts.join(' · ');
  }

  function apply(lang) {
    if (lang) current = lang === 'en' ? 'en' : 'es';
    var root = document.documentElement;
    root.setAttribute('lang', current);
    document.title = t((document.body && document.body.getAttribute('data-title-key')) || 'title');
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', t('metaDesc'));
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-html]'), function (el) { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-attr]'), function (el) {
      el.getAttribute('data-i18n-attr').split('|').forEach(function (pair) {
        var p = pair.split(':'); el.setAttribute(p[0], t(p[1]));
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-tape]'), function (el) {
      var words = t(el.getAttribute('data-tape'));
      var sp = '<svg viewBox="-30 -30 60 60" aria-hidden="true"><path d="' + SPARK + '"/></svg>';
      var seq = words.map(function (w) { return '<span>' + w + '</span>' + sp; }).join('');
      el.innerHTML = seq + seq;
    });
    Array.prototype.forEach.call(document.querySelectorAll('.js-release'), function (el) { el.textContent = releaseText(); });
    var email = (window.QHP && window.QHP.email) || '';
    Array.prototype.forEach.call(document.querySelectorAll('.js-mail-biz'), function (el) {
      el.setAttribute('href', 'mailto:' + email + '?subject=' + encodeURIComponent(t('bizSubject')));
    });
    Array.prototype.forEach.call(document.querySelectorAll('.js-lang'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === current ? 'true' : 'false');
    });
    Array.prototype.forEach.call(document.querySelectorAll('.js-lang-code'), function (el) { el.textContent = current.toUpperCase(); });
    Array.prototype.forEach.call(document.querySelectorAll('.js-lang-toggle'), function (el) {
      el.setAttribute('aria-label', t('langLabel') + ' (' + current.toUpperCase() + ')');
    });
    listeners.forEach(function (fn) { fn(current); });
  }

  window.QHPi18n = { t: t, apply: apply, lang: function () { return current; }, onChange: function (fn) { listeners.push(fn); } };
  apply(current);
})();
