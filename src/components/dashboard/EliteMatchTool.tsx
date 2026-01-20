import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Target,
  Zap,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  TrendingUp,
  Loader2,
  ExternalLink,
  Wand2
} from "lucide-react";
import { toast } from "sonner";

interface MissingSignal {
  text: string;
  category: string;
  importance: 'critical' | 'important' | 'nice_to_have';
  context?: string;
  suggestion: string;
}

interface MatchResult {
  score: number;
  missingCritical: MissingSignal[];
  missingImportant: MissingSignal[];
  matched: string[];
  robotView: {
    redZones: string[]; // Áreas problemáticas
    greenZones: string[]; // Áreas fuertes
  };
  recommendations: string[];
}

interface EliteMatchToolProps {
  user?: any;
  onUpgrade?: () => void;
}

export function EliteMatchTool({ user, onUpgrade }: EliteMatchToolProps = {}) {
  const [step, setStep] = useState<'input' | 'analyzing' | 'results'>('input');

  // Check if user has paid plan
  const isPaidUser = user?.subscriptionTier === "single_scan" || user?.subscriptionTier === "interview_sprint";
  const [jobDescriptionUrl, setJobDescriptionUrl] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');

  const handleAnalyze = async () => {
    if (!jobDescriptionUrl && !jobDescriptionText) {
      toast.error('Por favor pega el link de LinkedIn o el texto de la oferta');
      return;
    }

    // Start analysis
    setStep('analyzing');
    setProgress(0);

    // Simulate progress with realistic messages
    const progressSteps = [
      { progress: 20, message: 'Extracting Recruiter Intent...' },
      { progress: 40, message: 'Analyzing Hard Skills Requirements...' },
      { progress: 60, message: 'Detecting Soft Skills Signals...' },
      { progress: 80, message: 'Calculating ATS Compatibility...' },
      { progress: 100, message: 'Generating Missing Signals Report...' }
    ];

    for (const progressStep of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(progressStep.progress);
      setProgressMessage(progressStep.message);
    }

    // Mock result (in production, call backend API)
    const mockResult: MatchResult = {
      score: 67,
      missingCritical: [
        {
          text: 'Kubernetes',
          category: 'DevOps',
          importance: 'critical',
          context: 'Experience with Kubernetes for container orchestration',
          suggestion: 'La oferta pide experiencia en "Kubernetes" (CRÍTICO). Sin esto, el ATS te descarta automáticamente. Necesitas añadir este skill.'
        },
        {
          text: 'AWS Lambda',
          category: 'Cloud',
          importance: 'critical',
          context: 'Hands-on experience with AWS Lambda serverless architecture',
          suggestion: 'La oferta busca "AWS Lambda", pero tu CV solo menciona "EC2". Te falta este token crítico.'
        }
      ],
      missingImportant: [
        {
          text: 'Agile Leadership',
          category: 'Soft Skills',
          importance: 'important',
          suggestion: 'La oferta busca "Agile Leadership", pero tu CV es demasiado técnico. Necesitas añadir señales de liderazgo.'
        },
        {
          text: 'Stakeholder Management',
          category: 'Soft Skills',
          importance: 'important',
          suggestion: 'Te falta "Stakeholder Management". Añade contexto sobre cómo has trabajado con stakeholders.'
        }
      ],
      matched: [
        'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker',
        'CI/CD', 'Microservices', 'RESTful APIs'
      ],
      robotView: {
        redZones: [
          'Experience section: Missing Kubernetes references',
          'Skills section: No AWS Lambda mentioned',
          'Leadership section: Too technical, lacks soft skill signals'
        ],
        greenZones: [
          'Technical skills: Strong match with React and TypeScript',
          'Tools: Good coverage of modern DevOps tools',
          'Years of experience: Matches requirement (5+ years)'
        ]
      },
      recommendations: [
        'Añade "Kubernetes" en tu sección de experiencia con un ejemplo concreto',
        'Reescribe tu proyecto de AWS para incluir "Lambda" de forma natural',
        'Añade una sección de "Leadership & Collaboration" con ejemplos específicos',
        'Incluye métricas cuantificables (% mejora, usuarios impactados, etc.)'
      ]
    };

    await new Promise(resolve => setTimeout(resolve, 500));
    setMatchResult(mockResult);
    setStep('results');
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-[#22C55E]';
    if (score >= 70) return 'text-[#F59E0B]';
    return 'text-[#EF4444]';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return 'bg-[#22C55E]/10';
    if (score >= 70) return 'bg-[#F59E0B]/10';
    return 'bg-[#EF4444]/10';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Ready to Apply';
    if (score >= 70) return 'Needs Optimization';
    return 'Invisible to the Bot';
  };

  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Target className="h-8 w-8 text-[#3B82F6]" />
          <h1 className="text-3xl font-black text-[#0F172A]">Elite Match Tool</h1>
        </div>
        <p className="text-[#64748B]">
          Descubre exactamente qué le falta a tu CV para pasar el ATS de esa oferta específica
        </p>
      </div>

      {/* Content - Blurred if not paid */}
      <div className={!isPaidUser ? 'blur-[3px] pointer-events-none select-none' : ''}>
        <AnimatePresence mode="wait">
        {/* Step 1: Input */}
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl border-2 border-[#E2E8F0] p-8">
              <div className="space-y-6">
                {/* LinkedIn URL */}
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                    Link de LinkedIn (Recomendado)
                  </label>
                  <Input
                    type="url"
                    placeholder="https://www.linkedin.com/jobs/view/..."
                    value={jobDescriptionUrl}
                    onChange={(e) => setJobDescriptionUrl(e.target.value)}
                    className="h-12"
                  />
                  <p className="text-xs text-[#64748B] mt-2">
                    Pega el link directo de la oferta en LinkedIn
                  </p>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E2E8F0]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-[#64748B] font-semibold">O</span>
                  </div>
                </div>

                {/* Job Description Text */}
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                    Pega el Texto de la Oferta
                  </label>
                  <Textarea
                    placeholder="About the role:&#10;We are looking for a Senior Full Stack Developer with 5+ years of experience...&#10;&#10;Requirements:&#10;- Strong experience with React and Node.js&#10;- Experience with Kubernetes and AWS&#10;- Excellent communication skills"
                    value={jobDescriptionText}
                    onChange={(e) => setJobDescriptionText(e.target.value)}
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-[#64748B] mt-2">
                    Copia toda la descripción del trabajo desde cualquier portal
                  </p>
                </div>

                {/* CTA */}
                <Button
                  onClick={handleAnalyze}
                  size="lg"
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8]"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Analizar Match Score
                </Button>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] p-6 rounded-xl border border-[#93C5FD]">
                <Target className="h-8 w-8 text-[#3B82F6] mb-3" />
                <h3 className="font-bold text-[#0F172A] mb-2">Entity Extraction</h3>
                <p className="text-sm text-[#475569]">
                  No solo keywords - extraemos Hard Skills, Soft Skills y Métricas de Industria
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] p-6 rounded-xl border border-[#FCD34D]">
                <AlertTriangle className="h-8 w-8 text-[#F59E0B] mb-3" />
                <h3 className="font-bold text-[#0F172A] mb-2">Gap Analysis</h3>
                <p className="text-sm text-[#475569]">
                  Identificamos EXACTAMENTE qué signals te faltan para pasar el ATS
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] p-6 rounded-xl border border-[#86EFAC]">
                <Sparkles className="h-8 w-8 text-[#22C55E] mb-3" />
                <h3 className="font-bold text-[#0F172A] mb-2">Auto-Fix con IA</h3>
                <p className="text-sm text-[#475569]">
                  Un click y nuestra IA reescribe tu CV para incluir los signals que faltan
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Analyzing */}
        {step === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl border-2 border-[#E2E8F0] p-12"
          >
            <div className="max-w-md mx-auto text-center">
              <div className="mb-6">
                <Loader2 className="h-16 w-16 mx-auto text-[#3B82F6] animate-spin" />
              </div>

              <h2 className="text-2xl font-bold text-[#0F172A] mb-4">
                Analizando tu Match...
              </h2>

              <p className="text-[#64748B] mb-6">
                {progressMessage}
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-[#F1F5F9] rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <p className="text-sm font-semibold text-[#3B82F6] mt-3">
                {progress}%
              </p>
            </div>
          </motion.div>
        )}

        {/* Step 3: Results */}
        {step === 'results' && matchResult && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Match Dashboard */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left: Score */}
              <div className={`bg-white rounded-xl border-2 border-[#E2E8F0] p-8 ${getScoreBgColor(matchResult.score)}`}>
                <div className="text-center">
                  <div className="mb-4">
                    <div className={`text-7xl font-black ${getScoreColor(matchResult.score)}`}>
                      {matchResult.score}
                      <span className="text-4xl">%</span>
                    </div>
                    <p className="text-lg font-bold text-[#0F172A] mt-2">
                      {getScoreLabel(matchResult.score)}
                    </p>
                  </div>

                  {matchResult.score < 70 && (
                    <div className="bg-[#FEE2E2] border border-[#EF4444] rounded-lg p-4 text-left">
                      <p className="text-sm font-semibold text-[#EF4444]">
                        ⚠️ El ATS te descartará automáticamente
                      </p>
                      <p className="text-xs text-[#7F1D1D] mt-1">
                        Necesitas optimizar tu CV ANTES de aplicar
                      </p>
                    </div>
                  )}

                  {matchResult.score >= 70 && matchResult.score < 85 && (
                    <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-lg p-4 text-left">
                      <p className="text-sm font-semibold text-[#F59E0B]">
                        ⚡ Estás cerca, pero no destacas
                      </p>
                      <p className="text-xs text-[#78350F] mt-1">
                        Optimiza para superar a los demás candidatos
                      </p>
                    </div>
                  )}

                  {matchResult.score >= 85 && (
                    <div className="bg-[#DCFCE7] border border-[#22C55E] rounded-lg p-4 text-left">
                      <p className="text-sm font-semibold text-[#22C55E]">
                        ✅ Excelente - Apply con confianza
                      </p>
                      <p className="text-xs text-[#14532D] mt-1">
                        Tienes alta probabilidad de pasar el ATS
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Center: Missing Signals */}
              <div className="lg:col-span-2 bg-white rounded-xl border-2 border-[#E2E8F0] p-8">
                <h3 className="text-xl font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-[#EF4444]" />
                  Missing Signals
                </h3>

                <div className="space-y-3 mb-6">
                  {matchResult.missingCritical.map((signal, idx) => (
                    <div
                      key={idx}
                      className="bg-[#FEE2E2] border-l-4 border-[#EF4444] p-4 rounded-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <XCircle className="h-4 w-4 text-[#EF4444]" />
                            <span className="font-bold text-[#EF4444] text-sm">
                              CRÍTICO
                            </span>
                            <span className="font-bold text-[#0F172A]">
                              {signal.text}
                            </span>
                            <span className="text-xs bg-[#EF4444]/10 text-[#EF4444] px-2 py-1 rounded">
                              {signal.category}
                            </span>
                          </div>
                          <p className="text-sm text-[#475569] mb-2">
                            {signal.suggestion}
                          </p>
                          {signal.context && (
                            <p className="text-xs text-[#64748B] italic">
                              Contexto: "{signal.context.substring(0, 100)}..."
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white"
                        >
                          <Wand2 className="h-3 w-3 mr-1" />
                          Fix
                        </Button>
                      </div>
                    </div>
                  ))}

                  {matchResult.missingImportant.slice(0, 3).map((signal, idx) => (
                    <div
                      key={idx}
                      className="bg-[#FEF3C7] border-l-4 border-[#F59E0B] p-4 rounded-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />
                            <span className="font-bold text-[#F59E0B] text-sm">
                              IMPORTANTE
                            </span>
                            <span className="font-bold text-[#0F172A]">
                              {signal.text}
                            </span>
                            <span className="text-xs bg-[#F59E0B]/10 text-[#F59E0B] px-2 py-1 rounded">
                              {signal.category}
                            </span>
                          </div>
                          <p className="text-sm text-[#475569]">
                            {signal.suggestion}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#F59E0B] text-[#F59E0B] hover:bg-[#F59E0B] hover:text-white"
                        >
                          <Wand2 className="h-3 w-3 mr-1" />
                          Fix
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Matched Skills */}
                <div>
                  <h4 className="text-sm font-bold text-[#22C55E] mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Skills que ya tienes ({matchResult.matched.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {matchResult.matched.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-[#DCFCE7] text-[#22C55E] px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-Fix CTA */}
            <div className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] rounded-xl p-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Sparkles className="h-6 w-6" />
                    Auto-Fix con IA
                  </h3>
                  <p className="text-white/90 mb-4">
                    Nuestra IA reescribirá tu CV para incluir todos los Missing Signals de forma natural.
                    En 5 minutos tendrás un CV optimizado para esta oferta específica.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Añade keywords naturalmente
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Preserva tu experiencia real
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      ATS-friendly 100%
                    </span>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="bg-white text-[#8B5CF6] hover:bg-[#F8FAFC] font-bold px-8 h-14"
                >
                  <Wand2 className="h-5 w-5 mr-2" />
                  Auto-Fix por 14.99€
                </Button>
              </div>
            </div>

            {/* Robot View */}
            <div className="bg-white rounded-xl border-2 border-[#E2E8F0] p-8">
              <h3 className="text-xl font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#3B82F6]" />
                Robot View - Cómo el ATS prioriza tu CV
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Red Zones */}
                <div>
                  <h4 className="font-bold text-[#EF4444] mb-3 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Zonas Rojas (Bloqueadores)
                  </h4>
                  <div className="space-y-2">
                    {matchResult.robotView.redZones.map((zone, idx) => (
                      <div key={idx} className="bg-[#FEE2E2] border-l-2 border-[#EF4444] p-3 rounded text-sm text-[#7F1D1D]">
                        {zone}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Green Zones */}
                <div>
                  <h4 className="font-bold text-[#22C55E] mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Zonas Verdes (Fortalezas)
                  </h4>
                  <div className="space-y-2">
                    {matchResult.robotView.greenZones.map((zone, idx) => (
                      <div key={idx} className="bg-[#DCFCE7] border-l-2 border-[#22C55E] p-3 rounded text-sm text-[#14532D]">
                        {zone}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setStep('input');
                  setMatchResult(null);
                  setJobDescriptionUrl('');
                  setJobDescriptionText('');
                }}
                variant="outline"
                className="flex-1"
              >
                Analizar Otra Oferta
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-[#3B82F6] to-[#2563EB]"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Guardar Análisis
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Paywall Overlay */}
      {!isPaidUser && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#FFFFFF]/95 to-[#F8FAFC]/95 backdrop-blur-sm rounded-xl z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-12 max-w-xl"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Target className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-[#0F172A] mb-3">
              Elite Match Tool es Premium
            </h2>
            <p className="text-[#64748B] mb-2 text-lg leading-relaxed">
              Analiza tu CV contra cualquier oferta usando <span className="font-bold text-[#3B82F6]">ML local</span> (0 costes de API)
            </p>
            <p className="text-[#64748B] mb-8 text-sm">
              • Extracción de entidades con TF-IDF & Cosine Similarity<br/>
              • Gap analysis crítico/importante/nice-to-have<br/>
              • Robot View con zonas rojas/verdes<br/>
              • Auto-Fix suggestions específicas
            </p>
            <Button
              onClick={onUpgrade}
              size="lg"
              className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white font-bold px-8 py-4 rounded-xl shadow-2xl hover:scale-105 transition-all text-lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Upgrade Now - $14.99
            </Button>
            <p className="text-xs text-[#94A3B8] mt-4">
              24-hour access • Unlimited match analysis • ML-powered insights
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
