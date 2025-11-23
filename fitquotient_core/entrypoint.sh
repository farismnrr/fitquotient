#!/bin/bash
set -e

# Ensure upload and migrations directories exist and are writable by appuser
mkdir -p /home/appuser/core/uploads
mkdir -p /home/appuser/core/migrations

# Update ownership to allow appuser to write into these mountpoints
chown -R appuser:appuser /home/appuser/core/uploads || true
chown -R appuser:appuser /home/appuser/core/migrations || true

# If su-exec is available, drop privileges to appuser and run the startup script
if command -v su-exec >/dev/null 2>&1; then
  exec su-exec appuser /home/appuser/docker-startup.sh
fi

# Fallback: try using gosu if installed
if command -v gosu >/dev/null 2>&1; then
  exec gosu appuser /home/appuser/docker-startup.sh
fi

# As a last resort, attempt to run script via su
if command -v su >/dev/null 2>&1; then
  exec su -s /bin/bash appuser -c "/home/appuser/docker-startup.sh"
fi

# If none of the above are available, run the startup script directly
exec /home/appuser/docker-startup.sh
