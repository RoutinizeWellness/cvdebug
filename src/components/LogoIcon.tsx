import { cn } from "@/lib/utils";

interface LogoIconProps {
  className?: string;
  size?: number;
}

/**
 * CVDebug Logo Icon - Logo only (no text)
 */
export function LogoIcon({ className, size = 48 }: LogoIconProps) {
  return (
    <img
      src="/favicon.png?v=22"
      alt="CVDebug"
      width={size}
      height={size}
      className={cn("transition-transform duration-300", className)}
    />
  );
}
