# CVDebug - Technical Architecture Document
**Version:** 1.0  
**Last Updated:** December 2024  
**Author:** Senior Full-Stack Architect

---

## 1. ARQUITECTURA GENERAL

### Stack Tecnológico

#### Frontend
- **Framework:** React 19 + Vite
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4 + Shadcn UI
- **Animations:** Framer Motion
- **State Management:** Convex Real-time Queries (no Redux needed)
- **Icons:** Lucide React
- **3D Graphics:** Three.js + React Three Fiber

#### Backend
- **Platform:** Convex (Serverless Backend)
- **Runtime:** Node.js (for actions with "use node")
- **Database:** Convex DB (NoSQL with TypeScript validation)
- **File Storage:** Convex Storage (for PDFs, DOCX)

#### Authentication
- **Provider:** Clerk
- **Method:** Email OTP + Anonymous Users
- **Webhook:** Svix for user sync (user.created, user.updated)

#### AI & Processing
- **Primary Model:** Google Gemini 2.0 Flash (via OpenRouter)
- **Fallback:** ML-based local analysis (no API key required)
- **OCR:** Client-side (tesseract.js) + Server fallback
- **Document Parsing:** pdfjs-dist, mammoth (DOCX)

#### Payments
- **Gateway:** Autumn (wrapper over Stripe)
- **Plans:** Free Preview, Single Scan (€4.99), Interview Sprint (€19.99)
- **Webhook:** Autumn signature verification

#### Email Marketing
- **Provider:** Resend
- **Campaigns:** Onboarding, Conversion, Re-engagement, Low Score Tips

### Patrón de Diseño

**Arquitectura:** Serverless + Real-time Reactive
- **Frontend:** Component-based (React) con hooks personalizados
- **Backend:** Function-based (Convex queries, mutations, actions)
- **Data Flow:** Unidirectional con subscripciones reactivas
- **State:** Server-driven (Convex queries auto-update UI)

**Principios:**
1. **Separation of Concerns:** UI components separados de lógica de negocio
2. **Real-time First:** Todas las queries son subscripciones live
3. **Type Safety:** TypeScript end-to-end con validación Convex
4. **Progressive Enhancement:** Fallback ML cuando no hay API key

---

## 2. DESGLOSE POR MÓDULOS Y PANTALLAS

### 2.1 Landing Page (`/`)
**Archivo:** `src/pages/Landing.tsx`

**Propósito:** Convertir visitantes en usuarios registrados mediante propuesta de valor clara.

**Componentes Clave:**
- `Navbar`: Navegación con links a Features, Pricing, Login/Signup
- `HeroVisualizerSection`: Hero con badge "AI-Powered Parsing 2.0", headline, CTA buttons
- `HowItWorksSection`: Comparación visual "Human View vs Robot View" (muestra errores de parsing)
- `FeaturesSection`: Grid bento con 3 features (Project Tracking, Keyword Sniper, Image Trap Monitor)
- `PricingSection`: 3 tiers con navegación a `/auth?plan=X`
- `Footer`: Links legales (Privacy, Terms), social, logo

**Lógica de Negocio:**
- Redirección a `/auth` con query param `?plan=` para pre-seleccionar plan
- Animaciones con Framer Motion para engagement
- Tema dark (bg-slate-900) con gradientes primary

---

### 2.2 Auth Page (`/auth`)
**Archivo:** `src/pages/Auth.tsx`

**Propósito:** Registro/Login con Clerk Email OTP.

**Componentes Clave:**
- Clerk `<SignIn>` y `<SignUp>` components
- Redirección post-auth a `/dashboard` o `/onboarding`

**Lógica de Negocio:**
- Clerk maneja toda la autenticación
- Webhook Svix sincroniza usuarios a Convex (`users.storeUser`)
- Device fingerprinting (FingerprintJS) para anti-cheat
- Query param `?plan=` se preserva para checkout post-auth

---

### 2.3 Onboarding (`/onboarding`)
**Archivo:** `src/pages/Onboarding.tsx`

**Propósito:** Guiar al usuario a subir su primer CV.

**Componentes Clave:**
- `ProgressTimeline`: Stepper visual (Upload CV → Scanning → Target Job)
- `StepUploadCV`: Drag & drop + file input
- `StepScanning`: Loading animation durante OCR + AI analysis
- `StepTargetJob`: Input opcional para job description

**Lógica de Negocio:**
- Llama `resumes.createResume` mutation
- OCR client-side con tesseract.js
- Si falla, trigger `ai.serverOcr` action
- Redirección a `/dashboard` al completar

---

### 2.4 Dashboard (`/dashboard`)
**Archivo:** `src/pages/Dashboard.tsx`

**Propósito:** Hub central para gestionar CVs, proyectos, aplicaciones y herramientas AI.

**Componentes Clave:**
- `Sidebar`: Navegación entre vistas (Mission, Projects, Master CVs, Tools, Profile)
- `MobileTabBar`: Navegación móvil bottom bar
- `MissionControl`: Vista principal con ATS analysis
- `ProjectsView`: Lista de proyectos de búsqueda de empleo
- `ProjectBoard`: Kanban board para aplicaciones
- `ResumeGrid`: Grid de CVs maestros
- `ToolsViews`: Cover Letter Generator, LinkedIn Optimizer, Writing Forge
- `PricingDialog`: Modal para upgrade
- `ProcessingOverlay`: Loading durante upload/análisis
- `ResumeDetailDialog`: Modal con análisis completo del CV

