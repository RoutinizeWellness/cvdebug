# Actualizar Claves de Clerk en vly Keys Tab

## Variables de Entorno a Configurar

Copia y pega estas variables en el **Keys tab** de la plataforma vly:

```bash
# Clerk Development Keys (funcionan en cualquier dominio)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_aG9wZWZ1bC1kb2UtNTYuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_1G5YqDc3bUAhRl3XAPjZXbwvm0NcPmendZ5VQTCyQT

# Convex Configuration
VITE_CONVEX_URL=https://next-cod-660.convex.cloud
CONVEX_SITE_URL=https://lazy-badgers-roll.vly.sh
CONVEX_DEPLOYMENT=dev:next-cod-660

# vly Configuration
VITE_VLY_APP_ID=lazy-badgers-roll
VITE_VLY_MONITORING_URL=https://runtime-monitoring.vly.ai/runtime-error
```

## Pasos para Actualizar

1. Ve al panel de vly
2. Encuentra la pestaña "Keys" o "Environment Variables"
3. Actualiza o agrega cada variable listada arriba
4. Guarda los cambios
5. Espera 1-2 minutos a que se redespliegue automáticamente
6. Refresca tu navegador con Ctrl+Shift+R (hard refresh)

## Diferencia entre Claves de Desarrollo y Producción

### Claves de Desarrollo (pk_test_)
- ✅ Funcionan en CUALQUIER dominio (localhost, vly.sh, etc.)
- ✅ Perfectas para desarrollo y testing
- ✅ No requieren configurar dominios autorizados

### Claves de Producción (pk_live_)
- ⚠️ Solo funcionan en dominios específicos configurados en Clerk
- ⚠️ Requieren agregar cada dominio manualmente
- ✅ Más seguras para producción

## Resultado Esperado

Una vez configuradas las claves de desarrollo:
- ✅ Los errores de Clerk desaparecerán
- ✅ La autenticación funcionará en lazy-badgers-roll.vly.sh
- ✅ No verás más "Production Keys are only allowed for domain cvdebug.com"
- ✅ No verás más "Multiple ClerkProvider" errors
