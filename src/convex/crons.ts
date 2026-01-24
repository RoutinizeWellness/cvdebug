import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Cast internal to any to avoid type instantiation issues
const internalAny = require("./_generated/api").internal;

// Continuous PDF Sanitization for Interview Sprint users
// Runs every 5 minutes to check and fix PDF integrity issues
crons.interval(
  "continuous_pdf_sanitization",
  { minutes: 5 },
  internalAny.cvHealthMonitor.runContinuousSanitization,
  {}
);

// Sprint Expiration: Check every 5 minutes and expire Interview Sprint subscriptions after 7 days
crons.interval(
  "expire_interview_sprints",
  { minutes: 5 },
  internalAny.sprintExpiration.expireInterviewSprints,
  {}
);

// Daily Blog Post Generation: Generate and publish one SEO-optimized blog post every day at 9 AM UTC
crons.interval(
  "generate_daily_blog_post",
  { hours: 24 },
  internalAny.blogGenerator.generateDailyPost,
  {}
);

// Retargeting Email Campaign: Send re-engagement emails to inactive users (7+ days) every day
crons.interval(
  "send_retargeting_emails",
  { hours: 24 },
  internalAny.retargetingEmail.sendRetargetingEmails,
  {}
);

// System Health Check: Monitor system health and trigger alerts every 5 minutes
crons.interval(
  "system_health_check",
  { minutes: 5 },
  internalAny.system.healthCheck.runHealthCheck,
  {}
);

// Automated Cleanup Jobs: Maintain database hygiene and optimize storage
// Clean up old metrics data (30+ days) - runs daily at 2 AM UTC
crons.interval(
  "cleanup_old_metrics",
  { hours: 24 },
  internalAny.maintenance.cleanup.cleanupOldMetrics,
  {}
);

// Clean up old feedback data (90+ days) - runs daily at 3 AM UTC
crons.interval(
  "cleanup_old_feedback",
  { hours: 24 },
  internalAny.maintenance.cleanup.cleanupOldFeedback,
  {}
);

// Clean up failed resumes (7+ days) - runs every 12 hours
crons.interval(
  "cleanup_failed_resumes",
  { hours: 12 },
  internalAny.maintenance.cleanup.cleanupFailedResumes,
  {}
);

// Archive old completed resumes (180+ days) - runs weekly
crons.interval(
  "archive_old_resumes",
  { hours: 168 }, // 7 days
  internalAny.maintenance.cleanup.archiveOldResumes,
  {}
);

// Clean up inactive waitlist entries - runs daily
crons.interval(
  "cleanup_inactive_waitlist",
  { hours: 24 },
  internalAny.maintenance.cleanup.cleanupInactiveWaitlist,
  {}
);

// Auto-resolve stale errors (no occurrences in 30 days) - runs daily
crons.interval(
  "auto_resolve_stale_errors",
  { hours: 24 },
  internalAny.monitoring.errorTracking.autoResolveStaleErrors,
  {}
);

// Plan Expiration: Check and downgrade expired plans every hour
crons.interval(
  "check_expired_plans",
  { hours: 1 },
  internalAny.planAccess.checkAndDowngradeExpiredPlans,
  {}
);

// Plan Expiration Emails: Send emails to users with expired plans every 2 hours
crons.interval(
  "send_expiration_emails",
  { hours: 2 },
  internalAny.emails.planExpiration.checkAndSendExpirationEmails,
  {}
);

export default crons;