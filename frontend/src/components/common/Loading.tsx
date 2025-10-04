import React from 'react';
import { Spinner, Skeleton, PulseLoader } from '@/components/base';

// Full page loading component
export interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'pulse' | 'skeleton';
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  size = 'md',
  variant = 'spinner',
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        {variant === 'spinner' && <Spinner size={size} />}
        {variant === 'pulse' && <PulseLoader size={size} />}
        {variant === 'skeleton' && (
          <div className="space-y-4">
            <Skeleton width="w-32" height="h-8" />
            <Skeleton width="w-48" height="h-4" />
          </div>
        )}
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

// Inline loading component
export interface InlineLoadingProps {
  message?: string;
  centered?: boolean;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  message = 'Loading...',
  centered = false,
}) => {
  return (
    <div className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}>
      <Spinner size="sm" />
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  );
};

export { Loading, InlineLoading };