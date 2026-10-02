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

# guard: no reference may still point outside the bundle
if grep -q '\.\./assets' "$OUT/index.html"; then echo "unrewritten ../assets path" >&2; exit 1; fi
echo "bundle ready: $OUT ($(du -sh "$OUT" | cut -f1), $(find "$OUT" -type f | wc -l) files)"
