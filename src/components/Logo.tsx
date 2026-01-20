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
  size = 32,
}: LogoProps) {
  // Always show only the logo image (no text)
  return (
    <div className={cn("flex items-center", className)}>
      <img
        src="/favicon.png?v=20"
        alt="CVDebug"
        className={cn(
          "h-12 w-12 transition-transform duration-300 hover:scale-105",
          iconClassName
        )}
      />
    </div>
  );
}