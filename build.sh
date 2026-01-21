#!/bin/bash
# Vly.sh build script - Force npm usage
set -e

echo "=== Starting build for vly.sh ==="

# Ensure we're using npm
export npm_config_legacy_peer_deps=true
export SKIP_PREFLIGHT_CHECK=true

# Clean any conflicting package manager files and caches
echo "Cleaning conflicting package managers..."
rm -rf node_modules/.pnpm node_modules/.bun node_modules/.yarn 2>/dev/null || true
rm -rf .pnpm-store .bun 2>/dev/null || true

# Remove node_modules if it exists from wrong package manager
if [ -d "node_modules" ] && [ ! -f "node_modules/.package-lock.json" ]; then
  echo "Removing node_modules from wrong package manager..."
  rm -rf node_modules
fi

# Install with npm
echo "Installing dependencies with npm..."
npm install --legacy-peer-deps --no-audit --no-fund

# Build project
echo "Building project..."
npm run build

echo "=== Build complete! ==="
ls -lh dist/ | head -10
