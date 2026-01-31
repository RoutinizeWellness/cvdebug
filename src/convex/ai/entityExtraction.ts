// Elite Match Tool - Entity Extraction System
// Extracts meaningful entities from Job Descriptions beyond simple keywords

export interface ExtractedEntity {
  text: string;
  category: 'hard_skill' | 'soft_skill' | 'metric' | 'tool' | 'framework' | 'certification' | 'industry_term';
  importance: 'critical' | 'important' | 'nice_to_have';
  context?: string; // Surrounding text for context
  synonyms?: string[]; // Alternative ways to express this
}

export interface JobDescriptionEntities {
  hardSkills: ExtractedEntity[];
  softSkills: ExtractedEntity[];
  metrics: ExtractedEntity[];
  tools: ExtractedEntity[];
  frameworks: ExtractedEntity[];
  certifications: ExtractedEntity[];
  industryTerms: ExtractedEntity[];
  mustHaves: ExtractedEntity[]; // "Required", "Must have" items
  niceToHaves: ExtractedEntity[]; // "Preferred", "Nice to have" items
}

// Comprehensive skill databases
const HARD_SKILLS_DATABASE = {
  programming: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
    'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl', 'Shell',
    'SQL', 'NoSQL', 'GraphQL', 'HTML', 'CSS', 'Sass', 'Less'
  ],
  frameworks: [
    'React', 'Vue', 'Angular', 'Next.js', 'Nuxt', 'Svelte', 'Node.js', 'Express',
    'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Laravel', 'Ruby on Rails',
    'ASP.NET', 'Flutter', 'React Native', 'Ionic', 'Electron'
  ],
  cloud: [
    'AWS', 'Azure', 'GCP', 'Google Cloud', 'Digital Ocean', 'Heroku', 'Vercel',
    'Netlify', 'EC2', 'S3', 'Lambda', 'CloudFront', 'ECS', 'EKS', 'RDS',
    'DynamoDB', 'Cloud Functions', 'App Engine', 'Cloud Run'
  ],
  devops: [
    'Docker', 'Kubernetes', 'K8s', 'Jenkins', 'GitLab CI', 'GitHub Actions',
    'CircleCI', 'Travis CI', 'Terraform', 'Ansible', 'Chef', 'Puppet',
    'Helm', 'ArgoCD', 'Prometheus', 'Grafana', 'Datadog', 'New Relic'
  ],
  databases: [
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Cassandra', 'Elasticsearch',
    'DynamoDB', 'Firebase', 'Supabase', 'PlanetScale', 'CockroachDB',
    'Oracle', 'SQL Server', 'MariaDB', 'SQLite'
  ],
  tools: [
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'JIRA', 'Confluence', 'Slack',
    'VS Code', 'IntelliJ', 'Eclipse', 'Xcode', 'Android Studio', 'Figma',
    'Sketch', 'Photoshop', 'Illustrator'
  ]
};

const SOFT_SKILLS_PATTERNS = [
  { pattern: /\b(leadership|lead|leading|led)\b/i, skill: 'Leadership', synonyms: ['Team Leadership', 'Leading Teams', 'Lead Developer'] },
  { pattern: /\b(mentor|mentoring|mentorship|coaching)\b/i, skill: 'Mentoring', synonyms: ['Coaching', 'Training Junior Developers'] },
  { pattern: /\b(communication|communicate|communicating)\b/i, skill: 'Communication', synonyms: ['Stakeholder Communication', 'Technical Writing'] },
  { pattern: /\b(collaboration|collaborate|collaborative|cross-functional)\b/i, skill: 'Collaboration', synonyms: ['Teamwork', 'Cross-functional Collaboration'] },
  { pattern: /\b(problem.solving|analytical|critical.thinking)\b/i, skill: 'Problem Solving', synonyms: ['Analytical Thinking', 'Critical Thinking'] },
  { pattern: /\b(agile|scrum|kanban|sprint)\b/i, skill: 'Agile Methodologies', synonyms: ['Scrum', 'Kanban', 'Agile Development'] },
  { pattern: /\b(stakeholder|client.facing|customer.facing)\b/i, skill: 'Stakeholder Management', synonyms: ['Client Relations', 'Customer Engagement'] },
  { pattern: /\b(presentation|presenting|public.speaking)\b/i, skill: 'Presentation Skills', synonyms: ['Public Speaking', 'Technical Presentations'] },
  { pattern: /\b(documentation|documenting|technical.writing)\b/i, skill: 'Documentation', synonyms: ['Technical Writing', 'API Documentation'] },
  { pattern: /\b(time.management|priorit|deadline)\b/i, skill: 'Time Management', synonyms: ['Prioritization', 'Deadline Management'] }
];

