#!/bin/bash
# Script para verificar las variables de entorno en el build de producción

echo "=== Verificando variables de entorno en el build ==="
echo ""

echo "1️⃣  Variables en .env.production:"
echo "VITE_CONVEX_URL=$(grep VITE_CONVEX_URL .env.production | cut -d'=' -f2)"
echo "VITE_CLERK_PUBLISHABLE_KEY=$(grep VITE_CLERK_PUBLISHABLE_KEY .env.production | cut -d'=' -f2)"
echo ""

echo "2️⃣  URLs de Convex en el bundle:"
grep -oE "https://[a-z0-9-]+\.convex\.cloud" dist/assets/index-*.js 2>/dev/null | sort -u || echo "No dist found"
echo ""

echo "3️⃣  Claves de Clerk en Convex deployment:"
npx convex env list 2>/dev/null | grep CLERK_SECRET_KEY || echo "Could not fetch"
echo ""

echo "4️⃣  Tamaño del build:"
ls -lh dist/index.html 2>/dev/null || echo "No build found"
echo ""

echo "=== Diagnóstico completo ==="
