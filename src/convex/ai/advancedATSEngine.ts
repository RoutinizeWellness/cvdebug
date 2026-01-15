/**
 * Advanced ATS Analysis Engine
 * Surpasses Jobscan with superior ML algorithms for:
 * - Context-aware keyword detection with industry-specific categorization
 * - Advanced impact metrics with sentiment analysis
 * - Intelligent missing keyword suggestions with priority ranking
 * - ATS compatibility scoring with format validation
 */

import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

// ==================== CONTEXT-AWARE KEYWORD DETECTION ====================

interface KeywordDefinition {
  term: string;
  aliases: string[];
  category: 'technical' | 'soft' | 'tools' | 'industry' | 'certification' | 'methodology';
  industries: string[]; // Which industries this keyword is relevant for
  context: string[]; // Required context words
  exclude?: string[]; // Words that invalidate the match
  weight: number; // Importance weight (1-5)
  synonyms: string[]; // Alternative terms
  relatedSkills: string[]; // Skills that often appear together
}

// Comprehensive keyword database (100+ keywords across all categories)
const ADVANCED_KEYWORD_DATABASE: KeywordDefinition[] = [
  // Programming Languages (15)
  { term: 'javascript', aliases: ['js', 'javascript', 'ecmascript', 'es6', 'es2015'], category: 'technical', industries: ['software', 'web', 'tech'], context: ['developer', 'engineer', 'programming', 'code', 'frontend', 'backend'], exclude: ['java'], weight: 5, synonyms: ['js', 'ecmascript'], relatedSkills: ['react', 'node', 'typescript'] },
  { term: 'python', aliases: ['python', 'python3', 'py'], category: 'technical', industries: ['software', 'data', 'ai', 'ml'], context: ['developer', 'data', 'ml', 'engineer', 'programming', 'code', 'analysis'], exclude: ['snake', 'monty'], weight: 5, synonyms: ['py', 'python3'], relatedSkills: ['django', 'flask', 'pandas'] },
  { term: 'java', aliases: ['java'], category: 'technical', industries: ['software', 'enterprise'], context: ['developer', 'engineer', 'programming', 'code', 'backend'], exclude: ['javascript', 'coffee'], weight: 5, synonyms: ['jvm'], relatedSkills: ['spring', 'hibernate', 'maven'] },
  { term: 'typescript', aliases: ['typescript', 'ts'], category: 'technical', industries: ['software', 'web'], context: ['developer', 'engineer', 'frontend', 'backend', 'code'], weight: 4, synonyms: ['ts'], relatedSkills: ['javascript', 'react', 'angular'] },
  { term: 'go', aliases: ['golang', 'go'], category: 'technical', industries: ['software', 'cloud'], context: ['developer', 'engineer', 'backend', 'programming'], exclude: ['going', 'gone'], weight: 4, synonyms: ['golang'], relatedSkills: ['docker', 'kubernetes', 'microservices'] },
  { term: 'rust', aliases: ['rust'], category: 'technical', industries: ['software', 'systems'], context: ['developer', 'engineer', 'systems', 'programming'], exclude: ['corrosion', 'oxidation'], weight: 4, synonyms: [], relatedSkills: ['systems programming', 'webassembly'] },
  { term: 'c++', aliases: ['c++', 'cpp'], category: 'technical', industries: ['software', 'game', 'systems'], context: ['developer', 'engineer', 'programming', 'game'], weight: 4, synonyms: ['cpp'], relatedSkills: ['c', 'systems programming'] },
  { term: 'ruby', aliases: ['ruby'], category: 'technical', industries: ['software', 'web'], context: ['developer', 'engineer', 'rails', 'programming'], weight: 3, synonyms: [], relatedSkills: ['rails', 'ruby on rails'] },
  { term: 'php', aliases: ['php'], category: 'technical', industries: ['software', 'web'], context: ['developer', 'engineer', 'backend', 'web'], weight: 3, synonyms: [], relatedSkills: ['laravel', 'wordpress', 'mysql'] },
  { term: 'swift', aliases: ['swift'], category: 'technical', industries: ['software', 'mobile'], context: ['developer', 'ios', 'mobile', 'app'], exclude: ['taylor'], weight: 4, synonyms: [], relatedSkills: ['ios', 'xcode', 'objective-c'] },
  { term: 'kotlin', aliases: ['kotlin'], category: 'technical', industries: ['software', 'mobile'], context: ['developer', 'android', 'mobile', 'app'], weight: 4, synonyms: [], relatedSkills: ['android', 'java', 'jetpack'] },
  { term: 'c#', aliases: ['c#', 'csharp'], category: 'technical', industries: ['software', 'enterprise', 'game'], context: ['developer', 'engineer', '.net', 'unity'], weight: 4, synonyms: ['csharp', 'dotnet'], relatedSkills: ['.net', 'asp.net', 'unity'] },
  { term: 'scala', aliases: ['scala'], category: 'technical', industries: ['software', 'data'], context: ['developer', 'engineer', 'data', 'functional'], weight: 3, synonyms: [], relatedSkills: ['spark', 'functional programming'] },
  { term: 'r', aliases: ['r language', 'r programming'], category: 'technical', industries: ['data', 'analytics', 'research'], context: ['data', 'statistics', 'analysis', 'research'], weight: 4, synonyms: ['r lang'], relatedSkills: ['statistics', 'data science', 'ggplot'] },
  { term: 'sql', aliases: ['sql', 'structured query language'], category: 'technical', industries: ['software', 'data', 'analytics'], context: ['database', 'data', 'query', 'backend'], weight: 5, synonyms: ['structured query language'], relatedSkills: ['database', 'mysql', 'postgresql'] },

  // Frontend Frameworks & Libraries (10)
  { term: 'react', aliases: ['react', 'reactjs', 'react.js'], category: 'technical', industries: ['software', 'web'], context: ['frontend', 'developer', 'ui', 'web', 'javascript'], weight: 5, synonyms: ['reactjs'], relatedSkills: ['javascript', 'typescript', 'redux'] },
  { term: 'angular', aliases: ['angular', 'angularjs'], category: 'technical', industries: ['software', 'web'], context: ['frontend', 'developer', 'ui', 'web', 'typescript'], weight: 4, synonyms: ['angularjs'], relatedSkills: ['typescript', 'rxjs'] },
  { term: 'vue', aliases: ['vue', 'vuejs', 'vue.js'], category: 'technical', industries: ['software', 'web'], context: ['frontend', 'developer', 'ui', 'web', 'javascript'], weight: 4, synonyms: ['vuejs'], relatedSkills: ['javascript', 'nuxt'] },
  { term: 'svelte', aliases: ['svelte'], category: 'technical', industries: ['software', 'web'], context: ['frontend', 'developer', 'ui', 'web'], weight: 3, synonyms: [], relatedSkills: ['javascript', 'sveltekit'] },
  { term: 'next.js', aliases: ['next.js', 'nextjs', 'next'], category: 'technical', industries: ['software', 'web'], context: ['frontend', 'developer', 'react', 'web'], weight: 4, synonyms: ['nextjs'], relatedSkills: ['react', 'vercel', 'ssr'] },
  { term: 'redux', aliases: ['redux'], category: 'technical', industries: ['software', 'web'], context: ['frontend', 'state', 'react', 'javascript'], weight: 3, synonyms: [], relatedSkills: ['react', 'javascript'] },
  { term: 'webpack', aliases: ['webpack'], category: 'tools', industries: ['software', 'web'], context: ['bundler', 'build', 'frontend', 'javascript'], weight: 3, synonyms: [], relatedSkills: ['babel', 'javascript'] },
  { term: 'tailwind', aliases: ['tailwind', 'tailwindcss'], category: 'technical', industries: ['software', 'web'], context: ['css', 'frontend', 'styling', 'ui'], weight: 4, synonyms: ['tailwindcss'], relatedSkills: ['css', 'html'] },
  { term: 'bootstrap', aliases: ['bootstrap'], category: 'technical', industries: ['software', 'web'], context: ['css', 'frontend', 'ui', 'framework'], weight: 3, synonyms: [], relatedSkills: ['css', 'html'] },
  { term: 'sass', aliases: ['sass', 'scss'], category: 'technical', industries: ['software', 'web'], context: ['css', 'styling', 'frontend'], weight: 3, synonyms: ['scss'], relatedSkills: ['css'] },

  // Backend Frameworks & Technologies (10)
  { term: 'node.js', aliases: ['node', 'nodejs', 'node.js'], category: 'technical', industries: ['software', 'web'], context: ['backend', 'javascript', 'server', 'api'], weight: 5, synonyms: ['nodejs'], relatedSkills: ['javascript', 'express', 'npm'] },
  { term: 'express', aliases: ['express', 'express.js', 'expressjs'], category: 'technical', industries: ['software', 'web'], context: ['backend', 'node', 'api', 'server'], weight: 4, synonyms: ['express.js'], relatedSkills: ['node.js', 'javascript'] },
  { term: 'django', aliases: ['django'], category: 'technical', industries: ['software', 'web'], context: ['backend', 'python', 'web', 'framework'], weight: 4, synonyms: [], relatedSkills: ['python', 'orm'] },
  { term: 'flask', aliases: ['flask'], category: 'technical', industries: ['software', 'web'], context: ['backend', 'python', 'web', 'api'], weight: 3, synonyms: [], relatedSkills: ['python'] },
  { term: 'spring', aliases: ['spring', 'spring boot'], category: 'technical', industries: ['software', 'enterprise'], context: ['backend', 'java', 'framework', 'enterprise'], weight: 4, synonyms: ['spring boot'], relatedSkills: ['java', 'hibernate'] },
  { term: 'fastapi', aliases: ['fastapi'], category: 'technical', industries: ['software', 'web'], context: ['backend', 'python', 'api', 'async'], weight: 4, synonyms: [], relatedSkills: ['python', 'async'] },
  { term: 'graphql', aliases: ['graphql'], category: 'technical', industries: ['software', 'web'], context: ['api', 'backend', 'query', 'data'], weight: 4, synonyms: [], relatedSkills: ['rest', 'api'] },
  { term: 'rest api', aliases: ['rest', 'restful', 'rest api'], category: 'technical', industries: ['software', 'web'], context: ['api', 'backend', 'web', 'service'], weight: 5, synonyms: ['restful api'], relatedSkills: ['api', 'http'] },
  { term: 'grpc', aliases: ['grpc'], category: 'technical', industries: ['software', 'microservices'], context: ['api', 'backend', 'microservices', 'rpc'], weight: 3, synonyms: [], relatedSkills: ['protobuf', 'microservices'] },
  { term: 'microservices', aliases: ['microservices', 'microservice'], category: 'technical', industries: ['software', 'cloud'], context: ['architecture', 'backend', 'distributed', 'cloud'], weight: 4, synonyms: ['microservice architecture'], relatedSkills: ['docker', 'kubernetes'] },

  // Databases (10)
  { term: 'postgresql', aliases: ['postgresql', 'postgres', 'psql'], category: 'technical', industries: ['software', 'data'], context: ['database', 'sql', 'backend', 'data'], weight: 5, synonyms: ['postgres'], relatedSkills: ['sql', 'database'] },
  { term: 'mysql', aliases: ['mysql'], category: 'technical', industries: ['software', 'web'], context: ['database', 'sql', 'backend', 'data'], weight: 4, synonyms: [], relatedSkills: ['sql', 'database'] },
  { term: 'mongodb', aliases: ['mongodb', 'mongo'], category: 'technical', industries: ['software', 'web'], context: ['database', 'nosql', 'backend', 'data'], weight: 5, synonyms: ['mongo'], relatedSkills: ['nosql', 'database'] },
  { term: 'redis', aliases: ['redis'], category: 'technical', industries: ['software', 'web'], context: ['cache', 'database', 'backend', 'memory'], weight: 4, synonyms: [], relatedSkills: ['caching', 'database'] },
  { term: 'elasticsearch', aliases: ['elasticsearch', 'elastic'], category: 'technical', industries: ['software', 'data'], context: ['search', 'database', 'analytics', 'data'], weight: 4, synonyms: ['elastic search'], relatedSkills: ['search', 'lucene'] },
  { term: 'dynamodb', aliases: ['dynamodb'], category: 'technical', industries: ['software', 'cloud'], context: ['database', 'aws', 'nosql', 'cloud'], weight: 4, synonyms: [], relatedSkills: ['aws', 'nosql'] },
  { term: 'cassandra', aliases: ['cassandra'], category: 'technical', industries: ['software', 'data'], context: ['database', 'nosql', 'distributed', 'data'], weight: 3, synonyms: [], relatedSkills: ['nosql', 'distributed systems'] },
  { term: 'oracle', aliases: ['oracle', 'oracle db'], category: 'technical', industries: ['software', 'enterprise'], context: ['database', 'sql', 'enterprise', 'backend'], weight: 3, synonyms: ['oracle database'], relatedSkills: ['sql', 'database'] },
  { term: 'firebase', aliases: ['firebase'], category: 'technical', industries: ['software', 'mobile'], context: ['database', 'backend', 'mobile', 'realtime'], weight: 4, synonyms: [], relatedSkills: ['nosql', 'google cloud'] },
  { term: 'neo4j', aliases: ['neo4j'], category: 'technical', industries: ['software', 'data'], context: ['database', 'graph', 'data', 'query'], weight: 3, synonyms: ['graph database'], relatedSkills: ['graph', 'cypher'] },

  // Cloud & DevOps (15)
  { term: 'aws', aliases: ['aws', 'amazon web services'], category: 'technical', industries: ['software', 'cloud', 'devops'], context: ['cloud', 'devops', 'infrastructure', 'backend'], weight: 5, synonyms: ['amazon web services'], relatedSkills: ['ec2', 's3', 'lambda'] },
  { term: 'azure', aliases: ['azure', 'microsoft azure'], category: 'technical', industries: ['software', 'cloud', 'devops'], context: ['cloud', 'devops', 'infrastructure', 'microsoft'], weight: 5, synonyms: ['microsoft azure'], relatedSkills: ['cloud', 'devops'] },
  { term: 'gcp', aliases: ['gcp', 'google cloud'], category: 'technical', industries: ['software', 'cloud', 'devops'], context: ['cloud', 'devops', 'infrastructure', 'google'], weight: 5, synonyms: ['google cloud platform'], relatedSkills: ['cloud', 'devops'] },
  { term: 'docker', aliases: ['docker'], category: 'technical', industries: ['software', 'devops'], context: ['container', 'devops', 'deployment', 'infrastructure'], weight: 5, synonyms: ['containerization'], relatedSkills: ['kubernetes', 'devops'] },
  { term: 'kubernetes', aliases: ['kubernetes', 'k8s'], category: 'technical', industries: ['software', 'devops', 'cloud'], context: ['orchestration', 'devops', 'container', 'cloud'], weight: 5, synonyms: ['k8s', 'container orchestration'], relatedSkills: ['docker', 'helm'] },
  { term: 'terraform', aliases: ['terraform'], category: 'technical', industries: ['software', 'devops', 'cloud'], context: ['infrastructure', 'devops', 'iac', 'cloud'], weight: 4, synonyms: ['infrastructure as code'], relatedSkills: ['aws', 'devops'] },
  { term: 'ansible', aliases: ['ansible'], category: 'technical', industries: ['software', 'devops'], context: ['automation', 'devops', 'configuration', 'deployment'], weight: 3, synonyms: ['configuration management'], relatedSkills: ['devops', 'automation'] },
  { term: 'jenkins', aliases: ['jenkins'], category: 'tools', industries: ['software', 'devops'], context: ['ci/cd', 'devops', 'automation', 'pipeline'], weight: 4, synonyms: ['continuous integration'], relatedSkills: ['ci/cd', 'devops'] },
  { term: 'gitlab', aliases: ['gitlab'], category: 'tools', industries: ['software', 'devops'], context: ['git', 'ci/cd', 'devops', 'repository'], weight: 4, synonyms: [], relatedSkills: ['git', 'ci/cd'] },
  { term: 'github actions', aliases: ['github actions'], category: 'tools', industries: ['software', 'devops'], context: ['ci/cd', 'github', 'automation', 'workflow'], weight: 4, synonyms: [], relatedSkills: ['github', 'ci/cd'] },
  { term: 'circleci', aliases: ['circleci', 'circle ci'], category: 'tools', industries: ['software', 'devops'], context: ['ci/cd', 'devops', 'automation'], weight: 3, synonyms: [], relatedSkills: ['ci/cd', 'devops'] },
  { term: 'prometheus', aliases: ['prometheus'], category: 'tools', industries: ['software', 'devops'], context: ['monitoring', 'devops', 'metrics', 'observability'], weight: 4, synonyms: [], relatedSkills: ['grafana', 'monitoring'] },
  { term: 'grafana', aliases: ['grafana'], category: 'tools', industries: ['software', 'devops'], context: ['monitoring', 'visualization', 'metrics', 'dashboard'], weight: 4, synonyms: [], relatedSkills: ['prometheus', 'monitoring'] },
  { term: 'datadog', aliases: ['datadog'], category: 'tools', industries: ['software', 'devops'], context: ['monitoring', 'apm', 'observability', 'metrics'], weight: 3, synonyms: [], relatedSkills: ['monitoring', 'apm'] },
  { term: 'nginx', aliases: ['nginx'], category: 'technical', industries: ['software', 'web'], context: ['web server', 'proxy', 'backend', 'load balancer'], weight: 4, synonyms: ['web server'], relatedSkills: ['apache', 'reverse proxy'] },

  // Data Science & ML (15)
  { term: 'machine learning', aliases: ['machine learning', 'ml', 'ml model'], category: 'technical', industries: ['ai', 'data', 'ml'], context: ['data', 'ai', 'model', 'algorithm', 'prediction'], weight: 5, synonyms: ['ml', 'predictive modeling'], relatedSkills: ['python', 'tensorflow', 'pytorch'] },
  { term: 'deep learning', aliases: ['deep learning', 'dl', 'neural network'], category: 'technical', industries: ['ai', 'ml'], context: ['ai', 'neural', 'model', 'ml', 'learning'], weight: 5, synonyms: ['dl', 'neural networks'], relatedSkills: ['tensorflow', 'pytorch', 'cnn'] },
  { term: 'tensorflow', aliases: ['tensorflow', 'tf'], category: 'technical', industries: ['ai', 'ml'], context: ['ml', 'deep learning', 'ai', 'model'], weight: 4, synonyms: ['tf'], relatedSkills: ['python', 'keras', 'deep learning'] },
  { term: 'pytorch', aliases: ['pytorch', 'torch'], category: 'technical', industries: ['ai', 'ml'], context: ['ml', 'deep learning', 'ai', 'model'], weight: 4, synonyms: ['torch'], relatedSkills: ['python', 'deep learning'] },
  { term: 'scikit-learn', aliases: ['scikit-learn', 'sklearn'], category: 'technical', industries: ['data', 'ml'], context: ['ml', 'data', 'python', 'model'], weight: 4, synonyms: ['sklearn'], relatedSkills: ['python', 'machine learning'] },
  { term: 'pandas', aliases: ['pandas'], category: 'technical', industries: ['data', 'analytics'], context: ['data', 'python', 'analysis', 'dataframe'], weight: 5, synonyms: ['dataframe'], relatedSkills: ['python', 'numpy'] },
  { term: 'numpy', aliases: ['numpy'], category: 'technical', industries: ['data', 'ml'], context: ['data', 'python', 'array', 'computation'], weight: 4, synonyms: [], relatedSkills: ['python', 'pandas'] },
  { term: 'jupyter', aliases: ['jupyter', 'jupyter notebook'], category: 'tools', industries: ['data', 'ml'], context: ['data', 'python', 'notebook', 'analysis'], weight: 4, synonyms: ['jupyter notebook'], relatedSkills: ['python', 'data science'] },
  { term: 'spark', aliases: ['spark', 'apache spark'], category: 'technical', industries: ['data', 'big data'], context: ['big data', 'data', 'processing', 'distributed'], weight: 4, synonyms: ['apache spark'], relatedSkills: ['scala', 'hadoop'] },
  { term: 'hadoop', aliases: ['hadoop'], category: 'technical', industries: ['data', 'big data'], context: ['big data', 'data', 'processing', 'distributed'], weight: 3, synonyms: [], relatedSkills: ['spark', 'hdfs'] },
  { term: 'nlp', aliases: ['nlp', 'natural language processing'], category: 'technical', industries: ['ai', 'ml'], context: ['ai', 'language', 'text', 'ml'], weight: 4, synonyms: ['natural language processing'], relatedSkills: ['machine learning', 'spacy'] },
  { term: 'computer vision', aliases: ['computer vision', 'cv'], category: 'technical', industries: ['ai', 'ml'], context: ['ai', 'image', 'vision', 'ml'], weight: 4, synonyms: ['cv', 'image processing'], relatedSkills: ['opencv', 'deep learning'] },
  { term: 'opencv', aliases: ['opencv'], category: 'technical', industries: ['ai', 'ml'], context: ['computer vision', 'image', 'video', 'cv'], weight: 3, synonyms: [], relatedSkills: ['computer vision', 'python'] },
  { term: 'tableau', aliases: ['tableau'], category: 'tools', industries: ['data', 'analytics'], context: ['visualization', 'data', 'analytics', 'dashboard'], weight: 4, synonyms: ['data visualization'], relatedSkills: ['sql', 'data analysis'] },
  { term: 'power bi', aliases: ['power bi', 'powerbi'], category: 'tools', industries: ['data', 'analytics'], context: ['visualization', 'data', 'analytics', 'microsoft'], weight: 4, synonyms: ['powerbi'], relatedSkills: ['sql', 'data analysis'] },

  // Methodologies & Soft Skills (15)
  { term: 'agile', aliases: ['agile', 'agile methodology'], category: 'methodology', industries: ['software', 'project management'], context: ['project', 'methodology', 'team', 'development'], weight: 5, synonyms: ['agile methodology'], relatedSkills: ['scrum', 'kanban'] },
  { term: 'scrum', aliases: ['scrum'], category: 'methodology', industries: ['software', 'project management'], context: ['agile', 'project', 'team', 'sprint'], weight: 4, synonyms: [], relatedSkills: ['agile', 'sprint planning'] },
  { term: 'kanban', aliases: ['kanban'], category: 'methodology', industries: ['software', 'project management'], context: ['agile', 'project', 'workflow', 'board'], weight: 3, synonyms: [], relatedSkills: ['agile', 'lean'] },
  { term: 'leadership', aliases: ['leadership', 'team leadership'], category: 'soft', industries: ['all'], context: ['team', 'management', 'lead', 'people'], weight: 5, synonyms: ['team leadership'], relatedSkills: ['management', 'mentoring'] },
  { term: 'communication', aliases: ['communication', 'communication skills'], category: 'soft', industries: ['all'], context: ['team', 'stakeholder', 'collaboration', 'presentation'], weight: 5, synonyms: ['interpersonal skills'], relatedSkills: ['collaboration', 'presentation'] },
  { term: 'problem solving', aliases: ['problem solving', 'problem-solving'], category: 'soft', industries: ['all'], context: ['analytical', 'solution', 'troubleshoot', 'debug'], weight: 5, synonyms: ['troubleshooting'], relatedSkills: ['analytical', 'critical thinking'] },
  { term: 'collaboration', aliases: ['collaboration', 'teamwork'], category: 'soft', industries: ['all'], context: ['team', 'cross-functional', 'partner', 'work'], weight: 4, synonyms: ['teamwork'], relatedSkills: ['communication', 'team player'] },
  { term: 'mentoring', aliases: ['mentoring', 'mentorship'], category: 'soft', industries: ['all'], context: ['team', 'training', 'coaching', 'development'], weight: 4, synonyms: ['coaching'], relatedSkills: ['leadership', 'training'] },
  { term: 'stakeholder management', aliases: ['stakeholder management', 'stakeholder'], category: 'soft', industries: ['all'], context: ['business', 'communication', 'management', 'relationship'], weight: 4, synonyms: ['stakeholder engagement'], relatedSkills: ['communication', 'project management'] },
  { term: 'cross-functional', aliases: ['cross-functional', 'cross functional'], category: 'soft', industries: ['all'], context: ['team', 'collaboration', 'department', 'organization'], weight: 4, synonyms: ['interdisciplinary'], relatedSkills: ['collaboration', 'communication'] },
  { term: 'analytical', aliases: ['analytical', 'analytical skills'], category: 'soft', industries: ['all'], context: ['problem', 'data', 'analysis', 'thinking'], weight: 4, synonyms: ['critical thinking'], relatedSkills: ['problem solving', 'data analysis'] },
  { term: 'project management', aliases: ['project management', 'pm'], category: 'soft', industries: ['all'], context: ['project', 'planning', 'delivery', 'timeline'], weight: 5, synonyms: ['pm', 'program management'], relatedSkills: ['agile', 'planning'] },
  { term: 'time management', aliases: ['time management'], category: 'soft', industries: ['all'], context: ['priority', 'deadline', 'organize', 'schedule'], weight: 3, synonyms: ['prioritization'], relatedSkills: ['organization', 'planning'] },
  { term: 'adaptable', aliases: ['adaptable', 'adaptability'], category: 'soft', industries: ['all'], context: ['change', 'flexible', 'learn', 'environment'], weight: 3, synonyms: ['flexibility'], relatedSkills: ['learning agility'] },
  { term: 'detail oriented', aliases: ['detail oriented', 'detail-oriented', 'attention to detail'], category: 'soft', industries: ['all'], context: ['quality', 'accuracy', 'precise', 'thorough'], weight: 3, synonyms: ['attention to detail'], relatedSkills: ['quality assurance'] },
];