const METRIC_PATTERNS = [
  { pattern: /\b(\d+[\+]?\s*years?)\s+(of\s+)?experience\b/i, type: 'years_experience' },
  { pattern: /\b(high.volume|scale|scalab|million\s+users|thousand\s+users)\b/i, type: 'scale_metrics' },
  { pattern: /\b(budget|revenue|cost|savings|ROI)\b/i, type: 'financial_metrics' },
  { pattern: /\b(performance|optimization|speed|latency|response.time)\b/i, type: 'performance_metrics' },
  { pattern: /\b(team\s+of\s+\d+|manage\s+\d+|lead\s+\d+)\b/i, type: 'team_size' },
  { pattern: /\b(\d+%|percent|percentage)\s+(increase|decrease|improvement|growth)\b/i, type: 'percentage_metrics' }
];

const CERTIFICATION_PATTERNS = [
  'AWS Certified', 'Azure Certified', 'GCP Certified', 'PMP', 'Scrum Master',
  'CSM', 'CSPO', 'CKA', 'CKAD', 'CKS', 'CISSP', 'CompTIA', 'CCNA', 'CCNP'
];

/**
 * Extract all entities from a job description
 */
export function extractJobEntities(jobDescription: string): JobDescriptionEntities {
  const text = jobDescription.toLowerCase();
  const originalText = jobDescription;

  const entities: JobDescriptionEntities = {
    hardSkills: [],
    softSkills: [],
    metrics: [],
    tools: [],
    frameworks: [],
    certifications: [],
    industryTerms: [],
    mustHaves: [],
    niceToHaves: []
  };

  // Extract Hard Skills
  Object.entries(HARD_SKILLS_DATABASE).forEach(([category, skills]) => {
    skills.forEach(skill => {
      // Escape special characters for regex (e.g. C++ -> C\+\+)
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedSkill}\\b`, 'gi');
      const matches = originalText.match(regex);

      if (matches) {
        const context = extractContext(originalText, skill);
        const importance = determineImportance(context, originalText);

        const entity: ExtractedEntity = {
          text: skill,
          category: category === 'frameworks' ? 'framework' : category === 'tools' ? 'tool' : 'hard_skill',
          importance,
          context,
          synonyms: getSynonyms(skill)
        };

        if (category === 'frameworks') {
          entities.frameworks.push(entity);
        } else if (category === 'tools') {
          entities.tools.push(entity);
        } else {
          entities.hardSkills.push(entity);
        }

        // Add to mustHaves or niceToHaves based on context
        if (importance === 'critical') {
          entities.mustHaves.push(entity);
        } else if (importance === 'nice_to_have') {
          entities.niceToHaves.push(entity);
        }
      }
    });
  });

  // Extract Soft Skills
  SOFT_SKILLS_PATTERNS.forEach(({ pattern, skill, synonyms }) => {
    if (pattern.test(originalText)) {
      const context = extractContextByPattern(originalText, pattern);
      const importance = determineImportance(context, originalText);

      entities.softSkills.push({
        text: skill,
        category: 'soft_skill',
        importance,
        context,
        synonyms
      });
    }
  });

  // Extract Metrics
  METRIC_PATTERNS.forEach(({ pattern, type }) => {
    const matches = originalText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const context = extractContext(originalText, match);

        entities.metrics.push({
          text: match,
          category: 'metric',
          importance: 'important',
          context
        });
      });
    }
  });

  // Extract Certifications
  CERTIFICATION_PATTERNS.forEach(cert => {
    // Escape special characters for regex
    const escapedCert = cert.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedCert}\\b`, 'gi');
    if (regex.test(originalText)) {
      const context = extractContext(originalText, cert);

      entities.certifications.push({
        text: cert,
        category: 'certification',
        importance: 'important',
        context
      });
    }
  });

  // Deduplicate and sort by importance
  entities.hardSkills = deduplicateEntities(entities.hardSkills);
  entities.softSkills = deduplicateEntities(entities.softSkills);
  entities.frameworks = deduplicateEntities(entities.frameworks);
  entities.tools = deduplicateEntities(entities.tools);
  entities.mustHaves = deduplicateEntities(entities.mustHaves);
  entities.niceToHaves = deduplicateEntities(entities.niceToHaves);

  return entities;
}

/**
 * Extract context around a found entity (50 chars before and after)
 */
function extractContext(text: string, entity: string): string {
  const index = text.toLowerCase().indexOf(entity.toLowerCase());
  if (index === -1) return '';

  const start = Math.max(0, index - 50);
  const end = Math.min(text.length, index + entity.length + 50);

  return text.substring(start, end).trim();
}

/**
 * Extract context using regex pattern
 */
function extractContextByPattern(text: string, pattern: RegExp): string {
  const match = text.match(pattern);
  if (!match) return '';

  const index = match.index || 0;
  const start = Math.max(0, index - 50);
  const end = Math.min(text.length, index + match[0].length + 50);

  return text.substring(start, end).trim();
}

/**
 * Determine importance based on context keywords
 */
