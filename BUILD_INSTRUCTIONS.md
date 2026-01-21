# Build Instructions for CVDebug

## 🔧 Environment Configuration

Este proyecto tiene 3 archivos de entorno:

### 1. `.env.local` - Desarrollo Local (vly.sh)
```bash
VITE_CONVEX_URL=https://next-cod-660.convex.cloud
CONVEX_SITE_URL=https://lazy-badgers-roll.vly.sh
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..." (Development keys)
```
**Uso**: Desarrollo local en vly.sh
**Comando**: `npm run dev`

### 2. `.env.production` - Producción (cvdebug.com)
```bash
VITE_CONVEX_URL=https://shocking-meerkat-209.convex.cloud
CONVEX_SITE_URL=https://cvdebug.com
VITE_CLERK_PUBLISHABLE_KEY="pk_live_..." (Production keys)
```
**Uso**: Build para cvdebug.com en producción
**Comando**: `npm run build` o `npm run build:prod`

### 3. `.env.production.cvdebug` - Backup de Producción
Archivo de respaldo con las mismas configuraciones de producción.

---

## 🚀 Comandos de Build

### Desarrollo Local (vly.sh)
```bash
npm run dev
```
Usa `.env.local` con URLs de desarrollo.

### Build para Producción (cvdebug.com)
```bash
npm run build
```
Usa `.env.production` con URLs de producción de cvdebug.com.

### Build Explícito para Producción
```bash
npm run build:prod
```
Copia `.env.production.cvdebug` a `.env.production` y hace build.

---

## ⚠️ PROBLEMA COMÚN: 503 Service Unavailable

### Síntoma
- Localhost funciona ✅
- Producción da error 503 ❌

### Causa
El build de producción se hizo con claves de DESARROLLO (vly.sh) en lugar de claves de PRODUCCIÓN (cvdebug.com).

### Solución
1. **Verificar** que `.env.production` tiene las URLs correctas:
   ```bash
   cat .env.production | grep CONVEX_SITE_URL
   # Debe mostrar: CONVEX_SITE_URL=https://cvdebug.com
   # NO debe mostrar: CONVEX_SITE_URL=https://lazy-badgers-roll.vly.sh
   ```

2. **Rebuild** con las configuraciones correctas:
   ```bash
   npm run build
   ```

3. **Verificar** las variables en el build:
   ```bash
   # El dist debe usar cvdebug.com, no vly.sh
   grep -r "cvdebug.com" dist/
   ```

---

## 🔍 Diferencias Clave: Dev vs Prod

| Variable | Desarrollo (vly.sh) | Producción (cvdebug.com) |
|----------|---------------------|--------------------------|
| CONVEX_URL | next-cod-660 | shocking-meerkat-209 |
| SITE_URL | lazy-badgers-roll.vly.sh | cvdebug.com |
| CLERK_KEY | pk_test_... (dev) | pk_live_... (prod) |
| CONVEX_DEPLOYMENT | dev:next-cod-660 | prod:shocking-meerkat-209 |

---

## 📝 Checklist Pre-Deploy

Antes de deployar a producción:

- [ ] Verificar que `.env.production` tiene URLs de cvdebug.com
- [ ] Verificar que Clerk keys son `pk_live_` (no `pk_test_`)
- [ ] Verificar que Convex URL es shocking-meerkat-209 (no next-cod-660)
- [ ] Correr `npm run build`
- [ ] Verificar que `dist/` contiene URLs de cvdebug.com
- [ ] Test en local con `npm run preview`

---

## 🐛 Debug

### Ver qué environment está usando el build:
```bash
grep -E "VITE_|CONVEX_" .env.production
```

### Ver qué URLs están en el dist:
```bash
# Después de build
grep -r "lazy-badgers-roll" dist/  # NO debe aparecer en producción
grep -r "cvdebug.com" dist/        # Debe aparecer en producción
```

### Limpiar y rebuild desde cero:
```bash
rm -rf dist/
rm -rf node_modules/.vite/
npm run build
```

---

## ✅ Verificación Post-Deploy

Después de deployar, verificar:

1. **Console del navegador**: No debe haber errores 503
2. **Network tab**: Las llamadas deben ir a `shocking-meerkat-209.convex.cloud`
3. **Clerk**: Debe usar `pk_live_` keys
4. **Site URL**: Debe ser `https://cvdebug.com`

---

## 📞 Soporte

Si sigues teniendo problemas:
1. Verificar que Convex deployment `prod:shocking-meerkat-209` existe y está activo
2. Verificar que Clerk domain `cvdebug.com` está configurado con las live keys
3. Verificar que el DNS de cvdebug.com apunta correctamente

---

**Última actualización**: 2026-01-21
