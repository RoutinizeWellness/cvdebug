# SOLUCIÓN: Error de módulo .pnpm en localhost

## 🔴 El Problema

Ves este error en el navegador en localhost:
```
Cannot find module '.../node_modules/.pnpm/vite@6.3.5...
```

**Causa**: El navegador tiene cacheados archivos JavaScript de la instalación vieja con pnpm.

## ✅ SOLUCIÓN - Sigue EXACTAMENTE estos pasos:

### Paso 1: Abre DevTools
```
Presiona F12 en el navegador
```

### Paso 2: Abre la pestaña Network
```
Click en la pestaña "Network" o "Red"
```

### Paso 3: Marca "Disable cache"
```
☑️ Marca la casilla "Disable cache" en la parte superior
```

### Paso 4: Mantén DevTools abierto y recarga
```
Con DevTools ABIERTO, presiona:
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Paso 5: Si aún no funciona
```
1. Con DevTools abierto
2. Click DERECHO en el botón de recargar
3. Selecciona "Empty Cache and Hard Reload"
   (Vaciar caché y recargar de manera forzada)
```

### Paso 6: Alternativa - Modo Incógnito
```
1. Cierra la pestaña de localhost
2. Abre ventana incógnito: Ctrl + Shift + N
3. Ve a http://localhost:5176
```

### Paso 7: Última alternativa - Limpiar todo el cache
```
1. Presiona Ctrl + Shift + Delete
2. Selecciona "Cached images and files"
3. Time range: "All time"
4. Click "Clear data"
5. Reinicia el navegador completamente
6. Abre http://localhost:5176
```

---

## 🎯 Verificación

Después de hacer el Hard Refresh, deberías ver:
- ✅ La página carga normalmente
- ✅ Sin errores en la consola
- ✅ El dashboard funciona

Si ves CUALQUIER error después del Hard Refresh, copia el error COMPLETO aquí.

---

## 📝 Por qué pasa esto

1. Instalaste con pnpm originalmente
2. Los archivos JS cacheados contienen `import` de rutas con `.pnpm`
3. Cambiaste a npm (eliminaste `.pnpm`)
4. El navegador intenta cargar los módulos viejos → ERROR
5. Hard Refresh fuerza al navegador a descargar los archivos nuevos

---

## ⚡ Si NADA funciona

Si después de todo esto el error persiste:

1. Cierra TODAS las ventanas del navegador
2. Reinicia el navegador completamente
3. Abre SOLO UNA pestaña incógnito
4. Ve a http://localhost:5176

Si aún falla, comparte:
- ¿Qué navegador usas? (Chrome, Firefox, Edge, etc.)
- Screenshot del error completo
- Screenshot de la pestaña Network en DevTools