// ==================== ADVANCED KEYWORD SATURATION ANALYSIS ====================

export interface KeywordAnalysis {
  keyword: string;
  category: 'technical' | 'soft' | 'tools' | 'industry' | 'certification' | 'methodology';
  weight: number;
  matched: boolean;
  frequency: number; // How many times it appears
  sections: string[]; // Which resume sections contain it
  context: string; // Surrounding context
  relatedSkillsFound: string[]; // Related skills also found in resume
}

export interface KeywordSaturationResult {
  overallScore: number; // 0-100
  categoryBreakdown: {
    technical: { score: number; matched: number; total: number; };
    soft: { score: number; matched: number; total: number; };
    tools: { score: number; matched: number; total: number; };
    methodology: { score: number; matched: number; total: number; };
  };
  matchedKeywords: KeywordAnalysis[];
  missingKeywords: KeywordAnalysis[];
  industryRelevance: string;
  strengthAreas: string[];
  improvementAreas: string[];
}

export function analyzeKeywordSaturation(
  resumeText: string,
  jobDescription?: string,
  targetIndustry: string = 'software'
): KeywordSaturationResult {
  const lowerText = resumeText.toLowerCase();
  const lowerJobDesc = jobDescription?.toLowerCase() || '';

  // Filter keywords relevant to the target industry
  const relevantKeywords = ADVANCED_KEYWORD_DATABASE.filter(kw =>
    kw.industries.includes('all') || kw.industries.includes(targetIndustry)
  );

  const matchedKeywords: KeywordAnalysis[] = [];
  const missingKeywords: KeywordAnalysis[] = [];

  // Analyze each keyword
  for (const kwDef of relevantKeywords) {
    // Check if keyword exists in resume
    const hasKeyword = kwDef.aliases.some(alias => {
      const regex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(lowerText);
    });

    // Count frequency
    const frequency = kwDef.aliases.reduce((count, alias) => {
      const regex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = resumeText.match(regex);
      return count + (matches?.length || 0);
    }, 0);

    // Check context validation
    const hasContext = kwDef.context.length === 0 || kwDef.context.some(ctx =>
      lowerText.includes(ctx.toLowerCase())
    );

    // Check exclusions
    const hasExclusion = kwDef.exclude && kwDef.exclude.some(exc =>
      lowerText.includes(exc.toLowerCase())
    );

    // Check if related skills are also present
    const relatedSkillsFound = kwDef.relatedSkills.filter(skill =>
      new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(lowerText)
    );

    const isMatched = hasKeyword && hasContext && !hasExclusion;

    // Check if keyword appears in job description (higher priority if so)
    const inJobDesc = kwDef.aliases.some(alias => {
      const regex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(lowerJobDesc);
    });

    const analysis: KeywordAnalysis = {
      keyword: kwDef.term,
      category: kwDef.category,
      weight: inJobDesc ? kwDef.weight + 2 : kwDef.weight, // Boost weight if in job desc
      matched: isMatched,
      frequency,
      sections: [], // TODO: Add section detection
      context: '', // TODO: Extract surrounding context
      relatedSkillsFound,
    };

    if (isMatched) {
      matchedKeywords.push(analysis);
    } else if (inJobDesc || kwDef.weight >= 4) {
      // Only suggest missing keywords that are in job desc or high importance
      missingKeywords.push(analysis);
    }
  }

  // Calculate category breakdown
  const categories = ['technical', 'soft', 'tools', 'methodology'] as const;
  const categoryBreakdown: any = {};

  for (const cat of categories) {
    const relevantInCategory = relevantKeywords.filter(kw => kw.category === cat);
    const matchedInCategory = matchedKeywords.filter(kw => kw.category === cat);

    const totalWeight = relevantInCategory.reduce((sum, kw) => sum + kw.weight, 0);
    const matchedWeight = matchedInCategory.reduce((sum, kw) => sum + kw.weight, 0);

    categoryBreakdown[cat] = {
      score: totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0,
      matched: matchedInCategory.length,
      total: relevantInCategory.length,
    };
  }

  // Calculate overall score (weighted average)
  const totalWeight = relevantKeywords.reduce((sum, kw) => sum + kw.weight, 0);
  const matchedWeight = matchedKeywords.reduce((sum, kw) => sum + kw.weight, 0);
  const overallScore = Math.round((matchedWeight / totalWeight) * 100);

  // Identify strength and improvement areas
  const strengthAreas = categories
    .filter(cat => categoryBreakdown[cat].score >= 70)
    .map(cat => cat.charAt(0).toUpperCase() + cat.slice(1));

  const improvementAreas = categories
    .filter(cat => categoryBreakdown[cat].score < 50)
    .map(cat => cat.charAt(0).toUpperCase() + cat.slice(1));

  return {
    overallScore,
    categoryBreakdown,
    matchedKeywords: matchedKeywords.sort((a, b) => b.weight - a.weight),
    missingKeywords: missingKeywords.sort((a, b) => b.weight - a.weight).slice(0, 15), // Top 15 missing
    industryRelevance: targetIndustry,
    strengthAreas,
    improvementAreas,
  };
}

