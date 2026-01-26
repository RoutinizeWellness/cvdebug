import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { PremiumFeatureBadge } from "@/components/PremiumFeatureBadge";
import { PremiumFeatureModal } from "@/components/PremiumFeatureModal";
import { useI18n } from "@/contexts/I18nContext";

interface KeywordAnalysisProps {
  matchedKeywords: string[];
  missingKeywords: string[];
  matchRate?: number;
  onUpgrade?: () => void;
  resumeText?: string;
  jobDescription?: string;
  category?: string;
  seniorityLevel?: string;
  isPaidUser?: boolean; // NEW: Check if user has paid plan
}

interface FoundKeyword {
  keyword: string;
  icon: string;
  location: string;
  context?: string; // NEW: Show actual text snippet where keyword was found
  matchType?: 'exact' | 'synonym' | 'semantic'; // NEW: How it was matched
  confidence?: number; // NEW: Match confidence (0-100)
}

interface MissingKeyword {
  keyword: string;
  impact: string;
  impactPercent: number;
  description: string;
  isPriority: boolean;
}

export function KeywordAnalysis({
  matchedKeywords,
  missingKeywords,
  matchRate = 0, // Real data only, no fake score
  onUpgrade,
  resumeText = '',
  jobDescription = '',
  category = '',
  seniorityLevel = 'mid',
  isPaidUser = false // NEW: Default to false (free tier)
}: KeywordAnalysisProps) {
  const { t } = useI18n();
  const [showExamples, setShowExamples] = useState<string | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string>("");
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [groupByType, setGroupByType] = useState(false);
  const [showMatchDetails, setShowMatchDetails] = useState<string | null>(null); // NEW: Show detailed match info

  // Handle Auto-Add keyword (Premium Feature)
  const handleAutoAdd = (keyword: string) => {
    setSelectedFeature(`AI Auto-Add: ${keyword}`);
    setShowPremiumModal(true);
  };

  // Handle View Examples
  const handleViewExamples = (keyword: string) => {
    setShowExamples(keyword);
    toast.info(`${t.keywordAnalysis.showingExamples} "${keyword}"`, {
      description: t.keywordAnalysis.viewHowTopCandidates
    });
  };

  const handleUpgrade = () => {
    setShowPremiumModal(false);
    onUpgrade?.();
  };

  // Infer icon based on keyword type (not random)
  const getKeywordIcon = (keyword: any): string => {
    const lower = (typeof keyword === 'string' ? keyword : keyword?.keyword || '').toLowerCase();
>>>>>>> REPLACE
<<<<<<< SEARCH
  // Infer SPECIFIC location based on keyword type
  const getKeywordLocation = (keyword: string): string => {
    const lower = keyword.toLowerCase();
=======
  // Infer SPECIFIC location based on keyword type
  const getKeywordLocation = (keyword: any): string => {
    const lower = (typeof keyword === 'string' ? keyword : keyword?.keyword || '').toLowerCase();
>>>>>>> REPLACE
<<<<<<< SEARCH
  // Helper: Extract context snippet where keyword appears
  const extractKeywordContext = (keyword: string, text: string): { context: string; matchType: 'exact' | 'synonym' | 'semantic'; confidence: number } => {
    const lowerKeyword = keyword.toLowerCase();
    const lowerText = text.toLowerCase();
=======
  // Helper: Extract context snippet where keyword appears
  const extractKeywordContext = (keyword: any, text: string): { context: string; matchType: 'exact' | 'synonym' | 'semantic'; confidence: number } => {
    const kwStr = typeof keyword === 'string' ? keyword : keyword?.keyword || '';
    const lowerKeyword = kwStr.toLowerCase();
    const lowerText = (text || '').toLowerCase();
>>>>>>> REPLACE
<<<<<<< SEARCH
  // Calculate REAL impact for missing keywords based on importance
  const calculateImpact = (keyword: string, index: number): { impact: string; percent: number; isPriority: boolean } => {
    const lower = keyword.toLowerCase();
=======
  // Calculate REAL impact for missing keywords based on importance
  const calculateImpact = (keyword: any, index: number): { impact: string; percent: number; isPriority: boolean } => {
    const lower = (typeof keyword === 'string' ? keyword : keyword?.keyword || '').toLowerCase();
>>>>>>> REPLACE
<<<<<<< SEARCH
  // Generate REAL context-aware descriptions with SPECIFIC guidance
  const getKeywordDescription = (keyword: string): string => {
    const lower = keyword.toLowerCase();
=======
  // Generate REAL context-aware descriptions with SPECIFIC guidance
  const getKeywordDescription = (keyword: any): string => {
    const lower = (typeof keyword === 'string' ? keyword : keyword?.keyword || '').toLowerCase();
>>>>>>> REPLACE
<<<<<<< SEARCH
  // Map matched keywords to found signals with REAL context
  const foundSignals: FoundKeyword[] = matchedKeywords.slice(0, 15).map((keyword) => {
    const contextInfo = extractKeywordContext(keyword, resumeText);

    return {
      keyword,
      icon: getKeywordIcon(keyword),
      location: getKeywordLocation(keyword),
      context: contextInfo.context,
      matchType: contextInfo.matchType,
      confidence: contextInfo.confidence
    };
  });
=======
  // Map matched keywords to found signals with REAL context
  const foundSignals: FoundKeyword[] = (matchedKeywords || []).slice(0, 15).map((kw: any) => {
    const keyword = typeof kw === 'string' ? kw : kw?.keyword || '';
    const contextInfo = extractKeywordContext(keyword, resumeText);

    return {
      keyword,
      icon: getKeywordIcon(keyword),
      location: getKeywordLocation(keyword),
      context: contextInfo.context,
      matchType: contextInfo.matchType,
      confidence: contextInfo.confidence
    };
  });
>>>>>>> REPLACE
<<<<<<< SEARCH
  // Create DYNAMIC keyword cloud from REAL matched + missing keywords
  const allKeywords = [...matchedKeywords, ...missingKeywords];
  const industryKeywords = allKeywords.slice(0, 16).map((keyword, index) => {
    const isMatched = matchedKeywords.includes(keyword);
=======
  // Create DYNAMIC keyword cloud from REAL matched + missing keywords
  const allKeywords = [...(matchedKeywords || []), ...(missingKeywords || [])];
  const industryKeywords = allKeywords.slice(0, 16).map((kw: any, index) => {
    const keyword = typeof kw === 'string' ? kw : kw?.keyword || '';
    const isMatched = (matchedKeywords || []).some((m: any) => 
      (typeof m === 'string' ? m : m?.keyword) === keyword
    );
    if (/python|java|javascript|typescript|c\+\+|ruby|go|rust/.test(lower)) return "code";
    if (/sql|database|mongodb|postgresql|redis/.test(lower)) return "storage";
    if (/aws|azure|gcp|cloud|kubernetes|docker/.test(lower)) return "cloud";
    if (/ai|ml|machine learning|deep learning|neural/.test(lower)) return "psychology";
    if (/3d|ar|vr|unity|unreal/.test(lower)) return "view_in_ar";
    if (/api|integration|sync|webhook/.test(lower)) return "sync";
    if (/agile|scrum|kanban|methodology/.test(lower)) return "settings";
    if (/git|github|version control/.test(lower)) return "code_blocks";
    return "terminal"; // Default for unclassified
  };

  // Infer SPECIFIC location based on keyword type
  const getKeywordLocation = (keyword: string): string => {
    const lower = keyword.toLowerCase();

    // Leadership keywords
    if (/lead|manage|director|senior|architect|executive|chief/.test(lower))
      return "Professional Summary, Experience (leadership bullets)";

    // Cloud & Infrastructure
    if (/aws|azure|gcp|cloud|kubernetes|docker|terraform|ansible/.test(lower))
      return "Technical Skills → Infrastructure, Projects";

    // Programming Languages
    if (/python|java|javascript|typescript|c\+\+|ruby|go|rust/.test(lower))
      return "Technical Skills → Languages, Projects (with use cases)";

    // Databases
    if (/\bsql\b|mysql|postgresql|mongodb|redis|cassandra|dynamodb/.test(lower))
      return "Technical Skills → Databases, Experience (with metrics)";

    // Data Tools
    if (/excel|tableau|power bi|looker|data studio/.test(lower))
      return "Technical Skills → Tools, Experience (with analysis examples)";

    // Big Data
    if (/hadoop|spark|hive|pig|kafka|flink|storm/.test(lower))
      return "Technical Skills → Big Data, Projects (with scale)";

    // ETL & Data Engineering
    if (/etl|airflow|nifi|data warehouse|redshift|snowflake|bigquery/.test(lower))
      return "Technical Skills → Data Engineering, Experience (with pipeline details)";

    // AI/ML
    if (/machine learning|deep learning|tensorflow|pytorch|scikit|keras|ml/.test(lower))
      return "Technical Skills → AI/ML, Projects (with model performance)";

    // Methodologies
    if (/agile|scrum|kanban|devops|ci\/cd/.test(lower))
      return "Experience (methodology context), Professional Summary";

    // Version Control
    if (/git|github|gitlab|bitbucket/.test(lower))
      return "Technical Skills → Version Control, Experience";

    // Generic fallback - but more specific
    return "Technical Skills section, Experience bullets (with context)";
  };

  // Helper: Extract context snippet where keyword appears
  const extractKeywordContext = (keyword: string, text: string): { context: string; matchType: 'exact' | 'synonym' | 'semantic'; confidence: number } => {
    const lowerKeyword = keyword.toLowerCase();
    const lowerText = text.toLowerCase();

    // Try exact match first
    const exactIndex = lowerText.indexOf(lowerKeyword);
    if (exactIndex !== -1) {
      const start = Math.max(0, exactIndex - 30);
      const end = Math.min(text.length, exactIndex + keyword.length + 30);
      const snippet = text.substring(start, end);
      return {
        context: snippet,
        matchType: 'exact',
        confidence: 100
      };
    }

    // Try finding related terms (semantic matching)
    const words = lowerText.split(/\s+/);
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      // Check if this word is semantically related to keyword
      if (word.includes(lowerKeyword.split(' ')[0]) || lowerKeyword.split(' ')[0].includes(word)) {
        const start = Math.max(0, i - 6);
        const end = Math.min(words.length, i + 7);
        const snippet = words.slice(start, end).join(' ');
        return {
          context: snippet,
          matchType: 'semantic',
          confidence: 75
        };
      }
    }

    // Default: keyword exists somewhere
    return {
      context: 'Found in resume',
      matchType: 'exact',
      confidence: 85
    };
  };

  // Map matched keywords to found signals with REAL context
  const foundSignals: FoundKeyword[] = matchedKeywords.slice(0, 15).map((keyword) => {
    const contextInfo = extractKeywordContext(keyword, resumeText);

    return {
      keyword,
      icon: getKeywordIcon(keyword),
      location: getKeywordLocation(keyword),
      context: contextInfo.context,
      matchType: contextInfo.matchType,
      confidence: contextInfo.confidence
    };
  });

  // Calculate REAL impact for missing keywords based on importance
  const calculateImpact = (keyword: string, index: number): { impact: string; percent: number; isPriority: boolean } => {
    const lower = keyword.toLowerCase();

    // High-impact technical keywords
    if (/python|sql|machine learning|aws|kubernetes|docker/.test(lower)) {
      return { impact: `High Impact +${8 + index}%`, percent: 8 + index, isPriority: true };
    }

    // Medium-impact keywords
    if (/git|agile|scrum|api|rest|graphql/.test(lower)) {
      return { impact: `Impact +${4 + index}%`, percent: 4 + index, isPriority: false };
    }

    // Standard impact
    return { impact: `Impact +${2 + index}%`, percent: 2 + index, isPriority: false };
  };

  // Generate REAL context-aware descriptions with SPECIFIC guidance
  const getKeywordDescription = (keyword: string): string => {
    const lower = keyword.toLowerCase();

    // Programming Languages
    if (/\bpython\b/.test(lower)) return `Essential for technical roles. Add to "Technical Skills" with specific frameworks (Django, Flask, FastAPI) and use cases.`;
    if (/javascript|typescript/.test(lower)) return `Core web development skill. Mention frameworks (React, Node.js, Vue) and projects where you used it.`;
    if (/\bjava\b/.test(lower)) return `Enterprise development staple. Include Spring, Maven, or microservices architecture experience.`;
    if (/\bc\+\+|cpp\b/.test(lower)) return `Systems programming language. Highlight performance-critical applications, memory management, or embedded systems work.`;
    if (/\bruby\b/.test(lower)) return `Web development with Rails. Mention API development, test-driven development, or automation scripts built.`;
    if (/\bgo\b|golang/.test(lower)) return `Cloud-native language. Describe microservices built, concurrency patterns used, or CLI tools developed.`;

    // Databases & Data
    if (/\bsql\b/.test(lower)) return `Critical database skill. Include specific databases (PostgreSQL, MySQL) and mention query optimization or data analysis with measurable results.`;
    if (/postgresql|postgres/.test(lower)) return `Advanced SQL database. Detail complex queries, indexing strategies, or database performance tuning you implemented.`;
    if (/mysql/.test(lower)) return `Popular relational database. Mention schema design, query optimization, or replication setup you managed.`;
    if (/mongodb/.test(lower)) return `NoSQL document database. Describe data modeling, aggregation pipelines, or scalability improvements achieved.`;
    if (/redis/.test(lower)) return `In-memory cache. Detail caching strategies, session management, or latency reductions (e.g., from 500ms to 50ms).`;
    if (/elasticsearch/.test(lower)) return `Search and analytics engine. Mention search features built, query performance, or log analysis systems implemented.`;
    if (/excel/.test(lower)) return `Data analysis tool. Highlight advanced functions (VLOOKUP, Pivot Tables, Macros) and how you automated reports or analysis.`;
    if (/\betl\b/.test(lower)) return `Data pipeline expertise. Describe data volumes processed, transformation logic, and pipeline reliability improvements.`;
    if (/data warehouse/.test(lower)) return `Big data infrastructure. Mention tools (Redshift, Snowflake, BigQuery), data volume, and query performance gains.`;

    // Big Data & Analytics
    if (/big data/.test(lower)) return `Large-scale data processing. Quantify data volumes (TB/PB), processing speed improvements, and business insights generated.`;
    if (/hadoop/.test(lower)) return `Distributed computing platform. Specify cluster size, data processed, and performance optimizations achieved.`;
    if (/\bspark\b/.test(lower)) return `Fast data processing engine. Mention job optimization, processing time reductions, and data volume handled.`;
    if (/\bhive\b/.test(lower)) return `SQL-on-Hadoop tool. Describe query optimization, data warehouse design, and analytics capabilities built.`;
    if (/\bpig\b/.test(lower)) return `Data transformation language. Detail ETL pipelines created, data processing efficiency, and workflow automation.`;
    if (/kafka/.test(lower)) return `Event streaming platform. Describe message throughput, stream processing, or real-time data pipelines built.`;
    if (/airflow/.test(lower)) return `Workflow orchestration. Mention DAGs created, task scheduling, or data pipeline automation implemented.`;

    // Cloud & Infrastructure
    if (/\baws\b/.test(lower)) return `Cloud platforms are highly valued. Specify services used (S3, EC2, Lambda, RDS) and scale of infrastructure managed.`;
    if (/\bec2\b/.test(lower)) return `AWS compute service. Detail instance types managed, auto-scaling setups, or cost optimizations achieved.`;
    if (/\bs3\b/.test(lower)) return `AWS object storage. Mention data volume stored, backup strategies, or CDN integrations implemented.`;
    if (/lambda/.test(lower)) return `Serverless compute. Describe functions deployed, event triggers, or cost savings from serverless architecture.`;
    if (/azure/.test(lower)) return `Microsoft cloud platform. Specify services used (VMs, App Services, Cosmos DB) and infrastructure scale.`;
    if (/\bgcp\b|google cloud/.test(lower)) return `Google cloud platform. Detail services used (Compute Engine, BigQuery, Cloud Functions) and projects deployed.`;
    if (/kubernetes|k8s/.test(lower)) return `Container orchestration. Mention cluster size (nodes/pods), deployment strategies, or uptime SLAs achieved.`;
    if (/docker/.test(lower)) return `Containerization platform. Describe Dockerfiles written, image optimization, or CI/CD integration implemented.`;
    if (/terraform/.test(lower)) return `Infrastructure as code. Detail resources provisioned, environments managed, or deployment automation built.`;
    if (/ansible/.test(lower)) return `Configuration management. Mention servers managed, playbooks written, or deployment time reductions achieved.`;

    // AI/ML
    if (/machine learning|\bml\b/.test(lower)) return `High-demand AI skill. Detail algorithms used (regression, neural nets), model accuracy, and business impact.`;
    if (/deep learning/.test(lower)) return `Advanced AI technique. Mention neural architectures (CNN, RNN, Transformer), model performance, and applications built.`;
    if (/tensorflow/.test(lower)) return `ML framework. Describe models trained, training time optimizations, or inference performance improvements.`;
    if (/pytorch/.test(lower)) return `ML research framework. Detail model architectures implemented, experiment tracking, or research contributions.`;
    if (/\bnlp\b|natural language/.test(lower)) return `Text processing AI. Mention tasks (sentiment analysis, NER, translation), accuracy metrics, and use cases.`;

    // Web Frameworks
    if (/\breact\b/.test(lower)) return `Popular UI library. Describe components built, state management (Redux/Context), or performance optimizations.`;
    if (/\bvue\b/.test(lower)) return `Progressive framework. Mention components, Vuex state management, or SPAs built with measurable load times.`;
    if (/angular/.test(lower)) return `Enterprise framework. Detail modules created, RxJS reactive patterns, or large-scale apps architected.`;
    if (/node\.?js/.test(lower)) return `Server-side JavaScript. Describe APIs built, concurrent connections handled, or microservices developed.`;
    if (/express/.test(lower)) return `Node.js framework. Mention REST APIs built, middleware implemented, or request throughput achieved.`;
    if (/django/.test(lower)) return `Python web framework. Detail MVT architecture, ORM usage, or web apps deployed with user metrics.`;
    if (/flask/.test(lower)) return `Lightweight Python framework. Describe microservices built, API endpoints created, or integration complexity.`;
    if (/spring/.test(lower)) return `Java enterprise framework. Mention Spring Boot apps, dependency injection, or microservices architecture.`;

    // DevOps & Tools
    if (/\bgit\b/.test(lower)) return `Version control is expected. Mention branching strategies, merge conflict resolution, or monorepo management.`;
    if (/github|gitlab|bitbucket/.test(lower)) return `Code hosting platform. Detail CI/CD pipelines, PR review process, or open source contributions made.`;
    if (/jenkins/.test(lower)) return `CI/CD automation. Describe pipelines built, build time reductions, or deployment frequency improvements.`;
    if (/\bci\s*\/?\s*cd\b/.test(lower)) return `Automated deployment pipeline. Mention deployment frequency (daily/hourly), rollback strategies, or zero-downtime deploys.`;
    if (/maven/.test(lower)) return `Java build tool. Detail dependency management, build optimization, or multi-module project configurations.`;
    if (/\bpip\b/.test(lower)) return `Python package manager. Mention dependency management, virtual environments, or package distribution setup.`;
    if (/npm|yarn/.test(lower)) return `JavaScript package manager. Describe dependency updates, security audits, or monorepo tooling setup.`;

    // Soft Skills & Leadership
    if (/system design/.test(lower)) return `Architecture skill. Describe systems designed (scalability, reliability), traffic handled (QPS), or architecture decisions made.`;
    if (/performance optimization/.test(lower)) return `Critical skill. Quantify improvements: latency reductions (500ms→50ms), throughput increases (100→1000 req/s), or resource savings.`;
    if (/scalability/.test(lower)) return `Growth capability. Mention scale achieved (10K→1M users), load testing, or horizontal/vertical scaling strategies.`;
    if (/mentoring/.test(lower)) return `Leadership skill. Quantify: engineers mentored, code reviews conducted, or junior→mid promotions facilitated.`;
    if (/code review/.test(lower)) return `Quality practice. Detail review volume (PRs/week), bug prevention rate, or code quality improvements measured.`;
    if (/agile|scrum/.test(lower)) return `Project management methodology. Describe sprint cadence, velocity improvements (story points/sprint), and team collaboration.`;
    if (/kanban/.test(lower)) return `Workflow visualization. Mention WIP limits set, cycle time reductions, or throughput improvements achieved.`;
    if (/leadership/.test(lower)) return `Management skill. Quantify: team size led, projects delivered, or key initiatives championed with business impact.`;

    // Testing & Quality
    if (/\bunit test|testing/.test(lower)) return `Quality assurance. Mention test coverage % achieved, testing frameworks used (Jest, PyTest), or bug reduction rates.`;
    if (/integration test/.test(lower)) return `End-to-end validation. Describe test suites built, CI integration, or production incidents prevented.`;
    if (/\btdd\b|test.driven/.test(lower)) return `Development methodology. Detail test coverage, refactoring confidence, or code quality improvements.`;

    // Security
    if (/security|encryption/.test(lower)) return `Critical concern. Mention security audits, vulnerability fixes, encryption implementations, or compliance achieved.`;
    if (/oauth|authentication/.test(lower)) return `User security. Describe auth flows implemented, SSO integration, or security improvements (e.g., MFA).`;

    // APIs & Protocols
    if (/\brest\b|\brest\s*api/.test(lower)) return `API design pattern. Mention endpoints created, API versioning, or throughput handled (requests/sec).`;
    if (/graphql/.test(lower)) return `Query language. Describe schemas designed, resolver optimization, or over-fetching reductions achieved.`;
    if (/\bgrpc\b/.test(lower)) return `High-performance RPC. Detail services built, performance gains over REST, or microservices communication.`;
    if (/websocket/.test(lower)) return `Real-time communication. Mention concurrent connections, latency targets, or live features built (chat, notifications).`;

    // Generic but context-aware fallback
    return `Include "${keyword}" in Technical Skills or Experience. Add context: tools/versions used, scale of work, and quantifiable impact (faster, cheaper, more reliable).`;
  };

  // ML-powered keyword suggestion engine - analyzes CV context, industry, seniority
  const generateMLKeywordSuggestions = (): string[] => {
    const suggestions: Set<string> = new Set();
    const matchedLower = matchedKeywords.map((k: any) => {
      if (typeof k === 'string') return k.toLowerCase();
      return k?.keyword ? k.keyword.toLowerCase() : '';
    }).filter(Boolean);
    const resumeLower = resumeText.toLowerCase();
    const jdLower = jobDescription.toLowerCase();

    // Helper: check if keyword exists in CV
    const hasKeyword = (keywords: string[]) =>
      keywords.some((kw: any) => {
        const kwLower = typeof kw === 'string' ? kw.toLowerCase() : '';
        return matchedLower.some(m => m.includes(kwLower));
      });

    // Helper: check if keyword in JD but not in CV
    const inJDNotCV = (keyword: string) => {
      const keywordLower = typeof keyword === 'string' ? keyword.toLowerCase() : '';
      return jdLower.includes(keywordLower) && !matchedLower.some(m => m.includes(keywordLower));
    };

    // === 1. JOB DESCRIPTION ANALYSIS (highest priority) ===
    if (jobDescription) {
      // Extract technical terms from JD that are missing from CV
      const jdTechTerms = [
        'kubernetes', 'docker', 'terraform', 'ansible', 'jenkins',
        'react', 'vue', 'angular', 'node.js', 'typescript',
        'postgresql', 'mongodb', 'redis', 'elasticsearch',
        'aws', 'azure', 'gcp', 'serverless', 'microservices',
        'machine learning', 'deep learning', 'nlp', 'computer vision',
        'rest api', 'graphql', 'grpc', 'websocket',
        'agile', 'scrum', 'kanban', 'ci/cd', 'devops'
      ];

      for (const term of jdTechTerms) {
        if (inJDNotCV(term) && suggestions.size < 8) {
          suggestions.add(term.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
        }
      }
    }

    // === 2. CATEGORY-BASED RECOMMENDATIONS ===
    const categoryKeywords: Record<string, string[]> = {
      'software': ['Git', 'Unit Testing', 'Code Review', 'API Design', 'System Design'],
      'data': ['Data Modeling', 'Statistical Analysis', 'A/B Testing', 'Data Visualization', 'ETL'],
      'ml': ['Model Training', 'Feature Engineering', 'Model Deployment', 'MLOps', 'Experiment Tracking'],
      'devops': ['Infrastructure as Code', 'Container Orchestration', 'Monitoring', 'Log Management', 'Security'],
      'frontend': ['Responsive Design', 'Web Performance', 'Accessibility', 'State Management', 'Component Design'],
      'backend': ['Database Design', 'Caching', 'Message Queues', 'Load Balancing', 'Authentication']
    };

    const cat = category.toLowerCase();
    if (categoryKeywords[cat]) {
      for (const keyword of categoryKeywords[cat]) {
        if (!hasKeyword([keyword]) && suggestions.size < 8) {
          suggestions.add(keyword);
        }
      }
    }

    // === 3. SENIORITY-LEVEL ANALYSIS ===
    const seniorityKeywords: Record<string, string[]> = {
      'junior': ['Code Quality', 'Best Practices', 'Documentation', 'Version Control', 'Testing'],
      'mid': ['System Design', 'Performance Optimization', 'Scalability', 'Mentoring', 'Code Review'],
      'senior': ['Architecture Design', 'Technical Leadership', 'Cross-functional Collaboration', 'Strategic Planning', 'Team Mentorship'],
      'lead': ['Engineering Strategy', 'Stakeholder Management', 'Technical Roadmap', 'Budget Planning', 'Hiring']
    };

    const seniority = seniorityLevel.toLowerCase();
    if (seniorityKeywords[seniority]) {
      for (const keyword of seniorityKeywords[seniority]) {
        if (!hasKeyword([keyword]) && suggestions.size < 8) {
          suggestions.add(keyword);
        }
      }
    }

    // === 4. TECHNICAL STACK INFERENCE ===
    const stackInferences: Record<string, string[]> = {
      'python': ['pip', 'virtualenv', 'pytest', 'Django', 'Flask', 'FastAPI', 'pandas', 'numpy'],
      'javascript': ['npm', 'webpack', 'babel', 'eslint', 'jest', 'React', 'Node.js'],
      'java': ['Maven', 'Gradle', 'Spring Boot', 'JUnit', 'Hibernate'],
      'react': ['Redux', 'React Router', 'Hooks', 'Context API', 'Next.js'],
      'aws': ['EC2', 'S3', 'Lambda', 'RDS', 'CloudWatch', 'IAM'],
      'sql': ['Query Optimization', 'Indexing', 'Stored Procedures', 'Transactions'],
      'docker': ['Docker Compose', 'Dockerfile', 'Multi-stage Builds', 'Container Registry']
    };

    for (const [tech, relatedTerms] of Object.entries(stackInferences)) {
      if (hasKeyword([tech])) {
        for (const term of relatedTerms) {
          if (!hasKeyword([term]) && suggestions.size < 8) {
            suggestions.add(term);
            break; // Only add one related term per stack
          }
        }
      }
    }

    // === 5. ROLE-BASED SOFT SKILLS ===
    const softSkillsByRole: string[] = (() => {
      if (resumeLower.includes('lead') || resumeLower.includes('manager')) {
        return ['Strategic Thinking', 'Team Leadership', 'Conflict Resolution'];
      } else if (resumeLower.includes('senior')) {
        return ['Mentoring', 'Technical Leadership', 'Cross-team Collaboration'];
      } else {
        return ['Teamwork', 'Learning Agility', 'Communication'];
      }
    })();

    for (const skill of softSkillsByRole) {
      if (!hasKeyword([skill]) && suggestions.size < 8) {
        suggestions.add(skill);
      }
    }

    // === 6. INDUSTRY STANDARD TOOLS ===
    const standardTools = [
      'Git', 'Jira', 'Confluence', 'Slack', 'Agile', 'Scrum'
    ];

    for (const tool of standardTools) {
      if (!hasKeyword([tool]) && suggestions.size < 8) {
        suggestions.add(tool);
      }
    }

    return Array.from(suggestions).slice(0, 8);
  };

  // Map missing keywords to critical signals with REAL impact
  // If no missing keywords provided, use ML to generate smart suggestions
  const keywordsToAnalyze = missingKeywords.length > 0
    ? missingKeywords
    : generateMLKeywordSuggestions();

  const missingCount = Math.min(keywordsToAnalyze.length, 8);
  const missingSignals: MissingKeyword[] = keywordsToAnalyze.slice(0, missingCount).map((keyword, index) => {
    const impact = calculateImpact(keyword, index);

    return {
      keyword,
      impact: impact.impact,
      impactPercent: impact.percent,
      description: getKeywordDescription(keyword),
      isPriority: impact.isPriority
    };
  });

  // Create DYNAMIC keyword cloud from REAL matched + missing keywords
  const allKeywords = [...matchedKeywords, ...missingKeywords];
  const industryKeywords = allKeywords.slice(0, 16).map((keyword, index) => {
    const isMatched = matchedKeywords.includes(keyword);
    const isCritical = index < 3; // First 3 are most important

    // Size based on importance and match status
    const size = isCritical ? "2xl" : index < 6 ? "xl" : index < 10 ? "lg" : "base";
    const weight = isCritical ? "bold" : index < 8 ? "bold" : "medium";
    const color = isMatched ? (isCritical ? "primary" : "slate-200") : "slate-500";
    const highlight = isMatched && isCritical;

    return { text: keyword, size, weight, color, highlight };
  });

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-1">{t.keywordAnalysis.title}</h2>
          <p className="text-sm text-[#475569]">
            {t.keywordAnalysis.subtitle}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono font-bold text-[#64748B]">{matchRate}%</div>
          <div className="text-xs text-[#475569] uppercase tracking-wider">{t.keywordAnalysis.matchRate}</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Found Signals */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
              {t.keywordAnalysis.foundSignals}
              <span className="bg-[#E2E8F0] text-[#475569] text-[10px] px-2 py-0.5 rounded-full font-mono">
                {foundSignals.length} {t.keywordAnalysis.total}
              </span>
            </h3>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => {
                  setGroupByType(!groupByType);
                  toast.info(groupByType ? t.keywordAnalysis.showingAllKeywords : t.keywordAnalysis.groupedByType, {
                    description: groupByType ? t.keywordAnalysis.displayingFlatList : t.keywordAnalysis.keywordsOrganized
                  });
                }}
                className={`${groupByType ? 'text-[#64748B] font-medium' : 'text-[#64748B]'} hover:text-[#64748B] transition-colors`}
              >
                {t.keywordAnalysis.groupByType}
              </button>
              <span className="text-[#475569]">|</span>
              <button
                onClick={() => {
                  const newMode = viewMode === 'list' ? 'grid' : 'list';
                  setViewMode(newMode);
                  const listView = (t.keywordAnalysis?.listView || 'list view').toLowerCase();
                  const gridView = (t.keywordAnalysis?.gridView || 'grid view').toLowerCase();
                  toast.info(`${t.keywordAnalysis?.switchedToView || 'Switched to view'} ${newMode === 'list' ? listView : gridView}`);
                }}
                className="text-[#64748B] font-medium hover:text-[#475569] transition-colors"
              >
                {viewMode === 'list' ? t.keywordAnalysis.listView : t.keywordAnalysis.gridView}
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 h-full shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] relative overflow-hidden"
          >
            {/* Decorative blob */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#64748B]/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Keywords Display - Responsive to viewMode and groupByType */}
            {viewMode === 'list' ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {groupByType ? (
                  // Group by type
                  (() => {
                    const grouped: Record<string, typeof foundSignals> = {};
                    foundSignals.forEach(signal => {
                      const type = signal.location.split(',')[0].trim();
                      if (!grouped[type]) grouped[type] = [];
                      grouped[type].push(signal);
                    });

                    return Object.entries(grouped).map(([type, signals], groupIndex) => (
                      <div key={type} className="mb-4">
                        <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2 flex items-center gap-2">
                          <span className="w-1 h-4 bg-[#64748B] rounded"></span>
                          {type}
                          <span className="text-[10px] font-normal">({signals.length})</span>
                        </h4>
                        <div className="space-y-2">
                          {signals.map((signal, index) => (
                            <motion.div
                              key={`${groupIndex}-${index}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + index * 0.05 }}
                              className="group flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#64748B]/50 transition-all cursor-default"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-1.5 rounded bg-[#E2E8F0] text-[#475569]">
                                  <span className="material-symbols-outlined text-[16px]">{signal.icon}</span>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-[#0F172A] font-mono">
                                    {signal.keyword}
                                  </h4>
                                  <p className="text-[10px] text-[#64748B]">in: {signal.location}</p>
                                </div>
                              </div>
                              <span className="material-symbols-outlined text-[#22C55E] text-lg">check_circle</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ));
                  })()
                ) : (
                  // Flat list
                  foundSignals.map((signal, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="group flex flex-col p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#64748B]/50 transition-all cursor-pointer"
                      onClick={() => setShowMatchDetails(showMatchDetails === signal.keyword ? null : signal.keyword)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded bg-[#E2E8F0] text-[#475569]">
                            <span className="material-symbols-outlined text-[16px]">{signal.icon}</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-[#0F172A] font-mono">
                              {signal.keyword}
                            </h4>
                            <p className="text-[10px] text-[#64748B]">in: {signal.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {signal.confidence && (
                            <span className="text-[10px] font-bold text-[#64748B] px-2 py-0.5 rounded bg-[#64748B]/10">
                              {signal.confidence}%
                            </span>
                          )}
                          <span className="material-symbols-outlined text-[#22C55E] text-lg">check_circle</span>
                        </div>
                      </div>

                      {/* NEW: Show match details when clicked */}
                      {showMatchDetails === signal.keyword && signal.context && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.2 }}
                          className="mt-3 pt-3 border-t border-[#E2E8F0]"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="font-bold text-[#64748B] uppercase">{t.keywordAnalysis.matchType}:</span>
                              <span className={`px-2 py-0.5 rounded font-medium ${
                                signal.matchType === 'exact' ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                                signal.matchType === 'synonym' ? 'bg-[#64748B]/10 text-[#64748B]' :
                                'bg-[#F59E0B]/10 text-[#F59E0B]'
                              }`}>
                                {signal.matchType === 'exact' ? t.keywordAnalysis.exactMatch :
                                 signal.matchType === 'synonym' ? t.keywordAnalysis.synonymMatch :
                                 t.keywordAnalysis.semanticMatch}
                              </span>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">{t.keywordAnalysis.foundInResume}:</p>
                              <p className="text-[11px] text-[#475569] bg-white p-2 rounded border border-[#E2E8F0] italic">
                                "...{signal.context}..."
                              </p>
                            </div>
                            <p className="text-[9px] text-[#94A3B8] italic">
                              {t.keywordAnalysis.clickToHide}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            ) : (
              // Grid view
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
                {foundSignals.map((signal, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="group p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#64748B]/50 transition-all cursor-default"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <div className="p-1.5 rounded bg-[#E2E8F0] text-[#475569]">
                        <span className="material-symbols-outlined text-[14px]">{signal.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[#0F172A] font-mono truncate">
                          {signal.keyword}
                        </h4>
                        <p className="text-[10px] text-[#64748B] truncate">in: {signal.location}</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <span className="material-symbols-outlined text-[#22C55E] text-base">check_circle</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column - Missing Critical Signals */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse"></span>
              {t.keywordAnalysis.missingCriticalSignals}
              <span className="bg-[#FEF2F2] text-[#EF4444] text-[10px] px-2 py-0.5 rounded-full font-mono border border-[#EF4444]/20">
                {t.keywordAnalysis.highImpact}
              </span>
            </h3>
            <div className="flex items-center gap-2">
              {!isPaidUser && (
                <PremiumFeatureBadge plan="interview_sprint" size="sm" />
              )}
              <div className="text-xs text-[#64748B]">
                {t.keywordAnalysis.fixingIncreases}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 h-full shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] relative overflow-hidden"
          >
            {/* Decorative blob */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#EF4444]/5 rounded-full blur-3xl pointer-events-none"></div>

            {!isPaidUser ? (
              // LOCKED CONTENT FOR FREE USERS
              <div className="relative h-full min-h-[400px]">
                {/* Blurred Preview */}
                <div className="absolute inset-0 blur-sm select-none pointer-events-none opacity-40">
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="rounded-lg p-4 border border-[#EF4444]/20 bg-[#FFFFFF]">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-[#EF4444]">warning_amber</span>
                            <h4 className="text-base font-mono font-bold text-[#0F172A]">System Design</h4>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#EF4444] text-white">Alto Impacto</span>
                        </div>
                        <p className="text-xs text-[#475569]">Add "System Design" with specific examples...</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lock Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white/50 via-white/80 to-white/95 backdrop-blur-sm">
                  <div className="text-center px-6 max-w-md">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1E293B] to-[#EC4899] flex items-center justify-center mb-6 mx-auto shadow-2xl shadow-[#1E293B]/30">
                      <span className="material-symbols-outlined text-4xl text-white">lock</span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#0F172A] mb-3">
                      {t.keywordAnalysis.criticalSignalsLocked}
                    </h3>
                    <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
                      {t.keywordAnalysis.unlockDescription}
                    </p>

                    {/* Benefits List */}
                    <div className="bg-white/80 rounded-xl p-4 mb-6 text-left border border-[#E2E8F0] shadow-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-[#475569]">
                          <span className="text-[#22C55E]">✓</span>
                          <span>{t.keywordAnalysis.detailedImpactAnalysis}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#475569]">
                          <span className="text-[#22C55E]">✓</span>
                          <span>{t.keywordAnalysis.specificForEachKeyword}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#475569]">
                          <span className="text-[#22C55E]">✓</span>
                          <span>{t.keywordAnalysis.recommendedLocation}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#475569]">
                          <span className="text-[#22C55E]">✓</span>
                          <span>{t.keywordAnalysis.autoAddWithAI}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={onUpgrade}
                      className="w-full bg-gradient-to-r from-[#1E293B] to-[#EC4899] hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-xl shadow-[#1E293B]/30 hover:shadow-2xl hover:shadow-[#1E293B]/40 flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">workspace_premium</span>
                      {t.keywordAnalysis.unlockComplete}
                    </button>
                    <p className="text-xs text-[#94A3B8] mt-3">
                      {t.keywordAnalysis.sevenDayPlan}
                    </p>
                  </div>
                </div>
              </div>
            ) : missingSignals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-[#22C55E]/10 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl text-[#22C55E]">check_circle</span>
                </div>
                <h4 className="text-lg font-bold text-[#0F172A] mb-2">{t.keywordAnalysis.noMissingSignals}</h4>
                <p className="text-sm text-[#64748B] max-w-md">
                  {t.keywordAnalysis.excellentKeywordCoverage}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {missingSignals.map((signal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`relative group rounded-lg p-4 border transition-all ${
                    signal.isPriority
                      ? 'bg-[#FFFFFF] border-[#EF4444]/20 hover:border-[#EF4444] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]'
                      : 'bg-[#FFFFFF] border-[#E2E8F0] hover:border-[#F59E0B]/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-sm ${signal.isPriority ? 'text-[#EF4444]' : 'text-[#64748B]'}`}>
                        {signal.isPriority ? 'warning_amber' : 'do_not_disturb_on'}
                      </span>
                      <h4 className={`text-base font-mono ${signal.isPriority ? 'font-bold text-[#0F172A]' : 'font-medium text-[#475569]'}`}>
                        {signal.keyword}
                      </h4>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded ${
                        signal.isPriority
                          ? 'bg-[#EF4444] text-white shadow-lg shadow-[#EF4444]/20'
                          : 'bg-[#F59E0B] text-white shadow-lg shadow-[#F59E0B]/20'
                      }`}>
                        {signal.isPriority && <span className="material-symbols-outlined text-[10px] text-white">trending_up</span>}
                        <span className="text-white">{signal.impact}</span>
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#475569] mb-3 leading-relaxed">
                    {signal.description}
                  </p>
                  {signal.isPriority && (
                    <div className="space-y-2">
                      {/* Premium Badge */}
                      <div className="flex items-center justify-between">
                        <PremiumFeatureBadge plan="interview_sprint" size="sm" />
                        <span className="text-[10px] text-[#64748B]">{t.keywordAnalysis.aiPowered}</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewExamples(signal.keyword)}
                          className="flex-1 bg-[#F8FAFC] hover:bg-[#E2E8F0] text-xs text-[#0F172A] py-1.5 rounded border border-[#E2E8F0] transition-colors font-medium"
                        >
                          {t.keywordAnalysis.viewExamples}
                        </button>
                        <button
                          onClick={() => handleAutoAdd(signal.keyword)}
                          className="px-3 bg-gradient-to-r from-[#1E293B] to-[#EC4899] hover:opacity-90 text-white rounded text-xs transition-all font-medium shadow-lg"
                        >
                          {t.keywordAnalysis.autoAdd}
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Full Width - Industry Keyword Frequency Cloud */}
        <div className="col-span-12 mt-4">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#64748B]">cloud</span>
            {t.keywordAnalysis.industryKeywordFrequency}
          </h3>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 relative overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
          >
            <div className="flex flex-wrap gap-2 items-center justify-center">
              {industryKeywords.map((kw, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.03 }}
                  className={`
                    text-${kw.size} font-${kw.weight}
                    ${kw.highlight
                      ? kw.color === 'primary'
                        ? 'text-[#0F172A] bg-[#64748B]/20 border border-[#64748B]/40 px-3 py-1 rounded-lg backdrop-blur-sm'
                        : kw.color === 'accent'
                        ? 'text-[#1E293B] bg-[#1E293B]/10 border border-[#1E293B]/30 px-3 py-1 rounded-lg backdrop-blur-sm'
                        : 'text-[#0F172A] bg-[#64748B]/10 border border-[#64748B]/30 px-2 py-1 rounded backdrop-blur-sm'
                      : `text-${kw.color} ${kw.size !== 'sm' ? 'border border-[#E2E8F0]/50 px-2 py-1 rounded' : 'px-2'}`
                    }
                    cursor-help transition-all hover:scale-110
                  `}
                  title={kw.highlight ? 'Very High Frequency' : 'Standard'}
                >
                  {kw.text}
                </motion.span>
              ))}
            </div>

            <div className="mt-6 flex justify-center gap-6 text-[10px] text-[#64748B] font-mono uppercase tracking-widest border-t border-[#E2E8F0] pt-4 w-full">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded bg-[#64748B]/40"></div>
                High Demand
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded bg-[#64748B]"></div>
                Standard
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded bg-[#475569]"></div>
                Niche
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Premium Feature Modal */}
      <PremiumFeatureModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUpgrade={handleUpgrade}
        feature={selectedFeature}
        plan="interview_sprint"
      />
    </div>
  );
}
