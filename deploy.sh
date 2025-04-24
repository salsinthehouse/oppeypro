#!/usr/bin/env bash
set -euo pipefail

# ─── Configuration: update these values before running ───
# EC2_USER: your SSH login username on the EC2 instance (often “ec2-user” for Amazon Linux)
EC2_USER="ec2-user"
# EC2_HOST: the public IP or DNS name of your EC2 instance
EC2_HOST="16.176.19.41"
# SSH_KEY: full path on your local machine to the private key file you downloaded (e.g., .pem)
SSH_KEY="/c/Users/sala_/Downloads/oppy-production-key1.pem"
# REMOTE_BASE_DIR: absolute path on the EC2 instance where your repo should live
REMOTE_BASE_DIR="/home/ec2-user/oppeypro"
# GIT_REPO: HTTPS URL of your GitHub repository
GIT_REPO="https://github.com/salsinthehouse/oppeypro.git"

# 1. Build frontend locally
pushd oppy-frontend > /dev/null
npm ci
npm run build
popd > /dev/null

# 2. Ensure remote base directory and sync code
ssh -i "${SSH_KEY}" "${EC2_USER}@${EC2_HOST}" << EOF
set -euo pipefail
mkdir -p ${REMOTE_BASE_DIR}
cd ${REMOTE_BASE_DIR}
if [ ! -d .git ]; then
  git clone ${GIT_REPO} .
else
  git fetch origin main
  git reset --hard origin/main
fi
EOF

# 3. Sync static build to EC2
ssh -i "${SSH_KEY}" "${EC2_USER}@${EC2_HOST}" "mkdir -p ${REMOTE_BASE_DIR}/oppy-frontend/build"
scp -i "${SSH_KEY}" -r oppy-frontend/build/* \
  "${EC2_USER}@${EC2_HOST}:${REMOTE_BASE_DIR}/oppy-frontend/build/"

# 4. Restart or start backend & reload Nginx
echo "-- Restarting backend and reloading Nginx on remote --"
ssh -i "${SSH_KEY}" "${EC2_USER}@${EC2_HOST}" << EOF
set -euo pipefail
cd ${REMOTE_BASE_DIR}/oppy-backend
npm ci
# Start with PM2 if not already running, else restart
if ! pm2 describe oppy-backend >/dev/null 2>&1; then
  pm2 start server.js --name oppy-backend
else
  pm2 restart oppy-backend
fi
sudo systemctl reload nginx
EOF

echo "✅ Deploy complete!"