import { useState, useEffect, useRef } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
}

/**
 * Optimized Image Component for Core Web Vitals
 * Features:
 * - Lazy loading with Intersection Observer
 * - Blur placeholder while loading
 * - Automatic width/height to prevent CLS
 * - Priority loading for above-the-fold images
 */
export function OptimizedImage({
  src,
  alt,
  className = "",
  width,
  height,
  priority = false,
  onLoad,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) {
      // Priority images load immediately
      return;
    }

    // Lazy load images using Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before image enters viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={width && height ? { width, height } : undefined}
    >
      {/* Blur placeholder */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-muted animate-pulse"
          style={{
            background: "linear-gradient(110deg, #1a1a1b 8%, #2d2d2d 18%, #1a1a1b 33%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}
        />
      )}

      {/* Actual image - only load when in view */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={handleLoad}
          width={width}
          height={height}
        />
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
