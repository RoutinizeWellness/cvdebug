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
    <div className={cn("flex items-center justify-center", className)}>
      <img
        src="/favicon.png?v=22"
        alt="CVDebug"
        className={cn(
          "h-10 w-10 transition-transform duration-300 hover:scale-110",
          iconClassName
        )}
      />
    </div>
  );
}