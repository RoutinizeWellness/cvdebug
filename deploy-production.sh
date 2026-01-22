#!/bin/bash
# Deploy script for production (cvdebug.com)
# This script deploys to the shocking-meerkat-209 deployment

set -e

echo "🚀 Starting production deployment to cvdebug.com..."

# Load production environment
echo "📦 Building production bundle..."
cp .env.production.cvdebug .env.production
pnpm build:prod

echo "✅ Production build complete!"
echo ""
echo "⚠️  IMPORTANT: To deploy Convex functions to production, you need to:"
echo "   1. Go to https://dashboard.convex.dev"
echo "   2. Select the 'shocking-meerkat-209' deployment"
echo "   3. Go to Settings → Deploy Key"
echo "   4. Copy the deploy key and set it as CONVEX_DEPLOY_KEY_PROD in your environment"
echo "   5. Run: CONVEX_DEPLOY_KEY=\$CONVEX_DEPLOY_KEY_PROD npx convex deploy"
echo ""
echo "🔧 Production Convex URL: https://shocking-meerkat-209.convex.cloud"
echo "🌐 Production Site: https://cvdebug.com"