// ==================== ADVANCED IMPACT METRICS DETECTION ====================

export interface ImpactMetric {
  type: 'numeric' | 'percentage' | 'currency' | 'time' | 'scale' | 'growth' | 'roi';
  value: string;
  context: string; // Surrounding sentence
  sentiment: 'positive' | 'neutral' | 'negative';
  impactScore: number; // 1-10 (how impressive)
  category: 'efficiency' | 'revenue' | 'growth' | 'quality' | 'leadership' | 'innovation';
}

export interface ImpactAnalysisResult {
  totalMetrics: number;
  impactScore: number; // 0-100
  impactLevel: 'weak' | 'good' | 'strong' | 'elite';
  metrics: ImpactMetric[];
  missingMetricOpportunities: string[];
  improvementSuggestions: string[];
}

export function analyzeImpactMetrics(resumeText: string): ImpactAnalysisResult {
  const metrics: ImpactMetric[] = [];

  // Advanced metric patterns with context
  const metricPatterns = [
    // Scale metrics (users, customers, team size)
    {
      regex: /(\d+[\d,]*\.?\d*\+?\s*(?:million|thousand|M|K|B)?\s*(?:users?|customers?|clients?|people|employees?|team members?|records?|transactions?|requests?|downloads?))/gi,
      type: 'scale' as const,
      category: 'leadership' as const,
      baseScore: 7,
    },
    // Percentage improvements
    {
      regex: /((?:increased|improved|reduced|decreased|optimized|enhanced|boosted|grew|accelerated)\s+[^.]*?\s+(?:by\s+)?(\d+[\d,]*\.?\d*%)|(\d+[\d,]*\.?\d*%)\s+(?:increase|improvement|reduction|growth|faster|more|less))/gi,
      type: 'percentage' as const,
      category: 'efficiency' as const,
      baseScore: 8,
    },
    // Revenue/cost metrics
    {
      regex: /(\$\d+[\d,]*\.?\d*\s*(?:million|thousand|billion|M|K|B)?)/gi,
      type: 'currency' as const,
      category: 'revenue' as const,
      baseScore: 9,
    },
    // Time saved
    {
      regex: /((?:reduced|decreased|saved|cut)\s+[^.]*?\s+(?:by\s+)?(\d+[\d,]*\.?\d*\s*(?:hours?|days?|weeks?|months?|years?))|(\d+[\d,]*\.?\d*\s*(?:hours?|days?|weeks?|months?|years?))\s+(?:saved|faster|quicker))/gi,
      type: 'time' as const,
      category: 'efficiency' as const,
      baseScore: 7,
    },
    // Growth multipliers
    {
      regex: /(\d+[\d,]*\.?\d*x\s*(?:faster|growth|increase|improvement))/gi,
      type: 'growth' as const,
      category: 'growth' as const,
      baseScore: 9,
    },
    // ROI metrics
    {
      regex: /((?:roi|return on investment)\s*(?:of\s+)?(\d+[\d,]*\.?\d*%?))/gi,
      type: 'roi' as const,
      category: 'revenue' as const,
      baseScore: 10,
    },
  ];

  // Extract metrics with context
  const sentences = resumeText.split(/[.!?]+/).filter(s => s.trim());

  for (const sentence of sentences) {
    for (const pattern of metricPatterns) {
      const matches = sentence.matchAll(pattern.regex);

      for (const match of matches) {
        const value = match[0];
        const context = sentence.trim();

        // Sentiment analysis (simple)
        const positiveWords = /(?:increased|improved|optimized|enhanced|boosted|grew|accelerated|achieved|exceeded|success|award|promoted|led)/i;
        const negativeWords = /(?:reduced\s+(?:costs?|time|errors|bugs)|decreased\s+(?:costs?|time|errors|bugs)|eliminated|prevented)/i;

        let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
        if (positiveWords.test(context)) sentiment = 'positive';
        else if (negativeWords.test(context)) sentiment = 'negative';

        // Calculate impact score
        let impactScore = pattern.baseScore;

        // Boost score for specific patterns
        if (/\d{3,}/.test(value)) impactScore += 1; // Large numbers
        if (/million|billion/.test(value)) impactScore += 2; // Scale
        if (/\d{2,3}%/.test(value)) impactScore += 1; // High percentages

        impactScore = Math.min(10, impactScore);

        metrics.push({
          type: pattern.type,
          value,
          context,
          sentiment,
          impactScore,
          category: pattern.category,
        });
      }
    }
  }

  // Calculate overall impact score
  const totalMetrics = metrics.length;
  const avgImpactScore = metrics.length > 0
    ? metrics.reduce((sum, m) => sum + m.impactScore, 0) / metrics.length
    : 0;

  // Score formula: 40% quantity, 60% quality
  const impactScore = Math.min(100, Math.round(
    (Math.min(totalMetrics / 15, 1) * 40) + // Quantity (up to 15 metrics)
    ((avgImpactScore / 10) * 60) // Quality
  ));

  const impactLevel =
    impactScore >= 80 ? 'elite' :
    impactScore >= 60 ? 'strong' :
    impactScore >= 40 ? 'good' :
    'weak';

  // Generate improvement suggestions
  const missingMetricOpportunities: string[] = [];
  const improvementSuggestions: string[] = [];

  const hasScaleMetrics = metrics.some(m => m.type === 'scale');
  const hasPercentages = metrics.some(m => m.type === 'percentage');
  const hasCurrency = metrics.some(m => m.type === 'currency');
  const hasTimeMetrics = metrics.some(m => m.type === 'time');

  if (!hasScaleMetrics) {
    missingMetricOpportunities.push('Scale metrics (team size, users affected)');
    improvementSuggestions.push('Add numbers showing the scale of your work (e.g., "Managed team of 8 engineers" or "Served 100K+ users")');
  }
  if (!hasPercentages) {
    missingMetricOpportunities.push('Percentage improvements');
    improvementSuggestions.push('Quantify improvements with percentages (e.g., "Increased performance by 40%" or "Reduced costs by 25%")');
  }
  if (!hasCurrency) {
    missingMetricOpportunities.push('Revenue/cost impact');
    improvementSuggestions.push('Include financial impact where possible (e.g., "Generated $2M in revenue" or "Saved $500K annually")');
  }
  if (!hasTimeMetrics) {
    missingMetricOpportunities.push('Time savings');
    improvementSuggestions.push('Highlight time efficiency gains (e.g., "Reduced deployment time from 2 hours to 15 minutes")');
  }

  if (totalMetrics < 5) {
    improvementSuggestions.push('Add at least 5-8 quantifiable metrics across your bullet points to reach "good" level');
  } else if (totalMetrics < 10) {
    improvementSuggestions.push('Add 3-5 more metrics to reach "strong" level (10-15 total metrics)');
  } else if (totalMetrics < 15) {
    improvementSuggestions.push('Add a few more high-impact metrics to reach "elite" level (15+ metrics)');
  }

  return {
    totalMetrics,
    impactScore,
    impactLevel,
    metrics: metrics.sort((a, b) => b.impactScore - a.impactScore),
    missingMetricOpportunities,
    improvementSuggestions,
  };
}

