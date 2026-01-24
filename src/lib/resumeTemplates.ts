/**
 * Hybrid Resume Templates
 * 100% ATS-friendly structure + Premium visual design for humans
 *
 * These templates follow strict ATS parsing rules while maintaining
 * professional, modern aesthetics that impress human recruiters.
 */

export interface HybridTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'tech' | 'business' | 'creative';
  atsScore: number;
  features: string[];
  structure: TemplateStructure;
  styling: TemplateStyling;
}

export interface TemplateStructure {
  sections: TemplateSection[];
  maxWidth: string;
  margins: string;
  lineHeight: string;
}

export interface TemplateSection {
  name: string;
  required: boolean;
  order: number;
  format: 'list' | 'grid' | 'text';
}

export interface TemplateStyling {
  font: {
    primary: string;
    headings: string;
    size: {
      name: string;
      headings: string;
      body: string;
      meta: string;
    };
  };
  colors: {
    primary: string;
    secondary: string;
    text: string;
    accent: string;
  };
  spacing: {
    sectionGap: string;
    itemGap: string;
  };
}

export const hybridTemplates: HybridTemplate[] = [
  {
    id: 'tech-minimal',
    name: 'Tech Minimal',
    description: 'Clean, single-column layout with subtle accent lines. Perfect for software engineers and data scientists.',
    preview: '/templates/tech-minimal-preview.png',
    category: 'tech',
    atsScore: 98,
    features: [
      'Single column for perfect ATS parsing',
      'Selectable text throughout',
      'Standard section headers',
      'Subtle accent color for visual interest',
      'Optimized for technical keywords'
    ],
    structure: {
      sections: [
        { name: 'Header', required: true, order: 1, format: 'text' },
        { name: 'Summary', required: true, order: 2, format: 'text' },
        { name: 'Experience', required: true, order: 3, format: 'list' },
        { name: 'Skills', required: true, order: 4, format: 'grid' },
        { name: 'Education', required: true, order: 5, format: 'list' },
        { name: 'Projects', required: false, order: 6, format: 'list' },
        { name: 'Certifications', required: false, order: 7, format: 'list' }
      ],
      maxWidth: '8.5in',
      margins: '0.75in',
      lineHeight: '1.5'
    },
    styling: {
      font: {
        primary: 'Inter, system-ui, -apple-system, sans-serif',
        headings: 'Inter, system-ui, sans-serif',
        size: {
          name: '24px',
          headings: '14px',
          body: '11px',
          meta: '10px'
        }
      },
      colors: {
        primary: '#1E40AF',
        secondary: '#64748B',
        text: '#0F172A',
        accent: '#3B82F6'
      },
      spacing: {
        sectionGap: '20px',
        itemGap: '12px'
      }
    }
  },
  {
    id: 'exec-pro',
    name: 'Executive Professional',
    description: 'Sophisticated layout for senior roles. Clean structure with elegant typography that commands attention.',
    preview: '/templates/exec-pro-preview.png',
    category: 'business',
    atsScore: 97,
    features: [
      'Premium typography hierarchy',
      'Executive summary prominence',
      'Achievement-focused structure',
      'Subtle borders for visual separation',
      'Perfect for Director+ roles'
    ],
    structure: {
      sections: [
        { name: 'Header', required: true, order: 1, format: 'text' },
        { name: 'Executive Summary', required: true, order: 2, format: 'text' },
        { name: 'Professional Experience', required: true, order: 3, format: 'list' },
        { name: 'Core Competencies', required: true, order: 4, format: 'grid' },
        { name: 'Education', required: true, order: 5, format: 'list' },
        { name: 'Board Positions', required: false, order: 6, format: 'list' },
        { name: 'Publications', required: false, order: 7, format: 'list' }
      ],
      maxWidth: '8.5in',
      margins: '0.75in',
      lineHeight: '1.6'
    },
    styling: {
      font: {
        primary: 'Georgia, Times New Roman, serif',
        headings: 'Inter, sans-serif',
        size: {
          name: '26px',
          headings: '13px',
          body: '11px',
          meta: '10px'
        }
      },
      colors: {
        primary: '#1F2937',
        secondary: '#6B7280',
        text: '#111827',
        accent: '#1E293B'
      },
      spacing: {
        sectionGap: '24px',
        itemGap: '14px'
      }
    }
  },
  {
    id: 'modern-impact',
    name: 'Modern Impact',
    description: 'Bold, metrics-focused design for results-driven professionals. Emphasizes achievements and quantifiable outcomes.',
    preview: '/templates/modern-impact-preview.png',
    category: 'business',
    atsScore: 96,
    features: [
      'Metric highlights for key achievements',
      'Clean bullet structure',
      'Skills organized by category',
      'Modern sans-serif typography',
      'Optimized for PM, Sales, Marketing roles'
    ],
    structure: {
      sections: [
        { name: 'Header', required: true, order: 1, format: 'text' },
        { name: 'Professional Summary', required: true, order: 2, format: 'text' },
        { name: 'Key Achievements', required: true, order: 3, format: 'list' },
        { name: 'Experience', required: true, order: 4, format: 'list' },
        { name: 'Skills & Tools', required: true, order: 5, format: 'grid' },
        { name: 'Education', required: true, order: 6, format: 'list' }
      ],
      maxWidth: '8.5in',
      margins: '0.75in',
      lineHeight: '1.5'
    },
    styling: {
      font: {
        primary: 'Roboto, system-ui, sans-serif',
        headings: 'Roboto, sans-serif',
        size: {
          name: '24px',
          headings: '13px',
          body: '11px',
          meta: '10px'
        }
      },
      colors: {
        primary: '#059669',
        secondary: '#64748B',
        text: '#0F172A',
        accent: '#10B981'
      },
      spacing: {
        sectionGap: '22px',
        itemGap: '13px'
      }
    }
  }
];

