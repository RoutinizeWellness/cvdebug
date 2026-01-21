#!/bin/bash
# Vly.sh build script
set -e

echo "Starting build..."

# Clean any conflicting package manager files
rm -rf node_modules/.pnpm node_modules/.bun 2>/dev/null || true

# Use npm for installation and build
echo "Installing dependencies with npm..."
npm install --legacy-peer-deps

echo "Building project..."
npm run build

echo "Build complete!"