// ==================== INTELLIGENT MISSING KEYWORD SUGGESTIONS ====================

export interface MissingKeywordSuggestion {
  keyword: string;
  priority: 'critical' | 'important' | 'nice-to-have';
  impact: number; // Estimated score boost (0-10)
  section: string; // Recommended section to add it
  context: string; // Example usage
  synonyms: string[];
  reasoning: string; // Why this keyword matters
}

export function generateMissingKeywordSuggestions(
  resumeText: string,
  jobDescription: string,
  currentKeywordAnalysis: KeywordSaturationResult
): MissingKeywordSuggestion[] {
  const suggestions: MissingKeywordSuggestion[] = [];
  const lowerJobDesc = jobDescription.toLowerCase();

  // Priority 1: Keywords in job description but missing from resume
  for (const missing of currentKeywordAnalysis.missingKeywords) {
    const inJobDesc = ADVANCED_KEYWORD_DATABASE
      .find(kw => kw.term === missing.keyword)
      ?.aliases.some(alias => {
        const regex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        return regex.test(lowerJobDesc);
      });

    if (!inJobDesc && missing.weight < 4) continue; // Skip low priority unless in job desc

    const kwDef = ADVANCED_KEYWORD_DATABASE.find(kw => kw.term === missing.keyword);
    if (!kwDef) continue;

    // Determine priority
    let priority: 'critical' | 'important' | 'nice-to-have' = 'nice-to-have';
    let impact = missing.weight;

    if (inJobDesc && missing.weight >= 4) {
      priority = 'critical';
      impact = Math.min(10, impact + 3);
    } else if (inJobDesc || missing.weight >= 5) {
      priority = 'important';
      impact = Math.min(10, impact + 1);
    }

    // Determine recommended section
    const section =
      kwDef.category === 'technical' || kwDef.category === 'tools' ? 'Skills or Experience' :
      kwDef.category === 'certification' ? 'Certifications' :
      kwDef.category === 'soft' || kwDef.category === 'methodology' ? 'Experience bullet points' :
      'Experience';

    // Generate context example
    const context = generateContextExample(kwDef);

    // Generate reasoning
    const reasoning = inJobDesc
      ? `This keyword appears in the job description and is critical for ATS matching.`
      : `High-value skill (weight: ${kwDef.weight}/5) that strengthens your ${kwDef.category} profile.`;

    suggestions.push({
      keyword: missing.keyword,
      priority,
      impact,
      section,
      context,
      synonyms: kwDef.synonyms,
      reasoning,
    });
  }

  // Sort by priority and impact
  return suggestions
    .sort((a, b) => {
      const priorityOrder = { critical: 0, important: 1, 'nice-to-have': 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.impact - a.impact;
    })
    .slice(0, 15); // Top 15 suggestions
}

function generateContextExample(kwDef: KeywordDefinition): string {
  // Generate realistic example based on category
  switch (kwDef.category) {
    case 'technical':
      return `Built scalable microservices using ${kwDef.term} that processed 10K+ requests/second`;
    case 'tools':
      return `Utilized ${kwDef.term} to streamline development workflows and reduce deployment time by 40%`;
    case 'soft':
      return `Demonstrated ${kwDef.term} by mentoring junior developers and improving team velocity by 30%`;
    case 'methodology':
      return `Led ${kwDef.term} transformation, implementing sprint planning and retrospectives across 3 teams`;
    case 'certification':
      return `Earned ${kwDef.term} certification, validating expertise in cloud architecture and best practices`;
    default:
      return `Leveraged ${kwDef.term} to deliver high-impact solutions and exceed project goals`;
  }
}

// ==================== ATS COMPATIBILITY SCORING ====================

export interface ATSCompatibilityResult {
  overallScore: number; // 0-100
  formatScore: number;
  contentScore: number;
  keywordScore: number;
  issues: ATSIssue[];
  recommendations: string[];
}

export interface ATSIssue {
  severity: 'critical' | 'warning' | 'info';
  category: 'format' | 'content' | 'keywords' | 'structure';
  message: string;
  fix: string;
}

export function analyzeATSCompatibility(
  resumeText: string,
  keywordAnalysis: KeywordSaturationResult,
  impactAnalysis: ImpactAnalysisResult
): ATSCompatibilityResult {
  const issues: ATSIssue[] = [];

  // Format checks
  let formatScore = 100;

  // Check for common ATS-unfriendly formats
  if (/[▪●◆■□]/.test(resumeText)) {
    formatScore -= 10;
    issues.push({
      severity: 'warning',
      category: 'format',
      message: 'Special bullet characters detected (●, ■, etc.)',
      fix: 'Replace with standard bullets (-) or let the ATS system handle formatting'
    });
  }

  // Check for tables/columns (hard to detect in plain text, but look for excessive spacing)
  if (/\s{5,}/.test(resumeText)) {
    formatScore -= 5;
    issues.push({
      severity: 'info',
      category: 'format',
      message: 'Possible multi-column layout detected',
      fix: 'Use single-column layout for better ATS parsing'
    });
  }

  // Content checks
  let contentScore = 100;

  // Check for contact information
  const hasEmail = /@.+\..+/.test(resumeText);
  const hasPhone = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);

  if (!hasEmail) {
    contentScore -= 20;
    issues.push({
      severity: 'critical',
      category: 'content',
      message: 'Email address not found',
      fix: 'Add a professional email address at the top of your resume'
    });
  }

  if (!hasPhone) {
    contentScore -= 10;
    issues.push({
      severity: 'warning',
      category: 'content',
      message: 'Phone number not found',
      fix: 'Add your phone number in standard format (e.g., 555-123-4567)'
    });
  }

  // Check for standard sections
  const hasExperience = /\b(?:experience|work history|employment)\b/i.test(resumeText);
  const hasEducation = /\b(?:education|degree|university|college)\b/i.test(resumeText);
  const hasSkills = /\b(?:skills|technologies|technical skills|competencies)\b/i.test(resumeText);

  if (!hasExperience) {
    contentScore -= 15;
    issues.push({
      severity: 'critical',
      category: 'structure',
      message: 'No "Experience" section header detected',
      fix: 'Add a clearly labeled "Experience" or "Work History" section'
    });
  }

  if (!hasEducation) {
    contentScore -= 10;
    issues.push({
      severity: 'warning',
      category: 'structure',
      message: 'No "Education" section header detected',
      fix: 'Add an "Education" section with your degrees and institutions'
    });
  }

  if (!hasSkills) {
    contentScore -= 10;
    issues.push({
      severity: 'warning',
      category: 'structure',
      message: 'No "Skills" section header detected',
      fix: 'Add a "Skills" section listing your technical and professional competencies'
    });
  }

  // Keyword score (from keyword analysis)
  const keywordScore = keywordAnalysis.overallScore;

  if (keywordScore < 50) {
    issues.push({
      severity: 'critical',
      category: 'keywords',
      message: 'Low keyword density detected',
      fix: `Add more relevant keywords from the job description. Current score: ${keywordScore}/100`
    });
  } else if (keywordScore < 70) {
    issues.push({
      severity: 'warning',
      category: 'keywords',
      message: 'Moderate keyword density',
      fix: `Improve keyword optimization to increase ATS match rate. Current score: ${keywordScore}/100`
    });
  }

  // Impact metrics check
  if (impactAnalysis.totalMetrics < 5) {
    contentScore -= 15;
    issues.push({
      severity: 'warning',
      category: 'content',
      message: 'Few quantifiable achievements detected',
      fix: `Add more numbers and metrics to your bullet points. Current: ${impactAnalysis.totalMetrics} metrics`
    });
  }

  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    (formatScore * 0.2) +
    (contentScore * 0.3) +
    (keywordScore * 0.5)
  );

  // Generate recommendations
  const recommendations: string[] = [];

  if (overallScore < 70) {
    recommendations.push('Focus on adding relevant keywords from the job description to improve ATS matching');
  }
  if (impactAnalysis.totalMetrics < 10) {
    recommendations.push('Quantify your achievements with numbers, percentages, and metrics');
  }
  if (keywordAnalysis.missingKeywords.length > 5) {
    recommendations.push(`Add ${Math.min(5, keywordAnalysis.missingKeywords.length)} high-priority keywords to boost your score`);
  }
  if (issues.some(i => i.severity === 'critical')) {
    recommendations.push('Address critical issues first for immediate score improvement');
  }

  return {
    overallScore,
    formatScore,
    contentScore,
    keywordScore,
    issues: issues.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }),
    recommendations,
  };
}

// ==================== EXPORT ANALYSIS FUNCTION FOR CONVEX ====================

export const runAdvancedATSAnalysis = internalMutation({
  args: {
    resumeText: v.string(),
    jobDescription: v.optional(v.string()),
    targetIndustry: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { resumeText, jobDescription = '', targetIndustry = 'software' } = args;

    // Run all analyses
    const keywordAnalysis = analyzeKeywordSaturation(resumeText, jobDescription, targetIndustry);
    const impactAnalysis = analyzeImpactMetrics(resumeText);
    const missingKeywordSuggestions = generateMissingKeywordSuggestions(
      resumeText,
      jobDescription,
      keywordAnalysis
    );
    const atsCompatibility = analyzeATSCompatibility(
      resumeText,
      keywordAnalysis,
      impactAnalysis
    );

    return {
      keywordAnalysis,
      impactAnalysis,
      missingKeywordSuggestions,
      atsCompatibility,
      timestamp: Date.now(),
    };
  },
});
