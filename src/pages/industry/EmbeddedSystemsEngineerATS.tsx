import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function EmbeddedSystemsEngineerATS() {
  const template = getNicheTemplate("embedded-systems-engineer-ats");
  if (!template) return <div>Template not found</div>;
  return <NicheLandingPage template={template} />;
}
