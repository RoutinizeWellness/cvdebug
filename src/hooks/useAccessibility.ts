import { useEffect, useCallback, useRef } from 'react';

/**
 * Accessibility Hook
 * Provides utilities for keyboard navigation, screen reader support, and focus management
 */

interface UseKeyboardNavigationOptions {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  enabled?: boolean;
}

/**
 * Hook for keyboard navigation
 */
export function useKeyboardNavigation(options: UseKeyboardNavigationOptions) {
  const { enabled = true, ...handlers } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          if (handlers.onEscape) {
            event.preventDefault();
            handlers.onEscape();
          }
          break;
        case 'Enter':
          if (handlers.onEnter) {
            event.preventDefault();
            handlers.onEnter();
          }
          break;
        case 'ArrowUp':
          if (handlers.onArrowUp) {
            event.preventDefault();
            handlers.onArrowUp();
          }
          break;
        case 'ArrowDown':
          if (handlers.onArrowDown) {
            event.preventDefault();
            handlers.onArrowDown();
          }
          break;
        case 'ArrowLeft':
          if (handlers.onArrowLeft) {
            event.preventDefault();
            handlers.onArrowLeft();
          }
          break;
        case 'ArrowRight':
          if (handlers.onArrowRight) {
            event.preventDefault();
            handlers.onArrowRight();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handlers]);
}

/**
 * Hook for focus trap (useful for modals and dialogs)
 */
export function useFocusTrap(enabled: boolean = true) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus first element on mount
    firstElement?.focus();

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [enabled]);

  return containerRef;
}

/**
 * Hook for auto-focus on mount
 */
export function useAutoFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return ref;
}

/**
 * Hook for announcing screen reader messages
 */
export function useScreenReaderAnnouncement() {
  const announcementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create announcement div if it doesn't exist
    if (!announcementRef.current) {
      const div = document.createElement('div');
      div.setAttribute('role', 'status');
      div.setAttribute('aria-live', 'polite');
      div.setAttribute('aria-atomic', 'true');
      div.className = 'sr-only';
      document.body.appendChild(div);
      announcementRef.current = div;
    }

    return () => {
      if (announcementRef.current) {
        document.body.removeChild(announcementRef.current);
        announcementRef.current = null;
      }
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcementRef.current) {
      announcementRef.current.setAttribute('aria-live', priority);
      announcementRef.current.textContent = message;

      // Clear message after announcement
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  return announce;
}

/**
 * Hook for managing focus restoration
 */
export function useFocusRestore() {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, []);

  return { saveFocus, restoreFocus };
}

/**
 * Hook for skip links
 */
export function useSkipLink(targetId: string) {
  const handleSkip = useCallback(() => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [targetId]);

  return handleSkip;
}

/**
 * Hook for reduced motion preference
 */
export function useReducedMotion() {
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  return prefersReducedMotion;
}

/**
 * Hook for keyboard-only focus indicator
 */
export function useKeyboardFocusVisible() {
  const isKeyboardFocus = useRef(false);

  useEffect(() => {
    const handleMouseDown = () => {
      isKeyboardFocus.current = false;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        isKeyboardFocus.current = true;
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return isKeyboardFocus;
}

/**
 * ARIA live region hook for dynamic content
 */
export function useAriaLiveRegion(message: string, priority: 'polite' | 'assertive' = 'polite') {
  useEffect(() => {
    if (!message) return;

    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.textContent = message;

    document.body.appendChild(liveRegion);

    const timeout = setTimeout(() => {
      document.body.removeChild(liveRegion);
    }, 1000);

    return () => {
      clearTimeout(timeout);
      if (document.body.contains(liveRegion)) {
        document.body.removeChild(liveRegion);
      }
    };
  }, [message, priority]);
}

/**
 * Hook for managing modal accessibility
 */
export function useModalAccessibility(isOpen: boolean) {
  const { saveFocus, restoreFocus } = useFocusRestore();
  const focusTrapRef = useFocusTrap(isOpen);

  useEffect(() => {
    if (isOpen) {
      saveFocus();
      // Disable body scroll
      document.body.style.overflow = 'hidden';
    } else {
      restoreFocus();
      // Re-enable body scroll
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, saveFocus, restoreFocus]);

  return focusTrapRef;
}
