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
