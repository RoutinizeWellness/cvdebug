"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { Resend } from "resend";
import { Id } from "./_generated/dataModel";

// Helper to get Resend instance
const getResend = () => {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log("RESEND_API_KEY not set");
    return null;
  }
  return new Resend(key);
};

const FROM_EMAIL = "ResumeATS <onboarding@resend.dev>";

// Email #1: Bienvenida + Qué esperar (Trigger: Signup)
export const sendOnboardingEmail = internalAction({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    variant: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) return;

    const firstName = args.name?.split(" ")[0] || "there";
    
    const subject = "👋 Bienvenido a CVDebug (Tu primer paso)";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hola ${firstName},</p>
        <p>Gracias por unirte. Estás aquí porque quieres dejar de enviar currículums a agujeros negros.</p>
        
        <h3>Cómo funciona CVDebug:</h3>
        <ol>
          <li>Sube tu PDF.</li>
          <li>Nuestra IA simula un ATS (Applicant Tracking System).</li>
          <li>Te decimos exactamente qué borrar y qué añadir.</li>
        </ol>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://resume-ats-optimizer.convex.site/dashboard" style="background-color: #ea580c; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            🚀 Haz tu primer escaneo gratis aquí
          </a>
        </div>
        
        <p><strong>Tip:</strong> Usa el mismo PDF que envías a las empresas.</p>
        
        <p>Saludos,<br>El equipo de CVDebug</p>
      </div>
    `;

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: args.email,
        subject,
        html,
      });
      console.log(`Sent Email #1 (Onboarding) to ${args.email}`);
    } catch (error) {
      console.error("Failed to send Email #1:", error);
    }
  },
});

// Email #2: El "Empujón" (Trigger: 24h sin escanear)
export const sendActivationReminderEmail = internalAction({
  args: { email: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) return;

    const firstName = args.name?.split(" ")[0] || "there";
    const subject = "⏳ ¿Olvidaste escanear tu CV?";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hola ${firstName},</p>
        <p>Vi que creaste tu cuenta pero aún no has subido tu currículum.</p>
        <p>Solo toma 10 segundos saber si tu formato es legible para los robots de contratación. Es mejor saberlo ahora que después de recibir 50 rechazos.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://resume-ats-optimizer.convex.site/dashboard" style="background-color: #ea580c; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Escanear mi CV ahora
          </a>
        </div>
        
        <p>Saludos,<br>El equipo de CVDebug</p>
      </div>
    `;

    try {
      await resend.emails.send({ from: FROM_EMAIL, to: args.email, subject, html });
      console.log(`Sent Email #2 (Activation Reminder) to ${args.email}`);
    } catch (error) { console.error("Failed to send Email #2:", error); }
  },
});

// Email #3: Detectado Error de Parseo (0% Score)
export const sendParsingErrorEmail = internalAction({
  args: { 
    email: v.string(), 
    name: v.optional(v.string()),
    resumeId: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) return;

    const firstName = args.name?.split(" ")[0] || "there";
    const subject = "⚠️ Alerta: Tu archivo no se puede leer (0% Score)";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hola ${firstName},</p>
        <p>Tu último escaneo dio un resultado de <strong style="color: #ef4444;">0%</strong>.</p>
        
        <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold; color: #991b1b;">⚠️ No entres en pánico.</p>
          <p style="margin: 8px 0 0 0; color: #7f1d1d;">Esto no significa que tu experiencia sea mala, significa que tu formato de archivo está corrupto (Encoding Error).</p>
        </div>
        
        <p><strong>Si hubieras enviado este archivo a una empresa real, te habrían rechazado automáticamente.</strong></p>
        
        <h3>Cómo arreglarlo:</h3>
        <ol>
          <li>Abre tu PDF en Chrome/Edge.</li>
          <li>Pulsa <strong>Imprimir (Ctrl+P)</strong> → "Guardar como PDF".</li>
          <li>Sube ese archivo nuevo.</li>
        </ol>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://resume-ats-optimizer.convex.site/dashboard" style="background-color: #ea580c; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Inténtalo de nuevo aquí
          </a>
        </div>
        
        <p>Saludos,<br>El equipo de CVDebug</p>
      </div>
    `;

    try {
      await resend.emails.send({ from: FROM_EMAIL, to: args.email, subject, html });
      console.log(`Sent Email #3 (Parsing Error) to ${args.email}`);
    } catch (error) { 
      console.error("Failed to send Email #3:", error); 
    }
  },
});

