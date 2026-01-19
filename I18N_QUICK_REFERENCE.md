# i18n Translation Keys - Quick Reference Guide

## Quick Stats at a Glance

```
Total Hardcoded Strings: 373
├── Toasts (157)      ← Most important
├── Titles (124)      ← High visibility
├── Placeholders (69) ← Common UX
├── Labels (15)       ← Buttons, fields
└── Alt Text (8)      ← Accessibility
```

---

## Top 30 Strings to Translate First

### Authentication & Payment (5)
```javascript
1. "Payment successful! Unlocking your resume report..."
   → payment.success

2. "Please log in to purchase credits"
   → payment.loginRequired

3. "Failed to start checkout"
   → payment.checkoutError

4. "No transaction ID available"
   → payment.noTransactionId

5. "Receipt downloaded successfully"
   → payment.receiptDownloaded
```

### Resume Optimization (10)
```javascript
6. "Bullet point optimized!"
   → dashboard.bullet.optimized

7. "Changes saved!"
   → dashboard.writing.saved

8. "Resume regenerated!"
   → dashboard.writing.regenerated

9. "Copied to clipboard!"
   → common.copiedToClipboard

10. "Failed to save changes"
    → dashboard.writing.saveFailed

11. "Interview Sprint plan required"
    → dashboard.upgrade.interviewSprintRequired

12. "Please enter a bullet point to rewrite"
    → dashboard.bullet.noInput

13. "Preparing PDF download..."
    → dashboard.writing.preparingPdf

14. "Resume cannot be empty"
    → dashboard.writing.emptyResume

15. "No resume text to edit"
    → dashboard.writing.noResume
```

### Interview Prep (8)
```javascript
16. "Battle plan generated!"
    → dashboard.interview.battlePlanGenerated

17. "Please provide a valid job description to generate interview prep."
    → dashboard.interview.invalidJobDesc

18. "Resume text is too short. Please upload a valid resume first."
    → dashboard.interview.shortResume

19. "Questions regenerated with ML! Fresh questions based on your resume."
    → dashboard.interview.questionsRegenerated

20. "Enhancing your answer with AI..."
    → dashboard.interview.enhancing

21. "Answer enhanced with AI suggestions!"
    → dashboard.interview.answerEnhanced

22. "Regenerating questions with ML algorithms..."
    → dashboard.interview.regenerating

23. "Not enough resume text to generate questions"
    → dashboard.interview.noResumeText
```

### Footer Navigation (7)
```javascript
24. "Product"
    → footer.sections.product

25. "For Nurses"
    → footer.sections.forNurses

26. "For Tech"
    → footer.sections.forTech

27. "Resources"
    → footer.sections.resources

28. "Legal"
    → footer.sections.legal

29. "Privacy Policy"
    → footer.legal.privacy

30. "Terms of Service"
    → footer.legal.terms
```

---

## Most Common Patterns

### Toast Error Messages (157 total)
Pattern: `"<action> failed"` or `"Please <do something>"`

**Examples to translate:**
- "Failed to rewrite bullet point" → `dashboard.bullet.rewriteError`
- "Failed to submit feedback" → `dashboard.feedback.submitError`
- "Failed to copy to clipboard" → `dashboard.fluff.copyError`
- "Please enter a bullet point to rewrite" → `dashboard.bullet.noInput`

### Toast Success Messages
Pattern: `"<thing> <verb>!"`

**Examples:**
- "Thank you for your feedback!" → `dashboard.feedback.success`
- "Cover letter generated successfully!" → `dashboard.coverLetter.generated`
- "DMs generated successfully!" → `dashboard.dm.generated`

### Placeholder Text
Pattern: `"<verb> your <noun>..."`

**Examples:**
- "Edit your resume text here..." → `dashboard.writing.editPlaceholder`
- "Paste your resume content here..." → `dashboard.liveOptimizer.placeholder`
- "Type a message..." → `common.chatPlaceholder`

