import { motion } from "framer-motion";
import { Briefcase, GraduationCap, TrendingUp, Award, Crown, Building2 } from "lucide-react";

export type ExperienceLevel = "internship" | "entry" | "junior" | "mid" | "senior" | "lead" | "executive";

interface ExperienceLevelOption {
  value: ExperienceLevel;
  label: string;
  years: string;
  icon: any;
  description: string;
  color: string;
}

const experienceLevels: ExperienceLevelOption[] = [
  {
    value: "internship",
    label: "Internship",
    years: "0-1 years",
    icon: GraduationCap,
    description: "Looking for internships or first job",
    color: "from-slate-400 to-slate-600"
  },
  {
    value: "entry",
    label: "Entry Level",
    years: "0-2 years",
    icon: Briefcase,
    description: "Recent graduate or career switcher",
    color: "from-green-400 to-green-600"
  },
  {
    value: "junior",
    label: "Junior",
    years: "2-4 years",
    icon: TrendingUp,
    description: "Building core skills and experience",
    color: "from-teal-400 to-teal-600"
  },
  {
    value: "mid",
    label: "Mid-Level",
    years: "4-7 years",
    icon: Award,
    description: "Solid track record and growing expertise",
    color: "from-slate-500 to-slate-700"
  },
  {
    value: "senior",
    label: "Senior",
    years: "7-10 years",
    icon: Crown,
    description: "Expert with leadership responsibilities",
    color: "from-orange-400 to-orange-600"
  },
  {
    value: "lead",
    label: "Lead / Staff",
    years: "10+ years",
    icon: Building2,
    description: "Technical or team leadership role",
    color: "from-red-400 to-red-600"
  },
  {
    value: "executive",
    label: "Executive",
    years: "C-level / VP / Director",
    icon: Building2,
    description: "Senior management or C-suite",
    color: "from-slate-600 to-slate-800"
  }
];

interface ExperienceLevelSelectorProps {
  value?: ExperienceLevel;
  onChange: (level: ExperienceLevel) => void;
  label?: string;
  required?: boolean;
  compact?: boolean;
}

export function ExperienceLevelSelector({
  value,
  onChange,
  label = "What's your experience level?",
  required = false,
  compact = false
}: ExperienceLevelSelectorProps) {

  if (compact) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-slate-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value as ExperienceLevel)}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required={required}
        >
          <option value="">Select experience level...</option>
          {experienceLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label} ({level.years})
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {label && (
        <h3 className="text-lg font-bold text-slate-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </h3>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {experienceLevels.map((level) => {
          const Icon = level.icon;
          const isSelected = value === level.value;

          return (
            <motion.button
              key={level.value}
              type="button"
              onClick={() => onChange(level.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative p-4 rounded-xl text-left transition-all border-2
                ${isSelected
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  p-2 rounded-lg bg-gradient-to-br ${level.color}
                  ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                `}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-900 text-sm">{level.label}</h4>
                    {isSelected && (
                      <span className="material-symbols-outlined text-primary text-base">
                        check_circle
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-primary mb-1">{level.years}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{level.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined text-[#64748B] text-base mt-0.5">info</span>
          <p className="text-xs text-slate-900 leading-relaxed">
            <strong>Why this matters:</strong> We adapt our CV scoring to your experience level.
            An internship CV is evaluated differently than a senior position CV—different expectations
            for metrics, achievements, and depth of experience.
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function to convert experience level to years (for ML model)
export function experienceLevelToYears(level: ExperienceLevel): number {
  const mapping: Record<ExperienceLevel, number> = {
    internship: 0,
    entry: 1,
    junior: 3,
    mid: 5,
    senior: 8,
    lead: 12,
    executive: 15
  };
  return mapping[level];
}

// Helper function to get experience level display name
export function getExperienceLevelLabel(level: ExperienceLevel): string {
  const option = experienceLevels.find(l => l.value === level);
  return option ? `${option.label} (${option.years})` : level;
}
