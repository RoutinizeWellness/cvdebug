# Sistema de Pagos - CVDebug

Este documento explica cómo funciona el flujo completo de pagos en CVDebug y cómo se actualiza el sistema cuando un usuario realiza un pago.

## Arquitectura del Sistema de Pagos

### 1. Proveedor de Pagos: Autumn.js + Stripe

- **Autumn.js** maneja la integración con Stripe
- Los webhooks de Autumn notifican a nuestro backend cuando se completa un pago
- Endpoint del webhook: `/autumn-webhook`

### 2. Flujo Completo de Pago

```
Usuario → Compra en Autumn Checkout → Pago en Stripe → Webhook a CVDebug → Actualización del Usuario
```

## Código Crítico

### A. Webhook Handler (`src/convex/billing.ts`)

Cuando Autumn/Stripe completa un pago, envía un webhook a nuestro endpoint:

```typescript
export const handleWebhook = httpAction(async (ctx, request) => {
  // PASO 1: Validar firma del webhook
  const signature = request.headers.get("autumn-signature");

  // PASO 2: Parsear payload
  const payload = JSON.parse(body);

  // PASO 3: Actualizar suscripción del usuario (CRÍTICO)
  await ctx.runMutation(internalAny.users.updateSubscription, {
    tokenIdentifier: customer_id,
    plan: plan,
  });

  // PASO 4: Guardar registro de pago
  await ctx.runMutation(internalAny.billing.storePaymentRecord, {
    tokenIdentifier: customer_id,
    plan,
    transactionId: transaction_id,
    amount: amount,
  });

  // PASO 5: Desbloquear resume específico (si aplica)
  if (metadata?.resumeId) {
    await ctx.runMutation(internalAny.resumes.unlockResumeAfterPurchase, {
      resumeId: metadata.resumeId,
      userId: customer_id,
    });
  }
});
```

### B. Actualización del Usuario (`src/convex/users.ts`)

La función `updateSubscription` actualiza el tier y créditos del usuario:

```typescript
export const updateSubscription = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    plan: v.union(v.literal("free"), v.literal("single_scan"), v.literal("interview_sprint")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    if (user) {
      const updates: any = {
        credits: args.plan === "single_scan" ? 1 : currentCredits,
        subscriptionTier: args.plan,
        freeTrialUsed: true,
      };

      if (args.plan === "interview_sprint") {
        updates.sprintExpiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000);
        updates.credits = 0; // Sprint no necesita créditos
      }

      await ctx.db.patch(user._id, updates);

      // Enviar email de confirmación
      await ctx.scheduler.runAfter(0, internalAny.marketing.sendPurchaseConfirmationEmail, {
        email: user.email,
        name: user.name,
        plan: args.plan,
      });
    }
  },
});
```

### C. Registro de Pagos (`src/convex/billing.ts`)

Cada pago se guarda en la tabla `payments` para auditoría:

```typescript
export const storePaymentRecord = internalMutation({
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    // Prevenir duplicados
    const existingPayment = await ctx.db
      .query("payments")
      .withIndex("by_transaction_id", (q) => q.eq("transactionId", args.transactionId))
      .first();

    if (existingPayment) {
      return existingPayment._id;
    }

    // Crear registro
    const paymentId = await ctx.db.insert("payments", {
      userId: user._id,
      tokenIdentifier: args.tokenIdentifier,
      email: user.email,
      plan: args.plan,
      transactionId: args.transactionId,
      amount: args.amount,
      status: "completed",
      purchasedAt: Date.now(),
    });

    return paymentId;
  },
});
```

## Panel de Admin - Visualización en Tiempo Real

### 1. Vista de Usuarios (`src/components/admin/AdminUserTable.tsx`)

Los usuarios se muestran con su tier actualizado en tiempo real gracias a Convex reactive queries:

```typescript
const users = useQuery(apiAny.admin.getUsers, {});
```

Cada usuario muestra:
- **Badge de tier**: Free Preview / Single Scan / Interview Sprint
- **Badge de estado**: Active Sprint (si tiene sprint activo)
- **Fecha de registro**
- **Acciones**: Ver historial de pagos, editar, eliminar

### 2. Vista de Pagos (`src/components/admin/AdminPaymentsView.tsx`)

Nueva sección en el panel de admin que muestra:

#### A. Métricas de Revenue
- **Total Revenue**: Suma de todos los pagos
- **Total Payments**: Cantidad de transacciones
- **Single Scans**: Cantidad y revenue
- **Interview Sprints**: Cantidad y revenue

#### B. Tabla de Pagos Recientes
Muestra en tiempo real:
- Fecha y hora del pago
- Usuario (nombre, email, avatar)
- Plan comprado
- Monto
- Transaction ID
- Estado

```typescript
const payments = useQuery(apiAny.billing.getAllPayments, {});
```

