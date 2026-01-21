# 📦 Guía de Deployment - CVDebug

Este proyecto tiene dos ambientes de deployment:

## 🧪 Desarrollo/Staging: lazy-badgers-roll.vly.sh

**Usa claves de DESARROLLO** (funcionan en cualquier dominio)

### Variables de Entorno:
```bash
VITE_CONVEX_URL=https://next-cod-660.convex.cloud
CONVEX_SITE_URL=https://lazy-badgers-roll.vly.sh
CONVEX_DEPLOYMENT=dev:next-cod-660
VITE_CLERK_PUBLISHABLE_KEY=pk_test_aG9wZWZ1bC1kb2UtNTYuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_1G5YqDc3bUAhRl3XAPjZXbwvm0NcPmendZ5VQTCyQT
```

### Deployment:
1. El archivo `.env.production` tiene las claves de desarrollo
2. Push a `main` branch → vly despliega automáticamente
3. Usa `git push origin main`

---

## 🚀 Producción: cvdebug.com

**Usa claves de PRODUCCIÓN** (solo funcionan en cvdebug.com)

### Variables de Entorno:
```bash
VITE_CONVEX_URL=https://shocking-meerkat-209.convex.cloud
CONVEX_SITE_URL=https://cvdebug.com
CONVEX_DEPLOYMENT=prod:shocking-meerkat-209
VITE_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuY3ZkZWJ1Zy5jb20k
CLERK_SECRET_KEY=sk_live_lHtVcOMr43g3mar3A6NiNGG3AR41YtqunmDP4qK5be
```

### Deployment a cvdebug.com:

**Opción 1 - Usar el archivo de configuración:**
```bash
# Copiar configuración de producción
cp .env.production.cvdebug .env.production

# Build
npm run build

# Deploy a tu servidor de cvdebug.com
# (scp, rsync, o tu método preferido)
```

**Opción 2 - Variables de entorno del servidor:**
Configura las variables de producción directamente en tu servidor de cvdebug.com (Vercel, Netlify, VPS, etc.)

---

## ⚠️ IMPORTANTE: No mezclar claves

- ❌ NO uses claves de producción (`pk_live_`) en vly.sh
- ❌ NO uses claves de desarrollo (`pk_test_`) en cvdebug.com
- ✅ Cada ambiente debe usar sus propias claves

## 🔑 Resumen de Claves

| Ambiente | Dominio | Clerk Keys | Convex Deployment |
|----------|---------|------------|-------------------|
| **Desarrollo** | lazy-badgers-roll.vly.sh | pk_test_... (dev) | dev:next-cod-660 |
| **Producción** | cvdebug.com | pk_live_... (prod) | prod:shocking-meerkat-209 |

## 📝 Archivos de Configuración

- `.env.local` - Desarrollo local (no se commitea)
- `.env.production` - Usado por vly.sh (claves de desarrollo)
- `.env.production.cvdebug` - Template para cvdebug.com (claves de producción)

## 🔄 Workflow Recomendado

1. **Desarrollo local**: usar `.env.local` con claves de desarrollo
2. **Testing en vly.sh**: push a main → despliega automáticamente
3. **Producción cvdebug.com**: 
   - Copiar `.env.production.cvdebug` → `.env.production`
   - Build y deploy manual a cvdebug.com
   - Luego revertir `.env.production` a claves de desarrollo
