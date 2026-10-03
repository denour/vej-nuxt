#!/bin/sh
# Minifica el runtime (kit + primitivas + reproductor) en lib/runtime.min.js con el esbuild del MCP de HyperFrames.
# Sólo hace falta si cambias algo en lib/js/. build.py usa las fuentes sin minificar si el .min está viejo.
set -e
D=$(cd "$(dirname "$0")" && pwd)
ESB=${ESBUILD:-/var/www/hyperframes-mcp/node_modules/.bin/esbuild}
cat "$D/js/vej-kit.js" "$D/js/vej-prims.js" "$D/js/reel-runtime.js" | "$ESB" --minify --target=es2020 --log-level=warning > "$D/runtime.min.js"
wc -c "$D/runtime.min.js"