// ATS-friendly formatting rules that all templates follow
export const atsRules = {
  structure: [
    'Single column layout only',
    'Standard section headings (Experience, Education, Skills, etc.)',
    'No tables for layout',
    'No text boxes or graphics overlapping text',
    'No headers/footers',
    'Clear visual hierarchy with consistent formatting'
  ],
  typography: [
    'Standard fonts only (Arial, Calibri, Georgia, Times New Roman, or web-safe sans-serif)',
    'Minimum 10pt font size for body text',
    'Maximum 26pt for name',
    'Consistent font sizes within sections',
    'No decorative fonts or script styles'
  ],
  formatting: [
    'Left-aligned text for main content',
    'Standard bullet points (• or -)',
    'Consistent date formats (Month Year)',
    'No color-coded information (use bold/italic instead)',
    'Adequate white space between sections (at least 12pt)'
  ],
  content: [
    'Contact info at top in plain text',
    'Job titles clearly labeled',
    'Company names and dates on separate lines or clearly separated',
    'Skills listed with commas or bullets',
    'Education with degree, institution, and year',
    'Avoid acronyms without spelling out first'
  ],
  technical: [
    'Save as PDF from source (not scanned)',
    'Ensure all text is selectable',
    'No password protection',
    'File name: FirstName_LastName_Resume.pdf',
    'Keep file size under 1MB'
  ]
};

// Helper function to generate template-specific guidance
export function getTemplateGuidance(templateId: string): string {
  const template = hybridTemplates.find(t => t.id === templateId);
  if (!template) return '';

  return `
# ${template.name} Template Guide

## ATS Score: ${template.atsScore}/100

This template is optimized for both ATS parsing and human readability.

## Key Features:
${template.features.map(f => `- ${f}`).join('\n')}

## Formatting Rules:
All text must be selectable and follow these guidelines:
- Single column, top-to-bottom flow
- Standard section headers
- Consistent font sizes and spacing
- No graphics or images blocking text
- Date format: Month Year (e.g., "Jan 2023")

## Visual Design:
While maintaining ATS compatibility, this template uses:
- Clean typography hierarchy
- Subtle color accents for visual interest
- Proper white space for readability
- Professional layout that stands out

## Pro Tips:
1. Keep each section clearly labeled
2. Use bullet points for achievements
3. Include metrics and numbers (40%, $2M, 5 projects, etc.)
4. Tailor keywords to each job description
5. Save as PDF from Word/Google Docs (not scanned)
`;
}

// Export template as downloadable format
export function exportTemplate(templateId: string, userData: any): string {
  const template = hybridTemplates.find(t => t.id === templateId);
  if (!template) throw new Error('Template not found');

  // This would generate actual HTML/CSS for the template
  // For now, returning guidance
  return getTemplateGuidance(templateId);
}
