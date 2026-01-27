import { Droppable, DroppableProvided } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ApplicationCard } from "./ApplicationCard";

interface BoardColumnProps {
  column: { id: string; title: string; color: string };
  applications: any[];
  onAddClick: () => void;
  onViewTimeline: (app: any) => void;
  onRecruiterDM: (appId: string) => void;
  onInterviewPrep: (app: any) => void;
  onViewDetails: (app: any) => void;
  onGenerateCoverLetter?: (applicationId: string) => void;
}

export function BoardColumn({
  column,
  applications,
  onAddClick,
  onViewTimeline,
  onRecruiterDM,
  onInterviewPrep,
  onViewDetails,
  onGenerateCoverLetter
}: BoardColumnProps) {
  const isGhosted = (app: any) => {
    if (app.status !== "applied") return false;
    const lastUpdate = app.lastStatusUpdate || app.appliedDate || app._creationTime;
    const daysSinceUpdate = (Date.now() - lastUpdate) / (1000 * 60 * 60 * 24);
    return daysSinceUpdate > 5;
  };

  return (
    <div className="w-80 flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${column.color}`} />
          <h3 className="font-bold text-sm text-[#0F172A]">{column.title}</h3>
          <Badge variant="secondary" className="text-xs bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]">
            {applications.length}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
          onClick={onAddClick}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided: DroppableProvided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex-1 bg-[#F8FAFC] rounded-xl p-2 flex flex-col gap-3 min-h-[150px] border border-[#E2E8F0]"
          >
            {applications.map((app: any, index: number) => (
              <ApplicationCard
                key={app._id}
                app={app}
                index={index}
                isGhosted={isGhosted(app)}
                onViewTimeline={onViewTimeline}
                onRecruiterDM={onRecruiterDM}
                onInterviewPrep={onInterviewPrep}
                onViewDetails={onViewDetails}
                onGenerateCoverLetter={onGenerateCoverLetter}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
