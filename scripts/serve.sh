#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-8080}"
HOST="${2:-127.0.0.1}"

find_free_port() {
  local host="$1"
  local start_port="$2"
  python3 - "$host" "$start_port" <<'PY'
import socket
import sys

host = sys.argv[1]
port = int(sys.argv[2])

while port < 65535:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            s.bind((host, port))
            print(port)
            break
        except OSError:
            port += 1
else:
    raise SystemExit("No free port found in range 1..65535")
PY
}

FREE_PORT="$(find_free_port "${HOST}" "${PORT}")"

if [[ "${FREE_PORT}" != "${PORT}" ]]; then
  echo "Port ${PORT} is busy, using ${FREE_PORT} instead."
fi

echo "Starting local server at http://${HOST}:${FREE_PORT}/AngryBirds.htm"
python3 -m http.server "${FREE_PORT}" --bind "${HOST}"
