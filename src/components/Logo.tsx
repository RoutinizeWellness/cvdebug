import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
  variant?: "default" | "light";
}

export function Logo({ 
  className, 
  iconClassName, 
  textClassName, 
  showText = true,
  variant = "default"
}: LogoProps) {
  const gradientClass = variant === "light" 
    ? "from-white via-primary to-white" 
    : "from-foreground via-primary to-foreground";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative">
        <img
          src="https://harmless-tapir-303.convex.cloud/api/storage/4f836582-7336-4306-8004-211fad87218f"
          alt="CVDebug Logo"
          className={cn(
            "h-8 w-auto relative z-10 transition-transform duration-300 hover:scale-110",
            iconClassName
          )}
        />
      </div>

      {showText && (
        <div className={cn("flex flex-col leading-none", textClassName)}>
          <span className={cn(
            "font-black text-xl tracking-tight bg-gradient-to-r bg-clip-text text-transparent",
            gradientClass
          )} style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
            CVDebug
          </span>
        </div>
      )}
    </div>
  );
}