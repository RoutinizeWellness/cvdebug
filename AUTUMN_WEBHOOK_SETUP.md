# Configuración del Webhook de Autumn para CVDebug

## 📋 Resumen
Este documento explica cómo configurar correctamente el webhook de Autumn para que los pagos se reflejen automáticamente en el panel de admin.

---

## 🔗 URL del Webhook

**URL a configurar en Autumn:**
```
https://tu-dominio.convex.site/autumn-webhook
```

O si estás usando un dominio custom:
```
https://cvdebug.com/autumn-webhook
```

**Método:** `POST`

---

## 🔑 Variables de Entorno Requeridas

Asegúrate de tener estas variables configuradas en Convex:

### 1. Secret Key de Autumn
```
AUTUMN_SECRET_KEY=tu_secret_key_de_autumn
```

### 2. Product IDs de Autumn
```
PRODUCT_SINGLE_DEBUG_FIX=prod_debug_fix_id_de_autumn
PRODUCT_SINGLE_SCAN=prod_single_scan_id_de_autumn
PRODUCT_INTERVIEW_SPRINT=prod_sprint_id_de_autumn
```

**⚠️ IMPORTANTE:** Estos IDs deben coincidir EXACTAMENTE con los Product IDs configurados en Autumn.

---

## 💰 Mapeo de Productos

| Plan | Precio | Product ID Env Variable | Descripción |
|------|--------|------------------------|-------------|
| Arreglo Rápido | €5.99 | `PRODUCT_SINGLE_DEBUG_FIX` | Un solo arreglo de CV |
| Pase 24h | €14.99 | `PRODUCT_SINGLE_SCAN` | Acceso completo por 24 horas |
| Sprint 7 Días | €24.99 | `PRODUCT_INTERVIEW_SPRINT` | Acceso completo por 7 días |

---

## 🔄 Flujo del Webhook

### Cuando un usuario paga:

1. **Autumn envía webhook** → `POST /autumn-webhook`
2. **Sistema valida** signature de Autumn
3. **Identifica el producto** usando `product_id`
4. **PASO 1:** Actualiza `subscriptionTier` del usuario
5. **PASO 2:** Crea registro en tabla `payments` ✅ **CRÍTICO para admin panel**
6. **PASO 3:** Desbloquea resume específico si hay `metadata.resumeId`
7. **Admin panel se actualiza automáticamente** mediante queries reactivas

---

## 📊 Verificación en el Admin Panel

### Después de un pago exitoso, deberías ver:

1. **Dashboard → Stats Cards:**
   - Contador del plan incrementado
   - Revenue total actualizado
   - Revenue por plan actualizado

2. **Premium Users Table:**
   - Usuario aparece con el plan correcto
   - Badge de color (Amber/Orange/Primary)
   - Status "Activo" con créditos

3. **Billing View:**
   - Nuevo registro en "Recent Payments"
   - Transaction ID visible
   - Monto y plan correctos

---

## 🧪 Cómo Probar la Conexión

### Opción 1: Test Real (Recomendado)
1. Ve al Admin Panel → Dashboard
2. Scroll hasta "Test Payment Flow"
3. Click en "Test Debug Fix (€5.99)" o "Test 24h Pass (€14.99)"
4. Completa el checkout en Autumn
5. Verifica que el admin panel se actualice automáticamente

### Opción 2: Simulación de Webhook
1. Ve al Admin Panel → Dashboard
2. Scroll hasta "Test Post-Payment Logic (Webhook)"
3. Ingresa un email de usuario existente
4. Selecciona el plan
5. Click "Simulate Payment Success"
6. Verifica que aparezca en el admin panel

---

## 🐛 Troubleshooting

### El admin panel NO muestra el pago:

**1. Verifica que el webhook llegó:**
```bash
# En Convex Dashboard → Logs
Buscar: "[Webhook] Processing checkout"
```

**2. Verifica variables de entorno:**
```bash
# En Convex Dashboard → Settings → Environment Variables
✅ AUTUMN_SECRET_KEY debe existir
✅ PRODUCT_SINGLE_DEBUG_FIX debe existir
✅ PRODUCT_SINGLE_SCAN debe existir
✅ PRODUCT_INTERVIEW_SPRINT debe existir
```

**3. Verifica que el usuario existe:**
El usuario DEBE existir en Convex ANTES de que llegue el webhook.
- Si paga antes de registrarse → el webhook fallará
- Solución: Usa "Manual Purchase Grant" en el admin panel

**4. Verifica el Product ID:**
```bash
# En logs de Convex, buscar:
"[Webhook] 📦 Product ID: prod_xxx"
```
Este ID debe coincidir con alguna de las variables de entorno.

---

## ⚡ Actualización en Tiempo Real

El admin panel usa **Convex queries reactivas**, lo que significa:

- ✅ Se actualiza AUTOMÁTICAMENTE cuando hay nuevos pagos
- ✅ No necesitas refrescar la página
- ✅ Múltiples admins ven los cambios simultáneamente
- ✅ Notificación toast aparece cuando llega un nuevo pago

**Si no ves actualizaciones automáticas:**
1. Verifica que estás usando `useQuery` de Convex (no fetch)
2. Verifica que no hay errores en la consola del navegador
3. Hard refresh: `Ctrl + Shift + R`

---

## 📝 Logs Importantes

### Webhook exitoso:
```
[Webhook] ====== START WEBHOOK ======
[Webhook] ✅ Received event: checkout.completed
[Webhook] 🛒 Processing checkout for customer_id: user_xxx
[Webhook] 📦 Product ID: prod_xxx
[Webhook] ✅ Mapped product to plan: single_scan
[Webhook] ✅ STEP 1 SUCCESS: User subscription updated
[Webhook] ✅ STEP 2 SUCCESS: Payment record stored
[Webhook] ====== END WEBHOOK SUCCESS ======
```

### Webhook fallido (usuario no existe):
```
[Webhook] ❌ STEP 1 FAILED: User not found
[storePaymentRecord] ❌ User not found with tokenIdentifier: xxx
```
**Solución:** Usa "Manual Purchase Grant" con el email del usuario.

---

## 🎯 Checklist de Configuración

- [ ] Webhook URL configurada en Autumn Dashboard
- [ ] `AUTUMN_SECRET_KEY` configurada en Convex
- [ ] Los 3 Product IDs configurados en Convex
- [ ] Product IDs coinciden EXACTAMENTE con Autumn
- [ ] Test de pago completado exitosamente
- [ ] Admin panel muestra el pago
- [ ] Notificación toast apareció en admin panel

---

## 🔐 Seguridad

- El webhook valida la signature de Autumn (línea 9 en billing.ts)
- Solo el admin (tiniboti@gmail.com) puede ver pagos
- Los tokens de usuario están hasheados
- No se exponen datos sensibles en logs públicos

---

## 📞 Soporte

Si después de seguir todos los pasos el webhook no funciona:

1. Verifica logs en Convex Dashboard
2. Verifica configuración en Autumn Dashboard
3. Usa "Manual Purchase Grant" como solución temporal
4. Contacta soporte de Autumn si el webhook nunca llega

---

**Última actualización:** 26 de Enero de 2026
**Versión del sistema:** 2.4.0
