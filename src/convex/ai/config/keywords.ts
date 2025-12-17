// Industry-specific keyword databases for ML-based resume analysis
export const techKeywords = [
  "javascript", "python", "java", "react", "node", "sql", "aws", "docker",
  "kubernetes", "typescript", "angular", "vue", "mongodb", "postgresql",
  "git", "ci/cd", "agile", "scrum", "api", "rest", "graphql", "microservices",
  "machine learning", "ml", "ai", "tensorflow", "pytorch", "data science",
  "redux", "webpack", "babel", "jest", "cypress", "jenkins", "terraform",
  "ansible", "prometheus", "grafana", "elasticsearch", "redis", "kafka",
  "spark", "hadoop", "pandas", "numpy", "scikit-learn", "keras", "nlp",
  "next.js", "express", "fastapi", "django", "flask", "spring boot",
  "azure", "gcp", "lambda", "ec2", "s3", "cloudformation", "helm",
  "nginx", "apache", "linux", "bash", "shell scripting", "powershell"
];

export const engineeringKeywords = [
  "structural", "civil", "mechanical", "design", "cad", "autocad", "revit",
  "etabs", "sap2000", "staad", "tekla", "ibc", "asce", "eurocode", "seismic",
  "steel", "concrete", "wood", "foundation", "lateral", "gravity",
  "risa", "ram", "safe", "aisc", "aci", "aashto", "lrfd", "asd",
  "finite element", "fem", "structural analysis", "load calculation",
  "wind load", "snow load", "dead load", "live load", "moment frame",
  "shear wall", "braced frame", "composite", "prestressed", "post-tensioned",
  "geotechnical", "soil mechanics", "retaining wall", "pile foundation",
  "hvac", "piping", "solidworks", "catia", "ansys", "cfd", "thermodynamics",
  "bluebeam", "mathcad", "civil 3d", "microstation", "hec-ras", "arcgis", "qgis",
  "primavera", "procore", "bluebeam revu", "navisworks", "sketchup", "rhino",
  "grasshopper", "dynamo", "leed", "well ap", "osha", "pe license", "eit"
];

export const marketingKeywords = [
  "seo", "sem", "google analytics", "facebook ads", "content marketing",
  "email marketing", "social media", "conversion", "roi", "ctr", "cpc",
  "google ads", "linkedin ads", "marketing automation", "hubspot", "salesforce",
  "a/b testing", "funnel optimization", "lead generation", "crm", "kpi",
  "brand strategy", "copywriting", "ppc", "display ads", "retargeting",
  "instagram ads", "tiktok ads", "influencer marketing", "affiliate marketing",
  "marketing analytics", "customer acquisition", "customer retention", "churn rate",
  "lifetime value", "ltv", "cac", "marketing mix", "attribution modeling",
  "brand management", "growth hacking", "marketo", "mailchimp", "klaviyo",
  "buffer", "hootsuite", "sprout social", "canva", "adobe xd", "sketch",
  "invision", "zeplin", "hotjar", "crazy egg", "optimizely", "vwo",
  "google tag manager", "gtm", "search console", "ahrefs", "semrush", "moz",
  "screaming frog", "buzzsumo", "mailgun", "sendgrid", "twilio"
];

export const productKeywords = [
  "product management", "roadmap", "user stories", "backlog", "sprint planning",
  "jira", "confluence", "figma", "wireframes", "prototyping", "user research",
  "a/b testing", "analytics", "kpi", "okr", "mvp", "product strategy",
  "stakeholder management", "agile", "scrum", "kanban", "product launch",
  "product-market fit", "user personas", "customer journey", "feature prioritization",
  "product analytics", "mixpanel", "amplitude", "product roadmap", "go-to-market",
  "pendo", "fullstory", "heap", "segment", "airtable", "notion", "trello", 
  "asana", "monday.com", "clickup", "linear", "aha!", "roadmunk", 
  "productboard", "miro", "mural", "lucidchart", "balsamiq", "axure"
];

