#!/bin/sh
# Bump every shell version string at once: index.html ?v=, sw.js asset list and VERSION.
# Usage: ./release.sh 7.84   (then add the CHANGELOG entry, run both test suites, commit)
set -e
cd "$(dirname "$0")"
new="$1"
case "$new" in
  [0-9]*.[0-9]*) ;;
  *) echo "usage: ./release.sh <version>, e.g. ./release.sh 7.84" >&2; exit 1 ;;
esac
old=$(sed -n "s/^const VERSION='v\([0-9.]*\)';.*/\1/p" sw.js)
[ -n "$old" ] || { echo "Could not read VERSION from sw.js" >&2; exit 1; }
[ "$old" != "$new" ] || { echo "Already at $new" >&2; exit 1; }
oldre=$(printf '%s' "$old" | sed 's/\./\\./g')
sed -i.bak "s/?v=$oldre\([\"'\`]\)/?v=$new\1/g" index.html sw.js
sed -i.bak "s/^const VERSION='v$oldre';/const VERSION='v$new';/" sw.js
rm -f index.html.bak sw.js.bak
left=$(grep -c "v=$oldre[\"'\`]" index.html sw.js | awk -F: '{s+=$2} END{print s}')
[ "$left" = 0 ] || { echo "Warning: $left references to $old remain" >&2; exit 1; }
echo "Bumped $old -> $new: $(grep -o "?v=$new" index.html | wc -l | tr -d ' ') in index.html, $(grep -o "?v=$new" sw.js | wc -l | tr -d ' ') in sw.js, plus VERSION."
