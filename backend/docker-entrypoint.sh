#!/bin/sh
set -e

echo "Waiting for database at $DB_HOST:$DB_PORT..."
until python - <<PYEOF
import os, socket, sys
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.settimeout(2)
try:
    s.connect((os.environ.get("DB_HOST", "db"), int(os.environ.get("DB_PORT", 5432))))
    sys.exit(0)
except Exception:
    sys.exit(1)
PYEOF
do
  sleep 1
done
echo "Database is up."

python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec "$@"
