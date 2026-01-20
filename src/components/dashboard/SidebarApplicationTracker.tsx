import { motion } from "framer-motion";
import { Briefcase, TrendingUp } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function SidebarApplicationTracker() {
  const applications = useQuery(api.applications.getApplications);

  // Get applications with CVDebug (those created after user signed up)
  const trackedApplications = applications?.filter((app: any) =>
    app._creationTime > 0
  ) || [];

  const totalApplications = trackedApplications.length;
  const totalInterviews = trackedApplications.filter((app: any) => app.status === 'interviewing').length;
  const successRate = totalApplications > 0
    ? Math.round((totalInterviews / totalApplications) * 100)
    : 0;

  const recentApps = trackedApplications.slice(0, 3);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1d';
    if (diffDays < 7) return `${diffDays}d`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] border border-[#E2E8F0] rounded-lg p-3 shadow-sm"
    >
      {/* Header Compacto */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] rounded-md flex items-center justify-center">
            <Briefcase className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0F172A]">Applications</h4>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-[#0F172A]">{totalApplications}</div>
        </div>
      </div>

      {/* Stats Compactos */}
      {totalApplications > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-white/80 rounded px-2 py-1.5">
            <div className="text-[10px] text-[#64748B] uppercase font-medium">Interviews</div>
            <div className="text-sm font-bold text-[#0F172A]">{totalInterviews}</div>
          </div>
          {successRate > 0 && (
            <div className="bg-[#22C55E]/10 rounded px-2 py-1.5 flex items-center gap-1">
              <div className="flex-1">
                <div className="text-[10px] text-[#22C55E] uppercase font-medium">Rate</div>
                <div className="text-sm font-bold text-[#22C55E]">{successRate}%</div>
              </div>
              <TrendingUp className="h-3 w-3 text-[#22C55E]" />
            </div>
          )}
        </div>
      )}

      {/* Recent Apps - Ultra Compacto */}
      {recentApps.length === 0 ? (
        <div className="text-center py-4 border border-dashed border-[#E2E8F0] rounded bg-white/50">
          <Briefcase className="h-5 w-5 text-[#94A3B8] mx-auto mb-1" />
          <p className="text-[10px] text-[#64748B] font-medium">No apps yet</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {recentApps.map((app: any) => {
            const statusColors = {
              applied: 'bg-slate-100 text-slate-600',
              interviewing: 'bg-[#3B82F6]/10 text-[#3B82F6]',
              accepted: 'bg-[#22C55E]/10 text-[#22C55E]',
              rejected: 'bg-rose-100 text-rose-600'
            };

            return (
              <div
                key={app._id}
                className="bg-white/80 rounded p-2 border border-[#E2E8F0] hover:border-[#8B5CF6] transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#0F172A] truncate group-hover:text-[#8B5CF6] transition-colors">
                      {app.jobTitle || 'Position'}
                    </p>
                    <p className="text-[10px] text-[#64748B] truncate">{app.company || 'Company'}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${statusColors[app.status as keyof typeof statusColors] || statusColors.applied}`}>
                      {app.status === 'interviewing' ? '🎯' : app.status === 'accepted' ? '✓' : '•'}
                    </span>
                    <span className="text-[9px] text-[#94A3B8]">{formatDate(app._creationTime)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View All Footer */}
      {totalApplications > 3 && (
        <button className="w-full text-[10px] text-[#8B5CF6] hover:text-[#6366F1] font-semibold mt-2 py-1 transition-colors">
          View All {totalApplications} →
        </button>
      )}
    </motion.div>
  );
}
