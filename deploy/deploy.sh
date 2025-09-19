#!/usr/bin/env bash
set -euo pipefail
cd /root/UIW
exec 9>/root/UIW/deploy/deploy.lock
flock -n 9 || exit 0
BRANCH=
if [ -z  ]; then BRANCH=main; fi
if ! git rev-parse --verify origin/ >/dev/null 2>&1; then BRANCH=master; fi
if ! git rev-parse --verify origin/ >/dev/null 2>&1; then BRANCH=main; fi

echo [2025-09-18T21:23:18-04:00]
