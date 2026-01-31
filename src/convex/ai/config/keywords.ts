// Industry-specific keyword databases for ML-based resume analysis
export const techKeywords = [
  // Frontend
  "javascript", "typescript", "react", "vue", "angular", "svelte", "next.js", "nuxt", "gatsby",
  "html", "css", "sass", "scss", "less", "tailwind", "bootstrap", "material-ui", "chakra",
  "redux", "mobx", "zustand", "recoil", "jotai", "context api", "react query", "swr",
  "webpack", "vite", "rollup", "parcel", "esbuild", "babel", "swc", "turborepack",
  "jest", "vitest", "testing library", "cypress", "playwright", "selenium", "puppeteer",
  "storybook", "chromatic", "figma", "sketch", "adobe xd", "responsive design", "pwa",

  // Backend
  "node.js", "express", "fastify", "koa", "nest.js", "hapi", "restify",
  "python", "django", "flask", "fastapi", "tornado", "aiohttp", "sanic",
  "java", "spring", "spring boot", "hibernate", "jpa", "maven", "gradle",
  "go", "golang", "gin", "echo", "fiber", "gorilla", "grpc",
  "rust", "actix", "rocket", "warp", "axum", "tokio",
  "php", "laravel", "symfony", "codeigniter", "yii", "cakephp",
  "ruby", "rails", "sinatra", "hanami",
  "c#", ".net", "asp.net", "entity framework", "linq",

  // Databases
  "sql", "postgresql", "mysql", "mariadb", "sqlite", "oracle", "mssql",
  "nosql", "mongodb", "dynamodb", "couchdb", "cassandra", "scylladb",
  "redis", "memcached", "elasticache", "valkey",
  "elasticsearch", "opensearch", "solr", "algolia", "meilisearch",
  "neo4j", "arangodb", "orientdb", "graph database",
  "firebase", "supabase", "pocketbase", "appwrite",
  "prisma", "typeorm", "sequelize", "knex", "drizzle", "kysely",

  // Cloud & DevOps
  "aws", "azure", "gcp", "digitalocean", "linode", "vultr", "hetzner",
  "ec2", "s3", "lambda", "cloudfront", "route 53", "rds", "dynamodb", "sqs", "sns",
  "azure functions", "azure devops", "azure storage", "cosmos db",
  "google cloud run", "cloud functions", "bigquery", "cloud storage",
  "docker", "podman", "containerd", "docker compose", "docker swarm",
  "kubernetes", "k8s", "helm", "kustomize", "istio", "linkerd", "envoy",
  "terraform", "pulumi", "cloudformation", "cdk", "bicep",
  "ansible", "puppet", "chef", "saltstack",
  "jenkins", "gitlab ci", "github actions", "circleci", "travis ci", "drone",
  "prometheus", "grafana", "datadog", "new relic", "sentry", "loki", "tempo",
  "nginx", "apache", "caddy", "traefik", "haproxy", "envoy proxy",

  // Architecture & Patterns
  "microservices", "monolith", "serverless", "event-driven", "cqrs", "event sourcing",
  "rest", "graphql", "grpc", "websocket", "sse", "webhooks",
  "api gateway", "service mesh", "load balancing", "caching", "cdn",
  "message queue", "kafka", "rabbitmq", "nats", "zeromq", "activemq",
  "saga pattern", "circuit breaker", "retry pattern", "bulkhead",

  // AI/ML
  "machine learning", "ml", "ai", "deep learning", "neural networks",
  "tensorflow", "pytorch", "keras", "jax", "mxnet",
  "scikit-learn", "xgboost", "lightgbm", "catboost",
  "nlp", "computer vision", "cv", "llm", "transformers", "bert", "gpt",
  "langchain", "llama index", "haystack", "semantic search",
  "hugging face", "openai", "anthropic", "cohere", "replicate",
  "mlops", "mlflow", "kubeflow", "sagemaker", "vertex ai",
  "pandas", "numpy", "scipy", "matplotlib", "seaborn", "plotly",
  "jupyter", "colab", "databricks", "spark", "hadoop", "dask",

  // Security
  "oauth", "jwt", "saml", "openid", "auth0", "okta", "cognito",
  "encryption", "tls", "ssl", "hashing", "bcrypt", "argon2",
  "penetration testing", "owasp", "xss", "csrf", "sql injection",
  "security audit", "compliance", "gdpr", "hipaa", "soc 2", "iso 27001",

  // Methodologies
  "agile", "scrum", "kanban", "lean", "devops", "gitops", "devsecops",
  "ci/cd", "continuous integration", "continuous deployment",
  "tdd", "test-driven development", "bdd", "behavior-driven",
  "pair programming", "code review", "git", "github", "gitlab", "bitbucket",
  "jira", "confluence", "linear", "notion", "slack", "discord"
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
  // Digital Marketing
  "seo", "sem", "search engine optimization", "search engine marketing",
  "google analytics", "ga4", "google tag manager", "gtm", "search console",
  "keyword research", "on-page seo", "off-page seo", "technical seo",
  "link building", "backlinks", "domain authority", "page authority",

  // Paid Advertising
  "ppc", "pay per click", "google ads", "google adwords", "facebook ads", "meta ads",
  "instagram ads", "tiktok ads", "linkedin ads", "twitter ads", "pinterest ads",
  "display ads", "video ads", "shopping ads", "remarketing", "retargeting",
  "programmatic advertising", "dsp", "demand side platform",
  "cpc", "cpm", "ctr", "roas", "impression share", "quality score",

  // Content & Social
  "content marketing", "content strategy", "blogging", "copywriting", "storytelling",
  "social media marketing", "community management", "influencer marketing",
  "user generated content", "ugc", "brand voice", "brand storytelling",
  "video marketing", "youtube seo", "podcast marketing",

  // Email & Automation
  "email marketing", "email campaigns", "newsletter", "drip campaigns",
  "marketing automation", "lead nurturing", "lifecycle marketing",
  "hubspot", "marketo", "pardot", "active campaign", "mailchimp", "klaviyo",
  "sendgrid", "mailgun", "customer.io", "iterable", "braze",

  // Analytics & Optimization
  "marketing analytics", "data analysis", "reporting", "dashboards",
  "conversion rate optimization", "cro", "a/b testing", "multivariate testing",
  "funnel optimization", "landing page optimization", "user testing",
  "google optimize", "optimizely", "vwo", "hotjar", "crazy egg", "fullstory",
  "heatmaps", "session recordings", "user behavior",

  // Strategy & Planning
  "marketing strategy", "go-to-market", "gtm", "brand strategy", "positioning",
  "customer acquisition", "customer retention", "churn reduction",
  "lifetime value", "ltv", "cac", "customer acquisition cost",
  "marketing mix", "attribution modeling", "multi-touch attribution",
  "marketing roi", "budget allocation", "forecasting",
  "growth marketing", "growth hacking", "viral marketing", "referral marketing",

  // Tools & Platforms
  "salesforce", "hubspot crm", "marketo", "eloqua", "pardot",
  "hootsuite", "buffer", "sprout social", "later", "planoly",
  "canva", "adobe creative suite", "photoshop", "illustrator", "premiere",
  "ahrefs", "semrush", "moz", "spyfu", "ubersuggest",
  "screaming frog", "sitebulb", "deepcrawl",
  "buzzsumo", "mention", "brandwatch", "sprinklr",
  "segment", "mixpanel", "amplitude", "heap",

  // Metrics & KPIs
  "kpi", "okr", "conversion rate", "bounce rate", "engagement rate",
  "click-through rate", "open rate", "unsubscribe rate", "spam rate",
  "cost per acquisition", "return on ad spend", "customer lifetime value",
  "net promoter score", "nps", "customer satisfaction", "csat"
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
  // Programming & Analysis
  "sql", "python", "r", "scala", "julia", "matlab",
  "pandas", "numpy", "scipy", "polars", "dask", "vaex",
  "pyspark", "koalas", "modin",

  // Statistical Analysis
  "statistical analysis", "hypothesis testing", "regression analysis",
  "linear regression", "logistic regression", "polynomial regression",
  "classification", "clustering", "dimensionality reduction",
  "time series analysis", "forecasting", "arima", "sarima", "prophet",
  "predictive modeling", "machine learning", "supervised learning", "unsupervised learning",
  "feature engineering", "feature selection", "cross-validation",
  "a/b testing", "experimental design", "causal inference",

  // Data Engineering
  "etl", "elt", "data pipeline", "data orchestration",
  "airflow", "dagster", "prefect", "luigi", "argo workflows",
  "dbt", "dataform", "matillion", "fivetran", "airbyte", "stitch",
  "kafka", "kinesis", "pub/sub", "event streaming",
  "spark", "hadoop", "mapreduce", "hive", "pig", "presto", "trino",

  // Data Warehousing
  "data warehouse", "data lake", "data lakehouse",
  "snowflake", "redshift", "bigquery", "databricks", "synapse",
  "dimensional modeling", "star schema", "snowflake schema",
  "fact table", "dimension table", "slowly changing dimensions",
  "data vault", "kimball", "inmon",

  // BI & Visualization
  "business intelligence", "bi", "data visualization", "dashboards",
  "tableau", "power bi", "looker", "qlik", "sisense", "thoughtspot",
  "metabase", "redash", "superset", "grafana", "kibana",
  "d3.js", "chart.js", "plotly", "matplotlib", "seaborn", "bokeh",
  "altair", "vega", "ggplot2", "shiny", "dash", "streamlit",

  // Cloud & Modern Stack
  "snowflake", "databricks", "bigquery", "redshift", "synapse",
  "s3", "gcs", "azure storage", "data lake storage",
  "glue", "data fusion", "data factory",
  "athena", "spectrum", "bigquery", "presto", "trino",

  // Data Quality & Governance
  "data quality", "data validation", "data profiling",
  "great expectations", "deequ", "soda", "monte carlo",
  "data catalog", "metadata management", "data lineage",
  "alation", "collibra", "atlan", "datahub", "amundsen",
  "data governance", "data privacy", "gdpr", "ccpa",

  // Tools & Technologies
  "excel", "google sheets", "vba", "power query",
  "jupyter", "colab", "kaggle", "databricks notebooks",
  "git", "github", "gitlab", "version control",
  "docker", "kubernetes", "terraform",

  // Metrics & KPIs
  "kpi", "okr", "metrics", "analytics", "reporting",
  "cohort analysis", "retention analysis", "churn analysis",
  "revenue analytics", "product analytics", "user analytics"
];

