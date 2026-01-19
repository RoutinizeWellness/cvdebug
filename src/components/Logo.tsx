import { cn } from "@/lib/utils";
import { LogoIcon } from "./LogoIcon";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
  variant?: "default" | "light";
  iconOnly?: boolean;
  size?: number;
}

export function Logo({
  className,
  iconClassName,
  textClassName,
  showText = true,
  variant = "default",
  iconOnly = false,
  size = 24,
}: LogoProps) {
  // If icon only, use the new logo
  if (iconOnly || !showText) {
    return (
      <div className={cn("flex items-center", className)}>
        <img
          src="/favicon.png?v=16"
          alt="CVDebug"
          className={cn(
            "h-8 w-8 transition-transform duration-300 hover:scale-105",
            iconClassName
          )}
        />
      </div>
    );
  }

  // Full logo with text
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {/* Icon from favicon */}
      <LogoIcon
        size={size}
        className={cn("hover:scale-105", iconClassName)}
      />

      {/* Text */}
      <span
        className={cn(
          "text-xl font-bold tracking-tight",
          variant === "light" ? "text-white" : "text-[#1E293B]",
          textClassName
        )}
      >
        CV<span className="text-[#8B5CF6]">Debug</span>
      </span>
    </div>
  );
}