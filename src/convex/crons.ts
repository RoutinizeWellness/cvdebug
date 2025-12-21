import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Cast internal to any to avoid type instantiation issues
const internalAny = require("./_generated/api").internal;

// MODULE 2: Status Engagement - Check for stale applications every 12 hours
crons.interval(
  "check_stale_applications",
  { hours: 12 },
  internalAny.applications.checkStaleApplications,
  {}
);

export default crons;