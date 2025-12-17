// Role-specific metric suggestion templates
export interface MetricTemplate {
  tech: string;
  currentUsage?: string;
  metrics: string[];
  examples: string[];
  impact: string;
}

export const engineeringMetrics: MetricTemplate[] = [
  {
    tech: "Structural Design",
    metrics: [
      "Designed [X-story], [Y m²/ft²] [material] building using [IBC/ASCE/Eurocode] and [ETABS/SAP2000], reducing material cost by Z%",
      "Optimized structural system for [project type], achieving [X%] cost savings while meeting [seismic/wind] requirements",
      "Analyzed and designed [X] structures totaling [Y m²], ensuring compliance with [code] and achieving [Z%] efficiency gain"
    ],
    examples: [
      "Designed 12-story, 15,000 m² steel-frame office building using IBC 2018 and ETABS, reducing material cost by 18%",
      "Optimized post-tensioned slab system for residential tower, achieving 22% cost savings while meeting seismic Zone 4 requirements"
    ],
    impact: "Demonstrates project scale, technical expertise, and business value through cost optimization"
  },
  {
    tech: "Project Delivery",
    metrics: [
      "Managed [X] projects with combined budget of $[Y]M, delivering [Z%] on-time and under budget",
      "Coordinated with [X] stakeholders across [Y] disciplines, reducing design conflicts by [Z%]",
      "Implemented [BIM/VDC] workflow, reducing coordination issues by [X%] and saving [Y] hours"
    ],
    examples: [
      "Managed 8 projects with combined budget of $45M, delivering 95% on-time and 12% under budget",
      "Implemented BIM workflow across 5 disciplines, reducing coordination issues by 60% and saving 200+ hours"
    ],
    impact: "Shows leadership, coordination skills, and process improvement capabilities"
  }
];

export const softwareEngineeringMetrics: MetricTemplate[] = [
  {
    tech: "Backend Development",
    metrics: [
      "Built [system/API] serving [X]M users/requests daily using [tech stack], improving response time by [Y%]",
      "Optimized database queries reducing latency by [X%] and increasing throughput to [Y] requests/sec",
      "Architected microservices processing [X] TB/records daily, achieving [Y%] uptime and [Z%] cost reduction"
    ],
    examples: [
      "Built REST API serving 5M requests daily using Node.js/PostgreSQL, improving response time by 45%",
      "Architected microservices processing 2TB daily, achieving 99.95% uptime and 30% AWS cost reduction"
    ],
    impact: "Demonstrates scale, performance optimization, and system design expertise"
  },
  {
    tech: "Frontend Development",
    metrics: [
      "Developed [feature/app] using [React/Angular/Vue], improving user engagement by [X%] and reducing bounce rate by [Y%]",
      "Optimized bundle size by [X%] and page load time by [Y]ms, increasing conversion rate by [Z%]",
      "Implemented responsive design serving [X]M users across [Y] devices, achieving [Z%] satisfaction score"
    ],
    examples: [
      "Developed checkout flow using React/TypeScript, improving conversion by 28% and reducing cart abandonment by 35%",
      "Optimized bundle size by 60% and page load time by 1.2s, increasing mobile conversion rate by 18%"
    ],
    impact: "Shows user-centric development and measurable business impact"
  }
];

export const marketingMetrics: MetricTemplate[] = [
  {
    tech: "Digital Marketing",
    metrics: [
      "Increased conversion rate by [X%] through [campaign/strategy], generating $[Y]K in revenue with [Z%] ROI",
      "Grew organic traffic by [X%] using SEO optimization, resulting in [Y] new leads per month at $[Z] CAC",
      "Achieved [X%] ROI on [platform] campaigns with $[Y]K budget, reducing CPC by [Z%] and increasing CTR to [W%]"
    ],
    examples: [
      "Increased conversion rate by 42% through A/B testing and personalization, generating $280K in revenue with 340% ROI",
      "Grew organic traffic by 156% using technical SEO and content strategy, resulting in 450 new leads/month at $12 CAC"
    ],
    impact: "Demonstrates data-driven marketing and clear ROI measurement"
  },
  {
    tech: "Content & Social",
    metrics: [
      "Created [X] pieces of content generating [Y]K views and [Z]K engagements, increasing brand awareness by [W%]",
      "Grew social media following by [X%] to [Y]K followers, achieving [Z%] engagement rate",
      "Launched email campaigns with [X%] open rate and [Y%] CTR, generating $[Z]K in revenue"
    ],
    examples: [
      "Created 24 blog posts generating 180K views and 12K engagements, increasing brand awareness by 67%",
      "Launched email nurture campaign with 38% open rate and 8.2% CTR, generating $95K in pipeline"
    ],
    impact: "Shows content creation skills and audience engagement metrics"
  }
];

