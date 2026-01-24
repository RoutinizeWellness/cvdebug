import { motion } from "framer-motion";
import { Briefcase, Calendar, TrendingUp, ExternalLink } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useI18n } from "@/contexts/I18nContext";

export function ApplicationMicroTracker() {
  const { t } = useI18n();
  const applications = useQuery(api.applications.getApplications);

  // Get applications with CVDebug (those created after user signed up)
  const trackedApplications = applications?.filter((app: any) =>
    app._creationTime > 0 // Simple filter - all apps created with CVDebug
  ).slice(0, 5) || []; // Show last 5

  const totalApplications = trackedApplications.length;
  const totalInterviews = trackedApplications.filter((app: any) => app.status === 'interviewing').length;
  const successRate = totalApplications > 0
    ? Math.round((totalInterviews / totalApplications) * 100)
    : 0;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] rounded-lg flex items-center justify-center flex-shrink-0">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[#0F172A] font-bold text-sm sm:text-base">Application Tracker</h3>
            <p className="text-[#64748B] text-xs">Applied with CVDebug</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="text-right">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#0F172A]">{totalApplications}</div>
            <div className="text-[10px] sm:text-xs text-[#64748B] whitespace-nowrap">Total Applied</div>
          </div>
          {successRate > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-[#22C55E]/10 text-[#22C55E] rounded-md text-xs font-semibold whitespace-nowrap">
              <TrendingUp className="h-3 w-3" />
              {successRate}%
            </div>
          )}
        </div>
      </div>

      {/* Applications List */}
      {trackedApplications.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-[#E2E8F0] rounded-lg">
          <Briefcase className="h-8 w-8 text-[#94A3B8] mx-auto mb-2" />
          <p className="text-[#64748B] text-sm font-medium">No applications tracked yet</p>
          <p className="text-[#94A3B8] text-xs mt-1">Start applying to jobs to see your stats here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {trackedApplications.map((app: any, index: number) => {
            const statusColors = {
              applied: 'bg-slate-100 text-[#64748B] border-slate-200',
              interviewing: 'bg-[#64748B]/10 text-[#64748B] border-[#64748B]/20',
              accepted: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
              rejected: 'bg-rose-100 text-rose-600 border-rose-200'
            };

            const status = app.status || 'applied';
            const statusColor = statusColors[status as keyof typeof statusColors] || statusColors.applied;

            return (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full ${
                      status === 'interviewing' ? 'bg-[#64748B] animate-pulse' :
                      status === 'accepted' ? 'bg-[#22C55E]' :
                      status === 'rejected' ? 'bg-rose-500' :
                      'bg-slate-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <h4 className="text-xs sm:text-sm font-semibold text-[#0F172A] truncate" title={app.jobTitle || app.title}>
                        {app.jobTitle || app.title || 'Untitled Position'}
                      </h4>
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${statusColor} self-start sm:self-auto whitespace-nowrap`}>
                        {status}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-[#64748B] truncate">{app.company || 'Company'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center gap-1 text-[10px] text-[#64748B] font-mono whitespace-nowrap">
                      <Calendar className="h-3 w-3" />
                      {formatDate(app._creationTime)}
                    </div>
                  </div>
                  {app.jobUrl && (
                    <a
                      href={app.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#64748B] hover:text-[#64748B] transition-colors p-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Quick Stats Footer */}
      {totalApplications > 0 && (
        <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div>
              <span className="text-[#64748B]">Interviews: </span>
              <span className="font-bold text-[#0F172A]">{totalInterviews}</span>
            </div>
            <div>
              <span className="text-[#64748B]">Success Rate: </span>
              <span className="font-bold text-[#0F172A]">{successRate}%</span>
            </div>
          </div>
          <button className="text-[#64748B] hover:text-[#8B5CF6] font-semibold transition-colors whitespace-nowrap">
            View All →
          </button>
        </div>
      )}
    </motion.section>
  );
}
