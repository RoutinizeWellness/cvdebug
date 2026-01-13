import { Columns3, Clock, Briefcase, GripVertical } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import { Id } from "@/convex/_generated/dataModel";

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

function DraggableCard({ card, column }: { card: KanbanCard; column: KanbanColumn }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#FFFFFF] p-3 rounded-lg border border-[#E2E8F0] hover:border-[#E2E8F0] transition-all cursor-grab active:cursor-grabbing relative overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] ${
        card.status ? `border-l-2` : ""
      }`}
      {...listeners}
      {...attributes}
    >
      {card.status && (
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundColor: column.color,
            borderLeftColor: column.color,
          }}
        ></div>
      )}

      <div className="flex items-start gap-2 mb-2 relative z-10">
        <GripVertical className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <span className="text-[#0F172A] font-semibold text-sm line-clamp-1">{card.title}</span>
            {card.matchScore !== undefined && (
              <div className="bg-blue-50 text-[#3B82F6] rounded px-2 py-0.5 text-[10px] font-bold border border-blue-200">
                {card.matchScore}%
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-[#64748B] text-xs mb-3 relative z-10 line-clamp-1 pl-6">{card.company}</p>

      {card.status ? (
        <div className="flex items-center justify-between mt-2 pl-6">
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
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono pl-6">
          <Clock className="h-3 w-3" />
          {card.daysAgo}d ago
        </div>
      )}
    </motion.div>
  );
}

function DroppableColumn({ column }: { column: KanbanColumn }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.statusKey,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 flex flex-col gap-3 min-w-[200px] p-3 rounded-lg transition-colors ${
        isOver ? "bg-[#F8FAFC]" : ""
      }`}
    >
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
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center bg-[#F8FAFC] rounded-lg border-2 border-dashed border-[#E2E8F0]">
          <Briefcase className="h-8 w-8 text-slate-300 mb-2" />
          <p className="text-xs text-slate-400">
            No {column.statusKey === "applied" ? "applications" : column.statusKey === "interviewing" ? "interviews" : "offers"} yet
          </p>
        </div>
      )}

      {column.cards.map((card) => (
        <DraggableCard key={card.id} card={card} column={column} />
      ))}
    </div>
  );
}

export function KanbanBoard() {
  const jobHistory = useQuery(api.jobTracker.getJobHistory);
  const updateStatus = useMutation(api.jobTracker.updateApplicationStatus);
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = columns
      .flatMap(col => col.cards)
      .find(c => c.id === active.id);
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const cardId = active.id as string;
    const newStatus = over.id as string;

    // Don't update if dropped on same column
    const currentColumn = columns.find(col =>
      col.cards.some(card => card.id === cardId)
    );
    if (currentColumn?.statusKey === newStatus) return;

    try {
      await updateStatus({
        applicationId: cardId as Id<"applications">,
        status: newStatus as any,
      });
    } catch (error) {
      console.error("Failed to update application status:", error);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <section className="lg:col-span-2 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[#0F172A] text-lg font-bold flex items-center gap-2">
            <Columns3 className="h-5 w-5 text-[#3B82F6]" />
            Application Kanban
          </h3>
          <button className="text-xs text-[#3B82F6] hover:text-[#2563EB] font-mono transition-colors">
            VIEW ALL &gt;
          </button>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-1 rounded-xl flex-1 overflow-x-auto shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex gap-3 h-full min-w-[600px] p-2">
            {columns.map((column) => (
              <DroppableColumn key={column.statusKey} column={column} />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeCard ? (
            <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[#E2E8F0] shadow-lg rotate-3">
              <div className="flex items-start gap-2 mb-2">
                <GripVertical className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-[#0F172A] font-semibold text-sm">{activeCard.title}</span>
              </div>
              <p className="text-[#64748B] text-xs pl-6">{activeCard.company}</p>
            </div>
          ) : null}
        </DragOverlay>
      </section>
    </DndContext>
  );
}