export const productManagementMetrics: MetricTemplate[] = [
  {
    tech: "Product Strategy",
    metrics: [
      "Launched [X] features serving [Y]M users, increasing retention by [Z%] and reducing churn by [W%]",
      "Defined product roadmap for [X] quarters, delivering [Y] releases and achieving [Z%] of OKRs",
      "Conducted [X] user interviews and [Y] A/B tests, improving [metric] by [Z%]"
    ],
    examples: [
      "Launched 5 features serving 2.3M users, increasing 30-day retention by 24% and reducing churn by 15%",
      "Conducted 45 user interviews and 12 A/B tests, improving onboarding completion by 38%"
    ],
    impact: "Demonstrates user-centric product development and data-driven decision making"
  },
  {
    tech: "Stakeholder Management",
    metrics: [
      "Coordinated with [X] cross-functional teams ([Y] engineers, [Z] designers), delivering [W] projects on time",
      "Presented to [X] executives and [Y] stakeholders, securing $[Z]M budget for [initiative]",
      "Managed backlog of [X] stories across [Y] sprints, achieving [Z%] velocity and [W%] predictability"
    ],
    examples: [
      "Coordinated with 4 cross-functional teams (12 engineers, 3 designers), delivering 8 projects on time with 95% stakeholder satisfaction",
      "Presented to C-suite and 15 stakeholders, securing $2.5M budget for mobile app rebuild"
    ],
    impact: "Shows leadership, communication, and execution capabilities"
  }
];

export const dataScienceMetrics: MetricTemplate[] = [
  {
    tech: "Machine Learning",
    metrics: [
      "Built [model type] achieving [X%] accuracy on [Y]M records, improving [business metric] by [Z%]",
      "Deployed predictive model processing [X] TB data, reducing [cost/time] by [Y%] and increasing [metric] by [Z%]",
      "Implemented [algorithm] for [use case], achieving [X%] precision and [Y%] recall on [Z]K samples"
    ],
    examples: [
      "Built XGBoost classification model achieving 94% accuracy on 5M records, improving fraud detection by 67%",
      "Deployed recommendation engine processing 8TB data, reducing churn by 23% and increasing LTV by $180"
    ],
    impact: "Demonstrates ML expertise, model performance, and business impact"
  },
  {
    tech: "Data Analytics",
    metrics: [
      "Analyzed [X] TB of data using [SQL/Python/R], identifying insights that increased revenue by $[Y]M",
      "Created [X] dashboards in [Tableau/Power BI] serving [Y] stakeholders, reducing reporting time by [Z%]",
      "Conducted [X] statistical analyses revealing [Y] opportunities, resulting in $[Z]K savings"
    ],
    examples: [
      "Analyzed 12TB of customer data using Python/SQL, identifying insights that increased revenue by $4.2M",
      "Created 8 executive dashboards in Tableau serving 50+ stakeholders, reducing reporting time by 75%"
    ],
    impact: "Shows analytical skills, data visualization, and business value creation"
  }
];

export const generalMetrics: MetricTemplate[] = [
  {
    tech: "General Achievements",
    metrics: [
      "Led [X] projects/initiatives resulting in [Y%] improvement in [metric] and $[Z]K impact",
      "Managed team of [X] people delivering [Y] projects, achieving [Z%] on-time delivery rate",
      "Implemented [process/system] reducing [cost/time] by [X%] and improving [metric] by [Y%]"
    ],
    examples: [
      "Led 6 process improvement initiatives resulting in 35% efficiency gain and $450K annual savings",
      "Managed team of 8 delivering 12 projects, achieving 92% on-time delivery rate and 4.8/5 stakeholder satisfaction"
    ],
    impact: "Demonstrates leadership, project management, and measurable results"
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

// NEW: Generate specific metric suggestions based on resume content
export function generateSmartMetricSuggestions(
  ocrText: string,
  category: string,
  foundKeywords: Array<{keyword: string, frequency: number}>
): Array<{
  tech: string;
  currentUsage: string;
  suggestedMetric: string;
  example: string;
  impact: string;
}> {
  const templates = getMetricsForCategory(category);
  const suggestions: Array<{
    tech: string;
    currentUsage: string;
    suggestedMetric: string;
    example: string;
    impact: string;
  }> = [];

  // Find keywords that lack metrics
  foundKeywords.forEach(kw => {
    const keyword = kw.keyword.toLowerCase();
    
    // Check if keyword is mentioned without metrics
    const hasMetrics = /\d+%|\$\d+|\d+x|\d+\s*(million|billion|thousand|users|customers)/i.test(
      ocrText.substring(ocrText.toLowerCase().indexOf(keyword), ocrText.toLowerCase().indexOf(keyword) + 200)
    );

    if (!hasMetrics) {
      // Find matching template
      const matchingTemplate = templates.find(t => 
        t.tech.toLowerCase().includes(keyword) || keyword.includes(t.tech.toLowerCase())
      );

      if (matchingTemplate) {
        suggestions.push({
          tech: kw.keyword,
          currentUsage: `Mentioned ${kw.frequency} time(s) without quantifiable metrics`,
          suggestedMetric: matchingTemplate.metrics[0],
          example: matchingTemplate.examples[0],
          impact: matchingTemplate.impact
        });
      }
    }
  });

  return suggestions.slice(0, 5); // Return top 5 suggestions
}