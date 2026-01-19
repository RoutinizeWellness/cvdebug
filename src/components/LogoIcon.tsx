import { cn } from "@/lib/utils";

interface LogoIconProps {
  className?: string;
  size?: number;
}

/**
 * CVDebug Logo Icon - The document with debug symbol
 * Based on the favicon design
 */
export function LogoIcon({ className, size = 24 }: LogoIconProps) {
  const height = (size / 24) * 28; // Maintain aspect ratio

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-transform duration-300", className)}
    >
      {/* Document */}
      <rect x="6" y="4" width="20" height="24" rx="3" fill="#8B5CF6" />

      {/* Document lines */}
      <line
        x1="10"
        y1="10"
        x2="22"
        y2="10"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <line
        x1="10"
        y1="14"
        x2="22"
        y2="14"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <line
        x1="10"
        y1="18"
        x2="18"
        y2="18"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Bug/Debug badge */}
      <circle cx="22" cy="22" r="6" fill="#EF4444" />
      <line
        x1="22"
        y1="18"
        x2="22"
        y2="26"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="22"
        x2="26"
        y2="22"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