// Email #3b: Last Chance (Trigger: 72h sin uso) - REMOVED, not in new spec
export const sendActivationLastChanceEmail = internalAction({
  args: { email: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) return;

    const firstName = args.name?.split(" ")[0] || "Job Seeker";
    const subject = "Last chance: Free ATS scan expires soon";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>${firstName},</p>
        <p>Your free ATS scan expires in 24 hours.</p>
        <p>If you're job hunting, don't let it go to waste.</p>
        <p>Quick check: <a href="https://resume-ats-optimizer.convex.site/dashboard">https://resume-ats-optimizer.convex.site/dashboard</a></p>
        <p>Takes 2 minutes. Could explain why you're not getting callbacks.</p>
        <p>The ResumeATS Team</p>
        <p style="font-size: 12px; color: #666; margin-top: 20px;">P.S. After expiry, scans are $4.99. Use your free one while you can!</p>
      </div>
    `;

    try {
      await resend.emails.send({ from: FROM_EMAIL, to: args.email, subject, html });
      console.log(`Sent Email #3 (Last Chance) to ${args.email}`);
    } catch (error) { console.error("Failed to send Email #3:", error); }
  },
});

// Email #4: Recovery Email (1h after free scan, details not unlocked)
export const sendRecoveryEmail = internalAction({
  args: { 
    email: v.string(), 
    name: v.optional(v.string()), 
    score: v.number(),
    totalErrors: v.number(),
    firstError: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) return;

    const firstName = args.name?.split(" ")[0] || "Job Seeker";
    const subject = `⚠️ Your resume scored ${args.score}% - Don't let ATS reject you`;
    
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Tu análisis está completo.</p>
        
        <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 8px; text-align: center;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #92400e;">Resultado: ${args.score}/100</p>
          <p style="margin: 8px 0 0 0; font-size: 16px; color: #92400e;">Errores Críticos: ${args.totalErrors}</p>
        </div>

        <p>Hemos detectado que te faltan palabras clave esenciales para el puesto. Tu reporte completo está bloqueado.</p>
        
        <p><strong>Desbloquéalo por el precio de un café ($4.99) y deja de perder oportunidades.</strong></p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://resume-ats-optimizer.convex.site/dashboard?unlock=true" style="background-color: #ea580c; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Desbloquear Reporte
          </a>
        </div>

        <p style="font-size: 12px; color: #666; text-align: center;">Pago único • Sin suscripción • Acceso instantáneo</p>
        
        <p>Saludos,<br>El equipo de CVDebug</p>
      </div>
    `;

    try {
      await resend.emails.send({ from: FROM_EMAIL, to: args.email, subject, html });
      console.log(`Sent Email #4 (Post Scan) to ${args.email}`);
    } catch (error) { 
      console.error("Failed to send Email #4:", error); 
    }
  },
});

