import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Phase 2 pages to generate
const phase2Pages = [
  // Nursing (6 pages)
  { slug: 'ccu-cvu-nurse-ats-optimizer', name: 'CCUCVUNurseATSOptimizer' },
  { slug: 'dialysis-nurse-ats-scanner', name: 'DialysisNurseATSScanner' },
  { slug: 'home-health-nurse-ats-optimizer', name: 'HomeHealthNurseATSOptimizer' },
  { slug: 'school-nurse-ats-resume-scanner', name: 'SchoolNurseATSResumeScanner' },
  { slug: 'case-manager-nurse-ats-optimizer', name: 'CaseManagerNurseATSOptimizer' },
  { slug: 'infection-control-nurse-ats', name: 'InfectionControlNurseATS' },

  // Tech (4 pages)
  { slug: 'ios-engineer-swift-ats-optimizer', name: 'IOSEngineerSwiftATSOptimizer' },
  { slug: 'android-engineer-kotlin-ats', name: 'AndroidEngineerKotlinATS' },
  { slug: 'cloud-architect-aws-ats-scanner', name: 'CloudArchitectAWSATSScanner' },
  { slug: 'site-reliability-engineer-ats', name: 'SiteReliabilityEngineerATS' },
];

const generatePageFile = (slug: string, componentName: string): string => {
  return `import { NicheLandingPage } from "@/components/programmatic/NicheLandingPage";
import { getNicheTemplate } from "@/data/nicheTemplates";

export default function ${componentName}() {
  const template = getNicheTemplate("${slug}");
  if (!template) return <div>Template not found</div>;
  return <NicheLandingPage template={template} />;
}
`;
};

const main = () => {
  const outputDir = resolve(__dirname, '../src/pages/industry');

  let created = 0;
  let skipped = 0;

  phase2Pages.forEach(({ slug, name }) => {
    const filename = `${name}.tsx`;
    const filepath = resolve(outputDir, filename);

    try {
      const content = generatePageFile(slug, name);
      writeFileSync(filepath, content, 'utf-8');
      console.log(`✅ Created: ${filename}`);
      created++;
    } catch (error) {
      console.log(`⚠️  Skipped: ${filename} (${error})`);
      skipped++;
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Created: ${created} files`);
  console.log(`   Skipped: ${skipped} files`);
  console.log(`   Total Phase 2 pages: ${phase2Pages.length}`);
};

main();
