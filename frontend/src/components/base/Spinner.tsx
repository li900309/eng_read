import React, { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary' | 'destructive';
  speed?: 'slow' | 'normal' | 'fast';
}

const Spinner: React.FC<SpinnerProps> = ({
  className,
  size = 'md',
  variant = 'default',
  speed = 'normal',
  ...props
}) => {
  const sizes = {
    sm: ['w-4', 'h-4'],
    md: ['w-6', 'h-6'],
    lg: ['w-8', 'h-8'],
    xl: ['w-12', 'h-12'],
  };

  const variants = {
    default: ['border-foreground'],
    primary: ['border-primary'],
    secondary: ['border-secondary-foreground'],
    destructive: ['border-destructive'],
  };

  const animations = {
    slow: ['animate-spin-slow'],
    normal: ['animate-spin'],
    fast: ['animate-spin-fast'],
  };

  const classes = cn(
    'animate-spin',
    'rounded-full',
    'border-2',
    'border-t-transparent',
    ...sizes[size],
    ...variants[variant],
    ...animations[speed],
    className
  );

  return (
    <div className={classes} role="status" aria-label="Loading" {...props}>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Pulse loader component
export interface PulseLoaderProps extends HTMLAttributes<HTMLDivElement> {
  dots?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'secondary' | 'destructive';
}

const PulseLoader: React.FC<PulseLoaderProps> = ({
  className,
  dots = 3,
  size = 'md',
  variant = 'default',
  ...props
}) => {
  const sizes = {
    sm: ['w-2', 'h-2'],
    md: ['w-3', 'h-3'],
    lg: ['w-4', 'h-4'],
  };

  const variants = {
    default: ['bg-foreground'],
    primary: ['bg-primary'],
    secondary: ['bg-secondary-foreground'],
    destructive: ['bg-destructive'],
  };

  const dotClasses = cn(
    'rounded-full',
    'animate-pulse',
    ...sizes[size],
    ...variants[variant]
  );

  return (
    <div
      className={cn('flex', 'items-center', 'gap-1', className)}
      role="status"
      aria-label="Loading"
      {...props}
    >
      {Array.from({ length: dots }).map((_, index) => (
        <div
          key={index}
          className={dotClasses}
          style={{
            animationDelay: `${index * 0.16}s`,
            animationDuration: '1.4s',
          }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Skeleton loader component
export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1,
  ...props
}) => {
  const baseClasses = cn(
    'animate-pulse',
    'bg-muted',
    'rounded',
    className
  );

  const variantClasses = {
    text: ['rounded-md'],
    rectangular: ['rounded-md'],
    circular: ['rounded-full'],
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2" {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              ...variantClasses[variant],
              index === lines - 1 ? 'w-3/4' : 'w-full'
            )}
            style={{
              width: index === lines - 1 && width ? width : undefined,
              height: height || '1rem',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, ...variantClasses[variant])}
      style={{ width, height }}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
};

// Dots loader component
export interface DotsLoaderProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'secondary' | 'destructive';
}

const DotsLoader: React.FC<DotsLoaderProps> = ({
  className,
  size = 'md',
  variant = 'default',
  ...props
}) => {
  const sizes = {
    sm: ['w-1.5', 'h-1.5'],
    md: ['w-2', 'h-2'],
    lg: ['w-2.5', 'h-2.5'],
  };

  const variants = {
    default: ['bg-foreground'],
    primary: ['bg-primary'],
    secondary: ['bg-secondary-foreground'],
    destructive: ['bg-destructive'],
  };

  const dotClasses = cn(
    'rounded-full',
    'animate-bounce',
    ...sizes[size],
    ...variants[variant]
  );

  return (
    <div
      className={cn('flex', 'items-center', 'gap-1', className)}
      role="status"
      aria-label="Loading"
      {...props}
    >
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={dotClasses}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '1.4s',
          }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export { Spinner, PulseLoader, Skeleton, DotsLoader };