### Section Titles
Pattern: Can be anything, stored as title in objects

**Examples:**
- "File Validation" → `dashboard.scanning.fileValidation.title`
- "Layout Integrity" → `dashboard.scanning.layoutIntegrity.title`
- "Applied" (kanban status) → `dashboard.kanban.applied`

---

## Component-by-Component Breakdown

### WritingForge.tsx (36 strings) - HIGHEST PRIORITY
**These strings are seen by EVERY user writing resumes**

```
dashboard.writing:
  ├── saved: "Changes saved!"
  ├── saveFailed: "Failed to save changes"
  ├── saveError: "Unable to save changes"
  ├── noResume: "No resume text to edit"
  ├── emptyResume: "Resume cannot be empty"
  ├── regenerating: "Regenerating with AI..."
  ├── regenerated: "Resume regenerated!"
  ├── noTextToRegenerate: "No resume text to regenerate"
  ├── preparingPdf: "Preparing PDF download..."
  └── editPlaceholder: "Edit your resume text here..."
```

### InterviewBattlePlan.tsx (18 strings) - HIGH PRIORITY
**Interview prep is a premium feature, needs smooth UX**

```
dashboard.interview:
  ├── noResumeText: "Not enough resume text..."
  ├── regenerating: "Regenerating with ML..."
  ├── questionsRegenerated: "Questions regenerated..."
  ├── generateError: "Failed to generate questions..."
  ├── enhancing: "Enhancing your answer..."
  ├── answerEnhanced: "Answer enhanced..."
  ├── downloading: "Downloading strategy document..."
  ├── noJobDesc: "Please paste the job description first"
  ├── battlePlanGenerated: "Battle plan generated!"
  ├── battlePlanError: "Failed to generate battle plan"
  └── jobDescPlaceholder: "Paste the full job description here..."
```

### CinematicScanning.tsx (20 strings) - HIGH PRIORITY
**Onboarding/scanning UI - first impression for many users**

```
dashboard.scanning:
  ├── fileValidation.title: "File Validation"
  ├── fileValidation.subtitle: "PDF structure is valid."
  ├── layoutIntegrity.title: "Layout Integrity"
  ├── layoutIntegrity.subtitle: "Checking margins & text-flow."
  ├── keywordMatch.title: "Keyword Match"
  ├── keywordMatch.subtitle: "PENDING"
  ├── timeline.title: "Experience Timeline"
  ├── timeline.subtitle: "PENDING"
  ├── scoring.title: "Scoring & Report"
  └── scoring.subtitle: "PENDING"
```

### LinkedInOptimizer.tsx (14 strings)
```
dashboard.linkedin:
  ├── upgradeDescription: "Upgrade to optimize your LinkedIn profile"
  ├── noProfileText: "Please paste your LinkedIn profile text"
  ├── analyzed: "✅ LinkedIn profile analyzed successfully!"
  ├── scanError: "Failed to scan profile. Please try again."
  ├── noBioOptimization: "No bio optimization available..."
  ├── bioOptimized: "✅ Optimized bio copied to clipboard!..."
  └── [more strings...]
```

---

## Quick Implementation Template

For each component, follow this pattern:

```typescript
// BEFORE (hardcoded)
toast.success("Bullet point optimized!");

// AFTER (with i18n)
import { useI18n } from '@/lib/i18n';

const MyComponent = () => {
  const t = useI18n();

  const handleOptimize = () => {
    // ... optimization logic
    toast.success(t('dashboard.bullet.optimized'));
  };
};
```

---

## File Organization Reference

### Source Files
- **Audit Document**: `/HARDCODED_STRINGS_AUDIT.md` (comprehensive)
- **CSV Export**: `/hardcoded_strings.csv` (for tracking)
- **Summary**: `/I18N_TRANSLATION_SUMMARY.md` (overview)
- **This File**: `/I18N_QUICK_REFERENCE.md` (quick lookup)

