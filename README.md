# ¿Qué hay pa'? · Landing de descarga

Página pública para descargar la app Android de **¿Qué hay pa'?** con un solo botón, sin registro.
Se publica gratis en GitHub Pages y se actualiza sola cada vez que sale un APK nuevo.

- Español e inglés (botón con globo).
- Modo claro y oscuro (interruptor sol ↔ luna); abre según el modo del dispositivo.
- Animaciones con GSAP, con botón para pausarlas; respeta «reducir movimiento» del sistema.
- Páginas de política de privacidad y términos.

## Estructura

```
site/
  release.json          Repo y nombre del APK; la Action escribe versión, tamaño y enlace
  assets/               Logo (por letras, para la animación) e ilustraciones SVG
  src/
    index.html          Landing
    legal.html          Plantilla de privacidad y términos
    legal/*.html        Textos legales en español (.es) e inglés (.en)
    partials/           Controles de la barra (idioma y modo)
    styles.css          Estilos y tokens de color (modo claro y oscuro)
    i18n.js             Todos los textos de la página en ES y EN
    controls.js         Idioma, modo claro/oscuro
    main.js             Animaciones, descarga, confeti, pin guía
scripts/
  build.py              Genera dist/ (cada página en un solo HTML)
  fetch_release.py      Lee el último release del APK desde la API de GitHub
.github/workflows/
  deploy.yml            Construye y publica en GitHub Pages
docs/
  notify-landing.yml    Workflow para copiar en el repo de la app
```

## Probar en tu computador

Solo necesitas Python 3.

```bash
python scripts/build.py --out dist             # sitio real
python scripts/build.py --out dist --prototype # el botón muestra un aviso en vez de descargar
```

Abre `dist/index.html` en el navegador. Para probar desde el celular en la misma red:
`python -m http.server 8000 -d dist` y entra a `http://IP-DE-TU-PC:8000`.

## Puesta en marcha (una sola vez)

1. **Activar GitHub Pages:** en este repo, *Settings → Pages → Build and deployment → Source:* **GitHub Actions**.
   La primera publicación sale al hacer push a `main`. Dirección: `https://bratev-dev.github.io/quehaypa_landing/`.
2. **Hacer público el repo de la app** (`bratev-dev/quehaypa_frontend`), para que cualquiera pueda descargar el APK sin cuenta.
   Antes, revisen que en el historial de commits no haya claves ni secretos.
3. **Token para el aviso automático:** en GitHub, *Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token*:
   - *Resource owner:* `bratev-dev`
   - *Repository access:* solo `bratev-dev/quehaypa_landing`
   - *Repository permissions:* **Contents: Read and write**
   - Guárdalo en `quehaypa_frontend` como secret **`LANDING_DISPATCH_TOKEN`** (*Settings → Secrets and variables → Actions*).
   - Si la organización exige aprobar tokens, un admin debe aprobarlo.
4. **Copiar `docs/notify-landing.yml`** a `quehaypa_frontend/.github/workflows/notify-landing.yml` (lee la nota del archivo si el release lo crea otra Action).

## Publicar una versión nueva del APK

1. En `quehaypa_frontend` crea un release (*Releases → Draft a new release*) con la etiqueta de la versión, por ejemplo `v0.3.0`.
2. Adjunta el APK con el nombre **exacto `quehaypa.apk`**. Con ese nombre el botón siempre apunta a
   `https://github.com/bratev-dev/quehaypa_frontend/releases/latest/download/quehaypa.apk`.
3. Publica el release. En unos minutos la landing muestra la nueva versión y el tamaño.

Si el APK se sube con otro nombre, la landing usa el enlace directo a ese archivo y lo avisa en el log de la Action.
Si algo falla, la página igual se publica, solo sin versión ni tamaño. También puedes relanzarla a mano en
*Actions → Publicar landing → Run workflow*.

## Editar contenido

- **Textos de la landing:** `site/src/i18n.js` (cada texto en `es` y `en`).
- **Textos legales:** `site/src/legal/*.es.html` y `*.en.html`.
- **Colores:** variables al inicio de `site/src/styles.css` (`:root` para claro, `[data-mode="dark"]` para oscuro).
- **Correo de contacto:** `EMAIL` en `scripts/build.py`.