export const softSkills = [
  "communication", "leadership", "problem solving", "teamwork", "collaboration",
  "adaptability", "creativity", "critical thinking", "time management", "emotional intelligence",
  "negotiation", "conflict resolution", "decision making", "mentoring", "presentation",
  "strategic planning", "project management", "stakeholder management", "client facing",
  "analytical", "detail oriented", "organization", "flexibility", "interpersonal skills",
  "cross-functional collaboration", "remote collaboration", "async communication", "active listening",
  "cultural awareness", "empathy", "storytelling", "public speaking", "consensus building",
  "self-motivation", "resilience", "accountability", "ownership", "growth mindset",
  "initiative", "integrity", "work ethic", "dependability", "patience", "open-mindedness",
  "stress management", "delegation", "constructive feedback", "diplomacy", "networking",
  "persuasion", "influence", "team building", "conflict management", "customer focus"
];

export const actionVerbs = [
  "led", "managed", "developed", "created", "designed", "implemented", "optimized",
  "increased", "reduced", "saved", "achieved", "launched", "spearheaded", "transformed",
  "built", "engineered", "architected", "orchestrated", "accelerated", "revitalized",
  "modernized", "pioneered", "generated", "delivered", "executed", "consolidated",
  "maximized", "minimized", "streamlined", "overhauled", "championed", "directed",
  "supervised", "guided", "mentored", "coached", "established", "founded", "initiated",
  "instituted", "introduced", "resolved", "solved", "negotiated", "secured", "won",
  "awarded", "exceeded", "outperformed", "surpassed", "collaborated", "partnered",
  "facilitated", "coordinated", "standardized", "automated", "conceptualized",
  "forecasted", "budgeted", "allocated", "restructured", "simplified", "clarified",
  "presented", "authored", "published", "researched", "investigated", "audited",
  "evaluated", "assessed", "diagnosed", "troubleshot", "debugged", "refactored",
  "deployed", "maintained", "supported", "administered", "configured", "provisioned",
  "mobilized", "leveraged", "cultivated", "fostered", "empowered", "enabled",
  "integrated", "migrated", "upgraded", "scaled", "expanded", "diversified"
];

