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
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "relative flex items-center justify-center rounded-xl", 
        variant === "default" ? "bg-primary shadow-lg shadow-primary/20" : "bg-white/10 backdrop-blur-sm",
        "h-8 w-8",
        iconClassName
      )}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={cn("h-5 w-5", variant === "default" ? "text-primary-foreground" : "text-white")}
        >
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 15L11 17L15 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {/* Sparkle accent */}
        <div className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-yellow-400 rounded-full border-2 border-background animate-pulse" />
      </div>
      
      {showText && (
        <div className={cn("flex flex-col leading-none", textClassName)}>
          <span className="font-black text-lg tracking-tight">Resume ATS</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Optimizer</span>
        </div>
      )}
    </div>
  );
}
