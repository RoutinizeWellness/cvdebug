import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function SchoolNurseATSResumeScanner() {
  const template = getNicheTemplate("school-nurse-ats-resume-scanner");
  if (!template) return <div>Template not found</div>;
  return <NicheLandingPage template={template} />;
}
