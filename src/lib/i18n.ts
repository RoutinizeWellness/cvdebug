// Internationalization configuration for CVDebug
// Supports multiple countries and languages

export type SupportedLocale = 'en-US' | 'en-GB' | 'es-ES' | 'fr-FR' | 'de-DE' | 'pt-BR' | 'en-IN' | 'en-CA' | 'en-AU' | 'es-MX';

export interface Translation {
  // Hero Section
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustIndicator: string;
  };
  // Features
  features: {
    robotView: string;
    keywordGap: string;
    seniorityMatch: string;
    instantScan: string;
  };
  // Pricing
  pricing: {
    free: string;
    pass24h: string;
    sprint7d: string;
    currency: string;
  };
  // Dashboard
  dashboard: {
    welcome: string;
    uploadCv: string;
    analyzing: string;
    score: string;
    issues: string;
  };
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
  };
}

export const translations: Record<SupportedLocale, Translation> = {
  'en-US': {
    hero: {
      title: 'Stop guessing why you\'re being ghosted.',
      subtitle: 'Debug your resume\'s invisible bugs and land interviews in 7 days.',
      ctaPrimary: 'See Robot View - Free',
      ctaSecondary: 'Sign Up for Full Access',
      trustIndicator: 'No credit card • No sign up required • Instant results in 10 seconds',
    },
    features: {
      robotView: 'Robot View Terminal',
      keywordGap: 'Missing Signals Detector',
      seniorityMatch: 'Seniority Match Audit',
      instantScan: 'Instant ATS Score',
    },
    pricing: {
      free: 'Free Scan',
      pass24h: '24-Hour Pass',
      sprint7d: '7-Day Sprint',
      currency: '$',
    },
    dashboard: {
      welcome: 'Welcome back',
      uploadCv: 'Upload your resume',
      analyzing: 'Analyzing your resume...',
      score: 'ATS Score',
      issues: 'Issues Found',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
    },
  },
  'en-GB': {
    hero: {
      title: 'Stop guessing why you\'re being ghosted.',
      subtitle: 'Debug your CV\'s invisible bugs and land interviews in 7 days.',
      ctaPrimary: 'See Robot View - Free',
      ctaSecondary: 'Sign Up for Full Access',
      trustIndicator: 'No credit card • No sign up required • Instant results in 10 seconds',
    },
    features: {
      robotView: 'Robot View Terminal',
      keywordGap: 'Missing Signals Detector',
      seniorityMatch: 'Seniority Match Audit',
      instantScan: 'Instant ATS Score',
    },
    pricing: {
      free: 'Free Scan',
      pass24h: '24-Hour Pass',
      sprint7d: '7-Day Sprint',
      currency: '£',
    },
    dashboard: {
      welcome: 'Welcome back',
      uploadCv: 'Upload your CV',
      analyzing: 'Analysing your CV...',
      score: 'ATS Score',
      issues: 'Issues Found',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
    },
  },
  'es-ES': {
    hero: {
      title: 'Deja de preguntarte por qué te ignoran.',
      subtitle: 'Depura los errores invisibles de tu CV y consigue entrevistas en 7 días.',
      ctaPrimary: 'Ver Vista Robot - Gratis',
      ctaSecondary: 'Regístrate para Acceso Completo',
      trustIndicator: 'Sin tarjeta • Sin registro • Resultados instantáneos en 10 segundos',
    },
    features: {
      robotView: 'Terminal Vista Robot',
      keywordGap: 'Detector de Señales Faltantes',
      seniorityMatch: 'Auditoría de Nivel Senior',
      instantScan: 'Puntuación ATS Instantánea',
    },
    pricing: {
      free: 'Escaneo Gratis',
      pass24h: 'Pase 24 Horas',
      sprint7d: 'Sprint 7 Días',
      currency: '€',
    },
    dashboard: {
      welcome: 'Bienvenido de nuevo',
      uploadCv: 'Sube tu CV',
      analyzing: 'Analizando tu CV...',
      score: 'Puntuación ATS',
      issues: 'Problemas Encontrados',
    },
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
    },
  },
  'fr-FR': {
    hero: {
      title: 'Arrêtez de vous demander pourquoi on vous ignore.',
      subtitle: 'Déboguez les bugs invisibles de votre CV et obtenez des entretiens en 7 jours.',
      ctaPrimary: 'Voir Vue Robot - Gratuit',
      ctaSecondary: 'S\'inscrire pour Accès Complet',
      trustIndicator: 'Sans carte • Sans inscription • Résultats instantanés en 10 secondes',
    },
    features: {
      robotView: 'Terminal Vue Robot',
      keywordGap: 'Détecteur de Signaux Manquants',
      seniorityMatch: 'Audit de Niveau Senior',
      instantScan: 'Score ATS Instantané',
    },
    pricing: {
      free: 'Scan Gratuit',
      pass24h: 'Pass 24 Heures',
      sprint7d: 'Sprint 7 Jours',
      currency: '€',
    },
    dashboard: {
      welcome: 'Bon retour',
      uploadCv: 'Téléchargez votre CV',
      analyzing: 'Analyse de votre CV...',
      score: 'Score ATS',
      issues: 'Problèmes Trouvés',
    },
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      cancel: 'Annuler',
      save: 'Enregistrer',
      delete: 'Supprimer',
    },
  },
  'de-DE': {
    hero: {
      title: 'Hören Sie auf zu raten, warum Sie ignoriert werden.',
      subtitle: 'Beheben Sie die unsichtbaren Fehler Ihres Lebenslaufs und erhalten Sie in 7 Tagen Vorstellungsgespräche.',
      ctaPrimary: 'Roboter-Ansicht sehen - Kostenlos',
      ctaSecondary: 'Für vollen Zugang anmelden',
      trustIndicator: 'Keine Kreditkarte • Keine Anmeldung • Sofortergebnisse in 10 Sekunden',
    },
    features: {
      robotView: 'Roboter-Ansicht Terminal',
      keywordGap: 'Fehlende Signal-Detektor',
      seniorityMatch: 'Senior-Level Audit',
      instantScan: 'Sofortiger ATS-Score',
    },
    pricing: {
      free: 'Kostenloser Scan',
      pass24h: '24-Stunden-Pass',
      sprint7d: '7-Tage-Sprint',
      currency: '€',
    },
    dashboard: {
      welcome: 'Willkommen zurück',
      uploadCv: 'Laden Sie Ihren Lebenslauf hoch',
      analyzing: 'Analysiere deinen Lebenslauf...',
      score: 'ATS-Score',
      issues: 'Gefundene Probleme',
    },
    common: {
      loading: 'Wird geladen...',
      error: 'Fehler',
      success: 'Erfolg',
      cancel: 'Abbrechen',
      save: 'Speichern',
      delete: 'Löschen',
    },
  },
  'pt-BR': {
    hero: {
      title: 'Pare de adivinhar por que você está sendo ignorado.',
      subtitle: 'Depure os bugs invisíveis do seu currículo e consiga entrevistas em 7 dias.',
      ctaPrimary: 'Ver Visão Robô - Grátis',
      ctaSecondary: 'Cadastre-se para Acesso Completo',
      trustIndicator: 'Sem cartão • Sem cadastro • Resultados instantâneos em 10 segundos',
    },
    features: {
      robotView: 'Terminal Visão Robô',
      keywordGap: 'Detector de Sinais Ausentes',
      seniorityMatch: 'Auditoria de Nível Senior',
      instantScan: 'Pontuação ATS Instantânea',
    },
    pricing: {
      free: 'Scan Grátis',
      pass24h: 'Passe 24 Horas',
      sprint7d: 'Sprint 7 Dias',
      currency: 'R$',
    },
    dashboard: {
      welcome: 'Bem-vindo de volta',
      uploadCv: 'Carregue seu currículo',
      analyzing: 'Analisando seu currículo...',
      score: 'Pontuação ATS',
      issues: 'Problemas Encontrados',
    },
    common: {
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
      cancel: 'Cancelar',
      save: 'Salvar',
      delete: 'Excluir',
    },
  },
  'en-IN': {
    hero: {
      title: 'Stop guessing why you\'re being ghosted.',
      subtitle: 'Debug your resume\'s invisible bugs and land interviews in 7 days.',
      ctaPrimary: 'See Robot View - Free',
      ctaSecondary: 'Sign Up for Full Access',
      trustIndicator: 'No credit card • No sign up required • Instant results in 10 seconds',
    },
    features: {
      robotView: 'Robot View Terminal',
      keywordGap: 'Missing Signals Detector',
      seniorityMatch: 'Seniority Match Audit',
      instantScan: 'Instant ATS Score',
    },
    pricing: {
      free: 'Free Scan',
      pass24h: '24-Hour Pass',
      sprint7d: '7-Day Sprint',
      currency: '₹',
    },
    dashboard: {
      welcome: 'Welcome back',
      uploadCv: 'Upload your resume',
      analyzing: 'Analysing your resume...',
      score: 'ATS Score',
      issues: 'Issues Found',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
    },
  },
  'en-CA': {
    hero: {
      title: 'Stop guessing why you\'re being ghosted.',
      subtitle: 'Debug your resume\'s invisible bugs and land interviews in 7 days.',
      ctaPrimary: 'See Robot View - Free',
      ctaSecondary: 'Sign Up for Full Access',
      trustIndicator: 'No credit card • No sign up required • Instant results in 10 seconds',
    },
    features: {
      robotView: 'Robot View Terminal',
      keywordGap: 'Missing Signals Detector',
      seniorityMatch: 'Seniority Match Audit',
      instantScan: 'Instant ATS Score',
    },
    pricing: {
      free: 'Free Scan',
      pass24h: '24-Hour Pass',
      sprint7d: '7-Day Sprint',
      currency: 'C$',
    },
    dashboard: {
      welcome: 'Welcome back',
      uploadCv: 'Upload your resume',
      analyzing: 'Analyzing your resume...',
      score: 'ATS Score',
      issues: 'Issues Found',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
    },
  },
  'en-AU': {
    hero: {
      title: 'Stop guessing why you\'re being ghosted.',
      subtitle: 'Debug your resume\'s invisible bugs and land interviews in 7 days.',
      ctaPrimary: 'See Robot View - Free',
      ctaSecondary: 'Sign Up for Full Access',
      trustIndicator: 'No credit card • No sign up required • Instant results in 10 seconds',
    },
    features: {
      robotView: 'Robot View Terminal',
      keywordGap: 'Missing Signals Detector',
      seniorityMatch: 'Seniority Match Audit',
      instantScan: 'Instant ATS Score',
    },
    pricing: {
      free: 'Free Scan',
      pass24h: '24-Hour Pass',
      sprint7d: '7-Day Sprint',
      currency: 'A$',
    },
    dashboard: {
      welcome: 'Welcome back',
      uploadCv: 'Upload your resume',
      analyzing: 'Analysing your resume...',
      score: 'ATS Score',
      issues: 'Issues Found',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
    },
  },
  'es-MX': {
    hero: {
      title: 'Deja de preguntarte por qué te ignoran.',
      subtitle: 'Depura los errores invisibles de tu CV y consigue entrevistas en 7 días.',
      ctaPrimary: 'Ver Vista Robot - Gratis',
      ctaSecondary: 'Regístrate para Acceso Completo',
      trustIndicator: 'Sin tarjeta • Sin registro • Resultados instantáneos en 10 segundos',
    },
    features: {
      robotView: 'Terminal Vista Robot',
      keywordGap: 'Detector de Señales Faltantes',
      seniorityMatch: 'Auditoría de Nivel Senior',
      instantScan: 'Puntuación ATS Instantánea',
    },
    pricing: {
      free: 'Escaneo Gratis',
      pass24h: 'Pase 24 Horas',
      sprint7d: 'Sprint 7 Días',
      currency: 'MX$',
    },
    dashboard: {
      welcome: 'Bienvenido de nuevo',
      uploadCv: 'Sube tu CV',
      analyzing: 'Analizando tu CV...',
      score: 'Puntuación ATS',
      issues: 'Problemas Encontrados',
    },
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
    },
  },
};

