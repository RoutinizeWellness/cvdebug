import { motion } from "framer-motion";
import { CheckCircle, Code, DollarSign, Heart, Shield } from "lucide-react";

interface RoleSelectionProps {
  isCompleted: boolean;
  selectedRole: string | null;
  onRoleSelect: (role: string) => void;
  onEdit: () => void;
  onNext: () => void;
}

const roles = [
  {
    id: "software",
    icon: Code,
    label: "Software Eng.",
    subtitle: "System Design",
  },
  {
    id: "finance",
    icon: DollarSign,
    label: "Finance",
    subtitle: "Compliance",
  },
  {
    id: "nursing",
    icon: Heart,
    label: "Nursing",
    subtitle: "Patient Care",
  },
  {
    id: "admin",
    icon: Shield,
    label: "Admin",
    subtitle: "Management",
  },
];

export default function RoleSelection({
  isCompleted,
  selectedRole,
  onRoleSelect,
  onEdit,
  onNext,
}: RoleSelectionProps) {
  return (
    <motion.div
      className={`glass-panel rounded-xl p-6 transition-opacity duration-300 ${
        isCompleted ? "opacity-60 hover:opacity-100" : "opacity-100"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isCompleted ? 0.6 : 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          {isCompleted && <CheckCircle className="h-5 w-5 text-primary" />}
          Step 1: Role Selection
        </h2>
        {isCompleted && (
          <button
            onClick={onEdit}
            className="text-xs text-secondary hover:text-white underline transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <motion.div
              key={role.id}
              className={`glass-card rounded-lg p-4 relative overflow-hidden group cursor-pointer ${
                isSelected ? "border-primary/50 bg-primary/10" : ""
              }`}
              onClick={() => onRoleSelect(role.id)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
              )}

              <div className="relative z-10 flex flex-col gap-2">
                <Icon
                  className={`h-6 w-6 transition-colors ${
                    isSelected
                      ? "text-primary"
                      : "text-slate-400 group-hover:text-primary"
                  }`}
                />
                <div>
                  <p
                    className={`text-sm font-medium transition-colors ${
                      isSelected ? "text-white" : "text-slate-200 group-hover:text-white"
                    }`}
                  >
                    {role.label}
                  </p>
                  <p
                    className={`text-xs transition-colors ${
                      isSelected
                        ? "text-slate-300"
                        : "text-slate-500 group-hover:text-slate-400"
                    }`}
                  >
                    {role.subtitle}
                  </p>
                </div>
              </div>

              {isSelected && (
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    boxShadow: "0 0 8px rgba(139, 92, 246, 1)",
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {!isCompleted && (
        <div className="flex justify-end">
          <button
            onClick={onNext}
            disabled={!selectedRole}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-secondary to-primary text-white font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Continue
          </button>
        </div>
      )}
    </motion.div>
  );
}
