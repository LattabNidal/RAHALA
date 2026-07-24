import React, { useState, useEffect } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset loaded state when src changes
    setIsLoaded(false);
    setError(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-border/40 dark:bg-white/5 ${className}`}>
      {/* Skeleton / Shimmer background when not loaded */}
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-border/60 to-border/20 dark:from-white/10 dark:to-white/5" 
          role="status" 
          aria-label="Chargement d'image..."
        />
      )}
      
      <img
        src={src}
        alt={alt || "Illustration touristique d'Algérie"}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        referrerPolicy="no-referrer"
        {...props}
      />
    </div>
  );
};