export const dataKeywords = [
  "sql", "python", "r", "tableau", "power bi", "excel", "data visualization",
  "statistical analysis", "predictive modeling", "etl", "data warehouse",
  "big data", "hadoop", "spark", "hive", "pig", "data mining", "regression",
  "classification", "clustering", "time series", "forecasting", "bi",
  "data pipeline", "airflow", "dbt", "snowflake", "redshift", "bigquery",
  "looker", "metabase", "data modeling", "dimensional modeling", "star schema",
  "matplotlib", "seaborn", "plotly", "bokeh", "altair", "ggplot2",
  "shiny", "dash", "streamlit", "jupyter", "colab", "databricks",
  "sagemaker", "mlflow", "kubeflow", "dvc", "weights & biases",
  "hugging face", "transformers", "bert", "gpt", "llm", "langchain"
];

export const softSkills = [
  "communication", "leadership", "problem solving", "teamwork", "collaboration",
  "adaptability", "creativity", "critical thinking", "time management", "emotional intelligence",
  "negotiation", "conflict resolution", "decision making", "mentoring", "presentation",
  "strategic planning", "project management", "stakeholder management", "client facing", 
  "analytical", "detail oriented", "organization", "flexibility", "interpersonal skills",
  "cross-functional collaboration", "remote collaboration", "async communication", "active listening",
  "cultural awareness", "empathy", "storytelling", "public speaking", "consensus building",
  "self-motivation", "resilience", "accountability", "ownership", "growth mindset"
];

// Enhanced synonym mapping for semantic matching with weighted importance
export const synonymMap: Record<string, string[]> = {
  "javascript": ["js", "ecmascript", "es6", "es2015", "es2020", "node.js", "nodejs"],
  "python": ["py", "python3", "python2", "cpython"],
  "machine learning": ["ml", "artificial intelligence", "ai", "deep learning", "neural networks", "neural nets", "dl", "nlp", "computer vision", "reinforcement learning"],
  "react": ["reactjs", "react.js", "react native", "react-native", "jsx", "tsx"],
  "angular": ["angularjs", "angular.js", "angular2+", "angular 2"],
  "vue": ["vuejs", "vue.js", "vue 3"],
  "docker": ["containerization", "containers", "container"],
  "kubernetes": ["k8s", "container orchestration", "k8"],
  "aws": ["amazon web services", "amazon aws", "cloud", "amazon cloud", "ec2", "s3", "lambda", "dynamodb", "rds", "cloudfront"],
  "azure": ["microsoft azure", "azure cloud", "ms azure"],
  "gcp": ["google cloud platform", "google cloud", "gcloud"],
  "sql": ["structured query language", "mysql", "postgresql", "mssql", "oracle", "postgres"],
  "mongodb": ["mongo", "nosql", "document database"],
  "git": ["version control", "github", "gitlab", "bitbucket", "source control"],
  "ci/cd": ["continuous integration", "continuous deployment", "continuous delivery", "devops", "cicd"],
  "api": ["rest api", "restful", "web services", "rest", "api development"],
  "graphql": ["graph ql", "gql"],
  "microservices": ["micro services", "service-oriented architecture", "soa"],
  "seo": ["search engine optimization", "organic search", "search optimization", "on-page seo", "off-page seo", "technical seo"],
  "sem": ["search engine marketing", "paid search", "search marketing"],
  "ctr": ["click-through rate", "click through rate", "clickthrough rate"],
  "cpc": ["cost per click", "pay per click", "ppc"],
  "roi": ["return on investment", "return-on-investment"],
  "kpi": ["key performance indicator", "key performance indicators", "performance metrics"],
  "okr": ["objectives and key results", "objectives key results"],
  "structural": ["structural engineering", "structural design"],
  "civil": ["civil engineering"],
  "mechanical": ["mechanical engineering"],
  "autocad": ["cad", "computer aided design", "computer-aided design"],
  "revit": ["bim", "building information modeling", "building information modelling"],
  "etabs": ["structural analysis software", "structural software"],
  "ibc": ["international building code"],
  "asce": ["american society of civil engineers", "asce 7"],
  "eurocode": ["european code", "en 1990", "en 1991"],
  "product management": ["product manager", "pm", "product owner", "po", "apm", "rpm"],
  "agile": ["scrum", "kanban", "sprint", "agile methodology"],
  "data science": ["data scientist", "data analysis", "analytics", "data analytics"],
  "tableau": ["data visualization", "bi tool", "business intelligence"],
  "power bi": ["microsoft power bi", "powerbi", "ms power bi"],
  "a/b testing": ["ab testing", "split testing", "a/b test"],
  "user experience": ["ux", "ux design", "user-experience"],
  "user interface": ["ui", "ui design", "user-interface"],
  "full stack": ["fullstack", "full-stack", "full stack developer"],
  "backend": ["back-end", "back end", "server-side"],
  "frontend": ["front-end", "front end", "client-side"],
  "tensorflow": ["tf", "tensor flow"],
  "pytorch": ["torch", "py torch"],
  "natural language processing": ["nlp", "text mining", "text analytics"],
  "computer vision": ["cv", "image processing", "image recognition"],
  "devops": ["dev ops", "site reliability", "sre"],
  "cloud computing": ["cloud infrastructure", "cloud services"],
  "blockchain": ["distributed ledger", "crypto", "web3"],
  "cybersecurity": ["information security", "infosec", "security"],
  "salesforce": ["sfdc", "crm platform"],
  "hubspot": ["marketing automation", "inbound marketing"],
  "google analytics": ["ga", "web analytics", "analytics", "ga4", "universal analytics"],
  "photoshop": ["ps", "adobe photoshop"],
  "illustrator": ["ai", "adobe illustrator"],
  "figma": ["design tool", "ui design tool"],
  "jira": ["project management", "issue tracking"],
  "confluence": ["documentation", "wiki"],
  "slack": ["team communication", "messaging"],
  "excel": ["spreadsheet", "microsoft excel"],
  "powerpoint": ["presentation", "microsoft powerpoint", "ppt"],
  "civil 3d": ["autocad civil 3d", "c3d"],
  "bluebeam": ["bluebeam revu", "revu"],
  "leed": ["leed ap", "leed ga", "leadership in energy and environmental design"],
  "pe license": ["professional engineer", "p.e.", "pe"],
  "eit": ["engineer in training", "e.i.t.", "fundamentals of engineering", "fe"]
};

