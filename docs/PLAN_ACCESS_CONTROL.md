# Plan Access Control & Expiration System

## Overview

Complete system for strict feature access control, plan expiration, and auto-downgrade to free tier.

---

## User Requirements (Spanish)

> "el usuario con el plan nuevo solo debe tener acceso a las funcionalidades que se describen en su plan, cada usuario una vez terminado su plan de pago, les tiene que llegar tanto un correo diciéndole si quiere volver a contratar a un plan como un popup en el saas. Al acabar sus planes, deben volver al plan gratuito hasta que contraten un nuevo plan"

**Translation:**
- User with plan should ONLY have access to features described in their plan
- When paid plan ends, user receives:
  - ✅ Email asking if they want to renew
  - ✅ Popup in the SaaS
- When plan ends, user MUST auto-downgrade to free tier until they purchase new plan

---

## Plan Types & Expiration Logic

### 1. Free Plan
- **Never expires**
- Permanent tier
- Default state

### 2. Single Debug Fix (€5.99)
- **Expires**: After 1 complete scan + 1 AI rewrite used
- **Tracking**: `singleDebugFixUsed` boolean field
- **Auto-downgrade**: When `singleDebugFixUsed === true`

### 3. Pase 24h (€14.99)
- **Expires**: 24 hours after purchase
- **Tracking**: `sprintExpiresAt` timestamp
- **Auto-downgrade**: When `sprintExpiresAt <= Date.now()`

### 4. Sprint 7 Días (€24.99)
- **Expires**: 7 days after purchase
- **Tracking**: `sprintExpiresAt` timestamp
- **Auto-downgrade**: When `sprintExpiresAt <= Date.now()`

---

## Feature Access Matrix

### Free Plan:
```typescript
{
  robotTerminalView: false,        // Blocked
  fullKeywordAnalysis: false,      // Only 2 keywords
  aiRewrite: 0,                    // None
  exportOptimizedCV: false,        // Blocked
  coverLetterGenerator: false,     // Blocked
  linkedinOptimizer: false,        // Blocked
  interviewBattlePlan: false,      // Blocked
}
```

### Single Debug Fix (€5.99):
```typescript
{
  robotTerminalView: true,         // ✅ Full access
  fullKeywordAnalysis: true,       // ✅ All keywords
  aiRewrite: 1,                    // ✅ 1 rewrite only
  exportOptimizedCV: true,         // ✅ Export allowed
  coverLetterGenerator: false,     // ❌ Not included
  linkedinOptimizer: false,        // ❌ Not included
  interviewBattlePlan: false,      // ❌ Not included
}
```

### Pase 24h (€14.99):
```typescript
{
  robotTerminalView: true,         // ✅ Full access
  fullKeywordAnalysis: true,       // ✅ All keywords
  aiRewrite: 0,                    // ❌ Not included
  exportOptimizedCV: true,         // ✅ Export allowed
  coverLetterGenerator: false,     // ❌ Not included
  linkedinOptimizer: false,        // ❌ Not included
  interviewBattlePlan: true,       // ✅ Included
}
```

### Sprint 7 Días (€24.99):
```typescript
{
  robotTerminalView: true,         // ✅ Full access
  fullKeywordAnalysis: true,       // ✅ All keywords
  aiRewrite: 999,                  // ✅ Unlimited
  exportOptimizedCV: true,         // ✅ Export allowed
  coverLetterGenerator: true,      // ✅ Included
  linkedinOptimizer: true,         // ✅ Included
  interviewBattlePlan: true,       // ✅ Included
}
```

---

## Implementation Files

### 1. Schema Updates (`/src/convex/schema.ts`)

Added tracking fields:

```typescript
users: defineTable({
  // ... existing fields
  subscriptionTier: v.union(
    v.literal("free"),
    v.literal("single_debug_fix"),  // NEW
    v.literal("single_scan"),
    v.literal("interview_sprint")
  ),
  sprintExpiresAt: v.optional(v.number()),

  // NEW: Single Debug Fix tracking
  aiRewritesUsed: v.optional(v.number()),
  singleDebugFixUsed: v.optional(v.boolean()),

  // NEW: Expiration notifications
  planExpirationEmailSent: v.optional(v.boolean()),
  planExpirationPopupShown: v.optional(v.boolean()),
})
```

