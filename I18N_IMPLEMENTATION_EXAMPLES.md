# i18n Implementation Examples & Code Patterns

## Table of Contents
1. [Basic Patterns](#basic-patterns)
2. [Component Examples](#component-examples)
3. [Common Mistakes & Fixes](#common-mistakes--fixes)
4. [Testing Examples](#testing-examples)

---

## Basic Patterns

### Pattern 1: Simple Toast Message

**BEFORE (Hardcoded)**
```typescript
// WritingForge.tsx - Line 89
toast.success("Changes saved!");
```

**AFTER (With i18n)**
```typescript
import { useI18n } from '@/lib/i18n';

export function WritingForge() {
  const t = useI18n();

  const handleSave = async () => {
    // ... save logic
    toast.success(t('dashboard.writing.saved'));
  };

  return (
    // ... JSX
  );
}
```

**i18n.ts Addition**
```typescript
export interface Translation {
  dashboard: {
    writing: {
      saved: string;
      // ... other strings
    };
  };
}

export const translations: Record<SupportedLocale, Translation> = {
  'en': {
    dashboard: {
      writing: {
        saved: 'Changes saved!',
      },
    },
  },
  'es': {
    dashboard: {
      writing: {
        saved: '¡Cambios guardados!',
      },
    },
  },
  // ... other locales
};
```

---

### Pattern 2: Placeholder Text

**BEFORE (Hardcoded)**
```typescript
// WritingForge.tsx - Line 583
<textarea placeholder="Edit your resume text here..." />
```

**AFTER (With i18n)**
```typescript
import { useI18n } from '@/lib/i18n';

export function WritingForge() {
  const t = useI18n();

  return (
    <textarea
      placeholder={t('dashboard.writing.editPlaceholder')}
      // ... other props
    />
  );
}
```

---

### Pattern 3: Button Labels & Titles

**BEFORE (Hardcoded)**
```typescript
// InterviewBattlePlan.tsx - Line 109
<div className="title">End-to-End ML Deployment</div>
<div className="description">You have experience with...</div>
```

**AFTER (With i18n)**
```typescript
import { useI18n } from '@/lib/i18n';

export function InterviewBattlePlan() {
  const t = useI18n();

  const strengths = [
    {
      label: "Strength #1",
      title: t('dashboard.interview.strengths.mlDeployment.title'),
      description: t('dashboard.interview.strengths.mlDeployment.description'),
    },
    // ... more strengths
  ];

  return (
    // ... render strengths
  );
}
```

**i18n.ts Addition**
```typescript
dashboard: {
  interview: {
    strengths: {
      mlDeployment: {
        title: 'End-to-End ML Deployment',
        description: 'You have experience with...',
      },
      leadership: {
        title: 'Cross-Functional Leadership',
        description: '...',
      },
    },
  },
}
```

---

## Component Examples

### Full Component: WritingForge.tsx (Before)

```typescript
export function WritingForge() {
  const toast = useToast();

  const handleSave = async (text: string) => {
    try {
      if (!text) {
        toast.error("No resume text to edit");
        return;
      }
      if (text.trim().length === 0) {
        toast.error("Resume cannot be empty");
        return;
      }

      // ... save logic
      toast.success("Changes saved!");
    } catch (error) {
      toast.error("Failed to save changes");
    }
  };

  const handleRegenerate = async () => {
    if (!resumeText) {
      toast.error("No resume text to regenerate");
      return;
    }

    if (user?.subscriptionTier !== "interview_sprint") {
      toast.error("Interview Sprint plan required");
      return;
    }

    toast.loading("Regenerating with AI...");
    // ... regenerate logic
    toast.success("Resume regenerated!");
  };

  const handlePdfDownload = async () => {
    toast.loading("Preparing PDF download...");
    // ... download logic
  };

  return (
    <div>
      <textarea
        placeholder="Edit your resume text here..."
        // ... other props
      />
      <button onClick={() => handleSave(text)}>Save</button>
      <button onClick={handleRegenerate}>Regenerate</button>
      <button onClick={handlePdfDownload}>Download PDF</button>
    </div>
  );
}
```

### Full Component: WritingForge.tsx (After i18n)

```typescript
import { useI18n } from '@/lib/i18n';
import { useToast } from '@/components/ui/use-toast';

export function WritingForge() {
  const t = useI18n();
  const toast = useToast();

  const handleSave = async (text: string) => {
    try {
      if (!text) {
        toast.error(t('dashboard.writing.noResume'));
        return;
      }
      if (text.trim().length === 0) {
        toast.error(t('dashboard.writing.emptyResume'));
        return;
      }

      // ... save logic
      toast.success(t('dashboard.writing.saved'));
    } catch (error) {
      toast.error(t('dashboard.writing.saveFailed'));
    }
  };

  const handleRegenerate = async () => {
    if (!resumeText) {
      toast.error(t('dashboard.writing.noTextToRegenerate'));
      return;
    }

    if (user?.subscriptionTier !== "interview_sprint") {
      toast.error(t('dashboard.upgrade.interviewSprintRequired'));
      return;
    }

    toast.loading(t('dashboard.writing.regenerating'));
    // ... regenerate logic
    toast.success(t('dashboard.writing.regenerated'));
  };

  const handlePdfDownload = async () => {
    toast.loading(t('dashboard.writing.preparingPdf'));
    // ... download logic
  };

  return (
    <div>
      <textarea
        placeholder={t('dashboard.writing.editPlaceholder')}
        // ... other props
      />
      <button onClick={() => handleSave(text)}>
        {t('buttons.save')}
      </button>
      <button onClick={handleRegenerate}>
        {t('dashboard.writing.regenerate')}
      </button>
      <button onClick={handlePdfDownload}>
        {t('dashboard.writing.downloadPdf')}
      </button>
    </div>
  );
}
```

---

### Full Component: Dashboard Footer (Before)

```typescript
export function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <footer className="border-t border-slate-800 bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <Logo variant="default" />
            <p className="text-slate-400 text-sm">
              The developer-first toolkit for navigating the modern, automated job market.
            </p>
          </div>

          <div className="flex flex-wrap gap-12">
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-semibold">Product</h4>
              <a href="/">ATS Scanner</a>
              <a href="/preview">Preview Scan</a>
              <a href="/pricing">Pricing</a>
              <a href="/dashboard">Dashboard</a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-white font-semibold">For Nurses</h4>
              <a href="/ats-scanner-for-nurses">Nursing ATS Scanner</a>
              <a href="/icu-nurse-ats-optimizer">ICU Nurse</a>
              <a href="/er-nurse-ats-optimizer">ER Nurse</a>
              <a href="/travel-nurse-ats-optimizer">Travel Nurse</a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-white font-semibold">Legal</h4>
              <button onClick={() => setShowPrivacy(true)}>
                Privacy Policy
              </button>
              <button onClick={() => setShowTerms(true)}>
                Terms of Service
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 mt-8">
          <p className="text-slate-500 text-xs">
            © 2026 CVDebug Inc. All rights reserved.
          </p>
        </div>
      </div>

      <PrivacyDialog open={showPrivacy} onOpenChange={setShowPrivacy} />
      <TermsDialog open={showTerms} onOpenChange={setShowTerms} />
    </footer>
  );
}
```

### Full Component: Dashboard Footer (After i18n)

```typescript
import { useI18n } from '@/lib/i18n';

export function Footer() {
  const t = useI18n();
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const sections = [
    {
      title: t('footer.sections.product'),
      links: [
        { label: t('footer.links.scanner'), href: '/' },
        { label: t('footer.links.preview'), href: '/preview' },
        { label: t('footer.links.pricing'), href: '/pricing' },
        { label: t('footer.links.dashboard'), href: '/dashboard' },
      ],
    },
    {
      title: t('footer.sections.forNurses'),
      links: [
        { label: t('footer.links.nursing'), href: '/ats-scanner-for-nurses' },
        { label: t('footer.links.icu'), href: '/icu-nurse-ats-optimizer' },
        { label: t('footer.links.er'), href: '/er-nurse-ats-optimizer' },
        { label: t('footer.links.travel'), href: '/travel-nurse-ats-optimizer' },
      ],
    },
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <Logo variant="default" />
            <p className="text-slate-400 text-sm">
              {t('footer.description')}
            </p>
          </div>

          <div className="flex flex-wrap gap-12">
            {sections.map(section => (
              <div key={section.title} className="flex flex-col gap-3">
                <h4 className="text-white font-semibold">
                  {section.title}
                </h4>
                {section.links.map(link => (
                  <a key={link.href} href={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
            ))}

            <div className="flex flex-col gap-3">
              <h4 className="text-white font-semibold">
                {t('footer.sections.legal')}
              </h4>
              <button onClick={() => setShowPrivacy(true)}>
                {t('footer.legal.privacy')}
              </button>
              <button onClick={() => setShowTerms(true)}>
                {t('footer.legal.terms')}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 mt-8">
          <p className="text-slate-500 text-xs">
            {t('footer.copyright')}
          </p>
        </div>
      </div>

      <PrivacyDialog open={showPrivacy} onOpenChange={setShowPrivacy} />
      <TermsDialog open={showTerms} onOpenChange={setShowTerms} />
    </footer>
  );
}
```

**i18n.ts Addition**
```typescript
footer: {
  description: 'The developer-first toolkit for navigating the modern, automated job market.',
  sections: {
    product: 'Product',
    forNurses: 'For Nurses',
    forTech: 'For Tech',
    resources: 'Resources',
    legal: 'Legal',
  },
  links: {
    scanner: 'ATS Scanner',
    preview: 'Preview Scan',
    pricing: 'Pricing',
    dashboard: 'Dashboard',
    nursing: 'Nursing ATS Scanner',
    icu: 'ICU Nurse',
    er: 'ER Nurse',
    travel: 'Travel Nurse',
    software: 'Software Engineer',
    frontend: 'Frontend Engineer',
    backend: 'Backend Engineer',
    devops: 'DevOps Engineer',
    blog: 'Blog',
    beatAts: 'Beat ATS Guide',
    robotView: 'Robot View Guide',
    contact: 'Contact',
  },
  legal: {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
  },
  copyright: '© 2026 CVDebug Inc. All rights reserved.',
}
```

---

## Common Mistakes & Fixes

### Mistake 1: Hardcoded Strings in Lists

**WRONG** ❌
```typescript
const statusOptions = [
  { value: 'applied', label: 'Applied' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'accepted', label: 'Accepted' },
];
```

**CORRECT** ✅
```typescript
const KanbanBoard = () => {
  const t = useI18n();

  const statusOptions = [
    { value: 'applied', label: t('dashboard.kanban.applied') },
    { value: 'interviewing', label: t('dashboard.kanban.interviewing') },
    { value: 'accepted', label: t('dashboard.kanban.accepted') },
  ];
};
```

---

### Mistake 2: Inline String Concatenation

**WRONG** ❌
```typescript
toast.error("Failed to " + action + " " + itemType);
```

**CORRECT** ✅
```typescript
// Option 1: Use string formatting if i18n supports it
const key = `errors.${action}${itemType}`;
toast.error(t(key));

// Option 2: Create dedicated keys
const failureMessages = {
  save: t('errors.saveFailed'),
  delete: t('errors.deleteFailed'),
  upload: t('errors.uploadFailed'),
};
toast.error(failureMessages[action]);
```

---

### Mistake 3: Conditional Text Not Translating

**WRONG** ❌
```typescript
const message = score >= 85 ? "Elite / Ready to Apply" : "Needs Work";
return <div>{message}</div>;
```

**CORRECT** ✅
```typescript
const t = useI18n();

const getMessage = (score: number) => {
  if (score >= 85) {
    return t('dashboard.scoring.elite');
  }
  return t('dashboard.scoring.needsWork');
};

return <div>{getMessage(score)}</div>;
```

---

### Mistake 4: Missing Context in Key Names

**WRONG** ❌
```typescript
// Too vague - hard to find and maintain
"copied: string;
"uploaded: string;
"error: string;
```

**CORRECT** ✅
```typescript
// Clear, contextual, easy to find
"dashboard.metrics.metricCopied: string;
"dashboard.ats.fileUploaded: string;
"dashboard.fluff.copyError: string;
```

---

### Mistake 5: Not Using i18n in Error Boundaries

**WRONG** ❌
```typescript
// ErrorBoundary.tsx
<div>
  <h1>We encountered an unexpected error.</h1>
  <p>Don't worry, your data is safe.</p>
</div>
```

**CORRECT** ✅
```typescript
// ErrorBoundary.tsx
import { useI18n } from '@/lib/i18n';

export function ErrorBoundary({ children }: { children: ReactNode }) {
  const t = useI18n();

  if (this.state.hasError) {
    return (
      <div>
        <h1>{t('errors.unexpected.title')}</h1>
        <p>{t('errors.unexpected.description')}</p>
      </div>
    );
  }
}
```

---

## Testing Examples

### Test 1: Verify Toast Message Translation

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WritingForge } from './WritingForge';
import * as i18n from '@/lib/i18n';

describe('WritingForge - i18n', () => {
  it('should display translated success message when saving', async () => {
    // Mock the i18n hook to return Spanish translations
    jest.spyOn(i18n, 'useI18n').mockReturnValue(
      i18n.translations['es']
    );

    const user = userEvent.setup();
    render(<WritingForge />);

    // Fill in text and save
    const textarea = screen.getByPlaceholder('Edita tu texto de CV aquí...');
    await user.type(textarea, 'test content');

    const saveButton = screen.getByRole('button', { name: 'Guardar' });
    await user.click(saveButton);

    // Should show Spanish success message
    await waitFor(() => {
      expect(screen.getByText('¡Cambios guardados!')).toBeInTheDocument();
    });
  });

  it('should display correct placeholder in all languages', () => {
    const locales: Array<i18n.SupportedLocale> = ['en', 'es', 'fr', 'de', 'pt'];

    locales.forEach(locale => {
      const translations = i18n.translations[locale];
      expect(translations.dashboard.writing.editPlaceholder).toBeTruthy();
      expect(translations.dashboard.writing.editPlaceholder.length > 0).toBe(true);
    });
  });
});
```

### Test 2: Verify All Keys Exist

```typescript
import { translations } from '@/lib/i18n';

describe('i18n - Keys Completeness', () => {
  it('all locales should have the same keys structure', () => {
    const enKeys = Object.keys(JSON.stringify(translations['en']));
    const locales = ['es', 'fr', 'de', 'pt'] as const;

    locales.forEach(locale => {
      const localeKeys = Object.keys(JSON.stringify(translations[locale]));
      expect(localeKeys).toEqual(enKeys);
    });
  });

  it('dashboard.writing section should have all required keys', () => {
    const required = [
      'saved',
      'saveFailed',
      'saveError',
      'noResume',
      'emptyResume',
      'regenerating',
      'regenerated',
      'noTextToRegenerate',
      'preparingPdf',
      'editPlaceholder',
    ];

    required.forEach(key => {
      expect(translations['en'].dashboard.writing[key as keyof any])
        .toBeTruthy();
    });
  });
});
```

### Test 3: Verify Text Length (German Translations)

```typescript
describe('i18n - Text Length Validation', () => {
  it('German translations should not exceed reasonable length', () => {
    // German is ~20% longer than English
    Object.entries(translations['de']).forEach(([section, content]) => {
      Object.entries(content).forEach(([key, value]) => {
        if (typeof value === 'string') {
          const enText = (translations['en'][section as any] as any)[key];
          const ratio = value.length / enText.length;

          // Allow up to 40% longer (generous buffer)
          expect(ratio).toBeLessThan(1.4);
        }
      });
    });
  });
});
```

---

## Implementation Checklist

### Step 1: Update i18n.ts
- [ ] Add new interface properties to `Translation`
- [ ] Add English translations in `translations.en`
- [ ] Add Spanish translations
- [ ] Add French translations
- [ ] Add German translations
- [ ] Add Portuguese translations
- [ ] Test that all locales compile without errors

### Step 2: Update Component
- [ ] Import `useI18n` hook
- [ ] Remove hardcoded strings
- [ ] Replace with `t('key')` calls
- [ ] Test component locally
- [ ] Verify all strings translate correctly

### Step 3: Test
- [ ] Run unit tests
- [ ] Verify in browser with all locales
- [ ] Check for UI overflow with German text
- [ ] Test on mobile view

### Step 4: Code Review
- [ ] Review i18n keys follow naming convention
- [ ] Verify no hardcoded strings remain
- [ ] Check for missing translations
- [ ] Validate context usage

---

## Quick Reference: Hook Usage

```typescript
// Basic usage
import { useI18n } from '@/lib/i18n';

const MyComponent = () => {
  const t = useI18n();
  return <div>{t('dashboard.writing.saved')}</div>;
};

// With context
import { useI18n } from '@/lib/i18n';
import { useLocale } from '@/context/LocaleContext'; // if available

const MyComponent = () => {
  const { locale } = useLocale();
  const t = useI18n(locale);
  return <div>{t('dashboard.writing.saved')}</div>;
};

// Checking if key exists
const MyComponent = () => {
  const t = useI18n();
  const maybeText = t('dashboard.writing.potentialKey' as any);
  return <div>{maybeText || 'Fallback text'}</div>;
};
```

---

**Document Version**: 1.0
**Last Updated**: 2026-01-19
**Status**: Ready for Implementation
