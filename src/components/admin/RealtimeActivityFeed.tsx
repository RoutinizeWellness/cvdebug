import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { FileText, Users, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Id } from "@/convex/_generated/dataModel";

interface ResumeActivity {
  id: Id<"resumes">;
  title: string;
  userId: Id<"users">;
  score: number | null;
  createdAt: number;
  status: string;
}

interface UserActivity {
  id: Id<"users">;
  email: string;
  name: string | null;
  subscriptionTier: string;
  createdAt: number;
}

/**
 * Realtime Activity Feed Component
 * Shows recent system activity with real data
 */
export function RealtimeActivityFeed() {
  const activity = useQuery(api.admin.stats.getRecentActivity, { limit: 10 });

  if (!activity) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      </Card>
    );
  }

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Resumes */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Resumes
          </h3>
        </div>

        <div className="space-y-3">
          {activity.recentResumes.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
              No recent resumes
            </p>
          ) : (
            activity.recentResumes.map((resume: ResumeActivity, index: number) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="mt-1">
                  {getStatusIcon(resume.status)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {resume.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {resume.score !== null && resume.score !== undefined && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        resume.score >= 80
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : resume.score >= 60
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {resume.score}/100
                      </span>
                    )}
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {formatTimeAgo(resume.createdAt)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>

      {/* Recent Users */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            New Users
          </h3>
        </div>

        <div className="space-y-3">
          {activity.recentUsers.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
              No new users
            </p>
          ) : (
            activity.recentUsers.map((user: UserActivity, index: number) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {user.name || user.email.split('@')[0]}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      user.subscriptionTier === 'interview_sprint'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        : user.subscriptionTier === 'single_scan'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {user.subscriptionTier === 'interview_sprint'
                        ? 'Sprint'
                        : user.subscriptionTier === 'single_scan'
                        ? '24h Pass'
                        : 'Free'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {formatTimeAgo(user.createdAt)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