// ============================================================================
// NEW KEYWORDS - Added 2026-01-16 to surpass Jobscan (150+ new keywords)
// ============================================================================

// Emerging Technologies (50+ keywords) - 2025-2026 hot tech
export const emergingTechKeywords = [
  // Modern JavaScript Runtimes & Build Tools
  "bun", "deno", "turbopack", "esbuild", "rome", "biome",
  "astro", "remix", "qwik", "solid.js", "fresh", "million.js",

  // AI/ML Frameworks & Tools (Beyond existing)
  "langchain", "llama", "llama 2", "llama index", "autogen", "crew ai",
  "ollama", "local llm", "stable diffusion", "midjourney", "dall-e",
  "vector database", "pinecone", "weaviate", "qdrant", "chroma",
  "embeddings", "rag", "retrieval augmented generation", "fine-tuning",

  // Blockchain & Web3 (Expanded)
  "solidity", "smart contracts", "defi", "nft", "ethereum", "polygon",
  "solana", "avalanche", "cosmos", "polkadot", "chainlink", "web3.js", "ethers.js",

  // Edge Computing & Serverless (Modern)
  "cloudflare workers", "vercel edge", "deno deploy", "netlify edge",
  "edge functions", "edge computing", "fly.io", "railway",

  // Modern Database & Data Tools
  "planetscale", "neon", "xata", "turso", "cockroachdb", "yugabyte",
  "clickhouse", "timescaledb", "questdb", "influxdb 3.0",

  // Infrastructure as Code (Modern)
  "pulumi", "crossplane", "cdktf", "sst", "architect", "serverless framework",

  // Observability & Monitoring (Next-gen)
  "opentelemetry", "otel", "honeycomb", "lightstep", "axiom", "betterstack"
];

