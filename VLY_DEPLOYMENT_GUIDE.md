# Guía de Deployment en Vly para cvdebug.com

## 🔴 Problema Actual: 503 Service Unavailable

El error 503 en cvdebug.com indica que la plataforma Vly no puede iniciar la aplicación correctamente.

## ✅ Configuración Correcta

### Variables de Entorno Requeridas en Vly

Para que cvdebug.com funcione, la plataforma Vly **DEBE** tener estas variables de entorno configuradas:

```bash
# Convex Backend
VITE_CONVEX_URL=https://next-cod-660.convex.cloud

# Clerk Authentication (LIVE keys para cvdebug.com)
VITE_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuY3ZkZWJ1Zy5jb20k

# Vly Configuration
VITE_VLY_APP_ID=lazy-badgers-roll
VITE_VLY_MONITORING_URL=https://runtime-monitoring.vly.ai/runtime-error
```

### Build Configuration

El archivo `vly.json` ya está correctamente configurado:
```json
{
  "buildCommand": "chmod +x build-vly.sh && ./build-vly.sh",
  "outputDirectory": "dist",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "vite",
  "nodeVersion": "20"
}
```

### Backend Configuration (Convex)

El deployment de Convex (`next-cod-660`) ya tiene las claves correctas:
- ✅ `CLERK_SECRET_KEY=sk_live_lHtVcOMr43g3mar3A6NiNGG3AR41YtqunmDP4qK5be`
- ✅ Auth config detecta automáticamente el entorno

### Clerk JWT Templates

Dos templates configurados:

1. **Development** (para vly.sh):
   - Issuer: `https://hopeful-doe-56.clerk.accounts.dev`
   - Audience: `convex`

2. **Production** (para cvdebug.com):
   - Issuer: `https://clerk.cvdebug.com`
   - Audience: `convex`

## 🔍 Diagnóstico del 503

### Causas Posibles:

1. **Variables de entorno faltantes en Vly**
   - La plataforma Vly NO tiene configuradas las variables de entorno necesarias
   - Solución: Configurar las variables en el dashboard de Vly

2. **Build fallando**
   - El comando de build puede estar fallando
   - Revisar logs de build en Vly

3. **Health check fallando**
   - La aplicación arranca pero el health check de Vly falla
   - Verificar que la aplicación responde en `/`

4. **Autenticación fallando**
   - Mismatch entre JWT issuer y auth config
   - Ya corregido: auth.config.ts detecta el entorno automáticamente

### Pasos para Resolver:

1. **En el Dashboard de Vly para cvdebug.com:**
   - Ir a Settings → Environment Variables
   - Agregar las 4 variables listadas arriba
   - Hacer redeploy

2. **Verificar los logs de build:**
   - Debe mostrar: "✅ Using Convex deployment: https://next-cod-660.convex.cloud"
   - El build debe completarse sin errores

3. **Verificar los logs de runtime:**
   - Buscar errores de autenticación
   - Buscar errores de conexión a Convex

4. **Test local:**
   ```bash
   pnpm build:prod
   pnpm preview
   ```
   - Debería funcionar sin errores

## 📝 Notas Importantes

- **NO usar** `shocking-meerkat-209` - ese deployment no existe o no tenemos acceso
- **Usar siempre** `next-cod-660.convex.cloud` para ambos entornos
- El deployment `next-cod-660` tiene configuradas las claves LIVE de Clerk para producción
- El auth.config.ts detecta automáticamente si se está en producción por el dominio

## 🚀 Deploy Manual de Prueba

Para probar el build localmente:
```bash
./build-vly.sh
cd dist
python3 -m http.server 8000
```

Luego visitar http://localhost:8000 para verificar que funciona.
