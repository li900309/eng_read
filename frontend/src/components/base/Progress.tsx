import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      size = 'md',
      variant = 'default',
      showLabel = false,
      label,
      animated = true,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const baseStyles = [
      'relative',
      'w-full',
      'overflow-hidden',
      'rounded-full',
      'bg-secondary',
    ];

    const sizes = {
      sm: ['h-1'],
      md: ['h-2'],
      lg: ['h-3'],
    };

    const fillVariants = {
      default: ['bg-primary'],
      success: ['bg-green-500'],
      warning: ['bg-yellow-500'],
      error: ['bg-red-500'],
    };

    const fillClasses = cn(
      'h-full',
      'w-full',
      'flex-1',
      'transition-all',
      'duration-300',
      'ease-out',
      'rounded-full',
      ...fillVariants[variant],
      {
        'animate-pulse': animated && percentage > 0 && percentage < 100,
      }
    );

    const displayLabel = label || `${Math.round(percentage)}%`;

    return (
      <div className="space-y-2">
        {(showLabel || label) && (
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{label}</span>
            <span className="text-muted-foreground">{displayLabel}</span>
          </div>
        )}
        <div
          ref={ref}
          className={cn(...baseStyles, ...sizes[size], className)}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={value}
          {...props}
        >
          <div
            className={fillClasses}
            style={{ transform: `translateX(-${100 - percentage}%)` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

// Circular Progress component
export interface CircularProgressProps {
  value?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = 'default',
  showLabel = true,
  label,
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const strokeColors = {
    default: 'hsl(var(--primary))',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  };

  const displayLabel = label || `${Math.round(percentage)}%`;

  return (
    <div
      className={cn(
        'relative',
        'inline-flex',
        'items-center',
        'justify-center',
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--secondary))"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColors[variant]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold">{displayLabel}</span>
        </div>
      )}
    </div>
  );
};

export { Progress, CircularProgress };