// Professional Certifications (30+ keywords)
export const certificationKeywords = [
  // Cloud Certifications
  "aws certified solutions architect", "aws saa", "aws certified developer", "aws cda",
  "aws certified sysops", "aws certified devops", "aws security specialty",
  "azure administrator", "azure solutions architect", "azure devops engineer",
  "azure security engineer", "azure ai engineer", "az-104", "az-305", "az-400",
  "google cloud architect", "google cloud engineer", "gcp associate", "gcp professional",

  // Security Certifications
  "cissp", "certified information systems security professional",
  "ceh", "certified ethical hacker", "comptia security+", "security+",
  "oscp", "offensive security certified professional",
  "cism", "certified information security manager",

  // Project Management
  "pmp", "project management professional", "prince2", "agile certified practitioner",
  "csm", "certified scrum master", "psm", "professional scrum master",
  "safe", "scaled agile framework",

  // Finance & Business
  "cfa", "chartered financial analyst", "cpa", "certified public accountant",
  "mba", "master of business administration",

  // Healthcare/Nursing (Industry-specific)
  "acls", "advanced cardiac life support", "bls", "basic life support",
  "pals", "pediatric advanced life support", "ccrn", "critical care registered nurse",
  "cnor", "certified nurse operating room", "cen", "certified emergency nurse"
];

// Industry-Specific Business Keywords (40+ keywords)
export const industrySpecificKeywords = [
  // SaaS & Startup Metrics
  "arr", "annual recurring revenue", "mrr", "monthly recurring revenue",
  "cac", "customer acquisition cost", "ltv", "lifetime value", "ltv:cac ratio",
  "churn rate", "net revenue retention", "nrr", "gross retention",
  "activation rate", "product-led growth", "plg", "self-serve",
  "expansion revenue", "land and expand", "freemium", "free trial conversion",

  // Finance & Investment
  "portfolio management", "asset allocation", "risk management", "derivatives",
  "equity research", "financial modeling", "valuation", "dcf", "discounted cash flow",
  "ebitda", "earnings before interest taxes depreciation amortization",
  "cap table", "capitalization table", "fundraising", "series a", "series b",
  "venture capital", "private equity", "m&a", "mergers and acquisitions",

  // Operations & Supply Chain (EXPANDED for better matching)
  "supply chain optimization", "supply chain management", "supply chain planning",
  "supply chain scheduler", "production planning", "capacity planning",
  "inventory management", "demand forecasting", "demand planning",
  "logistics", "warehouse management", "wms", "erp", "enterprise resource planning",
  "lean manufacturing", "six sigma", "kaizen", "continuous improvement",
  "just in time", "jit", "total quality management", "tqm",
  "operations research", "scheduling algorithms", "resource allocation",
  "critical path method", "cpm", "pert", "project scheduling", "task scheduling",
  "dag", "directed acyclic graph", "dependency graph", "workflow optimization"
];

