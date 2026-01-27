/**
 * Plan Expiration Email Notifications
 * Sends emails when user plans expire or get exhausted
 */

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";

// Cast internal to any to avoid type instantiation issues
const internalAny = internal as any;

/**
 * Send plan expiration email
 */
export const sendPlanExpirationEmail = internalAction({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    tier: v.union(
      v.literal("single_debug_fix"),
      v.literal("single_scan"),
      v.literal("interview_sprint")
    ),
    reason: v.union(v.literal("expired"), v.literal("exhausted")),
  },
  handler: async (ctx, args) => {
    const { email, name, tier, reason } = args;

    const getTierName = () => {
      switch (tier) {
        case "single_debug_fix":
          return "Single Debug Fix";
        case "single_scan":
          return "Pase 24h";
        case "interview_sprint":
          return "Sprint 7 Días";
        default:
          return "Plan";
      }
    };

    const subject =
      reason === "exhausted"
        ? `¡Has completado tu ${getTierName()}!`
        : `Tu ${getTierName()} ha expirado`;

    const getEmailContent = () => {
      if (reason === "exhausted" && tier === "single_debug_fix") {
        return {
          greeting: `Hola ${name || ""}`,
          mainMessage: `¡Felicidades! Has completado tu **Single Debug Fix** exitosamente.`,
          body: `
Tu CV ha sido escaneado y optimizado con nuestra IA. Ahora tienes un CV mejorado y listo para aplicar.

**¿Qué pasó con tu plan?**
- ✅ 1 Escaneo Profundo → Completado
- ✅ 1 Optimización AI → Usada
- ✅ Export CV Optimizado → Disponible

Tu plan ha vuelto al modo **gratuito**. Aún puedes ver tu CV optimizado, pero las funciones premium están bloqueadas.

**¿Quieres seguir optimizando?**

Si estás aplicando a múltiples trabajos, considera reactivar tu acceso:

- **Pase 24h (€14.99)**: Scans ilimitados durante 24 horas
- **Sprint 7 Días (€24.99)**: AI ilimitado + Cover Letter + LinkedIn durante 7 días

👉 [Ver Planes y Reactivar](https://cvdebug.com/pricing)
          `,
        };
      }

      return {
        greeting: `Hola ${name || ""}`,
        mainMessage: `Tu plan **${getTierName()}** ha llegado a su fin.`,
        body: `
Tu acceso premium ha expirado y tu cuenta ha vuelto al **plan gratuito**.

**Funciones ahora bloqueadas:**
- ❌ Vista Robot Terminal completa
- ❌ Análisis completo de keywords
${tier === "single_debug_fix" || tier === "interview_sprint" ? "- ❌ Optimizaciones AI (Rewrite)" : ""}
${tier === "interview_sprint" ? "- ❌ Cover Letter Generator\n- ❌ LinkedIn Optimizer" : ""}

**Funciones que mantienes (Gratis):**
- ✅ 1 escaneo básico
- ✅ ATS Score global
- ✅ Preview de 2 keywords

**¿Quieres reactivar tu acceso?**

Si aún estás buscando trabajo, puedes volver a contratar:

- **Single Debug Fix (€5.99)**: 1 escaneo + 1 AI optimization
- **Pase 24h (€14.99)**: Scans ilimitados durante 24 horas
- **Sprint 7 Días (€24.99)**: Todo ilimitado durante 7 días

👉 [Reactivar Mi Plan](https://cvdebug.com/pricing)

**¿Ya conseguiste trabajo?** ¡Felicidades! 🎉 Vuelve cuando necesites actualizar tu CV.
        `,
      };
    };

    const content = getEmailContent();

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #0f172a; font-size: 28px; font-weight: 800; margin: 0;">CVDebug</h1>
      <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">ATS CV Debugger</p>
    </div>

    <!-- Main Content Card -->
    <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
      <p style="color: #475569; font-size: 16px; margin: 0 0 20px 0;">${content.greeting},</p>

      <p style="color: #1e293b; font-size: 18px; font-weight: 600; margin: 0 0 20px 0;">${content.mainMessage}</p>

      <div style="color: #475569; font-size: 15px; line-height: 1.6; white-space: pre-line;">
        ${content.body}
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin-top: 40px;">
        <a href="https://cvdebug.com/pricing" style="display: inline-block; background: linear-gradient(to right, #64748b, #1e293b); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Ver Planes Disponibles
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 40px; color: #94a3b8; font-size: 13px;">
      <p style="margin: 0 0 10px 0;">¿Preguntas? Responde a este email.</p>
      <p style="margin: 0;">
        CVDebug | ATS CV Debugger
      </p>
    </div>
  </div>
</body>
</html>
    `;

    console.log(`[Plan Expiration Email] Sending to ${email} - Tier: ${tier}, Reason: ${reason}`);

    // Send email via Resend
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "CVDebug <noreply@cvdebug.com>",
          to: email,
          subject: subject,
          html: htmlBody,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`[Resend Error] Failed to send email: ${errorData}`);
        throw new Error(`Resend API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log(`[Email] Successfully sent to ${email} - ID: ${data.id}`);

      return { success: true, email, tier, reason, emailId: data.id };
    } catch (error) {
      console.error(`[Email] Failed to send to ${email}:`, error);
      // Don't throw - just log the error and continue
      // This prevents the cron job from failing if one email fails
      return { success: false, email, tier, reason, error: String(error) };
    }
  },
});

/**
 * Check and send expiration emails (called by cron)
 */
export const checkAndSendExpirationEmails = internalAction({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    let emailsSent = 0;

    // Get users with expired plans who haven't received email
    const users = await ctx.runQuery(internalAny.planExpiration.getUsersNeedingExpirationEmail);

    for (const user of users) {
      try {
        // Determine reason
        let reason: "expired" | "exhausted" = "expired";
        if (user.subscriptionTier === "single_debug_fix" && user.singleDebugFixUsed) {
          reason = "exhausted";
        }

        // Send email
        await ctx.runAction(internalAny.emails.planExpiration.sendPlanExpirationEmail, {
          email: user.email,
          name: user.name,
          tier: user.subscriptionTier,
          reason: reason,
        });

        // Mark email as sent
        await ctx.runMutation(internalAny.planExpiration.markExpirationEmailSent, {
          userId: user._id,
        });

        emailsSent++;
      } catch (error) {
        console.error(`[Expiration Email] Failed for user ${user.email}:`, error);
      }
    }

    return { success: true, emailsSent };
  },
});
