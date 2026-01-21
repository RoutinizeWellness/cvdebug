#!/bin/bash
set -e

echo "🚀 Starting VLY AI Build..."

# Copy production environment
echo "📋 Copying production environment..."
cp .env.production.cvdebug .env.production

# Show what we're using
echo "✅ Using Convex deployment:"
grep "VITE_CONVEX_URL" .env.production || echo "⚠️  VITE_CONVEX_URL not found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Build
echo "🔨 Building application..."
npm run build -- --mode production

echo "✅ Build complete!"
ls -lh dist/index.html
