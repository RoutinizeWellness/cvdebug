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
      <img
        src="/assets/cvdebug-logo.png"
        alt="CVDebug"
        className={cn(
          "h-5 w-auto max-w-[100px] object-contain relative z-10 transition-transform duration-300 hover:scale-110",
          iconClassName,
          !showText && "h-6"
        )}
      />
    </div>
  );
}