// Enhanced Soft Skills & Leadership (30+ keywords)
export const enhancedSoftSkills = [
  // Modern Leadership
  "servant leadership", "transformational leadership", "change management",
  "organizational change", "change agent", "digital transformation",
  "innovation management", "design thinking", "lean startup methodology",

  // Stakeholder & Communication
  "stakeholder management", "stakeholder engagement", "executive presence",
  "executive communication", "board presentation", "investor relations",
  "crisis management", "crisis communication",

  // Team Development
  "talent development", "succession planning", "performance management",
  "coaching and mentoring", "team scaling", "hiring and onboarding",
  "diversity and inclusion", "dei", "equity", "belonging",

  // Strategic & Analytical
  "strategic thinking", "business acumen", "commercial awareness",
  "data-driven decision making", "root cause analysis", "systems thinking",
  "scenario planning", "risk assessment", "competitive analysis"
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
  "eit": ["engineer in training", "e.i.t.", "fundamentals of engineering", "fe"],

  // ============================================================================
  // NEW SYNONYMS - Added 2026-01-16 for expanded keyword coverage
  // ============================================================================

  // Emerging Tech Synonyms
  "bun": ["bun.sh", "bunjs"],
  "deno": ["deno.land"],
  "langchain": ["lang chain", "langchainjs", "langchain.js"],
  "ollama": ["llama.cpp", "local ai"],
  "rag": ["retrieval augmented generation", "retrieval-augmented generation"],
  "vector database": ["vector db", "embedding database"],
  "solidity": ["smart contract language", "ethereum programming"],
  "edge functions": ["edge computing", "edge workers", "serverless edge"],

  // Certification Synonyms
  "aws saa": ["aws solutions architect associate", "aws certified solutions architect associate"],
  "cissp": ["certified information systems security professional", "isc2 cissp"],
  "pmp": ["project management professional", "pmi pmp"],
  "cfa": ["chartered financial analyst", "cfa charter"],
  "acls": ["advanced cardiac life support", "acls certification"],

  // Business Metrics Synonyms
  "arr": ["annual recurring revenue", "annual revenue run rate"],
  "mrr": ["monthly recurring revenue"],
  "ltv": ["lifetime value", "customer lifetime value", "clv"],
  "cac": ["customer acquisition cost"],
  "nrr": ["net revenue retention", "net retention rate"],
  "plg": ["product-led growth", "product led growth"],
  "ebitda": ["earnings before interest taxes depreciation and amortization"],

  // Leadership & Soft Skills Synonyms
  "change management": ["organizational change", "change leadership"],
  "stakeholder management": ["stakeholder engagement", "stakeholder relations"],
  "dei": ["diversity equity inclusion", "diversity and inclusion", "diversity equity and inclusion"],
  "design thinking": ["human centered design", "human-centered design"],

  // Supply Chain & Operations Synonyms (NEW for technical term matching)
  "supply chain": ["supply chain management", "supply chain optimization", "supply chain planning",
    "logistics", "operations", "production planning", "capacity planning", "demand planning",
    "dag cpm engine", "cpm scheduler", "critical path", "scheduling algorithm", "resource scheduling"],
  "supply chain planning": ["production planning", "capacity planning", "demand planning",
    "master production schedule", "mps", "material requirements planning", "mrp",
    "dag engine", "cpm engine", "critical path method", "scheduling optimization"],
  "scheduler": ["scheduling", "scheduling algorithm", "task scheduler", "job scheduler",
    "production scheduler", "cpm scheduler", "dag scheduler", "workflow scheduler"],
  "cpm": ["critical path method", "critical path analysis", "cpm scheduling", "dag cpm"],
  "dag": ["directed acyclic graph", "dependency graph", "task graph", "workflow graph", "dag engine"],
  "optimization": ["optimization algorithm", "resource optimization", "scheduling optimization",
    "supply chain optimization", "operations optimization", "constraint optimization"]
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
  "Human Resources": [
    { keywords: ["talent acquisition", "employee relations", "benefits", "payroll", "onboarding", "hris"], weight: 10, context: ["hr", "human resources", "recruiter", "manager"] },
    { keywords: ["workday", "bamboo", "succession planning", "labor law", "performance management"], weight: 8 },
    { keywords: ["shrm", "phr", "staffing", "recruiting"], weight: 6 }
  ],
  "Legal": [
    { keywords: ["litigation", "legal research", "compliance", "corporate law", "contract"], weight: 10, context: ["attorney", "lawyer", "legal", "counsel"] },
    { keywords: ["intellectual property", "arbitration", "regulatory", "due diligence"], weight: 8 },
    { keywords: ["lexisnexis", "westlaw", "clio"], weight: 6 }
  ],
  "Education": [
    { keywords: ["curriculum", "classroom management", "lesson planning", "instructional design"], weight: 10, context: ["teacher", "educator", "instructor", "professor"] },
    { keywords: ["student assessment", "special education", "k-12", "higher education"], weight: 8 },
    { keywords: ["canvas", "blackboard", "moodle"], weight: 6 }
  ],
  "Customer Service": [
    { keywords: ["customer experience", "conflict resolution", "ticketing", "client relations"], weight: 10, context: ["support", "service", "customer", "representative"] },
    { keywords: ["zendesk", "intercom", "retention", "account management"], weight: 8 },
    { keywords: ["problem solving", "communication"], weight: 4 }
  ],
  "Sales": [
    { keywords: ["quota attainment", "revenue growth", "pipeline", "b2b sales", "outside sales", "inside sales"], weight: 10, context: ["sales", "account executive", "representative", "manager"] },
    { keywords: ["salesforce", "hubspot", "crm", "cold calling", "prospecting", "closir"], weight: 8 },
    { keywords: ["saas", "commission", "negotiation", "lead generation"], weight: 6 }
  ],
  "General": [
    { keywords: ["management", "leadership", "strategy", "operations", "administration"], weight: 5 },
    { keywords: ["communication", "collaboration", "problem solving", "customer service"], weight: 3 }
  ],
  "Cloud & DevOps": [
    { keywords: ["aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible", "cloud architecture"], weight: 10, context: ["engineer", "architect", "devops"] },
    { keywords: ["ci/cd", "jenkins", "gitlab ci", "github actions", "infrastructure as code", "platform engineering"], weight: 8 },
    { keywords: ["site reliability", "sre", "monitoring", "prometheus", "grafana", "microservices"], weight: 6 }
  ],
  "Cybersecurity": [
    { keywords: ["security", "cybersecurity", "penetration testing", "ethical hacking", "infosec", "soc"], weight: 10, context: ["analyst", "engineer", "specialist"] },
    { keywords: ["compliance", "vulnerability assessment", "incident response", "firewall", "encryption"], weight: 8 },
    { keywords: ["cissp", "ceh", "comptia security+", "iso 27001", "gdpr", "nist"], weight: 6 }
  ],
  "Project/Program Management": [
    { keywords: ["project management", "program management", "pmo", "portfolio management"], weight: 10, context: ["manager", "director", "lead"] },
    { keywords: ["scrum master", "agile coach", "pmp", "prince2", "budgeting", "resource planning"], weight: 8 },
    { keywords: ["stakeholder engagement", "risk mitigation", "strategic planning", "milestone tracking"], weight: 6 }
  ],
  "Design & Creative": [
    { keywords: ["ux design", "ui design", "product design", "graphic design", "visual design"], weight: 10, context: ["designer", "creative", "artist"] },
    { keywords: ["figma", "adobe xd", "sketch", "photoshop", "illustrator", "wireframing"], weight: 8 },
    { keywords: ["user research", "prototyping", "design system", "typography", "branding"], weight: 6 }
  ],
  "Healthcare/Medical": [
    { keywords: ["patient care", "clinical", "healthcare", "medical", "hospital", "nursing", "diagnosis"], weight: 10, context: ["nurse", "doctor", "clinician", "specialist"] },
    { keywords: ["hipaa", "emr", "ehr", "medical terminology", "patient safety", "cpr", "acls"], weight: 8 },
    { keywords: ["treatment planning", "healthcare administration", "medical records", "telehealth"], weight: 6 }
  ],
  "Finance/Fintech": [
    { keywords: ["financial analysis", "banking", "fintech", "investment", "accounting", "venture capital"], weight: 10, context: ["analyst", "banker", "accountant", "advisor"] },
    { keywords: ["cfa", "cpa", "gaap", "ifrs", "risk management", "hedging", "blockchain", "payments"], weight: 8 },
    { keywords: ["financial modeling", "portfolio management", "asset allocation", "equity research"], weight: 6 }
  ]
};

