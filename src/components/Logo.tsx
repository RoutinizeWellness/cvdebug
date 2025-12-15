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
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative">
        {/* Glow effect behind logo */}
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <img 
          src="https://harmless-tapir-303.convex.cloud/api/storage/5768dbac-7c15-4d7f-bf24-73eff8671dc0" 
          alt="CVdebug Logo" 
          className={cn(
            "h-8 w-auto relative z-10 drop-shadow-lg transition-transform duration-300 hover:scale-110",
            iconClassName
          )}
        />
      </div>
      
      {showText && (
        <div className={cn("flex flex-col leading-none", textClassName)}>
          <span className="font-black text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            CVdebug
          </span>
        </div>
      )}
    </div>
  );
}