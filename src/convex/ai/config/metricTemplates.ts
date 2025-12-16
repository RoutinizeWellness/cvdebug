// Role-specific metric suggestion templates
export interface MetricTemplate {
  tech: string;
  metrics: string[];
}

export const engineeringMetrics: MetricTemplate[] = [
  {
    tech: "Structural Design",
    metrics: [
      "Designed [X-story], [Y m²/ft²] [material] building using [IBC/ASCE/Eurocode] and [ETABS/SAP2000], reducing material cost by Z%",
      "Optimized structural system for [project type], achieving [X%] cost savings while meeting [seismic/wind] requirements",
      "Analyzed and designed [X] structures totaling [Y m²], ensuring compliance with [code] and achieving [Z%] efficiency gain"
    ]
  },
  {
    tech: "Project Delivery",
    metrics: [
      "Managed [X] projects with combined budget of $[Y]M, delivering [Z%] on-time and under budget",
      "Coordinated with [X] stakeholders across [Y] disciplines, reducing design conflicts by [Z%]",
      "Implemented [BIM/VDC] workflow, reducing coordination issues by [X%] and saving [Y] hours"
    ]
  }
];

export const softwareEngineeringMetrics: MetricTemplate[] = [
  {
    tech: "Backend Development",
    metrics: [
      "Built [system/API] serving [X]M users/requests daily using [tech stack], improving response time by [Y%]",
      "Optimized database queries reducing latency by [X%] and increasing throughput to [Y] requests/sec",
      "Architected microservices processing [X] TB/records daily, achieving [Y%] uptime and [Z%] cost reduction"
    ]
  },
  {
    tech: "Frontend Development",
    metrics: [
      "Developed [feature/app] using [React/Angular/Vue], improving user engagement by [X%] and reducing bounce rate by [Y%]",
      "Optimized bundle size by [X%] and page load time by [Y]ms, increasing conversion rate by [Z%]",
      "Implemented responsive design serving [X]M users across [Y] devices, achieving [Z%] satisfaction score"
    ]
  }
];

export const marketingMetrics: MetricTemplate[] = [
  {
    tech: "Digital Marketing",
    metrics: [
      "Increased conversion rate by [X%] through [campaign/strategy], generating $[Y]K in revenue with [Z%] ROI",
      "Grew organic traffic by [X%] using SEO optimization, resulting in [Y] new leads per month at $[Z] CAC",
      "Achieved [X%] ROI on [platform] campaigns with $[Y]K budget, reducing CPC by [Z%] and increasing CTR to [W%]"
    ]
  },
  {
    tech: "Content & Social",
    metrics: [
      "Created [X] pieces of content generating [Y]K views and [Z]K engagements, increasing brand awareness by [W%]",
      "Grew social media following by [X%] to [Y]K followers, achieving [Z%] engagement rate",
      "Launched email campaigns with [X%] open rate and [Y%] CTR, generating $[Z]K in revenue"
    ]
  }
];

export const productManagementMetrics: MetricTemplate[] = [
  {
    tech: "Product Strategy",
    metrics: [
      "Launched [X] features serving [Y]M users, increasing retention by [Z%] and reducing churn by [W%]",
      "Defined product roadmap for [X] quarters, delivering [Y] releases and achieving [Z%] of OKRs",
      "Conducted [X] user interviews and [Y] A/B tests, improving [metric] by [Z%]"
    ]
  },
  {
    tech: "Stakeholder Management",
    metrics: [
      "Coordinated with [X] cross-functional teams ([Y] engineers, [Z] designers), delivering [W] projects on time",
      "Presented to [X] executives and [Y] stakeholders, securing $[Z]M budget for [initiative]",
      "Managed backlog of [X] stories across [Y] sprints, achieving [Z%] velocity and [W%] predictability"
    ]
  }
];

export const dataScienceMetrics: MetricTemplate[] = [
  {
    tech: "Machine Learning",
    metrics: [
      "Built [model type] achieving [X%] accuracy on [Y]M records, improving [business metric] by [Z%]",
      "Deployed predictive model processing [X] TB data, reducing [cost/time] by [Y%] and increasing [metric] by [Z%]",
      "Implemented [algorithm] for [use case], achieving [X%] precision and [Y%] recall on [Z]K samples"
    ]
  },
  {
    tech: "Data Analytics",
    metrics: [
      "Analyzed [X] TB of data using [SQL/Python/R], identifying insights that increased revenue by $[Y]M",
      "Created [X] dashboards in [Tableau/Power BI] serving [Y] stakeholders, reducing reporting time by [Z%]",
      "Conducted [X] statistical analyses revealing [Y] opportunities, resulting in $[Z]K savings"
    ]
  }
];

export const generalMetrics: MetricTemplate[] = [
  {
    tech: "General Achievements",
    metrics: [
      "Led [X] projects/initiatives resulting in [Y%] improvement in [metric] and $[Z]K impact",
      "Managed team of [X] people delivering [Y] projects, achieving [Z%] on-time delivery rate",
      "Implemented [process/system] reducing [cost/time] by [X%] and improving [metric] by [Y%]"
    ]
  }
];

export function getMetricsForCategory(category: string): MetricTemplate[] {
  switch (category) {
    case "Engineering":
      return engineeringMetrics;
    case "Software Engineering":
      return softwareEngineeringMetrics;
    case "Marketing":
      return marketingMetrics;
    case "Product Management":
      return productManagementMetrics;
    case "Data Science":
      return dataScienceMetrics;
    default:
      return generalMetrics;
  }
}
