import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModalAccessibility, useKeyboardNavigation } from '@/hooks/useAccessibility';
import { Button } from '@/components/ui/button';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
}

/**
 * Accessible Modal Component
 * Fully keyboard navigable and screen reader friendly modal
 */
export function AccessibleModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnOverlayClick = true,
}: AccessibleModalProps) {
  const focusTrapRef = useModalAccessibility(isOpen);

  useKeyboardNavigation({
    onEscape: onClose,
    enabled: isOpen,
  });

  // Announce modal opening to screen readers
  useEffect(() => {
    if (isOpen) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = `${title} dialog opened`;
      document.body.appendChild(announcement);

      const timeout = setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);

      return () => {
        clearTimeout(timeout);
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement);
        }
      };
    }
  }, [isOpen, title]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby={description ? 'modal-description' : undefined}
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeOnOverlayClick ? onClose : undefined}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <motion.div
            ref={focusTrapRef as React.RefObject<HTMLDivElement>}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, type: 'spring', damping: 25 }}
            className={`relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex-1">
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-slate-900 dark:text-white"
                >
                  {title}
                </h2>
                {description && (
                  <p
                    id="modal-description"
                    className="text-sm text-slate-600 dark:text-slate-400 mt-1"
                  >
                    {description}
                  </p>
                )}
              </div>

              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="ml-4 rounded-lg"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * Modal Footer Component
 */
interface ModalFooterProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right';
}

export function ModalFooter({ children, align = 'right' }: ModalFooterProps) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div className={`flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 ${alignClasses[align]}`}>
      {children}
    </div>
  );
}
