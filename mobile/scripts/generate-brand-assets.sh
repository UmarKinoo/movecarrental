#!/usr/bin/env bash
# Regenerate app icon + splash from assets/move-logo.png (MOVE horizontal lockup).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ASSETS="$ROOT/assets"
INK="0E1A14"
LOGO="$ASSETS/move-logo.png"

if [[ ! -f "$LOGO" ]]; then
  echo "Missing $LOGO"
  exit 1
fi

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

# App icon: 1024×1024, ink background
sips -Z 520 "$LOGO" --out "$tmpdir/icon-logo.png" >/dev/null
sips --padToHeightWidth 1024 1024 "$tmpdir/icon-logo.png" --padColor "$INK" -o "$ASSETS/icon.png" >/dev/null

# Splash: portrait 1284×2778 (iPhone), ink background
sips -Z 440 "$LOGO" --out "$tmpdir/splash-logo.png" >/dev/null
sips --padToHeightWidth 2778 1284 "$tmpdir/splash-logo.png" --padColor "$INK" -o "$ASSETS/splash.png" >/dev/null

cp "$ASSETS/icon.png" "$ASSETS/app-icon.png"
cp "$ASSETS/splash.png" "$ASSETS/app-splash.png"
echo "Wrote $ASSETS/app-icon.png and $ASSETS/app-splash.png"
