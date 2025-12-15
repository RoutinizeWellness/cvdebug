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
      <img 
        src="https://harmless-tapir-303.convex.cloud/api/storage/5768dbac-7c15-4d7f-bf24-73eff8671dc0" 
        alt="CVDebug Logo" 
        className={cn("h-8 w-auto", iconClassName)}
      />
      
      {showText && (
        <div className={cn("flex flex-col leading-none", textClassName)}>
          <span className="font-black text-lg tracking-tight">CVDebug</span>
        </div>
      )}
    </div>
  );
}