// Role classification training data with weighted patterns
export interface RolePattern {
  keywords: string[];
  weight: number;
  context?: string[];
}

export const roleClassificationPatterns: Record<RoleCategory, RolePattern[]> = {
  "Engineering": [
    { keywords: ["structural", "civil", "mechanical", "electrical", "hvac", "piping"], weight: 10, context: ["engineer", "engineering", "design"] },
    { keywords: ["etabs", "sap2000", "revit", "autocad", "staad", "tekla", "risa", "solidworks", "catia", "ansys"], weight: 8 },
    { keywords: ["ibc", "asce", "eurocode", "aisc", "aci", "aashto", "astm", "iso", "din"], weight: 6 },
    { keywords: ["steel", "concrete", "seismic", "foundation", "structural design", "fea", "cfd"], weight: 4 },
    { keywords: ["load calculation", "finite element", "fem", "lateral", "gravity", "stress analysis"], weight: 3 }
  ],
  "Software Engineering": [
    { keywords: ["software", "full stack", "backend", "frontend", "web", "mobile", "ios", "android"], weight: 10, context: ["engineer", "developer", "architect"] },
    { keywords: ["javascript", "python", "java", "react", "node", "typescript", "angular", "vue", "golang", "rust", "c++", "c#"], weight: 6 },
    { keywords: ["api", "microservices", "docker", "kubernetes", "aws", "git", "ci/cd", "graphql", "rest", "grpc"], weight: 4 },
    { keywords: ["database", "sql", "nosql", "redis", "mongodb", "postgresql", "system design"], weight: 3 }
  ],
  "Marketing": [
    { keywords: ["digital marketing", "content strategy", "growth marketing", "brand management", "product marketing"], weight: 10, context: ["marketing", "marketer", "manager"] },
    { keywords: ["seo", "sem", "google analytics", "facebook ads", "ppc", "cpc", "ctr", "hubspot", "salesforce", "marketo"], weight: 6 },
    { keywords: ["campaign", "conversion", "roi", "lead generation", "email marketing", "social media", "influencer"], weight: 4 },
    { keywords: ["brand awareness", "copywriting", "storytelling", "market research", "customer segmentation"], weight: 3 }
  ],
  "Product Management": [
    { keywords: ["product management", "product owner", "technical product manager"], weight: 10, context: ["manager", "management", "owner", "head"] },
    { keywords: ["roadmap", "backlog", "user stories", "sprint", "jira", "confluence", "prd", "mrd"], weight: 6 },
    { keywords: ["mvp", "okr", "kpi", "stakeholder", "product strategy", "go-to-market", "gtm"], weight: 4 },
    { keywords: ["agile", "scrum", "kanban", "user research", "a/b testing", "feature prioritization"], weight: 3 }
  ],
  "Data Science": [
    { keywords: ["data science", "machine learning", "deep learning", "artificial intelligence"], weight: 10, context: ["scientist", "engineer", "analyst"] },
    { keywords: ["python", "r", "sql", "tableau", "power bi", "pandas", "numpy", "scikit-learn", "spark"], weight: 6 },
    { keywords: ["regression", "classification", "clustering", "predictive", "statistical", "nlp", "computer vision"], weight: 4 },
    { keywords: ["tensorflow", "pytorch", "keras", "big data", "etl", "data mining"], weight: 3 }
  ],
  "General": [
    { keywords: ["management", "leadership", "strategy", "operations", "administration"], weight: 5 },
    { keywords: ["communication", "collaboration", "problem solving", "customer service"], weight: 3 }
  ]
};

