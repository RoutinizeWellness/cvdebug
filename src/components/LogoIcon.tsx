import { cn } from "@/lib/utils";

interface LogoIconProps {
  className?: string;
  size?: number;
}

/**
 * CVDebug Logo Icon - New logo design
 */
export function LogoIcon({ className, size = 24 }: LogoIconProps) {
  return (
    <img
      src="/favicon.png?v=17"
      alt="CVDebug"
      width={size}
      height={size}
      className={cn("transition-transform duration-300", className)}
    />
  );
}