function determineImportance(context: string, fullText: string): 'critical' | 'important' | 'nice_to_have' {
  const lowerContext = context.toLowerCase();
  const lowerFull = fullText.toLowerCase();

  // Critical indicators
  const criticalKeywords = [
    'required', 'must have', 'mandatory', 'essential', 'critical',
    'core', 'fundamental', 'key requirement', 'necessary'
  ];

  // Nice to have indicators
  const niceToHaveKeywords = [
    'preferred', 'nice to have', 'bonus', 'plus', 'ideal', 'desirable',
    'would be great', 'additional', 'optional'
  ];

  for (const keyword of criticalKeywords) {
    if (lowerContext.includes(keyword) || lowerFull.includes(keyword)) {
      return 'critical';
    }
  }

  for (const keyword of niceToHaveKeywords) {
    if (lowerContext.includes(keyword)) {
      return 'nice_to_have';
    }
  }

  return 'important';
}

/**
 * Get synonyms for a skill
 */
function getSynonyms(skill: string): string[] {
  const synonymMap: Record<string, string[]> = {
    'JavaScript': ['JS', 'ECMAScript', 'ES6', 'ES2015+'],
    'TypeScript': ['TS'],
    'Kubernetes': ['K8s', 'k8s'],
    'PostgreSQL': ['Postgres', 'psql'],
    'MongoDB': ['Mongo'],
    'React': ['ReactJS', 'React.js'],
    'Node.js': ['NodeJS', 'Node'],
    'AWS': ['Amazon Web Services'],
    'GCP': ['Google Cloud Platform'],
    'CI/CD': ['Continuous Integration', 'Continuous Deployment'],
    'DevOps': ['Development Operations']
  };

  return synonymMap[skill] || [];
}

/**
 * Deduplicate entities by text (case-insensitive)
 */
function deduplicateEntities(entities: ExtractedEntity[]): ExtractedEntity[] {
  const seen = new Set<string>();
  return entities.filter(entity => {
    const key = entity.text.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Compare resume against job entities and find gaps
 */
export interface GapAnalysis {
  missingCritical: ExtractedEntity[]; // Must-haves that are missing
  missingImportant: ExtractedEntity[]; // Important skills missing
  matched: ExtractedEntity[]; // Skills that match
  score: number; // 0-100 compatibility score
  suggestions: string[]; // Human-readable suggestions
}

export function analyzeGaps(
  resumeText: string,
  jobEntities: JobDescriptionEntities
): GapAnalysis {
  const resumeLower = resumeText.toLowerCase();

  const allJobEntities = [
    ...jobEntities.hardSkills,
    ...jobEntities.softSkills,
    ...jobEntities.frameworks,
    ...jobEntities.tools,
    ...jobEntities.certifications
  ];

  const matched: ExtractedEntity[] = [];
  const missingCritical: ExtractedEntity[] = [];
  const missingImportant: ExtractedEntity[] = [];

  allJobEntities.forEach(entity => {
    // Check if entity or any synonym appears in resume
    const entityFound = resumeLower.includes(entity.text.toLowerCase()) ||
      (entity.synonyms || []).some(syn => resumeLower.includes(syn.toLowerCase()));

    if (entityFound) {
      matched.push(entity);
    } else {
      if (entity.importance === 'critical') {
        missingCritical.push(entity);
      } else if (entity.importance === 'important') {
        missingImportant.push(entity);
      }
    }
  });

  // Calculate score
  const totalEntities = allJobEntities.length;
  const matchedCount = matched.length;
  const criticalCount = allJobEntities.filter(e => e.importance === 'critical').length;
  const criticalMatched = matched.filter(e => e.importance === 'critical').length;

  // Weighted score: critical skills = 70%, other skills = 30%
  const criticalScore = criticalCount > 0 ? (criticalMatched / criticalCount) * 70 : 70;
  const otherScore = totalEntities > criticalCount
    ? ((matchedCount - criticalMatched) / (totalEntities - criticalCount)) * 30
    : 30;

  const score = Math.round(criticalScore + otherScore);

  // Generate suggestions
  const suggestions = generateSuggestions(missingCritical, missingImportant, matched);

  return {
    missingCritical,
    missingImportant,
    matched,
    score,
    suggestions
  };
}

/**
 * Generate human-readable suggestions
 */
function generateSuggestions(
  missingCritical: ExtractedEntity[],
  missingImportant: ExtractedEntity[],
  matched: ExtractedEntity[]
): string[] {
  const suggestions: string[] = [];

  if (missingCritical.length > 0) {
    missingCritical.slice(0, 3).forEach(entity => {
      suggestions.push(
        `La oferta pide experiencia en '${entity.text}' (CRÍTICO). Este es un bloqueador - sin esto, el ATS te descarta. Necesitas añadir este skill inmediatamente.`
      );
    });
  }

  if (missingImportant.length > 0) {
    missingImportant.slice(0, 3).forEach(entity => {
      suggestions.push(
        `Te falta '${entity.text}'. Aunque no es crítico, mejorará significativamente tu match score. ${entity.context ? `Contexto: "${entity.context.substring(0, 80)}..."` : ''}`
      );
    });
  }

  if (matched.length > 0 && missingCritical.length === 0) {
    suggestions.push(
      `✅ Excelente - tienes todos los skills críticos. Ahora optimiza añadiendo los skills importantes para destacar.`
    );
  }

  return suggestions;
}