export type RoleCategory = "Engineering" | "Software Engineering" | "Marketing" | "Sales" | "Product Management" | "Data Science" | "Human Resources" | "Legal" | "Education" | "Customer Service" | "General" | "Cloud & DevOps" | "Cybersecurity" | "Project/Program Management" | "Design & Creative" | "Healthcare/Medical" | "Finance/Fintech";

export function getKeywordsForCategory(category: RoleCategory): string[] {
  // Include new keywords in all categories for comprehensive coverage
  const baseNewKeywords = [
    ...emergingTechKeywords,
    ...certificationKeywords,
    ...industrySpecificKeywords,
    ...enhancedSoftSkills
  ];
  switch (category) {
    case "Engineering":
      return [...engineeringKeywords, ...techKeywords, ...certificationKeywords, ...enhancedSoftSkills];
    case "Software Engineering":
      return [...techKeywords, ...emergingTechKeywords, ...certificationKeywords, ...enhancedSoftSkills];
    case "Marketing":
      return [...marketingKeywords, ...techKeywords, ...industrySpecificKeywords, ...enhancedSoftSkills];
    case "Product Management":
      return [...productKeywords, ...techKeywords, ...industrySpecificKeywords, ...enhancedSoftSkills];
    case "Data Science":
      return [...dataKeywords, ...techKeywords, ...emergingTechKeywords, ...certificationKeywords, ...enhancedSoftSkills];
    case "Human Resources":
      return [...techKeywords, ...industrySpecificKeywords, ...enhancedSoftSkills];
    case "Legal":
      return [...techKeywords, ...industrySpecificKeywords, ...enhancedSoftSkills];
    case "Education":
      return [...techKeywords, ...enhancedSoftSkills];
    case "Customer Service":
      return [...techKeywords, ...enhancedSoftSkills];
    case "Sales":
      return [...marketingKeywords, ...techKeywords, ...industrySpecificKeywords, ...enhancedSoftSkills];
    case "Cloud & DevOps":
      return [...techKeywords, ...emergingTechKeywords, ...certificationKeywords, ...enhancedSoftSkills, "aws", "docker", "kubernetes", "terraform", "ci/cd"];
    case "Cybersecurity":
      return [...techKeywords, ...certificationKeywords, ...enhancedSoftSkills, "security", "encryption", "siem", "penetration testing"];
    case "Project/Program Management":
      return [...productKeywords, ...enhancedSoftSkills, "pmp", "scrum", "budgeting", "roadmap"];
    case "Design & Creative":
      return [...techKeywords, ...enhancedSoftSkills, "figma", "ux", "ui", "adobe", "typography"];
    case "Healthcare/Medical":
      return [...enhancedSoftSkills, "clinical", "hipaa", "emr", "patient care", "medical terminology"];
    case "Finance/Fintech":
      return [...enhancedSoftSkills, "cfa", "gaap", "financial modeling", "fintech", "banking"];
    default:
      return [...techKeywords, ...marketingKeywords, ...engineeringKeywords, ...baseNewKeywords];
  }
}

// Advanced role classification using pattern matching
export function classifyRole(text: string): { category: RoleCategory; confidence: number } {
  const lowerText = text.toLowerCase();
  const scores: Record<RoleCategory, number> = {
    "Engineering": 0,
    "Software Engineering": 0,
    "Marketing": 0,
    "Sales": 0,
    "Product Management": 0,
    "Data Science": 0,
    "Human Resources": 0,
    "Legal": 0,
    "Education": 0,
    "Customer Service": 0,
    "General": 0,
    "Cloud & DevOps": 0,
    "Cybersecurity": 0,
    "Project/Program Management": 0,
    "Design & Creative": 0,
    "Healthcare/Medical": 0,
    "Finance/Fintech": 0
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