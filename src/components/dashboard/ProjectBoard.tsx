import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Calendar, Building2, Briefcase } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ProjectBoardProps {
  projectId: Id<"projects">;
}

const COLUMNS = [
  { id: "draft", title: "Draft", color: "bg-zinc-500" },
  { id: "applied", title: "Applied", color: "bg-blue-500" },
  { id: "interviewing", title: "Interviewing", color: "bg-yellow-500" },
  { id: "accepted", title: "Offer", color: "bg-green-500" },
  { id: "rejected", title: "Rejected", color: "bg-red-500" },
];

export function ProjectBoard({ projectId }: ProjectBoardProps) {
  const applications = useQuery(api.applications.getApplicationsByProject, { projectId });
  const updateStatus = useMutation(api.applications.updateApplicationStatus);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    try {
      await updateStatus({
        applicationId: draggableId as Id<"applications">,
        status: newStatus,
      });
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (!applications) return null;

  return (
    <div className="h-full overflow-x-auto pb-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 min-w-max h-full">
          {COLUMNS.map((column) => (
            <div key={column.id} className="w-80 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${column.color}`} />
                  <h3 className="font-bold text-sm text-zinc-300">{column.title}</h3>
                  <Badge variant="secondary" className="text-xs bg-zinc-800 text-zinc-400">
                    {applications.filter((app: any) => app.status === column.id).length}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Droppable droppableId={column.id}>
                {(provided: DroppableProvided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex-1 bg-zinc-900/30 rounded-xl p-2 flex flex-col gap-3 min-h-[150px]"
                  >
                    {applications
                      .filter((app: any) => app.status === column.id)
                      .map((app: any, index: number) => (
                        <Draggable key={app._id} draggableId={app._id} index={index}>
                          {(provided: DraggableProvided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-[#0A0A0A] border-zinc-800 hover:border-zinc-700 transition-colors cursor-grab active:cursor-grabbing"
                            >
                              <CardContent className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                  <div className="space-y-1">
                                    <h4 className="font-bold text-sm text-white leading-tight">{app.jobTitle}</h4>
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                                      <Building2 className="h-3 w-3" />
                                      {app.companyName}
                                    </div>
                                  </div>
                                  {app.matchScore > 0 && (
                                    <Badge className={`${
                                      app.matchScore >= 80 ? "bg-green-500/10 text-green-500" :
                                      app.matchScore >= 50 ? "bg-yellow-500/10 text-yellow-500" :
                                      "bg-red-500/10 text-red-500"
                                    } border-0`}>
                                      {app.matchScore}%
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
                                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(app._creationTime).toLocaleDateString()}
                                  </div>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-white">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}