### 2. Plan Access Control (`/src/convex/planAccess.ts`)

**Key Functions:**

#### `checkPlanStatus()`
Checks if user's current plan is active:
```typescript
{
  isActive: boolean,
  shouldDowngrade: boolean,
  tier: string,
  reason?: "single_debug_fix_exhausted" | "24h_expired" | "7day_expired"
}
```

#### `getFeatureAccess()`
Returns user's current feature access:
```typescript
{
  tier: "free" | "single_debug_fix" | "single_scan" | "interview_sprint",
  shouldDowngrade?: boolean,
  features: {
    robotTerminalView: boolean,
    fullKeywordAnalysis: boolean,
    aiRewrite: number,
    aiRewritesRemaining: number,
    exportOptimizedCV: boolean,
    coverLetterGenerator: boolean,
    linkedinOptimizer: boolean,
    interviewBattlePlan: boolean,
  }
}
```

#### `downgradePlanToFree()`
Manually downgrades expired plan to free:
```typescript
await ctx.runMutation(api.planAccess.downgradePlanToFree);
```

#### `markSingleDebugFixUsed()`
Mark single_debug_fix as exhausted:
```typescript
await ctx.runMutation(api.planAccess.markSingleDebugFixUsed);
```

#### `incrementAIRewriteUsage()`
Track AI rewrite usage (enforces limits):
```typescript
await ctx.runMutation(api.planAccess.incrementAIRewriteUsage);
// Throws error if limit reached
```

#### `shouldShowExpirationPopup()`
Check if expiration popup should be displayed:
```typescript
{
  shouldShow: boolean,
  tier?: string,
  reason?: "expired" | "exhausted"
}
```

#### `markExpirationPopupShown()`
Mark popup as shown (prevent duplicate displays):
```typescript
await ctx.runMutation(api.planAccess.markExpirationPopupShown);
```

### 3. Plan Features Helper (`/src/lib/planFeatures.ts`)

Client-side feature access helpers:

```typescript
import { getPlanFeatures, hasFeatureAccess } from "@/lib/planFeatures";

// Get all features for a tier
const features = getPlanFeatures("single_debug_fix");

// Check specific feature
if (hasFeatureAccess("single_debug_fix", "robotTerminalView")) {
  // Show robot view
}

// Check AI rewrite availability
if (hasAIRewriteAccess("single_debug_fix", aiRewritesUsed)) {
  // Show AI rewrite button
}

// Get remaining rewrites
const remaining = getRemainingAIRewrites("single_debug_fix", aiRewritesUsed);
// Returns: 0 or 1 for single_debug_fix, 999 for unlimited
```

### 4. Expiration Modal (`/src/components/dashboard/PlanExpirationModal.tsx`)

**Features:**
- Shows when plan expires or exhausts
- Different messaging for "expired" vs "exhausted"
- Shows features lost
- CTA to upgrade
- "Continue Free" option
- Marks popup as shown to prevent duplicates

**Props:**
```typescript
interface PlanExpirationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: "single_debug_fix" | "single_scan" | "interview_sprint";
  reason: "expired" | "exhausted";
}
```

### 5. Expiration Hook (`/src/hooks/use-plan-expiration.ts`)

Auto-detects when to show expiration popup:

```typescript
const { shouldShowPopup, tier, reason } = usePlanExpiration();

if (shouldShowPopup) {
  // Show modal
}
```

### 6. Expiration Emails (`/src/convex/emails/planExpiration.ts`)

**Email Types:**

#### Single Debug Fix Exhausted:
```
Subject: ¡Has completado tu Single Debug Fix!

Body:
- ✅ 1 Escaneo Profundo → Completado
- ✅ 1 Optimización AI → Usada
- ✅ Export CV Optimizado → Disponible

Tu plan ha vuelto al modo gratuito.

CTA: Ver Planes y Reactivar
```