## Flujo de Actualización en Tiempo Real

### 1. Usuario Realiza Pago

```
1. Usuario hace clic en "Comprar" → createCheckoutSession()
2. Redirige a Autumn Checkout
3. Usuario completa el pago en Stripe
```

### 2. Webhook Recibe Notificación

```
4. Stripe → Autumn → POST /autumn-webhook
5. handleWebhook() valida y procesa
6. updateSubscription() actualiza el usuario en DB
7. storePaymentRecord() guarda el registro del pago
```

### 3. Panel de Admin se Actualiza Automáticamente

```
8. Convex reactive query detecta cambio en DB
9. useQuery() recibe datos actualizados
10. UI se re-renderiza con nueva información
```

**No se necesita refresh manual** - Todo es reactivo gracias a Convex.

## Logs y Debugging

### Logs del Webhook

Cada paso del webhook tiene logs detallados:

```
[Webhook] ====== START WEBHOOK ======
[Webhook] Timestamp: 2024-01-08T19:00:00.000Z
[Webhook] ✅ Received event: checkout.completed
[Webhook] 🔄 STEP 1: Updating user subscription...
[Webhook] ✅ STEP 1 SUCCESS: User subscription updated
[Webhook] 💾 STEP 2: Storing payment record...
[Webhook] ✅ STEP 2 SUCCESS: Payment record stored
[Webhook] 🎉 Credits granted successfully
[Webhook] ====== END WEBHOOK SUCCESS ======
```

### Verificación del Estado del Usuario

En el panel de admin, puedes:
1. Ver el tier actual del usuario
2. Ver si tiene sprint activo
3. Ver historial de pagos completo
4. Editar manualmente si hay problemas

## Manejo de Errores

### 1. Usuario No Encontrado

Si el webhook recibe un `customer_id` que no existe en la DB:

```typescript
if (!user) {
  console.error(`[updateSubscription] ❌ User not found`);
  // Intenta crear usuario si tiene identity válida
  const identity = await ctx.auth.getUserIdentity();
  if (identity && identity.subject === args.tokenIdentifier) {
    // Crea usuario nuevo con el pago
  }
}
```

### 2. Pago Duplicado

El sistema previene pagos duplicados:

```typescript
const existingPayment = await ctx.db
  .query("payments")
  .withIndex("by_transaction_id", (q) => q.eq("transactionId", args.transactionId))
  .first();

if (existingPayment) {
  console.log(`⚠️ Payment already recorded`);
  return existingPayment._id;
}
```

### 3. Manual Grant (Herramienta de Admin)

Si un pago no se procesa correctamente, el admin puede:

```typescript
// En Admin Panel → Manual Grant
await grantPurchase({
  identifier: "user@email.com",
  plan: "single_scan",
  name: "User Name"
});
```

## Queries Disponibles para Admin

### 1. Ver Todos los Pagos

```typescript
const payments = useQuery(api.billing.getAllPayments, {});
```

### 2. Ver Pagos de un Usuario Específico

```typescript
const userPayments = useQuery(api.billing.getUserPaymentHistory, {
  userId: user._id
});
```

### 3. Ver Último Pago del Usuario Actual

```typescript
const latestPayment = useQuery(api.billing.getUserLatestPayment, {});
```

## Variables de Entorno Necesarias

```env
# Autumn/Stripe
AUTUMN_SECRET_KEY=your_autumn_secret_key
AUTUMN_PUBLISHABLE_KEY=your_autumn_publishable_key
PRODUCT_SINGLE_SCAN=prod_xxx
PRODUCT_INTERVIEW_SPRINT=prod_xxx

# Webhook URL (configurar en Autumn Dashboard)
WEBHOOK_URL=https://your-convex-site.convex.site/autumn-webhook
```

## Testing del Sistema

### 1. Test de Pago Real

```typescript
// En Admin Panel → Payment Testing
await handleTestPayment("single_scan");
// Abre checkout de Autumn, completa el pago, verifica webhook
```

### 2. Simular Webhook (Sin Pago Real)

```typescript
// En Admin Panel → Simulate Webhook
await simulateWebhook({
  email: "test@example.com",
  plan: "single_scan"
});
// Actualiza usuario directamente sin cobrar
```

## Resumen del Flujo

1. ✅ **Usuario compra** → Autumn Checkout
2. ✅ **Pago exitoso** → Stripe procesa
3. ✅ **Webhook notifica** → `/autumn-webhook` recibe evento
4. ✅ **Usuario se actualiza** → `updateSubscription()` cambia tier y créditos
5. ✅ **Pago se registra** → `storePaymentRecord()` guarda en tabla `payments`
6. ✅ **Admin ve cambios** → Reactive queries actualizan UI automáticamente
7. ✅ **Email se envía** → Confirmación al usuario

**Todo es automático y en tiempo real.**
