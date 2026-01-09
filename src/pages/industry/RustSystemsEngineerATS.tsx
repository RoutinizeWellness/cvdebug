import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function RustSystemsEngineerATS() {
  const template = getNicheTemplate("rust-systems-engineer-ats");
  if (!template) return <div>Template not found</div>;
  return <NicheLandingPage template={template} />;
}