// Email #4: Post Free-Scan (Trigger: Usaron free scan)
export const sendPostScanEmail = internalAction({
  args: { email: v.string(), name: v.optional(v.string()), score: v.number() },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) return;

    const firstName = args.name?.split(" ")[0] || "Job Seeker";
    const subject = `Your ATS score: ${args.score}% - here's what it means`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hey ${firstName},</p>
        <p>You scanned your resume and got <strong>${args.score}% ATS compatibility</strong>.</p>
        <p>Here's what that means:</p>
        <ul style="list-style: none; padding-left: 0;">
          <li>📊 0-50%: High risk of auto-rejection</li>
          <li>📊 51-70%: Might get through, but not optimized</li>
          <li>📊 71-85%: Good chance of passing ATS</li>
          <li>📊 86-100%: Excellent ATS compatibility</li>
        </ul>
        <p><strong>Your score: ${args.score}%</strong></p>
        <p>The free preview showed you have a problem.</p>
        <p>The paid version ($4.99) shows exactly how to fix it:</p>
        <ul>
          <li>✅ List of missing keywords</li>
          <li>✅ Where to add them</li>
          <li>✅ Format issues to fix</li>
          <li>✅ Priority ranking</li>
        </ul>
        <p>Want to see what's blocking you?</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://resume-ats-optimizer.convex.site/dashboard?plan=single_scan" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Upgrade for $4.99</a>
        </div>
        <p>Questions? Reply to this email.</p>
        <p>The ResumeATS Team</p>
        <p style="font-size: 12px; color: #666; margin-top: 20px;">P.S. Most users improve their score by 15-25% after implementing fixes.</p>
      </div>
    `;

    try {
      await resend.emails.send({ from: FROM_EMAIL, to: args.email, subject, html });
      console.log(`Sent Email #4 (Post Scan) to ${args.email}`);
    } catch (error) { console.error("Failed to send Email #4:", error); }
  },
});

// Email #5: Value Reminder (Trigger: 48h después, no upgrade)
export const sendValueReminderEmail = internalAction({
  args: { email: v.string(), name: v.optional(v.string()), score: v.number() },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) return;

    const firstName = args.name?.split(" ")[0] || "Job Seeker";
    const subject = `${firstName}, still at ${args.score}%?`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hey ${firstName},</p>
        <p>You checked your ATS score 2 days ago: <strong>${args.score}%</strong></p>
        <p>Quick question: Did you make any changes to your resume?</p>
        <p>If you're still job hunting and want to improve that score, here's what the full analysis shows:</p>
        <ul>
          <li>Exact keywords you're missing</li>
          <li>Which sections to update</li>
          <li>Format issues ATS can't read</li>
          <li>Step-by-step fixes</li>
        </ul>
        <p>$4.99 for the full breakdown.</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://resume-ats-optimizer.convex.site/dashboard?plan=single_scan" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">See full analysis</a>
        </div>
        <p>Or let me know what would make this more useful!</p>
        <p>The ResumeATS Team</p>
      </div>
    `;

    try {
      await resend.emails.send({ from: FROM_EMAIL, to: args.email, subject, html });
      console.log(`Sent Email #5 (Value Reminder) to ${args.email}`);
    } catch (error) { console.error("Failed to send Email #5:", error); }
  },
});

// Email #6: Discount (Trigger: 7 días, no upgrade)
export const sendDiscountEmail = internalAction({
  args: { email: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) return;

    const firstName = args.name?.split(" ")[0] || "Job Seeker";
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    const subject = "50% off your ATS analysis (24h only)";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>${firstName},</p>
        <p>You scanned your resume a week ago but haven't upgraded.</p>
        <p>I'm offering 50% off for the next 24 hours:</p>
        <p><strong>$4.99 → $2.50</strong></p>
        <p>Use code: <strong>WEEK50</strong></p>
        <p>This shows:</p>
        <ul>
          <li>✅ All missing keywords</li>
          <li>✅ Specific fixes</li>
          <li>✅ Priority order</li>
        </ul>
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://resume-ats-optimizer.convex.site/dashboard?plan=single_scan&discount=WEEK50" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Claim 50% discount</a>
        </div>
        <p>Expires: ${dateString}</p>
        <p>If you're not interested, no worries - just let me know what would be more helpful!</p>
        <p>The ResumeATS Team</p>
      </div>
    `;

    try {
      await resend.emails.send({ from: FROM_EMAIL, to: args.email, subject, html });
      console.log(`Sent Email #6 (Discount) to ${args.email}`);
    } catch (error) { console.error("Failed to send Email #6:", error); }
  },
});

