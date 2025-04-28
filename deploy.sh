#!/usr/bin/env bash
set -euo pipefail

# ─── Config ─────────────────────────────────────────────────────────────────────
EC2_USER="ec2-user"
EC2_HOST="16.176.19.41"
SSH_KEY="/c/Users/sala_/Downloads/oppy-production-key1.pem"
REMOTE_BASE_DIR="/home/ec2-user/oppeypro"

FRONTEND_DIR="oppy-frontend"
BACKEND_DIR="oppy-backend"
# ────────────────────────────────────────────────────────────────────────────────

echo "🔨 Building frontend..."
pushd "$FRONTEND_DIR" >/dev/null
npm ci --silent
npm run build
popd >/dev/null

echo "📂 Ensure remote dirs exist..."
ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" \
  "mkdir -p $REMOTE_BASE_DIR/$FRONTEND_DIR/build $REMOTE_BASE_DIR"

if command -v rsync >/dev/null; then
  echo "☁️  Syncing with rsync…"
  rsync -avz --delete -e "ssh -i $SSH_KEY" \
    "$FRONTEND_DIR/build/" "$EC2_USER@$EC2_HOST:$REMOTE_BASE_DIR/$FRONTEND_DIR/build/"
  rsync -avz --delete \
    --exclude 'node_modules' --exclude '.git' --exclude 'server.log' \
    -e "ssh -i $SSH_KEY" \
    "$BACKEND_DIR/" "$EC2_USER@$EC2_HOST:$REMOTE_BASE_DIR/$BACKEND_DIR/"
else
  echo "⚠️  rsync not found; falling back to scp + tar packaging…"

  # Frontend: clean & scp
  ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" "rm -rf $REMOTE_BASE_DIR/$FRONTEND_DIR/build/*"
  scp -i "$SSH_KEY" -r "$FRONTEND_DIR/build/"* \
    "$EC2_USER@$EC2_HOST:$REMOTE_BASE_DIR/$FRONTEND_DIR/build/"

  # Backend: package & pipe
  echo "📦 Packaging backend (excluding node_modules & .git)…"
  ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" "rm -rf $REMOTE_BASE_DIR/$BACKEND_DIR"
  tar czf - \
    --exclude="./$BACKEND_DIR/node_modules" \
    --exclude="./$BACKEND_DIR/.git" \
    -C . "$BACKEND_DIR" | \
    ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" \
      "cd $REMOTE_BASE_DIR && tar xzf -"
fi

echo "🔄 Installing deps & restarting on EC2…"
ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" << 'EOF'
set -euo pipefail

cd /home/ec2-user/oppeypro/oppy-backend
npm ci --production

if pm2 describe oppy-backend > /dev/null 2>&1; then
  pm2 restart oppy-backend
else
  pm2 start server.js --name oppy-backend
fi

sudo systemctl reload nginx
EOF

echo "✅ Deployment complete!"
