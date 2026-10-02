#!/usr/bin/env bash
# Packages ONLY variante-1-definida (plus the assets it actually uses) into a
# self-contained static bundle for a separate Cloudflare Worker. The current
# site and its Worker are not touched.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
SITE="$(cd "$HERE/../.." && pwd)"
OUT="$HERE/dist"
rm -rf "$OUT" && mkdir -p "$OUT/assets/evidence" "$OUT/assets-extra"

# page: ../assets → assets, ../assets-extra → assets-extra
sed -e 's#\.\./assets-extra/#assets-extra/#g' -e 's#\.\./assets/#assets/#g' \
  "$SITE/variante-1-definida/index.html" > "$OUT/index.html"

cp "$SITE/assets/grain.png" "$OUT/assets/"
for n in origin-sequence steps-bg trace-bg; do cp "$SITE/assets/$n.mp4" "$OUT/assets/"; done
for n in origin-poster steps-bg-poster trace-bg-poster; do cp "$SITE/assets/$n.jpg" "$SITE/assets/$n.webp" "$OUT/assets/"; done
cp -r "$SITE/assets/evidence/." "$OUT/assets/evidence/"
cp "$SITE/assets-extra/"*.mp4 "$SITE/assets-extra/"*.jpg "$SITE/assets-extra/"*.webp "$OUT/assets-extra/"

# private plan: only the ENCRYPTED files (built by plan-privado/construir.py).
# The plan's sources, the PDFs and the page images never enter the bundle.
cp -r "$SITE/variante-1-definida/privado" "$OUT/privado"

# guard: no reference may still point outside the bundle
if grep -q '\.\./assets' "$OUT/index.html"; then echo "unrewritten ../assets path" >&2; exit 1; fi
# guard: nothing of the plan in clear — no PDFs, no page images, no plan text
if find "$OUT" -iname '*plan-operativo*' -o -path '*plan-acero*' | grep -q .; then echo "plan file in bundle" >&2; exit 1; fi
for probe in '0.8247' 'Línea A' '558,456' 'Arancel retroactivo' 'Retroactive duty'; do
  if grep -rqF "$probe" "$OUT"; then echo "plan text in clear in bundle: $probe" >&2; exit 1; fi
done
echo "bundle ready: $OUT ($(du -sh "$OUT" | cut -f1), $(find "$OUT" -type f | wc -l) files)"
