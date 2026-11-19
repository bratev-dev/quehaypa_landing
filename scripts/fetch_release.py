#!/usr/bin/env python3
"""Lee el último release del repo de la app y escribe versión, tamaño y enlace en site/release.json.

Se ejecuta en la GitHub Action antes de construir el sitio. No falla si todavía no hay
release o si el repo no es accesible: en ese caso la página muestra solo «APK gratuito».
"""
import json, os, sys, urllib.error, urllib.request

PATH = os.path.join(os.path.dirname(__file__), "..", "site", "release.json")

cfg = json.load(open(PATH, encoding="utf-8"))
repo, asset_name = cfg["repo"], cfg["asset"]
stable_url = f"https://github.com/{repo}/releases/latest/download/{asset_name}"

req = urllib.request.Request(f"https://api.github.com/repos/{repo}/releases/latest",
                             headers={"Accept": "application/vnd.github+json", "User-Agent": "quehaypa-landing"})
token = os.environ.get("GITHUB_TOKEN")
if token:
    req.add_header("Authorization", f"Bearer {token}")

result = {"repo": repo, "asset": asset_name, "version": None, "sizeBytes": None, "url": stable_url}
try:
    with urllib.request.urlopen(req, timeout=20) as r:
        rel = json.load(r)
    apks = [a for a in rel.get("assets", []) if a["name"].lower().endswith(".apk")]
    exact = [a for a in apks if a["name"] == asset_name]
    chosen = (exact or apks or [None])[0]
    if chosen:
        result["version"] = rel.get("tag_name", "").lstrip("vV") or None
        result["sizeBytes"] = chosen["size"]
        # Si el archivo tiene el nombre acordado se usa el enlace estable; si no, el enlace directo a ese archivo.
        result["url"] = stable_url if exact else chosen["browser_download_url"]
        print(f"Release {rel.get('tag_name')}: {chosen['name']} ({chosen['size']} bytes)")
        if not exact:
            print(f"Aviso: el APK no se llama {asset_name}; se usa {chosen['name']}.")
    else:
        print("Aviso: el último release no tiene ningún archivo .apk.")
except urllib.error.HTTPError as e:
    print(f"Aviso: no se pudo leer el release ({e.code}). ¿El repo {repo} es público y tiene releases?")
except Exception as e:  # red caída u otro error: se publica sin versión ni tamaño
    print(f"Aviso: no se pudo leer el release: {e}")

json.dump(result, open(PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(json.dumps(result, ensure_ascii=False))
sys.exit(0)
