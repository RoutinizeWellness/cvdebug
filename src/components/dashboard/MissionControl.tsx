import { MasterCVHealth } from "./mission/MasterCVHealth";
import { ApplicationCommander } from "./mission/ApplicationCommander";
import { UpsellSidebar } from "./mission/UpsellSidebar";
import { MissionStats } from "./mission/MissionStats";

interface MissionControlProps {
  onNavigate: (view: string) => void;
  onGenerateCoverLetter: (applicationId: string) => void;
  onUpload: () => void;
}

export function MissionControl({ onNavigate, onGenerateCoverLetter, onUpload }: MissionControlProps) {
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Top Section: Master CV Health */}
      <section>
        <MasterCVHealth onUpload={onUpload} />
      </section>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Main Body: Application Commander & Stats */}
        <div className="flex-1 flex flex-col gap-6 min-h-0">
          <div className="flex-1 min-h-[400px]">
            <ApplicationCommander onGenerateCoverLetter={onGenerateCoverLetter} />
          </div>
          <div className="flex-shrink-0">
            <MissionStats />
          </div>
        </div>

        {/* Right Sidebar: Upsell Zone */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <UpsellSidebar onNavigate={onNavigate} />
        </aside>
      </div>
    </div>
  );
}