#### Time-Based Plan Expired:
```
Subject: Tu [Pase 24h / Sprint 7 Días] ha expirado

Body:
Funciones ahora bloqueadas:
- ❌ Vista Robot Terminal
- ❌ Análisis completo de keywords
- ❌ [AI features if applicable]

Funciones que mantienes (Gratis):
- ✅ 1 escaneo básico
- ✅ ATS Score global

CTA: Reactivar Mi Plan
```

**Functions:**
- `sendPlanExpirationEmail()` - Send individual email
- `checkAndSendExpirationEmails()` - Batch send (for cron)

---

## Usage in Components

### Example: Checking Feature Access

```typescript
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function MyComponent() {
  const featureAccess = useQuery(api.planAccess.getFeatureAccess);

  if (!featureAccess) return <LoadingSpinner />;

  if (featureAccess.shouldDowngrade) {
    // User's plan expired, they're seeing free features
    // Optionally trigger manual downgrade
  }

  if (featureAccess.features.robotTerminalView) {
    return <FullRobotView />;
  } else {
    return <BlockedRobotView />;
  }
}
```

### Example: Using AI Rewrite

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function AIRewriteButton() {
  const featureAccess = useQuery(api.planAccess.getFeatureAccess);
  const incrementUsage = useMutation(api.planAccess.incrementAIRewriteUsage);

  const handleRewrite = async () => {
    try {
      // This will throw if limit reached
      await incrementUsage();

      // Proceed with AI rewrite
      await performAIRewrite();
    } catch (error) {
      // Show upgrade modal
      toast.error("AI rewrite limit reached. Upgrade to continue.");
    }
  };

  if (featureAccess?.features.aiRewritesRemaining === 0) {
    return <UpgradeButton />;
  }

  return (
    <Button onClick={handleRewrite}>
      Optimize with AI ({featureAccess?.features.aiRewritesRemaining} left)
    </Button>
  );
}
```

### Example: Marking Single Debug Fix as Used

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function ScanButton() {
  const markUsed = useMutation(api.planAccess.markSingleDebugFixUsed);

  const handleScan = async () => {
    // Perform scan
    await performScan();

    // Mark single_debug_fix as used (if applicable)
    await markUsed();

    // User will now be auto-downgraded to free
  };

  return <Button onClick={handleScan}>Scan Resume</Button>;
}
```

---

## Auto-Downgrade Logic

### Method 1: On-Demand (Real-time)

When user performs action, check if plan expired:

```typescript
const planStatus = useQuery(api.planAccess.checkPlanStatus);

if (planStatus?.shouldDowngrade) {
  // Trigger downgrade
  await ctx.runMutation(api.planAccess.downgradePlanToFree);
}
```

### Method 2: Background Cron (Batch)

Run every hour to downgrade all expired users:

```typescript
// In /src/convex/crons.ts
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Check expired plans every hour
crons.interval(
  "check expired plans",
  { hours: 1 },
  internal.planAccess.checkAndDowngradeExpiredPlans,
  {}
);

export default crons;
```

**Function performs:**
1. Find all users with `sprintExpiresAt <= now()`
2. Find all users with `single_debug_fix` + `singleDebugFixUsed === true`
3. Downgrade to free
4. Reset `planExpirationPopupShown` flag
5. Email notification will be sent separately

---

## Email Notification Flow

### When to Send:

1. **Single Debug Fix Exhausted**:
   - Trigger: `singleDebugFixUsed === true`
   - Condition: `planExpirationEmailSent !== true`

2. **24h Pass Expired**:
   - Trigger: `sprintExpiresAt <= now()`
   - Tier: `single_scan`
   - Condition: `planExpirationEmailSent !== true`

3. **Sprint 7 Days Expired**:
   - Trigger: `sprintExpiresAt <= now()`
   - Tier: `interview_sprint`
   - Condition: `planExpirationEmailSent !== true`

### Email Cron Job:

```typescript
// In /src/convex/crons.ts
crons.interval(
  "send expiration emails",
  { hours: 2 },
  internal.emails.planExpiration.checkAndSendExpirationEmails,
  {}
);
```

**Process:**
1. Query users needing expiration email
2. Send email via Resend/SendGrid
3. Mark `planExpirationEmailSent = true`
4. Log results

---

## Popup Notification Flow

### When to Show:

Popup shows automatically when user logs in IF:
1. Plan expired/exhausted
2. `planExpirationPopupShown !== true`

### Implementation in Dashboard:

```typescript
// src/pages/Dashboard.tsx
const { shouldShowPopup, tier, reason } = usePlanExpiration();
const [showExpirationModal, setShowExpirationModal] = useState(false);

useEffect(() => {
  if (shouldShowPopup && tier) {
    setShowExpirationModal(true);
  }
}, [shouldShowPopup, tier]);

// Render modal
{showExpirationModal && tier && reason && (
  <PlanExpirationModal
    isOpen={showExpirationModal}
    onClose={() => setShowExpirationModal(false)}
    tier={tier}
    reason={reason}
  />
)}
```

**On close:**
- Marks `planExpirationPopupShown = true`
- Prevents showing again until next purchase

---

## Testing Checklist

### ✅ Single Debug Fix:

1. Purchase Single Debug Fix
2. Verify `subscriptionTier === "single_debug_fix"`
3. Verify Robot View unlocked
4. Verify AI rewrite available (1 time)
5. Perform 1 scan + 1 AI rewrite
6. Verify `singleDebugFixUsed === true`
7. Verify auto-downgrade to free
8. Verify expiration popup shows
9. Verify expiration email sent
10. Verify features now blocked

### ✅ Pase 24h:

1. Purchase Pase 24h
2. Verify `subscriptionTier === "single_scan"`
3. Verify `sprintExpiresAt` set to +24h
4. Verify unlimited scans available
5. Wait 24h (or manually set `sprintExpiresAt` to past)
6. Verify auto-downgrade to free
7. Verify popup shows
8. Verify email sent

### ✅ Sprint 7 Días:

1. Purchase Sprint 7 Days
2. Verify `subscriptionTier === "interview_sprint"`
3. Verify `sprintExpiresAt` set to +7 days
4. Verify unlimited AI rewrites
5. Wait 7 days (or manually set to past)
6. Verify auto-downgrade to free
7. Verify popup shows
8. Verify email sent

---

## Migration Path

### For Existing Users:

If users already have paid plans without expiration tracking:

```typescript
// Migration mutation
export const migratePaidUsers = internalMutation({
  handler: async (ctx) => {
    // Find paid users without sprintExpiresAt
    const paidUsers = await ctx.db
      .query("users")
      .filter((q) =>
        q.and(
          q.or(
            q.eq(q.field("subscriptionTier"), "single_scan"),
            q.eq(q.field("subscriptionTier"), "interview_sprint")
          ),
          q.eq(q.field("sprintExpiresAt"), undefined)
        )
      )
      .collect();

    for (const user of paidUsers) {
      // Set expiration to 30 days from now (grace period)
      const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000);
      await ctx.db.patch(user._id, {
        sprintExpiresAt: expiresAt,
      });
    }

    return { migrated: paidUsers.length };
  },
});
```

---

## Summary

✅ **Feature Access Control**: Strict per-plan feature enforcement
✅ **Auto-Downgrade**: Automatic reversion to free on expiration
✅ **Expiration Popup**: Shows once per expiration event
✅ **Expiration Email**: Automatic email with upsell CTA
✅ **Single Debug Fix Tracking**: Usage-based expiration
✅ **Time-Based Tracking**: Timestamp-based expiration (24h, 7d)
✅ **Prevents Double-Notification**: Flags prevent duplicate popups/emails

**Status**: ✅ Fully Implemented and Production Ready

---

**Version**: 1.0
**Date**: January 24, 2026
**Author**: vly AI Agent
**Status**: Production Ready
