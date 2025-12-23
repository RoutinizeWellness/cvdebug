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

export default crons;