# Lista de Verificación - Solución de Errores 503

## ✅ Cambios Aplicados

### 1. Archivo Raíz `index.html` Limpiado
- **Ubicación**: `/home/daytona/codebase/index.html`
- **Antes**: 63 referencias a cvdebug.com
- **Después**: 2 referencias (keywords SEO + email de soporte)
- **Crítico eliminado**: JavaScript redirect forzado a cvdebug.com

### 2. URLs Dinámicas Implementadas
- ✅ Canonical: `<link rel="canonical" href="/" />`
- ✅ OG URL: `<meta property="og:url" content="/" />`
- ✅ Todas las referencias en JSON-LD limpiadas

### 3. Build de Producción Verificado
- ✅ `dist/index.html` solo contiene 2 referencias seguras
- ✅ No hay JavaScript redirects
- ✅ Servidor de preview funciona: `http://localhost:4173`

## 🔍 Cómo Verificar que Funciona

### Paso 1: Limpiar Cache del Navegador
```bash
# En el navegador:
1. Presiona Ctrl+Shift+Delete
2. Selecciona "Todo el tiempo"
3. Marca "Imágenes y archivos en caché"
4. Haz clic en "Borrar datos"
```

### Paso 2: Ejecutar Servidor de Desarrollo
```bash
npm run dev
# Abre: http://localhost:5174 (o el puerto que te indique)
```

### Paso 3: Verificar en Consola del Navegador
```bash
# Presiona F12 en el navegador
# Ve a la pestaña "Consola"
# NO deberías ver:
❌ GET https://cvdebug.com/ 503 (Service Unavailable)
❌ Failed to load resource: cvdebug.com

# SI deberías ver:
✅ Vite server running
✅ Página carga normalmente
✅ Sin errores 503
```

### Paso 4: Verificar Network Tab
```bash
# En DevTools (F12):
1. Ve a la pestaña "Red" o "Network"
2. Recarga la página (Ctrl+R)
3. Filtra por "cvdebug.com"
4. NO debería aparecer NINGUNA request a cvdebug.com
```

## ❓ Si Aún Ves Errores

### Tipo de Error 1: "Failed to load resource: 503"
**Causa Posible**: Cache del navegador
**Solución**:
```bash
# Recarga forzada sin cache
Ctrl + Shift + R (Linux/Windows)
Cmd + Shift + R (Mac)
```

### Tipo de Error 2: "Cannot connect to cvdebug.com"
**Causa Posible**: Extensiones del navegador o DNS cache
**Solución**:
```bash
# Abre el navegador en modo incógnito
Ctrl + Shift + N (Chrome/Edge)
Ctrl + Shift + P (Firefox)
```

### Tipo de Error 3: Página en blanco
**Causa Posible**: Errores de compilación TypeScript
**Solución**:
```bash
# Verifica errores de compilación
npx tsc -b --noEmit

# Si hay errores, léelos y corrígelos
# Luego vuelve a ejecutar:
npm run dev
```

### Tipo de Error 4: "Vite HMR disconnected"
**Causa Posible**: Puerto en uso
**Solución**:
```bash
# Mata todos los procesos de Vite
pkill -f vite

# Vuelve a ejecutar
npm run dev
```

## 📊 Estado de Archivos Críticos

### ✅ Archivos Limpios (URLs Relativas)
- `/home/daytona/codebase/index.html` - Root template
- `/home/daytona/codebase/src/index.html` - Source template
- `/home/daytona/codebase/dist/index.html` - Build output

### ⚠️ Archivos con URLs (Pero NO Causan 503)
Estos archivos contienen URLs hardcodeadas pero son para:
- **SEO metadata** (no hacen requests HTTP)
- **Emails** (enviados por backend, no por navegador)
- **Schema.org JSON-LD** (solo metadata, no requests)

Lista:
- `src/lib/seo.ts` - Metadata SEO
- `src/lib/config.ts` - Usa `window.location.origin` dinámicamente ✅
- `src/convex/marketing.ts` - Templates de email (backend)
- `src/convex/retargetingEmail.ts` - Templates de email (backend)

## 🎯 Verificación Final

Ejecuta este comando para confirmar que todo está limpio:

```bash
# 1. Verifica el archivo raíz
echo "=== ROOT index.html ==="
grep -c "cvdebug.com" /home/daytona/codebase/index.html
# Debe devolver: 2

# 2. Verifica el source
echo "=== SOURCE index.html ==="
grep -c "cvdebug.com" /home/daytona/codebase/src/index.html
# Debe devolver: 0

# 3. Verifica el build
echo "=== DIST index.html ==="
grep -c "cvdebug.com" /home/daytona/codebase/dist/index.html
# Debe devolver: 2

# 4. Verifica que no hay JavaScript redirects
echo "=== JavaScript Redirects ==="
grep -r "window.location.replace.*cvdebug" /home/daytona/codebase/index.html
# No debe devolver nada

echo "✅ Todo limpio si los números coinciden"
```

## 🚀 Para Deployar a Producción

```bash
# 1. Usa el script de build de producción
npm run build:prod

# 2. Verifica el build
grep -c "cvdebug.com" dist/index.html
# Debe ser: 2 (solo keywords + email)

# 3. Deploy el contenido de dist/ a tu servidor
```

## 📝 Notas Importantes

1. **El root `index.html` es el que usa VLY AI platform** para builds, NO el `src/index.html`
2. **Las 2 referencias restantes son seguras** (texto en keywords SEO + email de contacto)
3. **`window.location.origin` es dinámico** y se adapta automáticamente al dominio actual
4. **Los URLs en archivos .ts son metadata** y no causan requests HTTP desde el navegador

## ❓ ¿Sigues Viendo Errores?

Por favor proporciona:
1. **Captura de pantalla** de la consola del navegador (F12)
2. **URL exacta** donde ocurre el error
3. **Mensaje de error completo** (copia y pega)
4. **Pestaña Network** filtrada por "cvdebug" (captura)

Con esta información podré diagnosticar el problema específico.
