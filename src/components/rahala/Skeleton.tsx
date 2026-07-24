import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'circle' | 'rect' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect'
}) => {
  const baseClasses = 'animate-pulse bg-ink/10 dark:bg-white/10';
  const variantClasses = 
    variant === 'circle' 
      ? 'rounded-full' 
      : variant === 'text' 
        ? 'rounded h-4 w-full' 
        : 'rounded';

  return (
    <div 
      className={`${baseClasses} ${variantClasses} ${className}`} 
      role="status" 
      aria-label="Chargement..."
    />
  );
};

// Hotel Card loading variant
export const HotelCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-onyx border border-border/40 dark:border-white/10 rounded-xl overflow-hidden p-4 space-y-3">
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-1/4" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
};

// Itinerary Card loading variant
export const ItineraryCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-onyx border border-border/40 dark:border-white/10 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-8 w-full rounded-lg" />
        <Skeleton className="h-8 w-full rounded-lg" />
      </div>
    </div>
  );
};

// Transport Card / Row loading variant
export const TransportCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-onyx border border-border/40 dark:border-white/10 rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-3.5 w-1/3" />
        </div>
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
};
