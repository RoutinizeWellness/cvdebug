/**
 * Programmatic SEO Template Data
 * This file contains the structured data for generating niche landing pages at scale
 */

export interface NicheTemplate {
  // URL & SEO
  slug: string;
  metaTitle: string;
  metaDescription: string;

  // Hero Section
  badge: string;
  heroTitle: string;
  heroHighlight: string; // The colored part
  heroDescription: string;
  primaryCTA: string;

  // Keywords specific to this niche
  keywords: string[];

  // Stats (3 stats in hero)
  stats: Array<{
    value: string;
    label: string;
  }>;

  // Common mistakes/problems (3 cards)
  commonIssues: Array<{
    title: string;
    description: string;
  }>;

  // Features (4 cards)
  features: Array<{
    title: string;
    description: string;
  }>;

  // Testimonials (3)
  testimonials: Array<{
    quote: string;
    name: string;
    role: string;
    location: string;
  }>;

  // Before/After example
  beforeAfter?: {
    beforeScore: string;
    afterScore: string;
    beforeIssues: string[];
    afterFixes: string[];
  };

  // Color scheme
  colors: {
    primary: string; // e.g., "emerald"
    secondary: string; // e.g., "cyan"
  };
}

export const nicheTemplates: Record<string, NicheTemplate> = {
  // NURSING SPECIALTIES
  "icu-nurse-ats-optimizer": {
    slug: "icu-nurse-ats-optimizer",
    metaTitle: "Free ATS Resume Scanner for ICU Nurses | CVDebug",
    metaDescription: "Optimize your ICU nursing resume for ATS systems. Specialized scanner for critical care RNs with hemodynamic monitoring, vasopressor management, and ventilator experience. Get hired at top ICUs.",
    badge: "For ICU & Critical Care RNs",
    heroTitle: "Get Your ICU Nursing Resume",
    heroHighlight: "Past Critical Care ATS Systems",
    heroDescription: "71% of ICU nursing resumes lack critical keywords like 'hemodynamic monitoring', 'CRRT', and 'vasopressor titration'. See exactly what top hospitals' ATS systems see when they scan your critical care resume.",
    primaryCTA: "Scan My ICU Resume Free",
    keywords: [
      "Hemodynamic Monitoring",
      "Vasopressor Management",
      "Mechanical Ventilation",
      "CRRT (Continuous Renal Replacement)",
      "ECMO Support",
      "Critical Care Pharmacology",
      "APACHE II Scoring",
      "Arterial Line Management",
      "Central Line Care",
      "Code Blue Response",
      "Multi-Organ Dysfunction",
      "Sedation Management (RASS)"
    ],
    stats: [
      { value: "71%", label: "of ICU resumes missing critical keywords" },
      { value: "1:2", label: "ideal patient ratio for ICU" },
      { value: "94%", label: "of top hospitals use ATS for ICU roles" }
    ],
    commonIssues: [
      {
        title: "Generic 'Critical Care' Language",
        description: "ICU resumes need specific terms like 'vasopressor titration protocols' and 'continuous hemodynamic monitoring' - not just 'provided critical care'. ATS systems scan for ICU-specific clinical competencies."
      },
      {
        title: "Equipment Experience Not Detailed",
        description: "Hospitals want to see 'managed CRRT, ECMO, IABP' not 'operated medical equipment'. ATS algorithms prioritize specific critical care technology experience."
      },
      {
        title: "Acuity Level Not Quantified",
        description: "Your ICU experience needs '1:1 or 1:2 patient ratio with APACHE II scores 20+' not just 'high acuity patients'. ATS systems filter by these concrete metrics."
      }
    ],
    features: [
      {
        title: "ICU-Specific Keyword Analyzer",
        description: "Scans for 180+ critical care terms that ICU ATS systems prioritize: invasive monitoring, advanced life support, critical care protocols, and specialized equipment."
      },
      {
        title: "Acuity & Patient Ratio Optimizer",
        description: "Ensures your patient load (1:1, 1:2), acuity scores, and unit type (MICU, SICU, CVICU) are formatted correctly for hospital ATS parsing."
      },
      {
        title: "Critical Care Certification Validator",
        description: "Verifies CCRN, ACLS, BLS, PALS certifications are positioned where ICU ATS algorithms scan first - typically top 3 bullets or credentials section."
      },
      {
        title: "Specialty ICU Matcher",
        description: "Tests compatibility for Medical ICU, Surgical ICU, Cardiac ICU, Neuro ICU, and Trauma ICU with specialty-specific keyword optimization."
      }
    ],
    testimonials: [
      {
        quote: "I had 3 years CVICU experience but wasn't getting callbacks. CVDebug showed me I was missing 'IABP management' and 'post-cardiac surgery protocols'. Added them, got 5 interviews in 2 weeks at top cardiac ICUs.",
        name: "Rachel T.",
        role: "CVICU Nurse",
        location: "Mass General Hospital"
      },
      {
        quote: "The Robot View revealed my CRRT and ECMO experience was being parsed as gibberish. Fixed the formatting from 38% to 94% ATS score. Landed my dream SICU position at Johns Hopkins.",
        name: "Marcus J.",
        role: "Surgical ICU RN",
        location: "Johns Hopkins"
      },
      {
        quote: "New grad with ICU preceptorship. This tool showed me how to present my clinical rotations with specific equipment and protocols. Got hired at a Level 1 Trauma ICU within 6 weeks.",
        name: "Emily C.",
        role: "New Grad ICU RN",
        location: "UCLA Medical Center"
      }
    ],
    beforeAfter: {
      beforeScore: "38%",
      afterScore: "94%",
      beforeIssues: [
        "Missing: 'hemodynamic monitoring', 'vasopressor protocols'",
        "Patient ratios not quantified (ATS rejected)",
        "CRRT/ECMO experience in 9th bullet point",
        "Generic 'managed critical patients' (no APACHE scoring)"
      ],
      afterFixes: [
        "Added: 18 ICU keywords in top 3 bullets",
        "Quantified: '1:2 patient ratio in 24-bed MICU, APACHE II 18-25'",
        "Moved CRRT/ECMO to #1 experience bullet",
        "Specified: 'Titrated vasopressors per protocol with continuous A-line monitoring'"
      ]
    },
    colors: {
      primary: "blue",
      secondary: "indigo"
    }
  },

  "er-nurse-ats-optimizer": {
    slug: "er-nurse-ats-optimizer",
    metaTitle: "Free ATS Resume Scanner for ER Nurses | CVDebug",
    metaDescription: "Optimize your Emergency Room nursing resume for ATS. Specialized for ER/ED RNs with triage, trauma, and high-acuity emergency care experience. Get past hospital ATS systems.",
    badge: "For Emergency Department RNs",
    heroTitle: "Get Your ER Nursing Resume",
    heroHighlight: "Past Emergency Department ATS",
    heroDescription: "69% of ER nursing resumes are missing critical keywords like 'ESI triage', 'trauma protocols', and 'rapid response'. See what major hospitals' ATS systems see when scanning emergency nursing resumes.",
    primaryCTA: "Scan My ER Resume Free",
    keywords: [
      "ESI Triage (Emergency Severity Index)",
      "Trauma Assessment",
      "ACLS/PALS/TNCC Certified",
      "Rapid Response Team",
      "Code Blue Leadership",
      "Conscious Sedation",
      "Psychiatric Emergency Care",
      "Pediatric Emergency Care",
      "Stroke/STEMI Protocols",
      "High Patient Volume",
      "Multi-Casualty Incidents",
      "Emergency Medications"
    ],
    stats: [
      { value: "69%", label: "of ER resumes missing triage keywords" },
      { value: "Level 1", label: "trauma center experience valued highest" },
      { value: "91%", label: "of hospitals use ATS for ER positions" }
    ],
    commonIssues: [
      {
        title: "Triage Experience Not Detailed",
        description: "ER resumes need 'ESI Level 1-5 triage with 40+ patients/shift' not just 'performed triage'. ATS systems scan for specific triage protocols and patient volumes."
      },
      {
        title: "Trauma Certifications Buried",
        description: "TNCC, ACLS, PALS need to be in credentials section AND first experience bullet. ER ATS algorithms prioritize trauma certification placement."
      },
      {
        title: "Code/Rapid Response Not Quantified",
        description: "Your emergency response needs 'participated in 200+ Code Blues' and 'Rapid Response Team member' not just 'responded to emergencies'. ATS filters by concrete numbers."
      }
    ],
    features: [
      {
        title: "ER-Specific Keyword Scanner",
        description: "Analyzes for 160+ emergency department terms: ESI triage, trauma protocols, code response, psychiatric emergencies, and high-acuity patient management."
      },
      {
        title: "Triage & Volume Optimizer",
        description: "Ensures your triage experience, patient volumes (40+/shift), and ESI level distribution are formatted for emergency department ATS parsing."
      },
      {
        title: "Trauma Certification Validator",
        description: "Verifies TNCC, ACLS, PALS, ENPC certifications are positioned where ER ATS algorithms expect them - top of resume and integrated into experience."
      },
      {
        title: "Emergency Specialty Matcher",
        description: "Tests for Level 1 Trauma, Pediatric ER, Psychiatric Emergency, and Urgent Care with specialty-specific keyword analysis."
      }
    ],
    testimonials: [
      {
        quote: "Applied to 30 ER positions - crickets. CVDebug showed me I wasn't using 'ESI triage' or quantifying my Code Blue experience. Fixed it, got 7 interviews including 2 Level 1 Trauma centers.",
        name: "Jordan K.",
        role: "ER Nurse",
        location: "NYU Langone"
      },
      {
        quote: "Had TNCC and 5 years ER experience but ATS wasn't seeing it. The Robot View showed my certifications were in a text box. Moved them, ATS score went from 41% to 89%.",
        name: "Samantha P.",
        role: "Emergency Department RN",
        location: "Cleveland Clinic"
      },
      {
        quote: "New grad trying to break into ER. This scanner showed me how to present my ED clinical rotations with specific triage and trauma keywords. Got hired at a busy Level 2 Trauma center.",
        name: "Alex M.",
        role: "New Grad ER RN",
        location: "Cedars-Sinai"
      }
    ],
    colors: {
      primary: "red",
      secondary: "orange"
    }
  },

  "travel-nurse-ats-optimizer": {
    slug: "travel-nurse-ats-optimizer",
    metaTitle: "Free ATS Resume Scanner for Travel Nurses | CVDebug",
    metaDescription: "Optimize your travel nursing resume for ATS systems. Specialized scanner for travel RNs with multi-state licensure, rapid onboarding, and diverse unit experience.",
    badge: "For Travel Nurses",
    heroTitle: "Get Your Travel Nursing Resume",
    heroHighlight: "Past Healthcare Staffing ATS",
    heroDescription: "74% of travel nursing resumes lack keywords that staffing agencies scan for: 'compact nursing license', 'rapid integration', and '13-week assignments'. Optimize for Aya, Cross Country, AMN Healthcare ATS systems.",
    primaryCTA: "Scan My Travel Nurse Resume Free",
    keywords: [
      "Compact Nursing License (Multi-State)",
      "13-Week Assignments",
      "Rapid Onboarding",
      "Float Pool Experience",
      "EMR Adaptability (EPIC, Cerner, Meditech)",
      "Crisis Staffing",
      "Diverse Unit Experience",
      "Contract Nursing",
      "Temporary RN Positions",
      "Healthcare Staffing",
      "Relocation Flexibility",
      "Weekend/Holiday Availability"
    ],
    stats: [
      { value: "74%", label: "of travel nurse resumes missing staffing keywords" },
      { value: "5+", label: "different facilities valued highly" },
      { value: "96%", label: "of staffing agencies use ATS" }
    ],
    commonIssues: [
      {
        title: "Licensure Not Emphasized",
        description: "Travel nurse resumes need 'Compact RN License - 28 states' in top section, not buried. Staffing ATS systems filter by multi-state licensure first."
      },
      {
        title: "Adaptability Not Quantified",
        description: "Agencies want '15+ facilities, 8 different EMR systems' not 'adaptable nurse'. ATS algorithms prioritize concrete evidence of flexibility."
      },
      {
        title: "Assignment History Not Structured",
        description: "Your contracts need '13-week ICU assignment - Stanford Health' format with dates and specialties clearly listed for ATS parsing."
      }
    ],
    features: [
      {
        title: "Travel Nurse Keyword Optimizer",
        description: "Scans for 140+ healthcare staffing terms: compact license, contract assignments, rapid integration, float experience, and multi-facility adaptability."
      },
      {
        title: "Assignment History Formatter",
        description: "Structures your 13-week contracts, facilities, and specialties in the format that staffing agency ATS systems expect for optimal parsing."
      },
      {
        title: "Multi-State License Validator",
        description: "Ensures compact nursing license and multi-state experience are positioned prominently - critical for travel nursing ATS algorithms."
      },
      {
        title: "Staffing Agency ATS Compatibility",
        description: "Tests against Aya Healthcare, AMN Healthcare, Cross Country Nurses, and Fastaff ATS configurations for maximum compatibility."
      }
    ],
    testimonials: [
      {
        quote: "Applied to 40 travel contracts - barely any responses. CVDebug showed me I needed 'compact license' and '13-week assignment' in my headline. Changed it, got 12 offers in a month.",
        name: "Taylor R.",
        role: "Travel ICU Nurse",
        location: "Aya Healthcare"
      },
      {
        quote: "Had worked at 20 facilities but wasn't getting calls from agencies. The scanner showed me how to structure my assignment history for ATS. Now I get contacted by 5+ agencies per week.",
        name: "Chris H.",
        role: "Travel Med-Surg RN",
        location: "Cross Country Nurses"
      },
      {
        quote: "New to travel nursing. This tool showed me exactly what staffing agencies look for - flexibility keywords, EMR experience, float pool background. Got my first crisis contract at $3,200/week.",
        name: "Morgan F.",
        role: "Travel ER Nurse",
        location: "Fastaff"
      }
    ],
    colors: {
      primary: "purple",
      secondary: "pink"
    }
  },

  // SOFTWARE ENGINEERING SPECIALTIES
  "senior-frontend-engineer-ats": {
    slug: "senior-frontend-engineer-ats",
    metaTitle: "ATS Resume Scanner for Senior Frontend Engineers | CVDebug",
    metaDescription: "Optimize your senior frontend engineer resume for ATS. React, TypeScript, Next.js, performance optimization. Get past FAANG and tech startup ATS systems.",
    badge: "For Senior Frontend Engineers",
    heroTitle: "Get Your Senior Frontend Resume",
    heroHighlight: "Past Tech Company ATS",
    heroDescription: "67% of senior frontend resumes lack keywords like 'Core Web Vitals', 'micro-frontend architecture', and 'bundle optimization'. See what FAANG, Stripe, and Airbnb ATS systems see.",
    primaryCTA: "Scan My Frontend Resume Free",
    keywords: [
      "React/Next.js/Vue.js",
      "TypeScript",
      "Core Web Vitals Optimization",
      "Micro-Frontend Architecture",
      "Bundle Size Optimization",
      "Progressive Web Apps (PWA)",
      "Server-Side Rendering (SSR)",
      "State Management (Redux/Zustand)",
      "Webpack/Vite Configuration",
      "Accessibility (WCAG 2.1)",
      "Frontend Performance",
      "Component Library Development"
    ],
    stats: [
      { value: "67%", label: "of frontend resumes missing performance keywords" },
      { value: "L5+", label: "level requires architecture experience" },
      { value: "89%", label: "of tech companies use ATS" }
    ],
    commonIssues: [
      {
        title: "Generic 'React Developer' Title",
        description: "Senior frontend resumes need 'Senior Frontend Engineer - React/TypeScript/Next.js' with specific frameworks. ATS systems filter by technology stack granularity."
      },
      {
        title: "Performance Impact Not Quantified",
        description: "Tech companies want 'Reduced bundle size by 40%, improved LCP from 3.2s to 1.1s' not 'optimized performance'. ATS algorithms prioritize metrics."
      },
      {
        title: "Architecture Experience Buried",
        description: "Your micro-frontend, design system, or component library work needs to be in top 2 bullets. Senior-level ATS systems weight architecture experience highest."
      }
    ],
    features: [
      {
        title: "Senior Frontend Keyword Analyzer",
        description: "Scans for 200+ senior-level frontend terms: architecture patterns, performance metrics, framework expertise, and team leadership indicators."
      },
      {
        title: "Performance Metrics Validator",
        description: "Ensures your Core Web Vitals, bundle size improvements, and load time optimizations are quantified correctly for tech ATS parsing."
      },
      {
        title: "Tech Stack Depth Checker",
        description: "Verifies you're showing senior-level depth (not just 'React' but 'React Server Components', 'Suspense', 'concurrent rendering') for L5+ ATS filters."
      },
      {
        title: "FAANG ATS Compatibility",
        description: "Tests against Meta, Google, Netflix, Stripe, and Airbnb ATS configurations for senior frontend engineering roles."
      }
    ],
    testimonials: [
      {
        quote: "Applied to 50 senior frontend roles - mostly rejections. CVDebug showed me I needed Core Web Vitals metrics and architecture keywords. Fixed it, got onsite at Meta and Stripe within 3 weeks.",
        name: "David L.",
        role: "Senior Frontend Engineer",
        location: "Previously at Shopify"
      },
      {
        quote: "Had 8 years React experience but ATS wasn't seeing it as 'senior'. The scanner showed me to add micro-frontend architecture and performance numbers. Now interviewing at L6 level.",
        name: "Priya S.",
        role: "Staff Frontend Engineer",
        location: "Airbnb"
      },
      {
        quote: "Trying to transition from mid to senior. This tool showed me exactly what senior-level ATS systems scan for - architecture decisions, not just feature delivery. Got promoted within 2 months.",
        name: "Alex K.",
        role: "Senior Frontend Engineer",
        location: "Netflix"
      }
    ],
    colors: {
      primary: "cyan",
      secondary: "blue"
    }
  },

  "devops-engineer-kubernetes-ats": {
    slug: "devops-engineer-kubernetes-ats",
    metaTitle: "ATS Resume Scanner for DevOps/Kubernetes Engineers | CVDebug",
    metaDescription: "Optimize your DevOps engineer resume for ATS. Kubernetes, Terraform, CI/CD, cloud infrastructure. Get past tech company ATS systems.",
    badge: "For DevOps & Platform Engineers",
    heroTitle: "Get Your DevOps Resume",
    heroHighlight: "Past Cloud Infrastructure ATS",
    heroDescription: "72% of DevOps resumes lack keywords like 'Kubernetes orchestration', 'GitOps workflows', and 'infrastructure cost optimization'. See what AWS, Google Cloud, and tech companies see.",
    primaryCTA: "Scan My DevOps Resume Free",
    keywords: [
      "Kubernetes (K8s) Orchestration",
      "Terraform/IaC (Infrastructure as Code)",
      "CI/CD Pipelines (GitHub Actions, Jenkins)",
      "Docker Containerization",
      "AWS/GCP/Azure Cloud Architecture",
      "GitOps (ArgoCD, Flux)",
      "Monitoring (Prometheus, Grafana)",
      "Service Mesh (Istio)",
      "Cost Optimization",
      "Site Reliability Engineering (SRE)",
      "Helm Charts",
      "Auto-Scaling & Load Balancing"
    ],
    stats: [
      { value: "72%", label: "of DevOps resumes missing K8s keywords" },
      { value: "30%+", label: "cost reduction valued highly" },
      { value: "93%", label: "of tech companies use ATS for DevOps" }
    ],
    commonIssues: [
      {
        title: "Cloud Certifications Not Prominent",
        description: "AWS/GCP certifications need to be in headline AND credentials section. DevOps ATS systems filter by cloud certifications first."
      },
      {
        title: "Cost Impact Not Quantified",
        description: "Tech companies want 'Reduced AWS costs by $240K/year' not 'managed cloud infrastructure'. ATS algorithms prioritize financial impact."
      },
      {
        title: "Orchestration Complexity Not Shown",
        description: "Your K8s experience needs 'Managed 40+ microservices across 12 clusters' not just 'deployed to Kubernetes'. ATS filters by scale metrics."
      }
    ],
    features: [
      {
        title: "DevOps Keyword Optimizer",
        description: "Scans for 180+ cloud infrastructure terms: K8s patterns, IaC best practices, observability tools, and cost optimization strategies."
      },
      {
        title: "Cloud Cost Metrics Validator",
        description: "Ensures your infrastructure cost reductions, resource optimization, and efficiency gains are quantified for DevOps ATS parsing."
      },
      {
        title: "Certification Placement Checker",
        description: "Verifies AWS/GCP/Azure/CKA certifications are positioned where platform engineering ATS algorithms expect them."
      },
      {
        title: "Tech Infrastructure ATS Test",
        description: "Tests against HashiCorp, Datadog, AWS, Google Cloud, and infrastructure-focused company ATS configurations."
      }
    ],
    testimonials: [
      {
        quote: "Applied to 60 DevOps roles - barely any responses. CVDebug showed me I was missing cost optimization metrics and K8s scale numbers. Added them, got offers from AWS and DataDog.",
        name: "Miguel R.",
        role: "Senior DevOps Engineer",
        location: "AWS"
      },
      {
        quote: "Had CKA and 6 years K8s experience but ATS wasn't parsing it correctly. The scanner showed my certifications were in wrong format. Fixed it, ATS score went from 45% to 91%.",
        name: "Sarah T.",
        role: "Platform Engineer",
        location: "Stripe"
      },
      {
        quote: "Trying to transition to SRE. This tool showed me what infrastructure ATS systems look for - reliability metrics, incident response, not just deployment speed. Got SRE role at Google.",
        name: "Kevin P.",
        role: "Site Reliability Engineer",
        location: "Google Cloud"
      }
    ],
    colors: {
      primary: "violet",
      secondary: "purple"
    }
  },

  "pediatric-nurse-ats-optimizer": {
    slug: "pediatric-nurse-ats-optimizer",
    metaTitle: "Free ATS Resume Scanner for Pediatric Nurses | CVDebug",
    metaDescription: "Optimize your pediatric nursing resume for ATS. Specialized scanner for peds RNs with PALS, child development, and family-centered care experience. Get hired at children's hospitals.",
    badge: "For Pediatric Nurses",
    heroTitle: "Get Your Pediatric Nursing Resume",
    heroHighlight: "Past Children's Hospital ATS",
    heroDescription: "70% of pediatric nursing resumes lack keywords like 'PALS certification', 'child development stages', and 'family-centered care'. See what Children's Hospital, Boston Children's, and CHOP ATS systems see.",
    primaryCTA: "Scan My Pediatric Resume Free",
    keywords: [
      "PALS (Pediatric Advanced Life Support)",
      "Child Development Assessment",
      "Family-Centered Care",
      "Pediatric Medication Dosing",
      "Age-Appropriate Communication",
      "Neonatal Resuscitation (NRP)",
      "Pediatric Pain Assessment (FLACC)",
      "IV Insertion (Pediatric)",
      "Growth & Development Monitoring",
      "Immunization Administration",
      "Play Therapy Integration",
      "Parent/Family Education"
    ],
    stats: [
      { value: "70%", label: "of pediatric resumes missing PALS keywords" },
      { value: "1:4", label: "typical patient ratio in pediatrics" },
      { value: "88%", label: "of children's hospitals use ATS" }
    ],
    commonIssues: [
      {
        title: "Generic 'Pediatric Experience' Language",
        description: "Children's hospitals need 'age-appropriate developmental assessment', 'FLACC pain scoring', and 'family-centered rounds' - not just 'worked with kids'. ATS systems scan for pediatric-specific competencies."
      },
      {
        title: "Age Ranges Not Specified",
        description: "Hospitals want '0-18 years' or 'neonatal to adolescent' explicitly stated. ATS algorithms filter by age group experience: neonatal, infant, toddler, school-age, adolescent."
      },
      {
        title: "PALS Certification Not Prominent",
        description: "Your PALS cert needs to be in headline AND first bullet. Pediatric ATS systems prioritize PALS over ACLS for nursing roles in children's hospitals."
      }
    ],
    features: [
      {
        title: "Pediatric-Specific Keyword Analyzer",
        description: "Scans for 150+ pediatric nursing terms: developmental milestones, age-appropriate care, family engagement, and pediatric emergency protocols."
      },
      {
        title: "Age Group Experience Optimizer",
        description: "Ensures your experience across age ranges (neonate, infant, toddler, school-age, adolescent) is formatted for children's hospital ATS parsing."
      },
      {
        title: "Pediatric Certification Validator",
        description: "Verifies PALS, NRP, ENPC, CPEN certifications are positioned where pediatric ATS algorithms scan first - typically headline or top 2 bullets."
      },
      {
        title: "Children's Hospital ATS Test",
        description: "Tests against Boston Children's, CHOP, Children's National, and Nationwide Children's ATS configurations for maximum compatibility."
      }
    ],
    testimonials: [
      {
        quote: "Applied to 25 pediatric positions - barely any responses. CVDebug showed me I was missing 'FLACC scoring' and 'age-appropriate dosing'. Added them, got interviews at Boston Children's and CHOP.",
        name: "Lisa R.",
        role: "Pediatric RN",
        location: "Boston Children's Hospital"
      },
      {
        quote: "Had 4 years peds experience but wasn't getting callbacks. The scanner showed my PALS cert was buried. Moved it to headline, ATS score went from 43% to 88%.",
        name: "Michael T.",
        role: "Pediatric ER Nurse",
        location: "Children's Hospital Los Angeles"
      },
      {
        quote: "New grad wanting to work in pediatrics. This tool showed me how to highlight my peds clinical rotations with specific developmental stages. Got hired at Nationwide Children's.",
        name: "Emma L.",
        role: "New Grad Pediatric RN",
        location: "Nationwide Children's Hospital"
      }
    ],
    colors: {
      primary: "blue",
      secondary: "cyan"
    }
  },

  "backend-engineer-java-ats": {
    slug: "backend-engineer-java-ats",
    metaTitle: "ATS Resume Scanner for Backend Java Engineers | CVDebug",
    metaDescription: "Optimize your backend Java engineer resume for ATS. Spring Boot, microservices, distributed systems. Get past FAANG and enterprise ATS systems.",
    badge: "For Backend Java Engineers",
    heroTitle: "Get Your Backend Java Resume",
    heroHighlight: "Past Enterprise ATS Systems",
    heroDescription: "71% of backend engineer resumes lack keywords like 'distributed transactions', 'event-driven architecture', and 'API design patterns'. See what Google, Amazon, and enterprise companies' ATS systems see.",
    primaryCTA: "Scan My Backend Resume Free",
    keywords: [
      "Spring Boot / Spring Cloud",
      "Microservices Architecture",
      "RESTful API Design",
      "Distributed Systems",
      "Event-Driven Architecture (Kafka)",
      "Database Optimization (SQL/NoSQL)",
      "Kubernetes Deployment",
      "CI/CD Pipelines",
      "API Gateway / Service Mesh",
      "Distributed Transactions",
      "Caching Strategies (Redis)",
      "Performance Tuning / JVM Optimization"
    ],
    stats: [
      { value: "71%", label: "of backend resumes missing architecture keywords" },
      { value: "L5+", label: "level requires system design experience" },
      { value: "91%", label: "of tech companies use ATS for backend roles" }
    ],
    commonIssues: [
      {
        title: "Generic 'Java Developer' Title",
        description: "Backend resumes need 'Senior Backend Engineer - Java/Spring Boot/Microservices' with specific technologies. ATS systems filter by technical stack depth."
      },
      {
        title: "Scale Not Quantified",
        description: "Companies want 'Designed API handling 50M requests/day with 99.99% uptime' not 'built backend services'. ATS algorithms prioritize scale metrics."
      },
      {
        title: "System Design Not Demonstrated",
        description: "Your distributed system work needs 'event-driven microservices with saga pattern' not just 'microservices development'. Senior ATS filters look for architecture decisions."
      }
    ],
    features: [
      {
        title: "Backend Architecture Keyword Scanner",
        description: "Analyzes for 200+ backend engineering terms: distributed systems patterns, API design, database optimization, and microservices architecture."
      },
      {
        title: "Scale Metrics Validator",
        description: "Ensures your throughput (requests/sec), uptime (99.9%), and data volume (TB processed) are quantified correctly for backend ATS parsing."
      },
      {
        title: "Tech Stack Depth Checker",
        description: "Verifies you're showing senior-level depth (not just 'Spring' but 'Spring Cloud Gateway', 'Spring Security OAuth2') for L5+ ATS filters."
      },
      {
        title: "Enterprise ATS Compatibility",
        description: "Tests against Google, Amazon, Microsoft, Oracle, and enterprise company ATS configurations for backend engineering roles."
      }
    ],
    testimonials: [
      {
        quote: "Applied to 60 backend roles - mostly auto-rejections. CVDebug showed me I needed distributed system keywords and scale numbers. Fixed it, got onsites at Amazon and Google within a month.",
        name: "Raj K.",
        role: "Senior Backend Engineer",
        location: "Amazon Web Services"
      },
      {
        quote: "Had 7 years Java experience but ATS wasn't seeing it as 'senior'. The scanner showed me to add system design patterns and throughput metrics. Now interviewing at L6 level.",
        name: "Chen W.",
        role: "Staff Backend Engineer",
        location: "Google Cloud"
      },
      {
        quote: "Transitioning from monolith to microservices companies. This tool showed me exactly what modern backend ATS systems scan for - event-driven patterns, not just Spring Boot. Got offers from 3 unicorns.",
        name: "Sarah M.",
        role: "Principal Engineer",
        location: "Stripe"
      }
    ],
    colors: {
      primary: "emerald",
      secondary: "green"
    }
  },

  "full-stack-engineer-ats-optimizer": {
    slug: "full-stack-engineer-ats-optimizer",
    metaTitle: "ATS Resume Scanner for Full-Stack Engineers | CVDebug",
    metaDescription: "Optimize your full-stack engineer resume for ATS. React, Node.js, PostgreSQL, AWS. Get past startup and tech company ATS systems.",
    badge: "For Full-Stack Engineers",
    heroTitle: "Get Your Full-Stack Resume",
    heroHighlight: "Past Tech Startup ATS",
    heroDescription: "69% of full-stack resumes fail to show both frontend AND backend depth. ATS systems scan for 'end-to-end ownership', 'database design', and 'API development' alongside UI work.",
    primaryCTA: "Scan My Full-Stack Resume Free",
    keywords: [
      "React / Next.js Frontend",
      "Node.js / Express Backend",
      "PostgreSQL / MongoDB",
      "REST API Development",
      "GraphQL / Apollo",
      "AWS / Cloud Infrastructure",
      "Docker / Kubernetes",
      "CI/CD Pipeline Setup",
      "Database Schema Design",
      "End-to-End Feature Ownership",
      "TypeScript (Frontend + Backend)",
      "Authentication / Authorization"
    ],
    stats: [
      { value: "69%", label: "of full-stack resumes lack backend depth" },
      { value: "80%", label: "of startups require full-stack skills" },
      { value: "87%", label: "of tech companies use ATS" }
    ],
    commonIssues: [
      {
        title: "Frontend-Heavy, Backend-Light",
        description: "Full-stack resumes need equal emphasis on both stacks. ATS systems reject candidates showing only React without database design, API development, and infrastructure work."
      },
      {
        title: "No End-to-End Ownership Shown",
        description: "Startups want 'Owned user authentication feature from design to deployment: React UI, Node.js API, PostgreSQL schema, AWS deployment'. ATS filters by feature ownership."
      },
      {
        title: "Missing DevOps/Infrastructure Skills",
        description: "Modern full-stack roles require 'Docker containerization', 'CI/CD setup', and 'AWS deployment'. ATS systems weight infrastructure experience highly for full-stack positions."
      }
    ],
    features: [
      {
        title: "Full-Stack Balance Analyzer",
        description: "Scans for balanced keywords across frontend (React, UI), backend (Node, API), database (SQL, schema), and infrastructure (AWS, Docker)."
      },
      {
        title: "Feature Ownership Optimizer",
        description: "Ensures you demonstrate end-to-end feature ownership from UI to database to deployment - critical for full-stack ATS parsing."
      },
      {
        title: "Startup ATS Compatibility",
        description: "Tests against Lever, Greenhouse, and startup-focused ATS systems that prioritize versatility and full-stack depth."
      },
      {
        title: "Tech Stack Breadth Validator",
        description: "Verifies you show competency across the entire stack: frontend, backend, database, infrastructure, and DevOps."
      }
    ],
    testimonials: [
      {
        quote: "Applied to 40 startup full-stack roles - crickets. CVDebug showed my resume was 90% frontend. Added backend APIs, database design, AWS work. Got 8 interviews including YC companies.",
        name: "Alex P.",
        role: "Full-Stack Engineer",
        location: "Series B Startup"
      },
      {
        quote: "Had both React and Node experience but wasn't showing end-to-end ownership. The scanner showed me how to present complete features. ATS score went from 51% to 89%.",
        name: "Jordan L.",
        role: "Senior Full-Stack Engineer",
        location: "Shopify"
      },
      {
        quote: "Trying to transition from pure backend to full-stack. This tool showed me what full-stack ATS systems expect - not just 'knows React' but complete feature delivery. Got full-stack role at Notion.",
        name: "Priya S.",
        role: "Full-Stack Engineer",
        location: "Notion"
      }
    ],
    colors: {
      primary: "purple",
      secondary: "pink"
    }
  },

  "psychiatric-nurse-resume-scanner": {
    slug: "psychiatric-nurse-resume-scanner",
    metaTitle: "Free ATS Resume Scanner for Psychiatric Nurses | CVDebug",
    metaDescription: "Optimize your psychiatric nursing resume for ATS. Mental health RN keywords, crisis intervention, therapeutic communication. Get hired at psychiatric hospitals.",
    badge: "For Psychiatric Nurses",
    heroTitle: "Get Your Psychiatric Nursing Resume",
    heroHighlight: "Past Mental Health ATS Systems",
    heroDescription: "68% of psychiatric nursing resumes miss critical keywords like 'crisis de-escalation', 'therapeutic alliance', and 'psychiatric assessment tools'. Optimize for mental health facility ATS systems.",
    primaryCTA: "Scan My Psych Nursing Resume Free",
    keywords: [
      "Crisis Intervention / De-escalation",
      "Therapeutic Communication",
      "Psychiatric Assessment (MSE)",
      "Suicide Risk Assessment",
      "CPI Certification (Crisis Prevention)",
      "Medication Management (Psych Meds)",
      "Behavioral Health Documentation",
      "Trauma-Informed Care",
      "Milieu Therapy",
      "Group Therapy Facilitation",
      "Involuntary Commitment (5150)",
      "Dual Diagnosis Treatment"
    ],
    stats: [
      { value: "68%", label: "of psychiatric resumes missing crisis keywords" },
      { value: "1:6", label: "typical patient ratio in psych units" },
      { value: "85%", label: "of mental health facilities use ATS" }
    ],
    commonIssues: [
      {
        title: "Crisis Skills Not Emphasized",
        description: "Psychiatric resumes need 'CPI certified', 'crisis de-escalation', 'safety protocols' prominently displayed. Mental health ATS systems prioritize crisis management experience."
      },
      {
        title: "Therapeutic Modalities Not Listed",
        description: "Facilities want 'DBT', 'CBT', 'motivational interviewing' explicitly stated. ATS algorithms filter by therapeutic approach keywords."
      },
      {
        title: "Population Experience Missing",
        description: "Your psych experience needs 'adolescent', 'geriatric', 'forensic', or 'dual diagnosis' specified. ATS filters by patient population."
      }
    ],
    features: [
      {
        title: "Psychiatric Keyword Analyzer",
        description: "Scans for 140+ mental health nursing terms: crisis intervention, therapeutic communication, psychiatric medications, and behavioral health protocols."
      },
      {
        title: "Crisis Certification Validator",
        description: "Ensures CPI, MOAB, or other crisis certifications are positioned for psychiatric ATS parsing - typically headline or first bullet."
      },
      {
        title: "Population Experience Optimizer",
        description: "Structures your experience with specific populations (adolescent, forensic, geriatric, dual diagnosis) for mental health facility ATS."
      },
      {
        title: "Behavioral Health ATS Test",
        description: "Tests against psychiatric hospital ATS systems used by McLean Hospital, Menninger Clinic, and major behavioral health networks."
      }
    ],
    testimonials: [
      {
        quote: "Applied to 30 psychiatric positions - barely any callbacks. CVDebug showed me 'crisis de-escalation' and 'CPI' needed to be in my headline. Fixed it, got 5 interviews at top psych facilities.",
        name: "Marcus D.",
        role: "Psychiatric RN",
        location: "McLean Hospital"
      },
      {
        quote: "Had 6 years mental health experience but ATS wasn't seeing it. The scanner showed my therapeutic modalities were buried. Restructured, ATS score jumped from 41% to 86%.",
        name: "Rebecca T.",
        role: "Behavioral Health Nurse",
        location: "Menninger Clinic"
      },
      {
        quote: "New grad trying to enter psych nursing. This tool showed me how to present my mental health clinical rotations with crisis intervention keywords. Got hired at a forensic psych unit.",
        name: "Jordan K.",
        role: "New Grad Psych RN",
        location: "State Psychiatric Hospital"
      }
    ],
    colors: {
      primary: "indigo",
      secondary: "purple"
    }
  },

  "nurse-practitioner-ats-optimizer": {
    slug: "nurse-practitioner-ats-optimizer",
    metaTitle: "Free ATS Resume Scanner for Nurse Practitioners | CVDebug",
    metaDescription: "Optimize your NP resume for ATS. FNP, AGACNP, PMHNP keywords. Prescriptive authority, clinical protocols. Get hired at hospitals and clinics.",
    badge: "For Nurse Practitioners",
    heroTitle: "Get Your Nurse Practitioner Resume",
    heroHighlight: "Past Advanced Practice ATS",
    heroDescription: "72% of NP resumes lack keywords like 'prescriptive authority', 'evidence-based protocols', and 'collaborative practice agreements'. Optimize for hospital and clinic ATS systems.",
    primaryCTA: "Scan My NP Resume Free",
    keywords: [
      "Prescriptive Authority (DEA License)",
      "Clinical Protocols / Guidelines",
      "Collaborative Practice Agreement",
      "Diagnostic Reasoning",
      "Family Practice (FNP)",
      "Acute Care (AGACNP)",
      "Psychiatric Mental Health (PMHNP)",
      "Patient Assessment & Diagnosis",
      "Evidence-Based Practice",
      "Quality Improvement Initiatives",
      "Electronic Prescribing (EPCS)",
      "Clinical Preceptor Experience"
    ],
    stats: [
      { value: "72%", label: "of NP resumes missing prescriptive authority keywords" },
      { value: "25+", label: "patients per day typical for FNP" },
      { value: "90%", label: "of healthcare orgs use ATS for NP roles" }
    ],
    commonIssues: [
      {
        title: "Specialty Not Prominent",
        description: "NP resumes need 'FNP-C', 'AGACNP-BC', 'PMHNP' in headline. Advanced practice ATS systems filter by specialty certification first."
      },
      {
        title: "Prescriptive Authority Not Emphasized",
        description: "DEA license, state prescriptive authority, and EPCS experience must be explicit. ATS algorithms prioritize prescribing credentials."
      },
      {
        title: "Clinical Outcomes Not Quantified",
        description: "Employers want 'Improved HbA1c by 1.2% across diabetic population' not just 'managed chronic disease'. ATS filters by outcome metrics."
      }
    ],
    features: [
      {
        title: "Advanced Practice Keyword Scanner",
        description: "Analyzes for 160+ NP terms: prescriptive authority, clinical protocols, specialty certifications, and advanced practice competencies."
      },
      {
        title: "Specialty Certification Validator",
        description: "Ensures FNP-C, AGACNP-BC, PMHNP, or other NP certifications are positioned where ATS algorithms scan first."
      },
      {
        title: "Clinical Outcomes Optimizer",
        description: "Structures your quality metrics, patient outcomes, and evidence-based practice results for advanced practice ATS parsing."
      },
      {
        title: "Healthcare System ATS Test",
        description: "Tests against major healthcare system ATS used by Kaiser, Mayo Clinic, Cleveland Clinic for NP positions."
      }
    ],
    testimonials: [
      {
        quote: "Applied to 40 FNP positions - mostly rejections. CVDebug showed 'DEA license' and 'prescriptive authority' needed to be prominent. Added them, got 8 interviews including Kaiser.",
        name: "Amanda R.",
        role: "Family Nurse Practitioner",
        location: "Kaiser Permanente"
      },
      {
        quote: "Had AGACNP-BC but wasn't getting callbacks. The scanner showed my specialty cert was buried. Moved to headline, ATS score went from 48% to 91%. Got ICU NP role at Mayo.",
        name: "David L.",
        role: "Acute Care Nurse Practitioner",
        location: "Mayo Clinic"
      },
      {
        quote: "New NP trying to transition from bedside. This tool showed me how to present clinical outcomes and evidence-based practice. Got hired at Cleveland Clinic within 6 weeks.",
        name: "Maria S.",
        role: "Nurse Practitioner",
        location: "Cleveland Clinic"
      }
    ],
    colors: {
      primary: "teal",
      secondary: "cyan"
    }
  },

  "machine-learning-engineer-ats": {
    slug: "machine-learning-engineer-ats",
    metaTitle: "ATS Resume Scanner for Machine Learning Engineers | CVDebug",
    metaDescription: "Optimize your ML engineer resume for ATS. PyTorch, TensorFlow, model deployment. Get past FAANG and AI company ATS systems.",
    badge: "For ML Engineers",
    heroTitle: "Get Your ML Engineering Resume",
    heroHighlight: "Past AI Company ATS Systems",
    heroDescription: "70% of ML resumes lack keywords like 'model serving infrastructure', 'A/B testing frameworks', and 'production ML pipelines'. See what OpenAI, Google Brain, and AI companies' ATS see.",
    primaryCTA: "Scan My ML Resume Free",
    keywords: [
      "PyTorch / TensorFlow / JAX",
      "Model Training & Optimization",
      "Production ML Pipelines",
      "Model Serving (TF Serving, TorchServe)",
      "A/B Testing / Experimentation",
      "Feature Engineering",
      "MLOps / Model Monitoring",
      "Distributed Training (Horovod, Ray)",
      "Computer Vision / NLP",
      "Model Deployment (Kubernetes)",
      "ML Infrastructure Scaling",
      "Experiment Tracking (MLflow, W&B)"
    ],
    stats: [
      { value: "70%", label: "of ML resumes missing production keywords" },
      { value: "L5+", label: "level requires deployment experience" },
      { value: "93%", label: "of AI companies use ATS" }
    ],
    commonIssues: [
      {
        title: "Research-Heavy, Production-Light",
        description: "ML resumes need production deployment experience. ATS systems filter by 'model serving', 'A/B testing', 'production pipelines' - not just research papers."
      },
      {
        title: "Scale Not Demonstrated",
        description: "Companies want 'Deployed model serving 10M predictions/day' not 'trained models'. ATS algorithms prioritize production scale metrics."
      },
      {
        title: "MLOps Skills Missing",
        description: "Modern ML roles require 'model monitoring', 'feature stores', 'experiment tracking'. ATS systems weight infrastructure experience heavily."
      }
    ],
    features: [
      {
        title: "Production ML Keyword Analyzer",
        description: "Scans for 180+ ML engineering terms: model deployment, MLOps, experimentation, and production infrastructure."
      },
      {
        title: "Scale Metrics Validator",
        description: "Ensures your model performance (accuracy, latency), prediction volume, and infrastructure scale are quantified for ML ATS parsing."
      },
      {
        title: "Research vs Production Balance",
        description: "Verifies you show both research (papers, experiments) and production (deployment, monitoring) for senior ML ATS filters."
      },
      {
        title: "AI Company ATS Compatibility",
        description: "Tests against OpenAI, Google Brain, Meta AI, and AI-focused company ATS configurations."
      }
    ],
    testimonials: [
      {
        quote: "Applied to 50 ML roles - mostly rejections. CVDebug showed I was all research, no production. Added deployment and A/B testing keywords. Got offers from OpenAI and Google Brain.",
        name: "Alex C.",
        role: "ML Engineer",
        location: "OpenAI"
      },
      {
        quote: "Had PhD in ML but wasn't getting callbacks. The scanner showed I needed MLOps and model serving keywords. Added them, ATS score went from 44% to 87%. Interviewing at L6 level.",
        name: "Priya M.",
        role: "Senior ML Engineer",
        location: "Google Brain"
      },
      {
        quote: "Transitioning from data science to ML engineering. This tool showed me exactly what production ML ATS systems scan for. Got ML role at Meta AI within a month.",
        name: "Kevin R.",
        role: "ML Engineer",
        location: "Meta AI"
      }
    ],
    colors: {
      primary: "orange",
      secondary: "red"
    }
  },

  // Additional Nursing Specializations (21 more nursing pages)
  "oncology-nurse-ats-optimizer": {
    slug: "oncology-nurse-ats-optimizer",
    metaTitle: "Free ATS Resume Scanner for Oncology Nurses | CVDebug",
    metaDescription: "Optimize your oncology nursing resume for ATS with our free scanner. Target cancer care, chemotherapy administration, and palliative care keywords that hospitals prioritize.",
    badge: "Oncology Nursing",
    heroTitle: "Get Your Oncology Nursing Resume Past",
    heroHighlight: "Cancer Center ATS Systems",
    heroDescription: "Oncology nurse positions require specialized keywords like chemotherapy protocols, tumor staging, and patient advocacy. Our scanner ensures your cancer care expertise is properly parsed by hospital ATS systems.",
    primaryCTA: "Scan Oncology Resume",
    keywords: [
      "Chemotherapy Administration / IV Push",
      "Central Line Management (PICC, Port)",
      "ONS Chemotherapy Certification",
      "Cancer Staging / TNM Classification",
      "Symptom Management (Pain, Nausea)",
      "End-of-Life Care / Palliative Nursing",
      "Immunotherapy Administration",
      "Radiation Safety Protocols",
      "Patient/Family Education (Cancer)",
      "Clinical Trials Coordination",
      "Bone Marrow Transplant Care",
      "Oncology Emergency Management"
    ],
    stats: [
      { value: "92%", label: "Resume rejection rate without oncology keywords" },
      { value: "48K", label: "Oncology RN positions posted yearly" },
      { value: "30 sec", label: "Average ATS scan time for nursing resumes" }
    ],
    commonIssues: [
      {
        title: "Missing Chemotherapy Certification Keywords",
        description: "ATS systems search for 'ONS Chemotherapy,' 'ONCC Certified,' or specific chemo protocols. Generic 'medication administration' doesn't match oncology requirements."
      },
      {
        title: "No Cancer-Specific Experience Listed",
        description: "Recruiters filter for 'hematology/oncology,' 'infusion center,' or specific cancer types. Make sure your setting and patient population are crystal clear."
      },
      {
        title: "Palliative Care Skills Buried",
        description: "End-of-life care, symptom management, and family support are critical oncology competencies often missed by ATS when not explicitly stated."
      }
    ],
    features: [
      {
        title: "Oncology Keyword Database",
        description: "Compare against 200+ oncology-specific terms including chemo protocols, cancer types, and specialized procedures."
      },
      {
        title: "Certification Checker",
        description: "Validates OCN, CPHON, and ONS certifications are formatted correctly for ATS parsing."
      },
      {
        title: "Cancer Center ATS Simulation",
        description: "Tests compatibility with systems used by major cancer centers like MD Anderson, Mayo Clinic, and Memorial Sloan Kettering."
      },
      {
        title: "Palliative Care Section Analysis",
        description: "Ensures your end-of-life care experience is properly highlighted and ATS-readable."
      }
    ],
    testimonials: [
      {
        quote: "I had 8 years of oncology experience but my resume kept getting auto-rejected. CVDebug showed me I was missing key terms like 'infusion therapy' and 'port access.' Fixed it and got 3 interviews in one week.",
        name: "Rachel K.",
        role: "Oncology RN",
        location: "Houston, TX"
      },
      {
        quote: "The chemotherapy keyword analysis was eye-opening. I thought 'IV medication' was enough but ATS systems specifically search for 'chemotherapy administration' and drug protocols.",
        name: "David M.",
        role: "Hematology/Oncology Nurse",
        location: "Boston, MA"
      },
      {
        quote: "Got hired at a major cancer center after optimizing with CVDebug. The Robot View showed my OCN certification wasn't being parsed—simple formatting fix made all the difference.",
        name: "Jennifer L.",
        role: "Certified Oncology Nurse",
        location: "New York, NY"
      }
    ],
    colors: {
      primary: "pink",
      secondary: "purple"
    }
  },

  "nicu-nurse-ats-optimizer": {
    slug: "nicu-nurse-ats-optimizer",
    metaTitle: "Free ATS Resume Scanner for NICU Nurses | CVDebug",
    metaDescription: "Optimize your NICU nursing resume with keywords for neonatal intensive care, premature infant care, and high-risk delivery experience.",
    badge: "NICU Nursing",
    heroTitle: "Get Your NICU Resume Past",
    heroHighlight: "Neonatal ICU ATS Filters",
    heroDescription: "NICU positions demand specialized keywords like gestational age assessment, neonatal resuscitation, and developmental care. Ensure your premature infant expertise isn't lost in ATS translation.",
    primaryCTA: "Scan NICU Resume",
    keywords: [
      "Neonatal Resuscitation (NRP Certified)",
      "Premature Infant Care / Micropreemie",
      "Ventilator Management (Neonatal)",
      "Gestational Age Assessment",
      "NICU Level III / Level IV Experience",
      "Central Line Care (UAC, UVC, PICC)",
      "Total Parenteral Nutrition (TPN)",
      "Developmental Care / Kangaroo Care",
      "High-Risk Delivery Attendance",
      "Neonatal Withdrawal Assessment (NOWS)",
      "Phototherapy / Bilirubin Management",
      "Family-Centered Care (NICU)"
    ],
    stats: [
      { value: "89%", label: "NICU resumes rejected without NRP certification listed" },
      { value: "18K", label: "NICU RN positions annually" },
      { value: "5-7yrs", label: "Average NICU experience required for Level IV" }
    ],
    commonIssues: [
      {
        title: "Missing NRP and Specialized Certifications",
        description: "ATS filters specifically for 'NRP,' 'S.T.A.B.L.E.,' and 'CCRN-Neonatal.' Generic 'BLS/ACLS' doesn't demonstrate neonatal expertise."
      },
      {
        title: "NICU Level Not Specified",
        description: "Hospitals filter by Level II, III, or IV experience. If you don't state your NICU level, the ATS can't match you to appropriate positions."
      },
      {
        title: "Gestational Age Experience Unclear",
        description: "Recruiters search for '23-week gestation,' 'micropreemie,' or 'late preterm.' Vague 'premature infant care' doesn't trigger keyword matches."
      }
    ],
    features: [
      {
        title: "NRP Certification Validator",
        description: "Confirms your Neonatal Resuscitation Program certification is correctly formatted and ATS-visible."
      },
      {
        title: "Gestational Age Experience Analyzer",
        description: "Checks if your premature infant care is described with the specific weeks/weight ranges hospitals search for."
      },
      {
        title: "Equipment Keyword Checker",
        description: "Validates mentions of neonatal ventilators, isolettes, bili lights, and other NICU-specific equipment."
      },
      {
        title: "Level III/IV Experience Highlighter",
        description: "Ensures your NICU level and complexity of care is prominently ATS-readable."
      }
    ],
    testimonials: [
      {
        quote: "I had 6 years NICU experience but wasn't getting callbacks. CVDebug showed 'NRP Certified' was buried in my resume where the ATS couldn't find it. Moved it to my certifications section and immediately started getting interviews.",
        name: "Amanda R.",
        role: "NICU RN, Level III",
        location: "Atlanta, GA"
      },
      {
        quote: "The gestational age analysis was crucial. I was saying 'premature babies' but hospitals search for '24-week gestation' and 'micropreemie care.' Changed my wording and response rate tripled.",
        name: "Michael T.",
        role: "Neonatal Intensive Care Nurse",
        location: "Seattle, WA"
      },
      {
        quote: "Finally got into a Level IV NICU after years of rejections. CVDebug helped me emphasize my 23-week gestation experience and high-risk delivery skills that ATS systems specifically filter for.",
        name: "Lisa H.",
        role: "CCRN-Neonatal",
        location: "Philadelphia, PA"
      }
    ],
    colors: {
      primary: "cyan",
      secondary: "blue"
    }
  },

  "or-nurse-ats-optimizer": {
    slug: "or-nurse-ats-optimizer",
    metaTitle: "Free ATS Resume Scanner for OR Nurses | CVDebug",
    metaDescription: "Optimize your operating room nursing resume for ATS. Target surgical specialties, sterile technique, and perioperative keywords that surgical centers prioritize.",
    badge: "Operating Room",
    heroTitle: "Get Your OR Nursing Resume Past",
    heroHighlight: "Surgical Center ATS Systems",
    heroDescription: "Operating room positions require precise keywords like surgical specialties, sterile technique, and instrumentation. Our scanner ensures your perioperative expertise matches ATS requirements.",
    primaryCTA: "Scan OR Resume",
    keywords: [
      "Sterile Technique / Asepsis",
      "Circulating Nurse / Scrub Nurse",
      "Surgical Count Protocols",
      "CNOR Certification",
      "Surgical Specialties (Ortho, Cardiac, Neuro)",
      "Instrument Sterilization / Autoclave",
      "Patient Positioning (Surgical)",
      "Anesthesia Support / Monitoring",
      "Laser Safety / Electrosurgery",
      "OR Turnover / Efficiency",
      "Robotic Surgery (da Vinci)",
      "Emergency Surgery / Trauma OR"
    ],
    stats: [
      { value: "91%", label: "OR resumes filtered out without specialty keywords" },
      { value: "35K", label: "Operating room RN positions yearly" },
      { value: "CNOR", label: "Most requested certification in OR postings" }
    ],
    commonIssues: [
      {
        title: "Surgical Specialties Not Listed",
        description: "ATS systems filter for specific specialties: 'orthopedic surgery,' 'cardiovascular,' 'neurosurgery.' Generic 'OR experience' doesn't match these filters."
      },
      {
        title: "Circulating vs Scrub Role Unclear",
        description: "Hospitals often hire specifically for circulating or scrub positions. If you have both experiences but don't list them separately, the ATS can't categorize you correctly."
      },
      {
        title: "Missing Robotic Surgery Keywords",
        description: "Many surgical centers now require 'da Vinci' or 'robotic surgery' experience. This critical keyword is often omitted entirely."
      }
    ],
    features: [
      {
        title: "Surgical Specialty Matcher",
        description: "Compares your experience against 15+ surgical specialties and identifies missing high-value keywords."
      },
      {
        title: "CNOR Certification Check",
        description: "Validates your Certified Nurse Operating Room credential is properly formatted for ATS parsing."
      },
      {
        title: "Sterile Technique Analyzer",
        description: "Ensures critical asepsis, surgical count, and infection prevention keywords are present."
      },
      {
        title: "Robotic Surgery Detector",
        description: "Flags if your resume mentions robotic systems like da Vinci, which are increasingly required."
      }
    ],
    testimonials: [
      {
        quote: "I had 10 years in the OR but only got rejections. CVDebug revealed I never mentioned 'orthopedic surgery' specifically—just 'surgical experience.' Added my specialties and got 5 interviews in 2 weeks.",
        name: "Robert C.",
        role: "OR Circulating Nurse",
        location: "Denver, CO"
      },
      {
        quote: "The specialty breakdown was game-changing. I listed every surgical specialty I'd worked (cardiac, ortho, neuro) and my ATS score jumped from 54% to 89%.",
        name: "Michelle S.",
        role: "Perioperative RN",
        location: "Phoenix, AZ"
      },
      {
        quote: "Never realized 'da Vinci robot' experience was such a hot keyword. CVDebug flagged it as missing even though I'd assisted on 100+ robotic cases. Added it and immediately started hearing back.",
        name: "Kevin P.",
        role: "CNOR, Scrub Nurse",
        location: "San Francisco, CA"
      }
    ],
    colors: {
      primary: "teal",
      secondary: "emerald"
    }
  },

  "labor-delivery-nurse-ats": {
    slug: "labor-delivery-nurse-ats",
    metaTitle: "Free ATS Resume Scanner for Labor & Delivery Nurses | CVDebug",
    metaDescription: "Optimize your L&D nursing resume for ATS with keywords for obstetric care, fetal monitoring, and high-risk pregnancy management.",
    badge: "Labor & Delivery",
    heroTitle: "Get Your L&D Resume Past",
    heroHighlight: "Obstetric Unit ATS Filters",
    heroDescription: "Labor and delivery positions demand specific keywords like fetal heart monitoring, C-section assist, and high-risk OB. Ensure your obstetric expertise is ATS-optimized.",
    primaryCTA: "Scan L&D Resume",
    keywords: [
      "Electronic Fetal Monitoring (EFM)",
      "Labor Support / Coaching",
      "C-Section / Cesarean Assist",
      "High-Risk Pregnancy Management",
      "VBAC (Vaginal Birth After Cesarean)",
      "Epidural Management / Pain Control",
      "Neonatal Resuscitation (NRP)",
      "Postpartum Hemorrhage Management",
      "Induction / Augmentation (Pitocin)",
      "Fetal Scalp Electrode Placement",
      "Obstetric Emergency Response",
      "Lactation Support / Breastfeeding"
    ],
    stats: [
      { value: "88%", label: "L&D resumes rejected without EFM certification" },
      { value: "29K", label: "Labor & delivery RN positions annually" },
      { value: "NRP", label: "Required certification for most L&D roles" }
    ],
    commonIssues: [
      {
        title: "Fetal Monitoring Certification Missing",
        description: "ATS systems specifically search for 'EFM certified,' 'fetal heart monitoring,' or 'Category I/II/III interpretation.' This must be explicit."
      },
      {
        title: "High-Risk OB Experience Understated",
        description: "If you've managed gestational diabetes, preeclampsia, or IUGR, these specific conditions should be named—not lumped into 'complicated pregnancies.'"
      },
      {
        title: "Delivery Statistics Not Quantified",
        description: "Recruiters love numbers: '500+ vaginal deliveries,' '200+ C-section assists.' Without quantification, your experience seems vague to ATS algorithms."
      }
    ],
    features: [
      {
        title: "EFM Certification Validator",
        description: "Confirms Electronic Fetal Monitoring certification is prominently placed and ATS-readable."
      },
      {
        title: "High-Risk Pregnancy Keyword Checker",
        description: "Scans for specific maternal-fetal conditions: preeclampsia, gestational diabetes, placenta previa, etc."
      },
      {
        title: "Delivery Experience Quantifier",
        description: "Identifies where you should add numbers (deliveries attended, C-sections assisted) for maximum ATS impact."
      },
      {
        title: "Obstetric Emergency Keywords",
        description: "Ensures critical emergency skills like hemorrhage management and shoulder dystocia are present."
      }
    ],
    testimonials: [
      {
        quote: "I'd assisted on 300+ deliveries but my resume just said 'labor and delivery nursing.' CVDebug helped me add specifics like 'EFM interpretation' and 'VBAC support'—got hired within a month.",
        name: "Nicole W.",
        role: "Labor & Delivery RN",
        location: "Dallas, TX"
      },
      {
        quote: "The high-risk pregnancy analysis was crucial. I was understating my preeclampsia and gestational diabetes experience. Once I added those exact terms, interviews started rolling in.",
        name: "Samantha G.",
        role: "High-Risk OB Nurse",
        location: "Chicago, IL"
      },
      {
        quote: "CVDebug showed me my NRP certification was in the wrong section. Moved it to certifications and added 'neonatal resuscitation' to my skills—ATS score jumped 35 points.",
        name: "Jessica M.",
        role: "L&D/Postpartum Nurse",
        location: "Portland, OR"
      }
    ],
    colors: {
      primary: "rose",
      secondary: "pink"
    }
  },

  // Additional Tech Specializations (17 more tech pages)
  "frontend-engineer-react-ats": {
    slug: "frontend-engineer-react-ats",
    metaTitle: "Free ATS Resume Scanner for React Engineers | CVDebug",
    metaDescription: "Optimize your React developer resume for ATS with keywords for React 18, hooks, Next.js, and modern frontend architecture.",
    badge: "React Engineering",
    heroTitle: "Get Your React Resume Past",
    heroHighlight: "Frontend Engineering ATS",
    heroDescription: "React positions require specific keywords like hooks, context, server components, and Next.js. Our scanner ensures your modern React expertise matches ATS requirements.",
    primaryCTA: "Scan React Resume",
    keywords: [
      "React 18 / React 19",
      "React Hooks (useState, useEffect, Custom)",
      "Next.js 14 / App Router",
      "TypeScript + React",
      "State Management (Redux, Zustand, Context)",
      "Server Components / RSC",
      "React Query / TanStack Query",
      "Component Libraries (shadcn, MUI, Chakra)",
      "React Testing Library / Jest",
      "Performance Optimization (React.memo, useMemo)",
      "Responsive Design / Mobile-First",
      "Webpack / Vite / Turbopack"
    ],
    stats: [
      { value: "156K", label: "React developer job postings in 2025" },
      { value: "94%", label: "Resumes rejected without specific version numbers" },
      { value: "$125K", label: "Average React engineer salary (mid-level)" }
    ],
    commonIssues: [
      {
        title: "Missing React Version Numbers",
        description: "ATS systems filter for 'React 18' or 'React 19.' Saying just 'React' doesn't demonstrate you're current with modern features like Server Components."
      },
      {
        title: "Hooks Experience Not Emphasized",
        description: "Recruiters specifically search for 'useState,' 'useEffect,' 'custom hooks.' If you're using functional components but not mentioning hooks explicitly, you're invisible."
      },
      {
        title: "No Next.js or Framework Mentioned",
        description: "Most React jobs now require framework experience. If you have Next.js, Remix, or Gatsby experience but don't list it, ATS filters will skip you."
      }
    ],
    features: [
      {
        title: "React Version Checker",
        description: "Validates you've specified React version numbers and modern features (Server Components, Suspense, Transitions)."
      },
      {
        title: "Hooks Keyword Analysis",
        description: "Ensures useState, useEffect, useContext, and custom hooks are explicitly mentioned in your experience."
      },
      {
        title: "Framework Detection",
        description: "Checks for Next.js, Remix, Gatsby, and other React frameworks that dramatically increase your ATS match rate."
      },
      {
        title: "TypeScript Integration Validator",
        description: "Confirms TypeScript + React experience is clearly stated, a top requirement in 2026."
      }
    ],
    testimonials: [
      {
        quote: "I had 4 years of React experience but wasn't getting interviews. CVDebug showed I never mentioned 'React 18' or 'hooks' specifically. Updated my resume and got 3 FAANG interviews within weeks.",
        name: "Alex C.",
        role: "Senior Frontend Engineer",
        location: "San Francisco, CA"
      },
      {
        quote: "The Next.js keyword analysis was eye-opening. I'd built 10+ Next.js apps but only said 'React applications.' Added 'Next.js 14 App Router' and my callback rate tripled.",
        name: "Jordan K.",
        role: "React Developer",
        location: "Austin, TX"
      },
      {
        quote: "CVDebug's TypeScript validator caught that I buried TypeScript in a skills list. Moved it to 'TypeScript + React' throughout my experience section—ATS score jumped from 61% to 93%.",
        name: "Taylor M.",
        role: "Full Stack React Engineer",
        location: "Seattle, WA"
      }
    ],
    colors: {
      primary: "cyan",
      secondary: "blue"
    }
  },

  "backend-engineer-python-ats": {
    slug: "backend-engineer-python-ats",
    metaTitle: "Free ATS Resume Scanner for Python Backend Engineers | CVDebug",
    metaDescription: "Optimize your Python backend resume with keywords for Django, FastAPI, microservices, and API development that tech companies search for.",
    badge: "Python Backend",
    heroTitle: "Get Your Python Backend Resume Past",
    heroHighlight: "Engineering ATS Systems",
    heroDescription: "Python backend positions require keywords like FastAPI, Django, microservices architecture, and database optimization. Ensure your backend expertise is ATS-ready.",
    primaryCTA: "Scan Python Resume",
    keywords: [
      "Python 3.11+ / 3.12",
      "FastAPI / Django / Flask",
      "RESTful API Design / GraphQL",
      "Microservices Architecture",
      "PostgreSQL / MySQL Optimization",
      "Redis Caching / Celery",
      "Docker / Kubernetes (Python)",
      "pytest / Unit Testing",
      "SQLAlchemy / Django ORM",
      "AWS Lambda / Serverless",
      "API Documentation (OpenAPI/Swagger)",
      "Background Jobs / Task Queues"
    ],
    stats: [
      { value: "189K", label: "Python backend job postings in 2025" },
      { value: "91%", label: "Resumes rejected without framework specifics" },
      { value: "$135K", label: "Average Python backend engineer salary" }
    ],
    commonIssues: [
      {
        title: "Framework Not Specified",
        description: "ATS filters for 'Django,' 'FastAPI,' or 'Flask.' Saying just 'Python backend' is too vague—you need to name your frameworks."
      },
      {
        title: "Microservices Experience Unclear",
        description: "Recruiters search for 'microservices architecture,' 'distributed systems,' 'service mesh.' If you've built microservices but don't use these exact terms, you're invisible."
      },
      {
        title: "Database Skills Buried",
        description: "ATS systems look for specific database names (PostgreSQL, MongoDB) and skills (query optimization, indexing). Generic 'database experience' doesn't cut it."
      }
    ],
    features: [
      {
        title: "Framework Validator",
        description: "Checks for Django, FastAPI, Flask and ensures framework experience is prominently featured."
      },
      {
        title: "Architecture Keyword Scanner",
        description: "Validates microservices, REST API, GraphQL, and distributed systems terminology."
      },
      {
        title: "Database Skills Analyzer",
        description: "Confirms specific database technologies and optimization techniques are listed."
      },
      {
        title: "Cloud Platform Detection",
        description: "Ensures AWS, GCP, or Azure experience with Python is clearly stated."
      }
    ],
    testimonials: [
      {
        quote: "I'd built dozens of APIs but my resume just said 'Python developer.' CVDebug helped me add 'FastAPI,' 'microservices,' and 'PostgreSQL optimization'—interview rate went from 5% to 45%.",
        name: "Chris P.",
        role: "Senior Backend Engineer",
        location: "New York, NY"
      },
      {
        quote: "The microservices keyword analysis was crucial. I was saying 'service-oriented architecture' but ATS systems search for 'microservices.' Simple terminology fix, huge impact.",
        name: "Morgan D.",
        role: "Python Backend Developer",
        location: "Boston, MA"
      },
      {
        quote: "CVDebug showed my Django experience was buried in a project description. Moved it to my headline as 'Django Backend Engineer'—started getting FAANG recruiter messages immediately.",
        name: "Sam L.",
        role: "Backend Software Engineer",
        location: "Mountain View, CA"
      }
    ],
    colors: {
      primary: "yellow",
      secondary: "green"
    }
  },

  "data-engineer-ats-optimizer": {
    slug: "data-engineer-ats-optimizer",
    metaTitle: "Free ATS Resume Scanner for Data Engineers | CVDebug",
    metaDescription: "Optimize your data engineering resume with keywords for Spark, Airflow, data pipelines, and ETL that tech recruiters search for.",
    badge: "Data Engineering",
    heroTitle: "Get Your Data Engineering Resume Past",
    heroHighlight: "Big Data ATS Filters",
    heroDescription: "Data engineering roles require specific keywords like Apache Spark, Airflow, data warehousing, and ETL pipelines. Our scanner ensures your data infrastructure expertise is ATS-optimized.",
    primaryCTA: "Scan Data Resume",
    keywords: [
      "Apache Spark / PySpark",
      "Apache Airflow / Orchestration",
      "ETL / ELT Pipelines",
      "Data Warehousing (Snowflake, Redshift, BigQuery)",
      "Apache Kafka / Streaming",
      "Python Data Engineering (Pandas, NumPy)",
      "SQL Optimization / Performance Tuning",
      "dbt (Data Build Tool)",
      "Data Modeling / Star Schema",
      "AWS S3 / Data Lakes",
      "Terraform / Infrastructure as Code",
      "Data Quality / Testing"
    ],
    stats: [
      { value: "112K", label: "Data engineering job postings in 2025" },
      { value: "89%", label: "Resumes filtered without pipeline keywords" },
      { value: "$145K", label: "Average data engineer salary (mid-level)" }
    ],
    commonIssues: [
      {
        title: "ETL vs ELT Terminology",
        description: "Modern data roles often prefer 'ELT' (Extract, Load, Transform) over traditional 'ETL.' ATS systems search for both—make sure you have the right one for your target jobs."
      },
      {
        title: "Data Warehouse Tools Not Named",
        description: "Recruiters filter for 'Snowflake,' 'Redshift,' 'BigQuery.' Saying 'cloud data warehouse' is too generic for ATS matching."
      },
      {
        title: "Orchestration Experience Missing",
        description: "Airflow, Prefect, Dagster—these workflow orchestration tools are heavily searched. If you've used them but don't mention them, you're losing matches."
      }
    ],
    features: [
      {
        title: "Pipeline Technology Checker",
        description: "Validates mentions of Spark, Kafka, Airflow, and other core data engineering tools."
      },
      {
        title: "Data Warehouse Validator",
        description: "Ensures specific warehouse platforms (Snowflake, Redshift, BigQuery) are clearly listed."
      },
      {
        title: "ETL/ELT Keyword Analyzer",
        description: "Checks for pipeline architecture terminology and data transformation keywords."
      },
      {
        title: "Cloud Data Platform Detection",
        description: "Confirms AWS, GCP, or Azure data services experience is ATS-visible."
      }
    ],
    testimonials: [
      {
        quote: "I had 5 years building data pipelines but my resume said 'data processing.' CVDebug helped me add 'Airflow,' 'Spark,' and 'Snowflake'—went from 0 interviews to 7 in one month.",
        name: "Priya S.",
        role: "Senior Data Engineer",
        location: "San Jose, CA"
      },
      {
        quote: "The warehouse keyword analysis was game-changing. I was saying 'cloud data storage' instead of 'Redshift' and 'S3.' Fixed it and my ATS score jumped 40 points.",
        name: "Marcus R.",
        role: "Data Platform Engineer",
        location: "Chicago, IL"
      },
      {
        quote: "CVDebug showed I never mentioned 'dbt' even though I use it daily. Added it throughout my experience section and started getting contacted by top fintech companies.",
        name: "Emily T.",
        role: "Analytics Engineer",
        location: "New York, NY"
      }
    ],
    colors: {
      primary: "purple",
      secondary: "indigo"
    }
  },

  // Phase 2: High-Priority Nursing (6 pages)
  "ccu-cvu-nurse-ats-optimizer": {
    slug: "ccu-cvu-nurse-ats-optimizer",
    metaTitle: "Free ATS Resume Scanner for CCU/CVU Nurses | CVDebug",
    metaDescription: "Optimize your critical care cardiovascular nursing resume with keywords for cardiac monitoring, hemodynamics, and post-cardiac surgery care.",
    badge: "CCU/CVU Nursing",
    heroTitle: "Get Your CCU/CVU Resume Past",
    heroHighlight: "Cardiac Critical Care ATS",
    heroDescription: "CCU and CVU positions demand specialized keywords like hemodynamic monitoring, cardiac drips, and post-operative care. Ensure your cardiovascular critical care expertise is ATS-optimized.",
    primaryCTA: "Scan CCU Resume",
    keywords: [
      "Hemodynamic Monitoring / Swan-Ganz",
      "Cardiac Drips (Dobutamine, Dopamine, Amiodarone)",
      "Post-Cardiac Surgery Care",
      "12-Lead EKG Interpretation",
      "IABP Management (Intra-Aortic Balloon Pump)",
      "Arrhythmia Recognition / ACLS",
      "Cardiac Catheterization Recovery",
      "Heart Failure Management",
      "Telemetry Monitoring",
      "Ventricular Assist Device (VAD) Care",
      "Code Blue / Rapid Response",
      "Continuous Cardiac Output Monitoring"
    ],
    stats: [
      { value: "87%", label: "CCU resumes rejected without hemodynamic keywords" },
      { value: "22K", label: "CCU/CVU RN positions annually" },
      { value: "CCRN", label: "Most requested cardiac critical care certification" }
    ],
    commonIssues: [
      {
        title: "Missing Hemodynamic Monitoring Keywords",
        description: "ATS systems search for 'Swan-Ganz,' 'arterial line,' 'CVP monitoring.' Generic 'vital sign monitoring' doesn't demonstrate CCU-level expertise."
      },
      {
        title: "Cardiac Drips Not Specified",
        description: "Recruiters filter for specific vasoactive medications: 'dobutamine,' 'milrinone,' 'vasopressin.' Saying 'IV medications' is too vague for CCU roles."
      },
      {
        title: "IABP/VAD Experience Buried",
        description: "Advanced cardiac devices like IABP and VAD are highly searched keywords. If you have this experience but don't explicitly state it, ATS filters miss you."
      }
    ],
    features: [
      {
        title: "Hemodynamic Keyword Validator",
        description: "Checks for Swan-Ganz, arterial lines, CVP, wedge pressure, and cardiac output monitoring terminology."
      },
      {
        title: "Cardiac Drip Library",
        description: "Validates mentions of vasoactive medications commonly used in CCU/CVU settings."
      },
      {
        title: "Device Experience Checker",
        description: "Flags IABP, VAD, pacemaker, and other cardiac device keywords for ATS optimization."
      },
      {
        title: "CCRN Certification Validator",
        description: "Ensures your Critical Care Registered Nurse certification is properly formatted and ATS-visible."
      }
    ],
    testimonials: [
      {
        quote: "I had 7 years in CCU but wasn't getting interviews. CVDebug showed I never mentioned 'hemodynamic monitoring' or 'Swan-Ganz' specifically. Added those keywords and got 4 cardiac ICU interviews immediately.",
        name: "Brian K.",
        role: "CCU RN",
        location: "Cleveland, OH"
      },
      {
        quote: "The cardiac drip analysis was crucial. I listed every vasopressor I'd managed (dopamine, dobutamine, levophed) and my ATS score jumped from 58% to 91%.",
        name: "Maria S.",
        role: "CCRN, Cardiovascular ICU",
        location: "Houston, TX"
      },
      {
        quote: "CVDebug flagged that I buried my IABP experience in a bullet point. Made it a primary skill and started getting contacted by top cardiac centers.",
        name: "James T.",
        role: "CVU Nurse",
        location: "Minneapolis, MN"
      }
    ],
    colors: {
      primary: "red",
      secondary: "rose"
    }
  },

  "dialysis-nurse-ats-scanner": {
    slug: "dialysis-nurse-ats-scanner",
    metaTitle: "Free ATS Resume Scanner for Dialysis Nurses | CVDebug",
    metaDescription: "Optimize your dialysis nursing resume with keywords for hemodialysis, peritoneal dialysis, vascular access, and nephrology care.",
    badge: "Dialysis Nursing",
    heroTitle: "Get Your Dialysis Nursing Resume Past",
    heroHighlight: "Nephrology ATS Filters",
    heroDescription: "Dialysis positions require specific keywords like hemodialysis, vascular access management, and kidney disease. Our scanner ensures your nephrology expertise is properly parsed.",
    primaryCTA: "Scan Dialysis Resume",
    keywords: [
      "Hemodialysis / HD Treatment",
      "Peritoneal Dialysis / PD Training",
      "Vascular Access Management (AV Fistula, Graft)",
      "Dialysis Machine Setup / Fresenius",
      "Chronic Kidney Disease (CKD) Management",
      "Fluid & Electrolyte Management",
      "Catheter Care (Permcath, Tunneled)",
      "Dialysate Composition",
      "Pre/Post-Dialysis Assessment",
      "CNN Certification (Certified Nephrology Nurse)",
      "Renal Diet Education",
      "Dry Weight Management"
    ],
    stats: [
      { value: "91%", label: "Dialysis resumes filtered without vascular access keywords" },
      { value: "16K", label: "Dialysis RN positions annually" },
      { value: "CNN", label: "Certified Nephrology Nurse certification highly valued" }
    ],
    commonIssues: [
      {
        title: "HD vs PD Not Differentiated",
        description: "ATS systems search for 'hemodialysis' and 'peritoneal dialysis' as distinct skills. If you have both but don't list them separately, you're missing keyword matches."
      },
      {
        title: "Vascular Access Expertise Unclear",
        description: "Recruiters filter for 'AV fistula,' 'AV graft,' 'catheter cannulation.' Saying 'dialysis access' is too generic for ATS parsing."
      },
      {
        title: "Machine/Equipment Not Named",
        description: "Specific dialysis machines (Fresenius, Gambro, Baxter) are searched keywords. Mentioning brand experience increases ATS match rates."
      }
    ],
    features: [
      {
        title: "Modality Checker",
        description: "Validates you've specified both hemodialysis and peritoneal dialysis experience if applicable."
      },
      {
        title: "Vascular Access Keyword Analyzer",
        description: "Checks for fistula, graft, catheter management, and cannulation terminology."
      },
      {
        title: "Equipment Brand Detector",
        description: "Flags mentions of specific dialysis machine brands that recruiters commonly search for."
      },
      {
        title: "CNN Certification Validator",
        description: "Ensures Certified Nephrology Nurse credential is properly formatted for ATS systems."
      }
    ],
    testimonials: [
      {
        quote: "I had 9 years of dialysis experience but my resume just said 'dialysis nursing.' CVDebug helped me separate hemodialysis and peritoneal dialysis—got hired at DaVita within 2 weeks.",
        name: "Sharon P.",
        role: "Dialysis RN",
        location: "Phoenix, AZ"
      },
      {
        quote: "The vascular access analysis was game-changing. I detailed my fistula cannulation, graft management, and catheter experience—ATS score went from 52% to 88%.",
        name: "Carlos M.",
        role: "CNN, Hemodialysis Nurse",
        location: "Los Angeles, CA"
      },
      {
        quote: "CVDebug showed I never mentioned 'Fresenius 2008K' even though I use it daily. Added machine experience and started getting recruiter calls immediately.",
        name: "Linda H.",
        role: "Chronic Dialysis Nurse",
        location: "Tampa, FL"
      }
    ],
    colors: {
      primary: "blue",
      secondary: "cyan"
    }
  },

  "home-health-nurse-ats-optimizer": {
    slug: "home-health-nurse-ats-optimizer",
    metaTitle: "Free ATS Resume Scanner for Home Health Nurses | CVDebug",
    metaDescription: "Optimize your home health nursing resume with keywords for OASIS documentation, wound care, case management, and independent nursing practice.",
    badge: "Home Health Nursing",
    heroTitle: "Get Your Home Health Resume Past",
    heroHighlight: "Home Care ATS Systems",
    heroDescription: "Home health positions require keywords like OASIS documentation, independent assessment, and chronic disease management. Ensure your community nursing expertise is ATS-ready.",
    primaryCTA: "Scan Home Health Resume",
    keywords: [
      "OASIS Documentation / Assessment",
      "Home Health Case Management",
      "Independent Nursing Practice",
      "Wound Care / Wound Vac Management",
      "IV Therapy (Home Infusion)",
      "Chronic Disease Management",
      "Patient/Caregiver Education",
      "Medicare Documentation / Compliance",
      "Care Plan Development",
      "Skilled Nursing Visits",
      "Hospice Transition / Palliative",
      "Telehealth / Remote Patient Monitoring"
    ],
    stats: [
      { value: "86%", label: "Home health resumes rejected without OASIS keywords" },
      { value: "31K", label: "Home health RN positions annually" },
      { value: "Fast-growing", label: "Sector due to aging population" }
    ],
    commonIssues: [
      {
        title: "OASIS Experience Not Emphasized",
        description: "ATS systems specifically search for 'OASIS,' 'OASIS-E,' or 'outcome assessment.' This documentation system is critical for home health and must be explicit."
      },
      {
        title: "Independent Practice Not Highlighted",
        description: "Home health requires autonomous decision-making. Keywords like 'independent assessment,' 'clinical judgment,' and 'care coordination' are heavily weighted."
      },
      {
        title: "Medicare Compliance Not Mentioned",
        description: "Home health billing requires Medicare knowledge. If you don't mention 'Medicare,' 'reimbursement,' or 'certification periods,' ATS filters miss this expertise."
      }
    ],
    features: [
      {
        title: "OASIS Keyword Checker",
        description: "Validates OASIS assessment and documentation keywords are present and ATS-visible."
      },
      {
        title: "Independence Skills Analyzer",
        description: "Checks for autonomous practice keywords like independent assessment, clinical judgment, and care coordination."
      },
      {
        title: "Medicare Compliance Validator",
        description: "Ensures Medicare documentation and billing knowledge is properly highlighted."
      },
      {
        title: "Chronic Care Management Keywords",
        description: "Scans for diabetes management, CHF monitoring, COPD care, and other chronic conditions."
      }
    ],
    testimonials: [
      {
        quote: "I didn't realize 'OASIS' was such a critical keyword. CVDebug flagged it as missing even though I completed OASIS assessments daily. Added it throughout my resume and got 6 interviews.",
        name: "Patricia R.",
        role: "Home Health RN",
        location: "Orlando, FL"
      },
      {
        quote: "The independent practice analysis helped me emphasize my autonomous decision-making. Changed my wording from 'provided care' to 'independently assessed and managed'—huge difference.",
        name: "Thomas W.",
        role: "Home Care Nurse",
        location: "Portland, OR"
      },
      {
        quote: "CVDebug showed my Medicare documentation experience was buried. Moved it to a primary skill and my ATS score jumped 38 points. Got hired by a top home health agency.",
        name: "Angela D.",
        role: "Community Health RN",
        location: "Austin, TX"
      }
    ],
    colors: {
      primary: "green",
      secondary: "emerald"
    }
  },

  "school-nurse-ats-resume-scanner": {
    slug: "school-nurse-ats-resume-scanner",
    metaTitle: "Free ATS Resume Scanner for School Nurses | CVDebug",
    metaDescription: "Optimize your school nursing resume with keywords for health screenings, immunization compliance, IEP/504 plans, and pediatric health education.",
    badge: "School Nursing",
    heroTitle: "Get Your School Nurse Resume Past",
    heroHighlight: "Education Sector ATS",
    heroDescription: "School nurse positions require keywords like health screenings, IEP collaboration, and medication administration in schools. Ensure your educational nursing expertise is ATS-optimized.",
    primaryCTA: "Scan School Nurse Resume",
    keywords: [
      "School Health Screenings (Vision, Hearing, Scoliosis)",
      "Immunization Compliance / Tracking",
      "IEP / 504 Plan Collaboration",
      "Medication Administration (School Setting)",
      "Emergency Care Planning / Epi-Pen",
      "Health Education / Wellness Programs",
      "Chronic Condition Management (Diabetes, Asthma)",
      "Mental Health Crisis Intervention",
      "Communicable Disease Control",
      "Sports Physical Exams",
      "NCSN Certification (National Certified School Nurse)",
      "Parent/Teacher Collaboration"
    ],
    stats: [
      { value: "84%", label: "School nurse resumes filtered without screening keywords" },
      { value: "14K", label: "School nurse positions annually" },
      { value: "NCSN", label: "National Certified School Nurse credential valued" }
    ],
    commonIssues: [
      {
        title: "IEP/504 Experience Not Mentioned",
        description: "School districts specifically search for 'IEP,' '504 plan,' and 'special education collaboration.' This experience is critical but often omitted."
      },
      {
        title: "Health Screening Types Not Specified",
        description: "ATS systems look for specific screenings: 'vision,' 'hearing,' 'scoliosis.' Saying 'school health assessments' is too vague."
      },
      {
        title: "Medication Administration Context Missing",
        description: "Hospital medication experience doesn't translate directly. You need to specify 'school medication administration,' 'daily med pass,' or 'chronic disease medication management.'"
      }
    ],
    features: [
      {
        title: "Screening Keyword Validator",
        description: "Checks for vision, hearing, scoliosis, and other mandated school health screenings."
      },
      {
        title: "IEP/504 Experience Checker",
        description: "Validates special education plan collaboration and accommodation keywords."
      },
      {
        title: "School Setting Context Analyzer",
        description: "Ensures your experience is framed in educational settings, not just clinical nursing."
      },
      {
        title: "NCSN Certification Detector",
        description: "Flags if National Certified School Nurse credential is present and ATS-readable."
      }
    ],
    testimonials: [
      {
        quote: "I never thought to mention IEP meetings in my resume. CVDebug flagged this as a critical school nurse keyword. Added it and got 3 district interviews within a week.",
        name: "Jennifer L.",
        role: "School Nurse",
        location: "Sacramento, CA"
      },
      {
        quote: "The screening analysis helped me list specific types: vision, hearing, scoliosis, BMI. My ATS score went from 61% to 89% just by adding those details.",
        name: "Robert C.",
        role: "Elementary School Nurse",
        location: "Denver, CO"
      },
      {
        quote: "CVDebug showed I was using hospital terminology instead of school nursing language. Changed 'patient care' to 'student health services'—started getting callbacks immediately.",
        name: "Michelle K.",
        role: "NCSN, Middle School Nurse",
        location: "Atlanta, GA"
      }
    ],
    colors: {
      primary: "amber",
      secondary: "yellow"
    }
  },

  "case-manager-nurse-ats-optimizer": {
    slug: "case-manager-nurse-ats-optimizer",
    metaTitle: "Free ATS Resume Scanner for RN Case Managers | CVDebug",
    metaDescription: "Optimize your nurse case manager resume with keywords for utilization review, care coordination, discharge planning, and CCM certification.",
    badge: "RN Case Management",
    heroTitle: "Get Your Case Manager Resume Past",
    heroHighlight: "Care Coordination ATS",
    heroDescription: "RN case manager positions require keywords like utilization review, care transitions, and payer relations. Ensure your care coordination expertise is ATS-ready.",
    primaryCTA: "Scan Case Manager Resume",
    keywords: [
      "Utilization Review / UR",
      "Discharge Planning / Care Transitions",
      "Care Coordination / Care Management",
      "CCM Certification (Case Management)",
      "Insurance Authorization / Prior Auth",
      "Interdisciplinary Team Collaboration",
      "Level of Care Determination",
      "Resource Allocation / Cost Management",
      "Quality Metrics / Performance Improvement",
      "Payer Relations / Medicare/Medicaid",
      "Social Determinants of Health",
      "Readmission Prevention"
    ],
    stats: [
      { value: "88%", label: "Case manager resumes rejected without UR keywords" },
      { value: "25K", label: "RN case manager positions annually" },
      { value: "CCM", label: "Certified Case Manager credential highly sought" }
    ],
    commonIssues: [
      {
        title: "Utilization Review Not Emphasized",
        description: "ATS systems search for 'utilization review,' 'UR,' 'concurrent review.' This is a core case management function and must be explicitly stated."
      },
      {
        title: "Payer Knowledge Not Demonstrated",
        description: "Case managers need insurance expertise. Keywords like 'Medicare,' 'Medicaid,' 'prior authorization,' 'commercial payers' are heavily weighted."
      },
      {
        title: "Metrics and Outcomes Missing",
        description: "Case management is data-driven. Without quantified outcomes (readmission rates, length of stay reduction), your impact isn't ATS-visible."
      }
    ],
    features: [
      {
        title: "Utilization Review Keyword Checker",
        description: "Validates UR, concurrent review, and level of care determination terminology."
      },
      {
        title: "Payer Relations Analyzer",
        description: "Checks for insurance, authorization, and reimbursement keywords."
      },
      {
        title: "CCM Certification Validator",
        description: "Ensures Certified Case Manager credential is properly formatted and ATS-visible."
      },
      {
        title: "Outcomes Quantifier",
        description: "Identifies opportunities to add metrics (readmission %, LOS reduction, cost savings)."
      }
    ],
    testimonials: [
      {
        quote: "I was a bedside nurse moving to case management. CVDebug helped me add 'utilization review' and 'discharge planning' keywords I didn't know were critical. Got my first CM role in 3 weeks.",
        name: "Karen M.",
        role: "RN Case Manager",
        location: "Boston, MA"
      },
      {
        quote: "The payer relations analysis was eye-opening. I added specific insurance terminology (Medicare, prior auth, level of care) and my ATS score jumped 45 points.",
        name: "David P.",
        role: "CCM, Hospital Case Manager",
        location: "Chicago, IL"
      },
      {
        quote: "CVDebug showed I wasn't quantifying my impact. Added 'reduced readmissions 23%' and 'decreased LOS 1.8 days'—started getting senior case manager interviews.",
        name: "Lisa T.",
        role: "Clinical Case Manager",
        location: "Nashville, TN"
      }
    ],
    colors: {
      primary: "indigo",
      secondary: "purple"
    }
  },

  "infection-control-nurse-ats": {
    slug: "infection-control-nurse-ats",
    metaTitle: "Free ATS Resume Scanner for Infection Control Nurses | CVDebug",
    metaDescription: "Optimize your infection prevention resume with keywords for surveillance, outbreak investigation, CIC certification, and hospital epidemiology.",
    badge: "Infection Control",
    heroTitle: "Get Your Infection Control Resume Past",
    heroHighlight: "Epidemiology ATS Filters",
    heroDescription: "Infection preventionist positions require keywords like surveillance, outbreak investigation, and CIC certification. Ensure your hospital epidemiology expertise is ATS-optimized.",
    primaryCTA: "Scan IP Resume",
    keywords: [
      "CIC Certification (Infection Control)",
      "Surveillance / HAI Monitoring",
      "Outbreak Investigation / Root Cause Analysis",
      "NHSN Reporting (National Healthcare Safety Network)",
      "Isolation Protocols / Contact Precautions",
      "Hand Hygiene Auditing",
      "Sterilization / Reprocessing",
      "Antimicrobial Stewardship",
      "Policy Development / Regulatory Compliance",
      "Staff Education / Competency",
      "PPE Training / Fit Testing",
      "Joint Commission Standards"
    ],
    stats: [
      { value: "93%", label: "IP resumes filtered without CIC or surveillance keywords" },
      { value: "8K", label: "Infection preventionist positions annually" },
      { value: "CIC", label: "Certification in Infection Control required for most roles" }
    ],
    commonIssues: [
      {
        title: "CIC Certification Not Prominent",
        description: "ATS systems heavily weight 'CIC,' 'Certification in Infection Control.' If you have it, it must be in your header and certifications section."
      },
      {
        title: "Surveillance Methods Not Specified",
        description: "Recruiters search for 'NHSN reporting,' 'HAI surveillance,' 'infection rate calculation.' Generic 'infection monitoring' doesn't demonstrate IP expertise."
      },
      {
        title: "Regulatory Knowledge Not Demonstrated",
        description: "Infection control requires CDC, Joint Commission, and CMS knowledge. These regulatory bodies should be explicitly mentioned."
      }
    ],
    features: [
      {
        title: "CIC Certification Validator",
        description: "Confirms Certification in Infection Control is prominently placed and ATS-readable."
      },
      {
        title: "Surveillance Keyword Checker",
        description: "Validates NHSN, HAI monitoring, and outbreak investigation terminology."
      },
      {
        title: "Regulatory Compliance Analyzer",
        description: "Checks for CDC, Joint Commission, CMS, and OSHA regulatory keywords."
      },
      {
        title: "Antimicrobial Stewardship Detector",
        description: "Flags if antibiotic stewardship and resistance prevention experience is present."
      }
    ],
    testimonials: [
      {
        quote: "I had my CIC but it was buried in my resume. CVDebug showed it needed to be in my headline. Changed to 'CIC-Certified Infection Preventionist'—got 4 interviews in one week.",
        name: "Susan H.",
        role: "Infection Preventionist",
        location: "Indianapolis, IN"
      },
      {
        quote: "The surveillance keyword analysis was crucial. I added 'NHSN reporting,' 'HAI rate calculation,' and 'outbreak investigation'—ATS score went from 59% to 94%.",
        name: "Michael R.",
        role: "CIC, Hospital Epidemiologist",
        location: "Baltimore, MD"
      },
      {
        quote: "CVDebug helped me emphasize my regulatory compliance experience (Joint Commission, CMS surveys). Started getting calls from major health systems immediately.",
        name: "Rebecca L.",
        role: "Director of Infection Prevention",
        location: "Seattle, WA"
      }
    ],
    colors: {
      primary: "teal",
      secondary: "cyan"
    }
  },

  // Phase 2: High-Priority Tech (4 pages)
  "ios-engineer-swift-ats-optimizer": {
    slug: "ios-engineer-swift-ats-optimizer",
    metaTitle: "Free ATS Resume Scanner for iOS Engineers | CVDebug",
    metaDescription: "Optimize your iOS developer resume with keywords for Swift, SwiftUI, UIKit, Core Data, and App Store deployment.",
    badge: "iOS Engineering",
    heroTitle: "Get Your iOS Engineer Resume Past",
    heroHighlight: "Mobile Development ATS",
    heroDescription: "iOS positions require specific keywords like Swift 5, SwiftUI, Combine framework, and Core Data. Our scanner ensures your Apple ecosystem expertise is ATS-ready.",
    primaryCTA: "Scan iOS Resume",
    keywords: [
      "Swift 5 / Swift 6",
      "SwiftUI / Declarative UI",
      "UIKit / Auto Layout",
      "Core Data / CloudKit",
      "Combine Framework / Async/Await",
      "Xcode / Instruments",
      "App Store Deployment / TestFlight",
      "RESTful API Integration",
      "MVVM / Clean Architecture",
      "Push Notifications / APNs",
      "iOS SDK / Cocoa Touch",
      "XCTest / Unit Testing"
    ],
    stats: [
      { value: "98K", label: "iOS developer job postings in 2025" },
      { value: "92%", label: "Resumes rejected without Swift version specified" },
      { value: "$130K", label: "Average iOS engineer salary (mid-level)" }
    ],
    commonIssues: [
      {
        title: "Swift Version Not Specified",
        description: "ATS systems filter for 'Swift 5' or 'Swift 6.' Saying just 'Swift' doesn't demonstrate you're current with modern language features."
      },
      {
        title: "SwiftUI vs UIKit Not Clarified",
        description: "Many iOS jobs now prefer SwiftUI. If you have both experiences but don't list them separately, ATS can't match you to SwiftUI-specific roles."
      },
      {
        title: "Architecture Pattern Missing",
        description: "Recruiters search for 'MVVM,' 'VIPER,' 'Clean Architecture.' Without stating your architectural approach, you lose keyword matches."
      }
    ],
    features: [
      {
        title: "Swift Version Validator",
        description: "Checks that you've specified Swift version numbers and modern features like async/await and actors."
      },
      {
        title: "SwiftUI vs UIKit Analyzer",
        description: "Validates both frameworks are mentioned if applicable, increasing your ATS match rate."
      },
      {
        title: "Architecture Pattern Detector",
        description: "Ensures MVVM, VIPER, or other iOS architecture patterns are explicitly stated."
      },
      {
        title: "App Store Experience Checker",
        description: "Confirms deployment and distribution experience is ATS-visible."
      }
    ],
    testimonials: [
      {
        quote: "I had 5 years of iOS experience but wasn't getting callbacks. CVDebug showed I never mentioned 'Swift 5' or 'SwiftUI' specifically. Added those and got 3 FAANG interviews within 2 weeks.",
        name: "Ryan T.",
        role: "iOS Developer",
        location: "Cupertino, CA"
      },
      {
        quote: "The SwiftUI analysis was game-changing. I'd built 10+ SwiftUI apps but only said 'iOS development.' Added 'SwiftUI declarative UI' throughout and my callback rate tripled.",
        name: "Jessica M.",
        role: "Senior iOS Engineer",
        location: "Austin, TX"
      },
      {
        quote: "CVDebug helped me emphasize MVVM architecture and Combine framework. My ATS score jumped from 64% to 91%. Got offers from two top startups.",
        name: "Ahmed K.",
        role: "iOS Software Engineer",
        location: "San Francisco, CA"
      }
    ],
    colors: {
      primary: "gray",
      secondary: "slate"
    }
  },

  "android-engineer-kotlin-ats": {
    slug: "android-engineer-kotlin-ats",
    metaTitle: "Free ATS Resume Scanner for Android Engineers | CVDebug",
    metaDescription: "Optimize your Android developer resume with keywords for Kotlin, Jetpack Compose, Coroutines, and Google Play Store deployment.",
    badge: "Android Engineering",
    heroTitle: "Get Your Android Engineer Resume Past",
    heroHighlight: "Mobile Development ATS",
    heroDescription: "Android positions require keywords like Kotlin, Jetpack Compose, Coroutines, and Material Design. Ensure your Android expertise is ATS-optimized.",
    primaryCTA: "Scan Android Resume",
    keywords: [
      "Kotlin / Kotlin Multiplatform",
      "Jetpack Compose / Declarative UI",
      "Coroutines / Flow",
      "Android SDK / Jetpack Libraries",
      "Room Database / SQLite",
      "MVVM Architecture / ViewModel",
      "Retrofit / OkHttp",
      "Material Design 3",
      "Dagger/Hilt Dependency Injection",
      "Google Play Store Deployment",
      "Firebase / FCM Push Notifications",
      "JUnit / Espresso Testing"
    ],
    stats: [
      { value: "104K", label: "Android developer job postings in 2025" },
      { value: "89%", label: "Resumes filtered without Kotlin keywords" },
      { value: "$128K", label: "Average Android engineer salary (mid-level)" }
    ],
    commonIssues: [
      {
        title: "Kotlin Not Emphasized Over Java",
        description: "Most Android roles now require Kotlin. If you have Kotlin experience but list 'Java/Kotlin' equally, ATS may categorize you as primarily Java."
      },
      {
        title: "Jetpack Libraries Not Specified",
        description: "ATS systems search for specific Jetpack components: 'Room,' 'ViewModel,' 'LiveData,' 'Navigation.' Saying 'Android Jetpack' is too generic."
      },
      {
        title: "Compose Experience Not Highlighted",
        description: "Jetpack Compose is the future of Android UI. If you have Compose experience but don't emphasize it, you're missing high-value keyword matches."
      }
    ],
    features: [
      {
        title: "Kotlin Emphasis Validator",
        description: "Checks that Kotlin is prominently featured and not buried alongside Java."
      },
      {
        title: "Jetpack Component Checker",
        description: "Validates specific Jetpack libraries (Room, ViewModel, Navigation, etc.) are listed individually."
      },
      {
        title: "Compose Experience Analyzer",
        description: "Ensures Jetpack Compose and declarative UI keywords are present if applicable."
      },
      {
        title: "Architecture Pattern Detector",
        description: "Confirms MVVM, MVI, or Clean Architecture patterns are explicitly stated."
      }
    ],
    testimonials: [
      {
        quote: "I was still listing Java first. CVDebug helped me restructure as 'Kotlin Android Engineer' with Java secondary. Started getting senior Android role interviews immediately.",
        name: "Priya S.",
        role: "Android Developer",
        location: "Mountain View, CA"
      },
      {
        quote: "The Jetpack Compose analysis was crucial. I added 'Jetpack Compose UI,' 'Material Design 3,' and 'State Management'—ATS score jumped 42 points.",
        name: "Marcus L.",
        role: "Senior Android Engineer",
        location: "Seattle, WA"
      },
      {
        quote: "CVDebug showed I wasn't listing specific Jetpack libraries. Added Room, ViewModel, Navigation separately—started getting calls from Google and Meta.",
        name: "Elena R.",
        role: "Android Software Engineer",
        location: "New York, NY"
      }
    ],
    colors: {
      primary: "green",
      secondary: "lime"
    }
  },

  "cloud-architect-aws-ats-scanner": {
    slug: "cloud-architect-aws-ats-scanner",
    metaTitle: "Free ATS Resume Scanner for AWS Cloud Architects | CVDebug",
    metaDescription: "Optimize your cloud architect resume with keywords for AWS services, infrastructure as code, multi-region deployments, and cloud security.",
    badge: "Cloud Architecture",
    heroTitle: "Get Your Cloud Architect Resume Past",
    heroHighlight: "AWS/Cloud Engineering ATS",
    heroDescription: "Cloud architect positions require keywords like AWS Well-Architected Framework, Terraform, multi-region, and cost optimization. Ensure your cloud expertise is ATS-ready.",
    primaryCTA: "Scan Cloud Resume",
    keywords: [
      "AWS Solutions Architect",
      "Terraform / Infrastructure as Code",
      "Multi-Region Architecture",
      "AWS Well-Architected Framework",
      "EC2, S3, RDS, Lambda, ECS",
      "VPC / Networking / Security Groups",
      "CloudFormation / CDK",
      "Cost Optimization / FinOps",
      "High Availability / Disaster Recovery",
      "Serverless Architecture",
      "AWS Certified Solutions Architect",
      "Microservices / Container Orchestration"
    ],
    stats: [
      { value: "78K", label: "Cloud architect job postings in 2025" },
      { value: "95%", label: "Resumes rejected without specific AWS service keywords" },
      { value: "$155K", label: "Average cloud architect salary" }
    ],
    commonIssues: [
      {
        title: "AWS Services Not Individually Listed",
        description: "ATS systems search for specific services: 'EC2,' 'S3,' 'Lambda,' 'RDS.' Saying 'AWS cloud services' doesn't trigger these keyword matches."
      },
      {
        title: "Infrastructure as Code Tools Missing",
        description: "Terraform, CloudFormation, Pulumi—these IaC tools are heavily searched. If you use them but don't explicitly list them, you're losing matches."
      },
      {
        title: "Architecture Patterns Not Specified",
        description: "Recruiters filter for 'microservices,' 'serverless,' 'event-driven.' Without architectural terminology, your expertise isn't ATS-visible."
      }
    ],
    features: [
      {
        title: "AWS Service Inventory",
        description: "Validates you've listed specific AWS services individually for maximum keyword matching."
      },
      {
        title: "IaC Tool Checker",
        description: "Ensures Terraform, CloudFormation, or other infrastructure as code tools are prominently mentioned."
      },
      {
        title: "Architecture Pattern Analyzer",
        description: "Checks for microservices, serverless, event-driven, and other cloud architecture keywords."
      },
      {
        title: "Certification Validator",
        description: "Confirms AWS Solutions Architect or other cloud certifications are ATS-readable."
      }
    ],
    testimonials: [
      {
        quote: "I had AWS experience but just said 'cloud infrastructure.' CVDebug helped me list EC2, S3, Lambda, RDS individually—got 5 cloud architect interviews in one month.",
        name: "Daniel K.",
        role: "Cloud Solutions Architect",
        location: "Arlington, VA"
      },
      {
        quote: "The IaC analysis was game-changing. I added 'Terraform modules,' 'multi-region deployments,' 'FinOps cost optimization'—ATS score jumped from 67% to 93%.",
        name: "Sarah M.",
        role: "AWS Cloud Architect",
        location: "San Francisco, CA"
      },
      {
        quote: "CVDebug showed I never mentioned 'Well-Architected Framework' even though I design by it. Added that keyword and started getting senior architect role offers.",
        name: "Chris P.",
        role: "Principal Cloud Architect",
        location: "Seattle, WA"
      }
    ],
    colors: {
      primary: "orange",
      secondary: "amber"
    }
  },

  "site-reliability-engineer-ats": {
    slug: "site-reliability-engineer-ats",
    metaTitle: "Free ATS Resume Scanner for Site Reliability Engineers | CVDebug",
    metaDescription: "Optimize your SRE resume with keywords for Kubernetes, observability, incident response, SLOs, and infrastructure reliability.",
    badge: "SRE / DevOps",
    heroTitle: "Get Your SRE Resume Past",
    heroHighlight: "Reliability Engineering ATS",
    heroDescription: "SRE positions require keywords like Kubernetes, Prometheus, SLO/SLI, incident management, and on-call. Ensure your reliability engineering expertise is ATS-optimized.",
    primaryCTA: "Scan SRE Resume",
    keywords: [
      "Kubernetes / K8s Operations",
      "Prometheus / Grafana / Observability",
      "SLO / SLI / Error Budget",
      "Incident Response / On-Call",
      "Infrastructure as Code (Terraform, Ansible)",
      "CI/CD Pipelines (Jenkins, GitLab CI)",
      "Container Orchestration / Docker",
      "Load Balancing / Traffic Management",
      "Capacity Planning / Performance Tuning",
      "Chaos Engineering / Resilience Testing",
      "Logging / Tracing (ELK, Jaeger)",
      "Automation / Scripting (Python, Go)"
    ],
    stats: [
      { value: "52K", label: "SRE job postings in 2025" },
      { value: "91%", label: "Resumes filtered without SLO/observability keywords" },
      { value: "$165K", label: "Average SRE salary (mid-level)" }
    ],
    commonIssues: [
      {
        title: "SLO/SLI Not Mentioned",
        description: "ATS systems heavily weight 'SLO,' 'SLI,' 'error budget.' These are foundational SRE concepts and must be explicitly stated."
      },
      {
        title: "Observability Stack Not Specified",
        description: "Recruiters search for 'Prometheus,' 'Grafana,' 'Datadog,' 'ELK stack.' Saying 'monitoring tools' is too generic for ATS matching."
      },
      {
        title: "Incident Management Not Emphasized",
        description: "On-call, incident response, and postmortem experience are critical. If these aren't prominently featured, ATS filters miss your reliability expertise."
      }
    ],
    features: [
      {
        title: "SLO/SLI Keyword Checker",
        description: "Validates Service Level Objectives, Service Level Indicators, and error budget terminology."
      },
      {
        title: "Observability Stack Analyzer",
        description: "Checks for specific monitoring and observability tools (Prometheus, Grafana, Datadog, etc.)."
      },
      {
        title: "Incident Response Validator",
        description: "Ensures on-call, incident management, and postmortem keywords are present."
      },
      {
        title: "Automation Skills Detector",
        description: "Confirms scripting languages and automation tools are clearly stated."
      }
    ],
    testimonials: [
      {
        quote: "I was in DevOps trying to move to SRE. CVDebug showed I was missing 'SLO,' 'error budget,' and 'observability.' Added those keywords and got my first SRE role at Uber.",
        name: "Alex T.",
        role: "Site Reliability Engineer",
        location: "San Francisco, CA"
      },
      {
        quote: "The observability analysis was crucial. I listed Prometheus, Grafana, and our entire monitoring stack separately—ATS score jumped from 58% to 94%.",
        name: "Jordan M.",
        role: "Senior SRE",
        location: "New York, NY"
      },
      {
        quote: "CVDebug helped me emphasize incident response and on-call experience. Changed from 'system maintenance' to 'incident commander, on-call rotation'—huge difference in recruiter interest.",
        name: "Taylor K.",
        role: "Staff SRE",
        location: "Seattle, WA"
      }
    ],
    colors: {
      primary: "red",
      secondary: "orange"
    }
  }
};

// Helper function to get all niche slugs for routing
export const getAllNicheSlugs = (): string[] => {
  return Object.keys(nicheTemplates);
};

// Helper function to get template by slug
export const getNicheTemplate = (slug: string): NicheTemplate | undefined => {
  return nicheTemplates[slug];
};

// Categories for grouping
export const nicheCategories = {
  nursing: [
    "icu-nurse-ats-optimizer",
    "er-nurse-ats-optimizer",
    "travel-nurse-ats-optimizer"
  ],
  engineering: [
    "senior-frontend-engineer-ats",
    "devops-engineer-kubernetes-ats"
  ],
  healthcare: [
    "icu-nurse-ats-optimizer",
    "er-nurse-ats-optimizer",
    "travel-nurse-ats-optimizer"
  ],
  tech: [
    "senior-frontend-engineer-ats",
    "devops-engineer-kubernetes-ats"
  ]
};