// Get browser locale or default to en-US
export function detectLocale(): SupportedLocale {
  if (typeof window === 'undefined') return 'en-US';

  const browserLang = navigator.language || 'en-US';
  const supportedLocales: SupportedLocale[] = ['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'pt-BR', 'en-IN', 'en-CA', 'en-AU', 'es-MX'];

  // Exact match
  if (supportedLocales.includes(browserLang as SupportedLocale)) {
    return browserLang as SupportedLocale;
  }

  // Language match (e.g., 'es' -> 'es-ES')
  const langCode = browserLang.split('-')[0];
  const match = supportedLocales.find(locale => locale.startsWith(langCode));

  return match || 'en-US';
}

// Get translations for current locale
export function useTranslation(locale?: SupportedLocale): Translation {
  const currentLocale = locale || detectLocale();
  return translations[currentLocale] || translations['en-US'];
}

// Format price with currency
export function formatPrice(amount: number, locale?: SupportedLocale): string {
  const currentLocale = locale || detectLocale();
  const { currency } = translations[currentLocale].pricing;

  // Special formatting for different currencies
  if (currency === 'R$') return `${currency} ${amount.toFixed(2)}`;
  if (currency === '₹') return `${currency} ${amount.toFixed(0)}`;

  return `${currency}${amount.toFixed(2)}`;
}
