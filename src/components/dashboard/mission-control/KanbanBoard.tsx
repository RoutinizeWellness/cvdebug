import { Columns3 } from "lucide-react";
import { motion } from "framer-motion";

interface KanbanCard {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  daysAgo?: number;
  status?: string;
  deadline?: string;
}

interface KanbanColumn {
  title: string;
  count: number;
  color: string;
  cards: KanbanCard[];
}

export function KanbanBoard() {
  const columns: KanbanColumn[] = [
    {
      title: "Applied",
      count: 5,
      color: "slate-500",
      cards: [
        {
          id: "1",
          title: "Senior Dev",
          company: "Stripe",
          companyLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuARM5peAcxqjMMzuxqT9uN_cZt2JLBnG-c3Ql8xKhjsEKDX2D_t2BbUujfjaENjHmfPYDq1WXhh9Xhu7L3mZ-GcP-DhGcZmUAeDnEAqg8d7l9qKhPOVgpbELllSbBE2zfSiG6X2-ZcHuHBo-EY3vazafJZj_ydJmY6mkB1NgULxaayi2f-6podWpiIgL9MCCXVqr3rCT_sWu72UCTmKgaL58Kxmp0-gi4zjqN4YcLnvPkEWJiYJZL3BtoomQBG22qdzWLC25-jcow",
          daysAgo: 2,
        },
        {
          id: "2",
          title: "Frontend Eng",
          company: "Airbnb",
          companyLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4LKZ20mKfqxHDe-IYY66xt5S7KVZcRCszytuWZR4IZEiQVbscVD8yMkG3rsvegOrjNR_N7G06ZGgtmL0LfIraTr7ErLIuBt_dINWWiFDQh7MWacMZ2wKQ-_6TyIATcLmHjTaWo8xxMHZnEGdDBxksqykBilyB5vpSGx0RtM5v17bHTQpZFkjN16WPAUJnU8qmzjQ5-5EUYlpAYJpDfy3XxjcZy3xZYSJbsRrnomz8O_MAIEfI0Bh3DZ50sAZkFaIaqb5Cd0zlaA",
          daysAgo: 5,
        },
      ],
    },
    {
      title: "Interviewing",
      count: 2,
      color: "#3B82F6",
      cards: [
        {
          id: "3",
          title: "Lead Eng",
          company: "Vercel",
          companyLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqn6P-4QL7Qm_NO-Lc2-0o1aJcE64YCvyiAtD6Qk3UytPn63ftURrZ1u0WMmPaD6SOJOANskluLiTRuz-JSaTA601XtLQRDI8_SSi1gf5UZgLbHb1VnJC0DFVAz5L_2t0alTxt1sfkwuSbNtuKYGt1GWyxR6-4b041u2tw1RXakxEa2kVx17ibDRiY-1WtxPQ5qeO_GBMLbRU9vh-exDEeNLab0vLUN43GqhOE8jyYgZNzGEab9VucTjGbLQuCqUWaLCxD2LthGA",
          status: "Tech Screen",
          deadline: "Tomorrow",
        },
      ],
    },
    {
      title: "Offer",
      count: 1,
      color: "#8B5CF6",
      cards: [
        {
          id: "4",
          title: "Staff Eng",
          company: "Linear",
          companyLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfHGWVVHYBnfm8nOFkx7SKlqnunqMsJQz5WdjOm2ZREyW_uHo4gGoD2uLEw5IkjsBNhPEUYzBn6aUWbdQGJ2Je7Np9ft34kMbIJj10F8i272B03aMJLrPIelVmFcfNldIX5KDlhYafUojdK1D0LR8DXtKFY3MgauXAA88BvpK2Ln0ZVSzmL_Bno1xrDpx9iypllF674xxJKke-RKN0b4yjV7BL-tLi-BlDfxSsGDFJ2ayotTViWgRWUc2uHzpWfXfvyyh8PLtqag",
          status: "Reviewing",
        },
      ],
    },
  ];

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
                  style={{ color: column.color === "slate-500" ? "#94a3b8" : column.color }}
                >
                  {column.title} ({column.count})
                </span>
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: column.color === "slate-500" ? "#64748b" : column.color,
                    boxShadow:
                      column.color !== "slate-500" ? `0 0 8px ${column.color}` : "none",
                  }}
                ></div>
              </div>

              {column.cards.map((card, cardIndex) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: colIndex * 0.1 + cardIndex * 0.05 }}
                  className={`bg-[#2a374a] p-3 rounded border hover:bg-[#2f3e54] transition-colors cursor-pointer relative overflow-hidden ${
                    card.status
                      ? `border-l-2 border-y border-r border-y-slate-700 border-r-slate-700`
                      : "border-slate-700"
                  }`}
                  style={
                    card.status && column.color !== "slate-500"
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
                    <span className="text-white font-semibold text-sm">{card.title}</span>
                    <div className="bg-slate-800 rounded p-1">
                      <div
                        className="w-4 h-4 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${card.companyLogo})` }}
                      ></div>
                    </div>
                  </div>

                  <p className="text-slate-400 text-xs mb-3 relative z-10">{card.company}</p>

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
                      {card.deadline && (
                        <span className="text-[10px] text-slate-500">{card.deadline}</span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <span className="material-symbols-outlined text-[12px]">schedule</span>
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
