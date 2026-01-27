#!/bin/bash
set -e

echo "🚀 Starting VLY AI Build..."

# Copy production environment
echo "📋 Copying production environment..."
cp .env.production.cvdebug .env.production

# Show what we're using
echo "✅ Configuration:"
echo "   VITE_CONVEX_URL: ${VITE_CONVEX_URL:-$(grep VITE_CONVEX_URL .env.production | cut -d'=' -f2)}"
echo "   VITE_CLERK_PUBLISHABLE_KEY: ${VITE_CLERK_PUBLISHABLE_KEY:-$(grep VITE_CLERK_PUBLISHABLE_KEY .env.production | cut -d'=' -f2 | head -c 30)}..."
echo "   VITE_VLY_APP_ID: ${VITE_VLY_APP_ID:-$(grep VITE_VLY_APP_ID .env.production | cut -d'=' -f2)}"

# Verify critical variables
if [ -z "$VITE_CONVEX_URL" ]; then
  echo "⚠️  VITE_CONVEX_URL not set in environment, using .env.production"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Build
echo "🔨 Building application..."
npm run build -- --mode production

echo "✅ Build complete!"
ls -lh dist/index.html

# Verify build has correct URL
echo ""
echo "🔍 Verifying build:"
if grep -q "next-cod-660.convex.cloud" dist/assets/index-*.js; then
  echo "   ✅ Correct Convex URL in bundle"
else
  echo "   ⚠️  Convex URL might be incorrect"
fi
