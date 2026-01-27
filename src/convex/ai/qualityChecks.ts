export const buzzwords = [
  "synergy", "thought leader", "rockstar", "ninja", "guru", 
  "go-getter", "self-starter", "hard worker", "team player",
  "detail-oriented", "proactive", "strategic thinker", "best of breed",
  "bottom line", "core competency", "ecosystem", "paradigm shift",
  "game changer", "out of the box", "leverage"
];

export const commonTechCapitalization: Record<string, string> = {
  "javascript": "JavaScript",
  "typescript": "TypeScript",
  "react": "React",
  "next.js": "Next.js",
  "node.js": "Node.js",
  "github": "GitHub",
  "devops": "DevOps",
  "aws": "AWS",
  "api": "API",
  "sql": "SQL",
  "nosql": "NoSQL",
  "jquery": "jQuery",
  "mongodb": "MongoDB",
  "postgresql": "PostgreSQL",
  "mysql": "MySQL",
  "docker": "Docker",
  "kubernetes": "Kubernetes",
  "linux": "Linux",
  "python": "Python",
  "java": "Java",
  "html": "HTML",
  "css": "CSS",
  "saas": "SaaS",
  "paas": "PaaS",
  "iaas": "IaaS",
  "json": "JSON",
  "xml": "XML",
  "jwt": "JWT",
  "oauth": "OAuth"
};

export function checkBuzzwords(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  // Use word boundary to avoid partial matches
  buzzwords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(lower)) found.push(word);
  });
  return [...new Set(found)]; // Deduplicate
}

export function checkCapitalization(text: string): string[] {
  const issues: string[] = [];
  
  Object.entries(commonTechCapitalization).forEach(([key, correct]) => {
    // Find all occurrences of the word (case-insensitive)
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    const matches = text.match(regex);
    
    if (matches) {
      matches.forEach(match => {
        // Check if it matches the correct form OR is fully uppercase (acronyms/headers)
        if (match !== correct && match !== correct.toUpperCase()) {
           // Avoid duplicates in the report
           const issue = `${match} → ${correct}`;
           if (!issues.includes(issue)) {
             issues.push(issue);
           }
        }
      });
    }
  });
  
  return issues.slice(0, 5); // Limit to top 5 to avoid overwhelming
}

export function checkRepetitiveStarts(text: string): string[] {
    // Split into lines and clean up
    const lines = text.split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 20); // Only consider substantial lines
      
    const starts: Record<string, number> = {};
    
    lines.forEach(line => {
        // Remove bullet points if present
        const cleanLine = line.replace(/^[-•*]\s*/, '');
        const firstWord = cleanLine.split(' ')[0].toLowerCase();
        
        // Only check verbs/common starters (length > 3 to avoid "The", "A", etc.)
        if (firstWord.length > 3) {
            starts[firstWord] = (starts[firstWord] || 0) + 1;
        }
    });
    
    const repetitive = Object.entries(starts)
        .filter(([word, count]) => count >= 4) // 4 or more lines starting with same word
        .map(([word, count]) => `"${word}" starts ${count} lines`);
        
    return repetitive;
}