**Lógica de Negocio:**
- `currentView` state controla qué vista renderizar
- `useResumeUpload` hook maneja drag & drop + file upload
- Payment success flow: `?payment=success&plan=X` → `purchaseCredits` mutation
- Credit exhaustion: muestra `CreditsExhaustedModal`
- Free tier: solo muestra score, bloquea detalles

**Vistas Internas:**
1. **Mission Control:** ATS analysis del CV maestro
2. **Projects:** Lista de proyectos con health status
3. **Master CVs:** Grid de CVs base
4. **Tools:** AI tools (Cover Letter, LinkedIn, Writing Forge)
5. **Profile:** Créditos, sprint progress, settings

---

### 2.5 Mission Control
**Archivo:** `src/components/dashboard/MissionControl.tsx`

**Propósito:** Mostrar análisis ATS del CV maestro con actionable insights.

**Componentes Clave:**
- `SpeedometerCard`: Score 0-100 con gauge visual
- `RoleMatchCard`: Match con target role
- `KeywordHeatmap`: Keywords matched vs missing
- `FormattingAudit`: Formato issues (ATS compatibility)
- `ActionableFixes`: Lista priorizada de fixes
- `AIProTip`: Tip contextual basado en score
- `FreeTierView`: Vista restringida para usuarios free (solo score + upgrade prompt)

**Lógica de Negocio:**
- Query `resumes.getResumes` para obtener master CV
- Si `isFree && !detailsUnlocked`: muestra solo score + upsell
- Si `isPremium || detailsUnlocked`: muestra análisis completo
- `isPremium` = `subscriptionTier === "single_scan" || "interview_sprint"` O `sprintExpiresAt > now`
- Botones CTA: "Upload New CV", "Generate Cover Letter", "Optimize LinkedIn"

---

### 2.6 Project Board
**Archivo:** `src/components/dashboard/ProjectBoard.tsx`

**Propósito:** Kanban board para trackear aplicaciones de un proyecto.

**Componentes Clave:**
- Columnas: Draft, Applied, Interviewing, Rejected, Accepted
- `ApplicationCard`: Card con company, job title, match score, keywords gap
- `KeywordSniperPanel`: Panel lateral con análisis de keywords para una aplicación

**Lógica de Negocio:**
- Query `applications.getApplicationsByProject`
- Drag & drop con `@hello-pangea/dnd`
- Mutation `applications.updateApplicationStatus` al mover cards
- Click "View Details" → abre `KeywordSniperPanel` con análisis de gap
- Click "Generate Cover Letter" → navega a `/dashboard/tools/cover-letter` con `applicationId`

---

### 2.7 AI Tools

#### Cover Letter Generator
**Archivo:** `src/components/dashboard/tools/CoverLetterGenerator.tsx`

**Propósito:** Generar cover letters tailored con AI.

**Lógica:**
- Input: Application ID (pre-filled) o manual (company, job title, JD)
- Action `coverLetters.generate` → OpenRouter API
- Output: Cover letter con keywords bridged
- Guarda en DB: `coverLetters` table

#### LinkedIn Optimizer
**Archivo:** `src/components/dashboard/tools/LinkedInOptimizer.tsx`

**Propósito:** Auditar y optimizar perfil de LinkedIn.

**Lógica:**
- Input: LinkedIn URL + profile text paste
- Action `ai.optimizeLinkedIn` → análisis de headline, about, experience
- Output: Score, suggested headline, rewritten about, missing keywords
- Componentes: `HeadlineOptimizer`, `KeywordCloud`, `QuickFixList`, `ScoreGauge`

#### Recruiter DM Generator
**Archivo:** `src/components/dashboard/tools/RecruiterDMGenerator.tsx`

**Propósito:** Generar mensajes para recruiters.

**Lógica:**
- Input: Recruiter name, job description
- Action `ai.generateRecruiterDMs` → 3 variaciones (Professional, Casual, Bold)
- Output: Subject + body para cada tono

---

### 2.8 Admin Panel (`/admin`)
**Archivo:** `src/pages/Admin.tsx`

**Propósito:** Gestión de usuarios, pagos, testing.

**Componentes Clave:**
- `AdminStats`: Métricas (total users, paid users, revenue)
- `AdminUserTable`: Tabla de usuarios con filtros
- `AdminManualGrant`: Otorgar créditos manualmente
- `AdminBulkGrant`: Otorgar créditos en bulk (CSV)
- `AdminPaymentTesting`: Simular pagos
- `AdminDataImport`: Importar datos de CSV

**Lógica de Negocio:**
- Solo accesible para `tiniboti@gmail.com` (hardcoded admin)
- Mutations: `admin.grantCredits`, `admin.bulkGrantCredits`
- Query `admin.getAllUsers` con paginación

---

## 3. LÓGICA DEL BACKEND (CONVEX)

### Estructura de Archivos

