import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = [
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-full',
      'font-semibold',
      'transition-colors',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-ring',
      'focus:ring-offset-2',
    ];

    const variants = {
      default: [
        'border-transparent',
        'bg-primary',
        'text-primary-foreground',
        'hover:bg-primary/80',
      ],
      secondary: [
        'border-transparent',
        'bg-secondary',
        'text-secondary-foreground',
        'hover:bg-secondary/80',
      ],
      outline: [
        'text-foreground',
        'border-border',
        'bg-background',
        'hover:bg-accent',
        'hover:text-accent-foreground',
      ],
      destructive: [
        'border-transparent',
        'bg-destructive',
        'text-destructive-foreground',
        'hover:bg-destructive/80',
      ],
      success: [
        'border-transparent',
        'bg-green-500',
        'text-white',
        'hover:bg-green-600',
      ],
      warning: [
        'border-transparent',
        'bg-yellow-500',
        'text-white',
        'hover:bg-yellow-600',
      ],
      info: [
        'border-transparent',
        'bg-blue-500',
        'text-white',
        'hover:bg-blue-600',
      ],
    };

    const sizes = {
      sm: ['px-2', 'py-0.5', 'text-xs'],
      md: ['px-2.5', 'py-0.5', 'text-xs'],
      lg: ['px-3', 'py-1', 'text-sm'],
    };

    const classes = cn(
      ...baseStyles,
      ...variants[variant],
      ...sizes[size],
      className
    );

    return (
      <span ref={ref} className={classes} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };