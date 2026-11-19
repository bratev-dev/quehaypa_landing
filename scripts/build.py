#!/usr/bin/env python3
"""Genera el sitio de ¿Qué hay pa'? en una carpeta lista para publicar.

uso: python scripts/build.py [--site site] [--out dist] [--prototype] [--gsap-dir RUTA]

- Cada página sale como un solo HTML con CSS, JS e imágenes en línea.
- Lee site/release.json (lo reescribe scripts/fetch_release.py en la GitHub Action).
- --prototype: el botón de descarga muestra un aviso en vez de descargar.
- --gsap-dir: carga GSAP desde una carpeta local (pruebas sin internet); por defecto usa cdnjs.
"""
import argparse, base64, json, os, re, sys

ap = argparse.ArgumentParser()
ap.add_argument("--site", default=os.path.join(os.path.dirname(__file__), "..", "site"))
ap.add_argument("--out", default=os.path.join(os.path.dirname(__file__), "..", "dist"))
ap.add_argument("--prototype", action="store_true")
ap.add_argument("--gsap-dir", default=None)
ARGS = ap.parse_args()
SITE, OUTDIR, PROTO = os.path.abspath(ARGS.site), os.path.abspath(ARGS.out), ARGS.prototype
EMAIL = 'quehaypaa@gmail.com'
src = lambda p: open(os.path.join(SITE, p), encoding="utf-8").read()

def data_uri(rel):
    path = os.path.join(SITE, rel)
    raw = open(path, "rb").read()
    mime = "image/svg+xml" if rel.endswith(".svg") else "image/png"
    return f"data:{mime};base64," + base64.b64encode(raw).decode()

ICONS = {
    "music": '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
    "pin": '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    "star": '<path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
    "heart": '<path d="M12 20s-8-5-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15 12 20 12 20z"/>',
    "ticket": '<path d="M4 8h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z"/>',
    "share": '<path d="M14 5l6 6-6 6M20 11h-9a6 6 0 0 0-6 6v1"/>',
    "mark": '<path d="M7 4h10v16l-5-4-5 4z"/>',
    "bell": '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0"/>',
    "search": '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>',
    "megaphone": '<path d="M4 10v4h3l7 4V6L7 10zM17 9a4 4 0 0 1 0 6"/>',
    "rocket": '<path d="M12 3c3 2 5 5 5 9l-2 4H9l-2-4c0-4 2-7 5-9z"/><circle cx="12" cy="10" r="1.6"/><path d="M9 16l-2 4M15 16l2 4"/>',
    "chart": '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    "badge": '<path d="M12 3l2.5 2 3.2-.3.8 3.1 2.6 1.9-1.3 2.9 1.3 2.9-2.6 1.9-.8 3.1-3.2-.3L12 21l-2.5-2-3.2.3-.8-3.1L2.9 14.3l1.3-2.9L2.9 8.5l2.6-1.9.8-3.1 3.2.3z"/><path d="m8.5 12 2.4 2.4 4.6-4.8"/>',
}

def icon(name, color, sw="2.4"):
    return (f'<svg viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="{sw}" stroke-linecap="round" '
            f'stroke-linejoin="round" aria-hidden="true">{ICONS[name]}</svg>')

SPARK = 'M0-26C3-8 8-3 26 0C8 3 3 8 0 26C-3 8-8 3-26 0C-8-3-3-8 0-26Z'

def eye(cx, cy):
    # óvalo irregular dibujado "a mano" (sin filtro, para que el parpadeo no sea costoso)
    return (f'<path d="M{cx-25} {cy+1}C{cx-27} {cy-21} {cx-13} {cy-35} {cx+2} {cy-34}C{cx+18} {cy-33} {cx+28} {cy-17} {cx+26} {cy+3}'
            f'C{cx+25} {cy+24} {cx+12} {cy+36} {cx-3} {cy+34}C{cx-18} {cy+33} {cx-24} {cy+19} {cx-25} {cy+1}Z" '
            f'fill="#fff" stroke="#0128EB" stroke-width="10"/>')

def pin_svg(with_ids=True):
    i = (lambda n: f' id="{n}"') if with_ids else (lambda n: "")
    fid = "pinWa" if with_ids else "pinWb"
    return f'''<svg viewBox="0 0 600 600" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<defs><filter id="{fid}" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7"/></filter></defs>
<g{i("gArmL")}><path d="M128 334C72 334 54 274 72 228" stroke="#0128EB" stroke-width="24"/><circle cx="72" cy="224" r="26" fill="#fff" stroke="#0128EB" stroke-width="9"/></g>
<g{i("gArmR")}><path d="M472 334C528 334 548 278 532 232" stroke="#0128EB" stroke-width="24"/><circle cx="532" cy="228" r="26" fill="#fff" stroke="#0128EB" stroke-width="9"/></g>
<path d="M300 80C196 80 124 160 124 260C124 374 250 454 300 540C350 454 476 374 476 260C476 160 404 80 300 80Z" fill="#0A47ED" stroke="#0128EB" stroke-width="10"/>
<path d="M168 238C168 178 210 132 258 118" stroke="#fff" stroke-width="12" opacity=".45"/>
<g filter="url(#{fid})"><circle cx="300" cy="256" r="112" fill="#fff" stroke="#0128EB" stroke-width="12"/>
<path d="M230 202Q254 184 284 196M316 196Q346 184 370 202" stroke="#0128EB" stroke-width="11"/>
<path d="M216 296L232 288M218 314L236 304M384 296L368 288M382 314L364 304" stroke="#0128EB" stroke-width="6"/></g>
<g{i("gEyes")}>{eye(262, 246)}{eye(338, 246)}
<g{i("gPupils")}><circle cx="265" cy="254" r="11" fill="#0128EB"/><circle cx="341" cy="254" r="11" fill="#0128EB"/></g></g>
<path{i("gMouth")} d="M262 290C276 295 324 295 338 290C335 316 319 330 300 330C281 330 265 316 262 290Z" fill="#0128EB" stroke="#0128EB" stroke-width="8"/>
</svg>'''

meta = json.load(open(os.path.join(SITE, "assets/logo/meta.json")))
order = ["inv", "Q", "U", "E", "H", "a", "y", "P", "A", "apos", "q"]
letters = []
for g in order + ["sp1", "sp2", "sp3"]:
    m = meta[g]
    cls = "sp" if g.startswith("sp") else "l"
    for col, vis in (("k", "on-light"), ("y", "on-dark")):
        letters.append(f'<img class="{cls} {vis}" src="{data_uri(f"assets/logo/{g}-{col}.png")}" alt="" '
                       f'style="left:{m["l"]}%;top:{m["t"]}%;width:{m["w"]}%">')

def tape(words, spark_color):
    sp = f'<svg viewBox="-30 -30 60 60" aria-hidden="true"><path d="{SPARK}"/></svg>'
    seq = "".join(f"<span>{w}</span>{sp}" for w in words)
    return seq + seq  # dos copias para el bucle infinito

TA = ["Conciertos", "Salsa", "Cine al parque", "Comida", "Ferias", "Arte", "¿Qué hay pa' hoy?"]
TB = ["Planes cerca", "Recordatorios", "Mapa", "Eventos", "Lugares", "Amigos", "Cerca de ti"]

ICON_REP = {
    "{{IC_BACK}}": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    "{{IC_SUN}}": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>',
    "{{IC_MOON}}": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
    "{{IC_GLOBE}}": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.5 3.9 5.5 3.9 9s-1.3 6.5-3.9 9c-2.6-2.5-3.9-5.5-3.9-9S9.4 5.5 12 3z"/></svg>',
    "{{IC_CHEV}}": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    "{{IC_PLAY}}": '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>',
    "{{IC_PAUSE}}": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg>',
    "{{ICON_DL}}": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M6.5 10.5 12 16l5.5-5.5M4 20h16"/></svg>',
    "{{ICON_DOWN}}": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v15M6 13l6 6 6-6"/></svg>',
    "{{IC_CHECK}}": '<svg class="istep__check" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    "{{IC_SHIELD}}": '<svg viewBox="0 0 24 24" fill="none" stroke="#0A47ED" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="m8.5 12 2.4 2.4 4.6-4.8"/></svg>',
}

if ARGS.gsap_dir:
    base = "file://" + os.path.abspath(ARGS.gsap_dir).rstrip("/") + "/"
else:
    base = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/"
gsap_tags = f'<script src="{base}gsap.min.js"></script>\n<script src="{base}ScrollTrigger.min.js"></script>'

rel = json.load(open(os.path.join(SITE, "release.json")))
if not rel.get("url"):
    rel["url"] = f"https://github.com/{rel['repo']}/releases/latest/download/{rel['asset']}"
cfg = {"prototype": PROTO, "email": EMAIL,
       "release": {"url": rel["url"], "version": rel.get("version"), "sizeBytes": rel.get("sizeBytes")}}

COMMON = {
    "{{CSS}}": "<style>\n" + src("src/styles.css") + "\n</style>",
    "{{I18N}}": "<script>\n" + src("src/i18n.js") + "\n</script>",
    "{{CONTROLS}}": "<script>\n" + src("src/controls.js") + "\n</script>",
    "{{JS}}": "<script>\n" + src("src/main.js") + "\n</script>",
    "{{CFG}}": json.dumps(cfg, ensure_ascii=False),
    "{{DL_URL}}": rel["url"],
    "{{EMAIL}}": EMAIL,
    "{{GSAP}}": gsap_tags,
    "{{LOGO_LETTERS}}": "\n".join(letters),
    "{{PIN_SVG}}": pin_svg(True),
    "{{PIN_SVG_STATIC}}": pin_svg(False),
    "{{TAPE_A}}": tape(TA, "#FCD413"),
    "{{TAPE_B}}": tape(TB, "#121212"),
    "{{NAV_CONTROLS}}": src("src/partials/nav-controls.html"),
}
COMMON.update(ICON_REP)

def render(template, extra=None):
    html = src(template)
    reps = dict(COMMON); reps.update(extra or {})
    for _ in range(2):  # dos pasadas: los parciales también llevan marcadores
        for k, v in reps.items():
            html = html.replace(k, v)
    html = re.sub(r"\{\{IMG:([^}]+)\}\}", lambda m: data_uri(m.group(1)), html)
    html = re.sub(r"\{\{IC:([a-z]+)\}\}", lambda m: icon(m.group(1), "#0A47ED"), html)
    html = re.sub(r"\{\{ICW:([a-z]+)\}\}", lambda m: icon(m.group(1), "#FCD413"), html)
    html = re.sub(r"\{\{SPARK:(#[0-9A-Fa-f]{6})\}\}", lambda m: f'<path d="{SPARK}" fill="{m.group(1)}"/>', html)
    left = re.findall(r"\{\{[^}]+\}\}", html)
    if left:
        sys.exit(f"{template}: marcadores sin reemplazar: {left}")
    return html

os.makedirs(OUTDIR, exist_ok=True)
pages = {"index.html": render("src/index.html")}
for slug, key in (("privacidad", "privacyTitle"), ("terminos", "termsTitle")):
    pages[slug + ".html"] = render("src/legal.html", {
        "{{TITLE_KEY}}": key,
        "{{LEGAL_ES}}": src(f"src/legal/{slug}.es.html"),
        "{{LEGAL_EN}}": src(f"src/legal/{slug}.en.html"),
    })
for name, html in pages.items():
    open(os.path.join(OUTDIR, name), "w", encoding="utf-8").write(html)
    print(os.path.join(OUTDIR, name), round(len(html) / 1024), "KB")
