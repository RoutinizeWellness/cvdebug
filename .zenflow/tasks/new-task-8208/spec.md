# Technical Specification: CVDebug Repository Connection and Analysis

## Task Overview
**Complexity**: Easy  
**Objective**: Successfully connect to and document the CVDebug repository (https://github.com/RoutinizeWellness/cvdebug)

## Technical Context

### Platform & Architecture
- **Platform**: AI-Powered Resume Analysis SaaS
- **Frontend**: React 19 + TypeScript 5.8 + Vite 6
- **Backend**: Convex (Serverless)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Routing**: React Router v7
- **State Management**: Convex real-time queries/mutations
- **Authentication**: Convex Auth (Email OTP)
- **Payments**: LemonSqueezy
- **AI Models**: Gemini 2.0 Flash, DeepSeek Chat, Custom ML fallback

### Key Dependencies
```json
{
  "react": "^19.1.0",
  "convex": "^1.31.6",
  "@convex-dev/auth": "^0.0.86",
  "react-router": "^7.6.1",
  "tailwindcss": "^4.1.8",
  "@google/generative-ai": "^0.24.1",
  "framer-motion": "^12.15.0",
  "lucide-react": "^0.511.0"
}
```

### Build Commands
- **Dev**: `npm run dev` or `pnpm dev`
- **Build**: `tsc -b && vite build`
- **Prod Build**: `npm run build:prod`
- **Lint**: `eslint .`
- **Format**: `prettier --write .`

## Repository Structure

```
cvdebug/
├── src/
│   ├── convex/                    # Backend (Convex functions)
│   │   ├── ai/                   # AI analysis system
│   │   │   ├── resumeAnalysis.ts    # 4-layer fallback system
│   │   │   ├── fallbackAnalysis.ts  # ML-based backup
│   │   │   └── scoring/             # Scoring algorithms
│   │   ├── resumes.ts            # Resume CRUD
│   │   ├── billing.ts            # Payment webhooks
│   │   ├── jobTracker.ts         # Job application tracking
│   │   └── auth.ts               # Auth config (DO NOT MODIFY)
│   │
│   ├── components/               # React components
│   │   ├── dashboard/
│   │   │   ├── MissionControl.tsx   # Main dashboard
│   │   │   └── Sidebar.tsx
│   │   └── ui/                  # shadcn/ui components
│   │
│   ├── pages/                   # Page components
│   │   ├── Dashboard.tsx
│   │   └── Admin.tsx
│   │
│   └── hooks/                   # Custom React hooks
│
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Issue Encountered: Windows Path Compatibility

**Problem**: The repository contains files with invalid Windows paths:
- Files with regex patterns as names (e.g., `[\s\S]*?^```/gm`)
- Files with special characters and backslashes

**Impact**: Cannot perform `git clone` or `git checkout` on Windows systems.

**Error Messages**:
```
error: invalid path '[\\w]*\\n([\\s\\S]*?)\\n```$/g, '$1');'
error: invalid path '[\s\S]*?^```/gm, '');'
error: invalid path '\s*$/g, '');'
```

**Root Cause**: These appear to be accidentally committed files (possibly from code generation or regex testing) that violate Windows filesystem naming rules.

## Implementation Approach

### Option 1: Clone on Linux/Mac or WSL (Recommended)
1. Use WSL2, Linux VM, or Mac to clone repository
2. Remove invalid files
3. Push cleaned repository
4. Re-clone on Windows

### Option 2: Sparse Checkout (Windows-Compatible)
1. Initialize git with sparse-checkout enabled
2. Manually fetch only valid files/directories
3. Exclude problematic files

### Option 3: Work with GitHub API
1. Access files via GitHub Raw API
2. Download needed files programmatically
3. Reconstruct project structure locally

### Option 4: Fix Repository Directly
1. Use GitHub web interface or API to identify and delete invalid files
2. Re-clone cleaned repository

## Recommended Solution

**Immediate Action**: Use Option 3 (GitHub API) to access and document the system.

**Long-term Fix**: Clean the repository using Option 1 or 4.

## Files to Access/Document

### Critical Files (via GitHub Raw API):
1. ✅ `package.json` - Dependencies and scripts
2. ✅ `README.md` - Project overview
3. ✅ `vite.config.ts` - Build configuration
4. ✅ `tsconfig.json` - TypeScript configuration
5. ⏳ `src/convex/ai/resumeAnalysis.ts` - Core AI logic
6. ⏳ `src/components/dashboard/MissionControl.tsx` - Main UI
7. ⏳ `src/pages/Dashboard.tsx` - Dashboard page
8. ⏳ `convex.json` - Backend configuration

## Data Model / API

### Convex Schema (Expected)
- **users**: User accounts with auth
- **resumes**: Uploaded CV data and analysis results
- **payments**: LemonSqueezy transaction records
- **jobApplications**: Kanban board items

### API Endpoints (Convex Functions)
- `resumes.upload` - Upload and parse CV
- `resumes.analyze` - Trigger AI analysis
- `billing.createCheckout` - Initialize payment
- `billing.webhook` - Handle LemonSqueezy webhooks
- `jobTracker.create/update/delete` - CRUD operations

## Verification Steps

1. **Connection Test**:
   ```bash
   git remote -v  # Verify remote is set
   git fetch origin  # Test connectivity
   ```

2. **Project Setup** (once accessible):
   ```bash
   pnpm install
   pnpm dev  # Should start on localhost:5173
   ```

3. **Type Checking**:
   ```bash
   tsc -b --noEmit
   ```

4. **Linting**:
   ```bash
   eslint .
   ```

5. **Build Test**:
   ```bash
   pnpm build
   ```

## Success Criteria

- ✅ Remote repository connection established
- ✅ Project structure documented
- ⏳ Invalid files identified and documented
- ⏳ Workaround implemented to access code
- ⏳ Technical specification completed

## Next Steps

1. ✅ Document current repository state (this file)
2. Fetch and analyze key source files via GitHub API
3. Propose repository cleanup plan
4. Wait for user decision on how to proceed with invalid files
5. Once accessible, set up local development environment

## References

- Repository: https://github.com/RoutinizeWellness/cvdebug
- Live Site: https://resumeatsoptimizer.vly.site
- Convex Docs: https://docs.convex.dev
- React Router v7: https://reactrouter.com