// Email #7: Win-Back (Trigger: 30 días inactivo)
export const sendWinBackEmail = internalAction({
  args: { email: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) return;

    const firstName = args.name?.split(" ")[0] || "Job Seeker";
    const subject = "Miss you! Here's what's new";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hey ${firstName},</p>
        <p>Haven't seen you in a while!</p>
        <p>Since you last checked, we've added:</p>
        <ul>
          <li>LinkedIn Profile Analysis</li>
          <li>Improved Keyword Matching</li>
        </ul>
        <p>Your free scan is still waiting if you want to try again: <a href="https://resume-ats-optimizer.convex.site/dashboard">https://resume-ats-optimizer.convex.site/dashboard</a></p>
        <p>Or if you had issues before, reply and let me know how I can help!</p>
        <p>The ResumeATS Team</p>
      </div>
    `;

    try {
      await resend.emails.send({ from: FROM_EMAIL, to: args.email, subject, html });
      console.log(`Sent Email #7 (Win-Back) to ${args.email}`);
    } catch (error) { console.error("Failed to send Email #7:", error); }
  },
});

// Email #8: Purchase Confirmation
export const sendPurchaseConfirmationEmail = internalAction({
  args: { email: v.string(), name: v.optional(v.string()), plan: v.string(), credits: v.number() },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) return;

    const firstName = args.name?.split(" ")[0] || "Job Seeker";
    const subject = "Purchase Confirmed! 🚀";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hey ${firstName},</p>
        <p>Thanks for your purchase!</p>
        <p>You've successfully upgraded to the <strong>${args.plan.replace("_", " ")}</strong> plan.</p>
        <p>We've added <strong>${args.credits} credits</strong> to your account.</p>
        <p>You can now scan your resume and get detailed feedback to beat the ATS.</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://resume-ats-optimizer.convex.site/dashboard" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to Dashboard</a>
        </div>
        <p>Good luck with your job search!</p>
        <p>The ResumeATS Team</p>
      </div>
    `;

    try {
      await resend.emails.send({ from: FROM_EMAIL, to: args.email, subject, html });
      console.log(`Sent Purchase Confirmation to ${args.email}`);
    } catch (error) { console.error("Failed to send Purchase Confirmation:", error); }
  },
});

// Test Email Function - Send to tiniboti@gmail.com for testing
export const sendTestEmail = internalAction({
  args: {},
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) {
      console.error("RESEND_API_KEY not set");
      return { success: false, error: "RESEND_API_KEY not configured" };
    }

    const testEmail = "tiniboti@gmail.com";
    const subject = "🧪 Test Email - CVDebug Email System";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #ea580c;">✅ Email System Test - CVDebug</h2>
        <p>Hola Tini,</p>
        <p>Este es un email de prueba del sistema de marketing de CVDebug.</p>
        
        <div style="background: #f3f4f6; border-left: 4px solid #ea580c; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <h3 style="margin: 0 0 10px 0; color: #1f2937;">📧 Emails Configurados:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
            <li><strong>Email #1:</strong> Bienvenida + Qué esperar (Trigger: Signup)</li>
            <li><strong>Email #2:</strong> El "Empujón" (Trigger: 24h sin escanear)</li>
            <li><strong>Email #3:</strong> Detectado Error de Parseo (0% Score)</li>
            <li><strong>Email #4:</strong> Recovery Email (1h after free scan, details not unlocked)</li>
            <li><strong>Email #5:</strong> Value Reminder (48h después, no upgrade)</li>
            <li><strong>Email #6:</strong> Discount (7 días, no upgrade)</li>
            <li><strong>Email #7:</strong> Win-Back (30 días inactivo)</li>
            <li><strong>Email #8:</strong> Purchase Confirmation</li>
          </ul>
        </div>

        <p><strong>Estado del sistema:</strong> ✅ Funcionando correctamente</p>
        <p><strong>Fecha de prueba:</strong> ${new Date().toLocaleString('es-ES')}</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        
        <p style="font-size: 12px; color: #6b7280;">
          Este es un email de prueba generado automáticamente por el sistema CVDebug.<br>
          Si recibes este email, significa que Resend está configurado correctamente.
        </p>
      </div>
    `;

    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: testEmail,
        subject,
        html,
      });
      console.log(`✅ Test email sent successfully to ${testEmail}`, result);
      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error("❌ Failed to send test email:", error);
      return { success: false, error: String(error) };
    }
  },
});