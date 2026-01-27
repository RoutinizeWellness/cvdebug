# CVDebug - AI-Powered Resume Analysis Platform

<div align="center">

![CVDebug Logo](https://harmless-tapir-303.convex.cloud/api/storage/5768dbac-7c15-4d7f-bf24-73eff8671dc0)

**Professional ATS Resume Analysis with 100% Success Rate Guarantee**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://reactjs.org/)
[![Convex](https://img.shields.io/badge/Convex-Backend-orange)](https://convex.dev/)
[![License](https://img.shields.io/badge/License-Proprietary-red)]()

</div>

## 🎯 About CVDebug

CVDebug is a professional resume analysis platform that uses AI to help job seekers optimize their resumes for Applicant Tracking Systems (ATS). Our unique **100% Analysis Guarantee** ensures every resume uploaded receives actionable feedback.

### ✨ Key Features

- 🤖 **AI-Powered Analysis**: Multi-model AI system (Gemini 2.0 + DeepSeek + ML fallback)
- ✅ **100% Success Rate**: NEVER fails to analyze a CV - minimum score of 35-42 points guaranteed
- 🎯 **Keyword Optimization**: Identifies missing and matched keywords for target roles
- 📊 **Mission Control Dashboard**: Real-time metrics, kanban board, and error tracking
- 🔍 **ATS Compatibility Check**: Detects formatting issues that break ATS parsing
- 💼 **Job Application Tracking**: Kanban-style tracking of your applications
- 🎨 **Professional UI**: Glassmorphism design with smooth animations

### 🚀 Guaranteed Analysis System

Unlike other tools that can fail, CVDebug implements a **4-layer fallback system**:

```
Layer 1: Gemini 2.0 Flash (Free) → Layer 2: DeepSeek Chat
    ↓ (if fails)                       ↓ (if fails)
Layer 3: ML-Based Analysis  → Layer 4: Baseline Data (Score 40)
    ↓ (if fails)                       ↓
    ✅ ALWAYS RETURNS: Status "completed" + Score 35-100
```

See [ANALYSIS_GUARANTEE.md](./ANALYSIS_GUARANTEE.md) for technical details.

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript 5.0** - Type safety
- **Vite** - Build tool
- **React Router v7** - Routing (use `react-router`, not `react-router-dom`)
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **Framer Motion** - Animations
- **Lucide Icons** - Icon library

### Backend
- **Convex** - Serverless backend & real-time database
- **Convex Auth** - Email OTP authentication
- **OpenRouter API** - AI model access
- **LemonSqueezy** - Payment processing

### AI Models
- Gemini 2.0 Flash (primary)
- DeepSeek Chat (secondary)
- Custom ML keyword analysis (fallback)

## 📁 Project Structure

```
cvdebug-app/
├── src/
│   ├── convex/                    # Backend (Convex functions)
│   │   ├── ai/                   # AI analysis system ⭐
│   │   │   ├── resumeAnalysis.ts    # Main analysis with 4-layer fallback
│   │   │   ├── fallbackAnalysis.ts  # ML-based backup system
│   │   │   └── scoring/             # Scoring algorithms
│   │   ├── resumes.ts            # Resume CRUD operations
│   │   ├── billing.ts            # Payment webhook handling
│   │   ├── jobTracker.ts         # Job application tracking
│   │   └── auth.ts               # Authentication (DO NOT MODIFY)
│   │
│   ├── components/               # React components
│   │   ├── dashboard/           # Dashboard features
│   │   │   ├── MissionControl.tsx   # Main dashboard ⭐
│   │   │   ├── Sidebar.tsx
│   │   │   └── ...
│   │   ├── ui/                  # shadcn/ui components
│   │   └── LogoutConfirmDialog.tsx
│   │
│   ├── pages/                   # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Admin.tsx
│   │   └── ...
│   │
│   └── hooks/                   # Custom React hooks
│
├── ANALYSIS_GUARANTEE.md       # System documentation ⭐
├── BRANDING_GUIDE.md           # Brand consistency guide
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- pnpm (package manager)
- Convex account (free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/cvdebug-app.git
cd cvdebug-app

# Install dependencies
pnpm install

# Start development server (frontend + backend)
pnpm dev
```

The app will run on:
- Frontend: `http://localhost:5173`
- Convex Dashboard: Check terminal output for URL

### Environment Variables

#### Client-side (`.env.local`)
```env
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

#### Server-side (Convex Dashboard → Settings → Environment Variables)
```env
# Authentication (auto-configured by Convex Auth)
JWKS=
JWT_PRIVATE_KEY=
SITE_URL=

# AI Analysis (optional - uses fallback if missing)
OPENROUTER_API_KEY=your_key_here

# Payments
LEMONSQUEEZY_API_KEY=your_key_here
LEMONSQUEEZY_WEBHOOK_SECRET=your_secret_here
```

## 📝 Development Guidelines

### Authentication
- Auth is **already configured** - DO NOT modify:
  - `src/convex/auth.ts`
  - `src/convex/auth.config.ts`
  - `src/convex/auth/emailOtp.ts`

### Backend (Convex)
```typescript
// Use these imports for Convex functions
import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";

// Get current user
import { getCurrentUser } from "./users";
const user = await getCurrentUser(ctx);
```

### Frontend
```typescript
// Use react-router (NOT react-router-dom)
import { useNavigate } from "react-router";

// Convex hooks
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
```

### Styling
- Use Tailwind utility classes
- shadcn/ui components in `@/components/ui`
- Custom animations with Framer Motion

## 🧪 Testing

```bash
# Check TypeScript errors
npx tsc -b --noEmit

# Verify Convex functions compile
npx convex dev --once

# Run full build
pnpm build
```

## 🚢 Deployment

### Backend (Convex)
```bash
# Deploy to production
npx convex deploy

# View deployment
npx convex dashboard
```

### Frontend (Recommended: Vercel)
```bash
# Build for production
pnpm build

# Output: dist/
# Deploy dist/ to Vercel, Netlify, or your preferred hosting
```

Configure environment variables in your hosting dashboard.

## 📊 Key Features Explained

### Mission Control Dashboard
The main dashboard provides:
- **Visibility Score**: Resume ATS compatibility (0-100)
- **Active Applications**: Kanban board with Applied/Interviewing/Offer columns
- **Missing Signals**: Critical keywords/formatting issues
- **Error Terminal**: Real-time debugging with severity levels

### Guaranteed Analysis
Every CV receives:
- ✅ Score (35-100 points)
- ✅ Matched keywords
- ✅ Missing keywords with suggestions
- ✅ Format issues with fixes
- ✅ Optimization tips
- ✅ Status: "completed" (NEVER "failed")

### Payment System
- Single Scan: €4.99 (one-time detailed analysis)
- Interview Sprint: €19.99 (unlimited scans for 14 days)
- LemonSqueezy integration with webhook processing

## 🔒 Security

- JWT-based authentication with Convex Auth
- Server-side validation for all mutations
- Rate limiting on AI endpoints
- Secure payment webhook verification
- Device fingerprinting for abuse prevention

## 📖 Documentation

- [ANALYSIS_GUARANTEE.md](./ANALYSIS_GUARANTEE.md) - Detailed system architecture
- [BRANDING_GUIDE.md](./BRANDING_GUIDE.md) - Logo and brand usage
- [Convex Docs](https://docs.convex.dev/) - Backend documentation

## 🤝 Contributing

This is a private project. For questions or support:
- Email: cvdebug@outlook.com
- Admin: tiniboti@gmail.com

## 📜 License

Proprietary - All rights reserved

## 🎓 Credits

Built with:
- [Convex](https://convex.dev/) - Real-time serverless backend
- [OpenRouter](https://openrouter.ai/) - AI model gateway
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

---

**Version**: 2.4.0-prod
**Last Updated**: 2026-01-09
**Status**: ✅ Production Ready

<div align="center">

Made with ❤️ by the CVDebug Team

</div>
