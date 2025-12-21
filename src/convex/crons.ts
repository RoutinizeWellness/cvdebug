import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Cast internal to any to avoid type instantiation issues
const internalAny = require("./_generated/api").internal;

// Cron jobs will be added here as needed
// Minimum interval is 5 minutes to prevent abuse

export default crons;