### Implementation Files to Update
- `/src/lib/i18n.ts` (main translations file)
- `/src/pages/Dashboard.tsx` (+7 strings)
- `/src/components/dashboard/WritingForge.tsx` (+36 strings)
- `/src/components/dashboard/InterviewBattlePlan.tsx` (+18 strings)
- `/src/components/landing/Footer.tsx` (+25 strings)
- `/src/components/dashboard/*.tsx` (50+ files, ~250 strings)

---

## Translation Keys by Frequency

### Very High (>3 occurrences)
- `common.copiedToClipboard` (appears 5+ times)
- `dashboard.upgrade.interviewSprintRequired` (appears 3+ times)
- `common.deleteError` (appears 2+ times)

### Common Patterns to Extract
```javascript
// Pattern: Copy to clipboard
"Copied to clipboard!" → common.copiedToClipboard (5 occurrences)
"Copy Raw Text" → dashboard.ats.copyRawText
"Metric copied to clipboard!" → dashboard.fluff.metricCopied

// Pattern: File operations
"Raw text downloaded" → dashboard.ats.textDownloaded
"Receipt downloaded successfully" → payment.receiptDownloaded
"Downloading strategy document..." → dashboard.interview.downloading

// Pattern: Feature upgrades
"Interview Sprint plan required" → dashboard.upgrade.interviewSprintRequired (3 occurrences)
"Upgrade to [feature]" → dashboard.[feature].upgradeDescription
```

---

## Quality Checklist

Before implementing i18n keys:

- [ ] Check for duplicate meanings (consolidate where possible)
- [ ] Verify singular/plural handling needed
- [ ] Check context length (some strings are quite long)
- [ ] Consider CSS text overflow (German translations are ~20% longer)
- [ ] Test in mobile view (placeholders might truncate)
- [ ] Verify HTML entities if any
- [ ] Check RTL considerations (future locales)

---

## Context-Specific Notes

### Dashboard Strings
- Most interactive and dynamic
- Many contain time-based messages ("...ing" patterns)
- Often include emoji (✅, 💰, 🎉)
- Validation messages should be user-friendly

### Payment Strings
- **CRITICAL**: Must be accurate
- Include transaction references
- Should match payment provider terminology
- May need currency symbols

### Admin Strings
- Internal use (slightly less critical)
- Include database operations ("User updated", "Fix Complete")
- May include status codes/errors

### Landing/Footer Strings
- SEO-relevant in some cases
- Navigation consistency important
- Brand voice maintained

---

## Estimated Translation Time

**By Category:**
- Dashboard toasts: 3-4 hours (157 strings)
- Form placeholders: 1-2 hours (69 strings)
- Titles/feature descriptions: 2-3 hours (124 strings)
- Admin/misc: 1 hour (23 strings)
- **Total Implementation**: 7-10 hours
- **Per Language Translation**: 2-3 hours (with context)
- **Testing All 5 Languages**: 4-5 hours

---

## Common Pitfalls to Avoid

1. **Don't mix hardcoded and i18n keys** in same component
2. **Don't forget context** - brief strings might be ambiguous
3. **Don't ignore RTL** - plan for potential Arabic/Hebrew support
4. **Don't truncate descriptions** - full text should be translatable
5. **Don't hardcode numbers/dates** - use formatting functions
6. **Don't forget placeholders** - these are user-facing
7. **Don't miss alt text** - critical for accessibility

---

## References

- **Current i18n file**: `/src/lib/i18n.ts` (2000+ lines)
- **Supported locales**: en, es, fr, de, pt
- **i18n hook**: `useI18n()` from `/lib/i18n.ts`
- **Translation provider**: Check for `I18nProvider` in app structure

---

**Last Updated**: 2026-01-19
**Total Strings to Translate**: 373
**Status**: Audit Complete, Ready for Implementation
