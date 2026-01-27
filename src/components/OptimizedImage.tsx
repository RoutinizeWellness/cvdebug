import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  placeholderSrc?: string;
  blurDataURL?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  aspectRatio?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  className?: string;
}

/**
 * Optimized Image Component for Core Web Vitals
 * Features:
 * - Lazy loading with Intersection Observer
 * - Blur placeholder while loading
 * - Error handling with fallback
 * - Automatic width/height to prevent CLS
 * - Priority loading for above-the-fold images
 * - Responsive images
 * - Animated loading transitions
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  placeholderSrc,
  blurDataURL,
  priority = false,
  onLoad,
  onError,
  fallbackSrc = '/placeholder.png',
  aspectRatio,
  objectFit = 'cover',
  className = ''
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(placeholderSrc || blurDataURL || src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Skip lazy loading for priority images
    if (priority) {
      loadImage(src);
      return;
    }

    // Set up intersection observer for lazy loading
    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage(src);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, priority]);

  const loadImage = (imageSrc: string) => {
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      setImageSrc(imageSrc);
      setIsLoading(false);
      setHasError(false);
      onLoad?.();
    };

    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      setImageSrc(fallbackSrc);
      onError?.();
    };
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(fallbackSrc);
      onError?.();
    }
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: aspectRatio,
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
      }}
    >
      {/* Blur placeholder */}
      {isLoading && blurDataURL && (
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-xl scale-110"
          style={{ backgroundImage: `url(${blurDataURL})` }}
          aria-hidden="true"
        />
      )}

      {/* Loading skeleton with shimmer */}
      {isLoading && !blurDataURL && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700" aria-hidden="true">
          <div
            className="w-full h-full"
            style={{
              background: 'linear-gradient(110deg, transparent 8%, rgba(255,255,255,0.3) 18%, transparent 33%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }}
          />
        </div>
      )}

      {/* Actual image */}
      <motion.img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        onError={handleError}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className={`w-full h-full object-${objectFit}`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />

      {/* Error overlay */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
          <div className="text-center p-4">
            <svg
              className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs text-slate-500 dark:text-slate-400">Image failed to load</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Responsive Image Component
 * Automatically selects the best image size based on viewport
 */
interface ResponsiveImageProps {
  srcSet: {
    sm: string;  // Mobile (< 640px)
    md: string;  // Tablet (640px - 1024px)
    lg: string;  // Desktop (> 1024px)
  };
  alt: string;
  sizes?: string;
  width?: number;
  height?: number;
  placeholderSrc?: string;
  blurDataURL?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  aspectRatio?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  className?: string;
}

export function ResponsiveImage({
  srcSet,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  alt,
  ...props
}: ResponsiveImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(srcSet.sm);

  useEffect(() => {
    const updateSrc = () => {
      if (window.innerWidth < 640) {
        setCurrentSrc(srcSet.sm);
      } else if (window.innerWidth < 1024) {
        setCurrentSrc(srcSet.md);
      } else {
        setCurrentSrc(srcSet.lg);
      }
    };

    updateSrc();
    window.addEventListener('resize', updateSrc);
    return () => window.removeEventListener('resize', updateSrc);
  }, [srcSet]);

  return (
    <OptimizedImage
      src={currentSrc}
      alt={alt}
      {...props}
    />
  );
}

/**
 * Avatar Image Component
 * Optimized for user avatars with initials fallback
 */
interface AvatarImageProps extends Omit<OptimizedImageProps, 'alt' | 'aspectRatio' | 'objectFit'> {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function AvatarImage({ name, size = 'md', ...props }: AvatarImageProps) {
  const [showFallback, setShowFallback] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (showFallback || !props.src) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-[#1E293B] to-[#0F172A] flex items-center justify-center text-white font-semibold`}
      >
        {initials}
      </div>
    );
  }

  return (
    <OptimizedImage
      {...props}
      alt={name}
      aspectRatio="1"
      objectFit="cover"
      className={`${sizeClasses[size]} rounded-full ${props.className || ''}`}
      onError={() => setShowFallback(true)}
    />
  );
}
