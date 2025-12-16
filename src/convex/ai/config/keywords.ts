// Industry-specific keyword databases for ML-based resume analysis
export const techKeywords = [
  "javascript", "python", "java", "react", "node", "sql", "aws", "docker",
  "kubernetes", "typescript", "angular", "vue", "mongodb", "postgresql",
  "git", "ci/cd", "agile", "scrum", "api", "rest", "graphql", "microservices",
  "machine learning", "ml", "ai", "tensorflow", "pytorch", "data science",
  "redux", "webpack", "babel", "jest", "cypress", "jenkins", "terraform",
  "ansible", "prometheus", "grafana", "elasticsearch", "redis", "kafka",
  "spark", "hadoop", "pandas", "numpy", "scikit-learn", "keras", "nlp"
];

export const engineeringKeywords = [
  "structural", "civil", "mechanical", "design", "cad", "autocad", "revit",
  "etabs", "sap2000", "staad", "tekla", "ibc", "asce", "eurocode", "seismic",
  "steel", "concrete", "wood", "foundation", "lateral", "gravity",
  "risa", "ram", "safe", "aisc", "aci", "aashto", "lrfd", "asd",
  "finite element", "fem", "structural analysis", "load calculation",
  "wind load", "snow load", "dead load", "live load", "moment frame"
];

export const marketingKeywords = [
  "seo", "sem", "google analytics", "facebook ads", "content marketing",
  "email marketing", "social media", "conversion", "roi", "ctr", "cpc",
  "google ads", "linkedin ads", "marketing automation", "hubspot", "salesforce",
  "a/b testing", "funnel optimization", "lead generation", "crm", "kpi",
  "brand strategy", "copywriting", "ppc", "display ads", "retargeting"
];

export const productKeywords = [
  "product management", "roadmap", "user stories", "backlog", "sprint planning",
  "jira", "confluence", "figma", "wireframes", "prototyping", "user research",
  "a/b testing", "analytics", "kpi", "okr", "mvp", "product strategy",
  "stakeholder management", "agile", "scrum", "kanban", "product launch"
];

export const dataKeywords = [
  "sql", "python", "r", "tableau", "power bi", "excel", "data visualization",
  "statistical analysis", "predictive modeling", "etl", "data warehouse",
  "big data", "hadoop", "spark", "hive", "pig", "data mining", "regression",
  "classification", "clustering", "time series", "forecasting", "bi"
];

// Synonym mapping for semantic matching
export const synonymMap: Record<string, string[]> = {
  "javascript": ["js", "ecmascript", "es6", "es2015", "node.js", "nodejs"],
  "python": ["py", "python3", "python2"],
  "machine learning": ["ml", "artificial intelligence", "ai", "deep learning", "neural networks"],
  "react": ["reactjs", "react.js", "react native"],
  "angular": ["angularjs", "angular.js", "angular2+"],
  "vue": ["vuejs", "vue.js"],
  "docker": ["containerization", "containers"],
  "kubernetes": ["k8s", "container orchestration"],
  "aws": ["amazon web services", "amazon aws", "cloud"],
  "sql": ["structured query language", "mysql", "postgresql", "mssql", "oracle"],
  "mongodb": ["mongo", "nosql"],
  "git": ["version control", "github", "gitlab", "bitbucket"],
  "ci/cd": ["continuous integration", "continuous deployment", "devops"],
  "api": ["rest api", "restful", "web services"],
  "seo": ["search engine optimization", "organic search"],
  "sem": ["search engine marketing", "paid search"],
  "ctr": ["click-through rate", "click through rate"],
  "cpc": ["cost per click", "pay per click", "ppc"],
  "roi": ["return on investment"],
  "structural": ["structural engineering", "structural design"],
  "civil": ["civil engineering"],
  "mechanical": ["mechanical engineering"],
  "autocad": ["cad", "computer aided design"],
  "revit": ["bim", "building information modeling"],
  "etabs": ["structural analysis software"],
  "ibc": ["international building code"],
  "asce": ["american society of civil engineers", "asce 7"],
  "eurocode": ["european code", "en 1990"],
  "product management": ["product manager", "pm", "product owner", "po"],
  "agile": ["scrum", "kanban", "sprint"],
  "data science": ["data scientist", "data analysis", "analytics"],
  "tableau": ["data visualization", "bi tool"],
  "power bi": ["microsoft power bi", "powerbi"]
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
