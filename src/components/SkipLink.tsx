import { useSkipLink } from '@/hooks/useAccessibility';

interface SkipLinkProps {
  targetId: string;
  label?: string;
}

/**
 * Skip Link Component
 * Allows keyboard users to skip to main content
 */
export function SkipLink({ targetId, label = 'Skip to main content' }: SkipLinkProps) {
  const handleSkip = useSkipLink(targetId);

  return (
    <a
      href={`#${targetId}`}
      onClick={(e) => {
        e.preventDefault();
        handleSkip();
      }}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
    >
      {label}
    </a>
  );
}

/**
 * Multiple Skip Links Component
 */
interface SkipLinksProps {
  links: Array<{ targetId: string; label: string }>;
}

export function SkipLinks({ links }: SkipLinksProps) {
  return (
    <nav aria-label="Skip navigation">
      {links.map((link) => (
        <SkipLink key={link.targetId} targetId={link.targetId} label={link.label} />
      ))}
    </nav>
  );
}
