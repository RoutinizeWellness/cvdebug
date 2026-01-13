import { Columns3, Clock, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";

interface KanbanCard {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  daysAgo?: number;
  status?: string;
  matchScore?: number;
}

interface KanbanColumn {
  title: string;
  count: number;
  color: string;
  cards: KanbanCard[];
  statusKey: string;
}

export function KanbanBoard() {
  const jobHistory = useQuery(api.jobTracker.getJobHistory);

  const columns: KanbanColumn[] = useMemo(() => {
    if (!jobHistory) {
      return [
        { title: "Applied", count: 0, color: "#14b8a6", cards: [], statusKey: "applied" },
        { title: "Interviewing", count: 0, color: "#3B82F6", cards: [], statusKey: "interviewing" },
        { title: "Accepted", count: 0, color: "#8B5CF6", cards: [], statusKey: "accepted" },
      ];
    }

    // Group applications by status
    const appliedCards: KanbanCard[] = [];
    const interviewingCards: KanbanCard[] = [];
    const acceptedCards: KanbanCard[] = [];

    jobHistory.forEach((job: any) => {
      const status = (job.status || "applied").toLowerCase();
      const daysAgo = Math.floor((Date.now() - (job.appliedDate || job._creationTime)) / (1000 * 60 * 60 * 24));

      const card: KanbanCard = {
        id: job._id,
        title: job.jobTitle || "Untitled Position",
        company: job.company || "Unknown Company",
        daysAgo,
        matchScore: job.score,
      };

      if (status === "applied" || status === "draft") {
        appliedCards.push(card);
      } else if (status === "interviewing") {
        interviewingCards.push({ ...card, status: "Interview" });
      } else if (status === "accepted") {
        acceptedCards.push({ ...card, status: "Offer" });
      }
    });

    return [
      {
        title: "Applied",
        count: appliedCards.length,
        color: "#14b8a6",
        cards: appliedCards.slice(0, 5), // Show max 5 cards
        statusKey: "applied"
      },
      {
        title: "Interviewing",
        count: interviewingCards.length,
        color: "#3B82F6",
        cards: interviewingCards.slice(0, 5),
        statusKey: "interviewing"
      },
      {
        title: "Accepted",
        count: acceptedCards.length,
        color: "#8B5CF6",
        cards: acceptedCards.slice(0, 5),
        statusKey: "accepted"
      },
    ];
  }, [jobHistory]);

  return (
    <section className="lg:col-span-2 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-lg font-bold flex items-center gap-2">
          <Columns3 className="h-5 w-5 text-secondary" />
          Application Kanban
        </h3>
        <button className="text-xs text-primary hover:text-secondary font-mono transition-colors">
          VIEW ALL &gt;
        </button>
      </div>

      <div className="glass-panel p-1 rounded-xl flex-1 overflow-x-auto">
        <div className="flex gap-3 h-full min-w-[600px] p-3">
          {columns.map((column, colIndex) => (
            <div key={column.title} className="flex-1 flex flex-col gap-3 min-w-[200px]">
              <div className="flex items-center justify-between px-1">
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: column.color }}
                >
                  {column.title} ({column.count})
                </span>
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: column.color,
                    boxShadow: `0 0 8px ${column.color}`,
                  }}
                ></div>
              </div>

              {/* Empty state */}
              {column.cards.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
                  <Briefcase className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    No {column.statusKey === "applied" ? "applications" : column.statusKey === "interviewing" ? "interviews" : "offers"} yet
                  </p>
                </div>
              )}

              {column.cards.map((card, cardIndex) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: colIndex * 0.1 + cardIndex * 0.05 }}
                  className={`bg-card/60 p-3 rounded-lg border hover:bg-card/80 transition-colors cursor-pointer relative overflow-hidden ${
                    card.status
                      ? `border-l-2 border-y border-r border-y-border border-r-border`
                      : "border-border"
                  }`}
                  style={
                    card.status
                      ? { borderLeftColor: column.color }
                      : {}
                  }
                >
                  {card.status && (
                    <div
                      className="absolute inset-0 pointer-events-none opacity-5"
                      style={{
                        backgroundColor: column.color,
                      }}
                    ></div>
                  )}

                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <span className="text-white font-semibold text-sm line-clamp-1">{card.title}</span>
                    {card.matchScore !== undefined && (
                      <div className="bg-primary/10 text-primary rounded px-2 py-0.5 text-[10px] font-bold">
                        {card.matchScore}%
                      </div>
                    )}
                  </div>

                  <p className="text-muted-foreground text-xs mb-3 relative z-10 line-clamp-1">{card.company}</p>

                  {card.status ? (
                    <div className="flex items-center justify-between mt-2">
                      <div
                        className="flex items-center gap-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                        style={{
                          color: column.color,
                          backgroundColor: `${column.color}1a`,
                        }}
                      >
                        {card.status}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                      <Clock className="h-3 w-3" />
                      {card.daysAgo}d ago
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