export type RoleCategory = "Engineering" | "Software Engineering" | "Marketing" | "Product Management" | "Data Science" | "General";

export function getKeywordsForCategory(category: RoleCategory): string[] {
  switch (category) {
    case "Engineering":
      return [...engineeringKeywords, ...techKeywords];
    case "Software Engineering":
      return techKeywords;
    case "Marketing":
      return [...marketingKeywords, ...techKeywords];
    case "Product Management":
      return [...productKeywords, ...techKeywords];
    case "Data Science":
      return [...dataKeywords, ...techKeywords];
    default:
      return [...techKeywords, ...marketingKeywords, ...engineeringKeywords];
  }
}

// Advanced role classification using pattern matching
export function classifyRole(text: string): { category: RoleCategory; confidence: number } {
  const lowerText = text.toLowerCase();
  const scores: Record<RoleCategory, number> = {
    "Engineering": 0,
    "Software Engineering": 0,
    "Marketing": 0,
    "Product Management": 0,
    "Data Science": 0,
    "General": 0
  };

  // Apply pattern-based scoring
  for (const [category, patterns] of Object.entries(roleClassificationPatterns)) {
    for (const pattern of patterns) {
      let matchScore = 0;
      
      // Check if keywords exist
      const keywordMatches = pattern.keywords.filter(kw => lowerText.includes(kw)).length;
      if (keywordMatches > 0) {
        matchScore = pattern.weight * (keywordMatches / pattern.keywords.length);
        
        // Bonus if context words are present
        if (pattern.context) {
          const contextMatches = pattern.context.filter(ctx => lowerText.includes(ctx)).length;
          if (contextMatches > 0) {
            matchScore *= 1.5;
          }
        }
        
        scores[category as RoleCategory] += matchScore;
      }
    }
  }

  // Find category with highest score
  const maxScore = Math.max(...Object.values(scores));
  const topCategory = (Object.keys(scores).find(key => scores[key as RoleCategory] === maxScore) || "General") as RoleCategory;
  
  // Calculate confidence (0-1)
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? maxScore / totalScore : 0;

  return { category: topCategory, confidence };
}