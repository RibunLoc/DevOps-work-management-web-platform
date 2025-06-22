#!/bin/sh
cat <<EOF > /usr/share/nginx/html/env.js
window.__ENV__ = {
  VITE_API_BASE: "${VITE_API_BASE}"
};
EOF

exec nginx -g 'daemon off;'
