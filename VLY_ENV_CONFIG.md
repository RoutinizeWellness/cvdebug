# ⚠️ CONFIGURACIÓN REQUERIDA EN VLY PARA CVDEBUG.COM

## 🔴 Problema Actual
El sitio cvdebug.com muestra error 503 porque faltan las variables de entorno en la plataforma Vly.

## ✅ SOLUCIÓN: Configurar Variables de Entorno

En el **Dashboard de Vly** para el proyecto **cvdebug.com**, agregar estas variables de entorno:

### Variables Requeridas:

```bash
VITE_CONVEX_URL=https://next-cod-660.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuY3ZkZWJ1Zy5jb20k
VITE_VLY_APP_ID=lazy-badgers-roll
VITE_VLY_MONITORING_URL=https://runtime-monitoring.vly.ai/runtime-error
```

### Instrucciones:

1. **Ir al Dashboard de Vly**
2. **Seleccionar el proyecto cvdebug.com**
3. **Ir a Settings → Environment Variables** (o similar)
4. **Agregar las 4 variables listadas arriba**
5. **Hacer Redeploy/Rebuild**

## 📋 Verificación del Build

El script `build-vly.sh` mostrará en los logs:

```
✅ Configuration:
   VITE_CONVEX_URL: https://next-cod-660.convex.cloud
   VITE_CLERK_PUBLISHABLE_KEY: pk_live_Y2xlcmsuY3ZkZWJ1Zy5jb20k...
   VITE_VLY_APP_ID: "lazy-badgers-roll"
```

Y al final:
```
🔍 Verifying build:
   ✅ Correct Convex URL in bundle
```

Si ves estos mensajes, el build es correcto.

## 🔍 Diagnóstico

Si el 503 persiste después de configurar las variables:

1. **Revisar los logs de build en Vly** - debe completarse sin errores
2. **Revisar los logs de runtime** - buscar errores de autenticación o conexión
3. **Verificar que el build se completó** - debe generar archivos en `dist/`
4. **Verificar health check** - la app debe responder en `/`

## 📝 Notas Importantes

- Las variables **DEBEN** empezar con `VITE_` para ser incluidas en el bundle de Vite
- El valor de `VITE_CLERK_PUBLISHABLE_KEY` debe incluir las comillas si es necesario
- Después de agregar variables, es necesario hacer **redeploy/rebuild** completo
- El build usa Node 20 como se especifica en `vly.json`

## 🚀 Archivo de Configuración

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

## ✅ Confirmación de Éxito

Una vez configuradas las variables y hecho el redeploy, cvdebug.com debe:
- ✅ Cargar sin error 503
- ✅ Mostrar la landing page
- ✅ Permitir autenticación con Clerk
- ✅ Conectarse a Convex correctamente

---

**Contacto:** Si el problema persiste después de configurar las variables, revisar los logs de build y runtime en el dashboard de Vly.
