import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'outline' | 'link' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = [
      'inline-flex',
      'items-center',
      'justify-center',
      'gap-2',
      'rounded-lg',
      'font-medium',
      'transition-all',
      'duration-200',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'disabled:opacity-50',
      'disabled:pointer-events-none',
    ];

    const variants = {
      default: [
        'bg-background',
        'text-foreground',
        'border',
        'border-input',
        'hover:bg-accent',
        'hover:text-accent-foreground',
        'focus:ring-ring',
      ],
      primary: [
        'bg-primary',
        'text-primary-foreground',
        'hover:bg-primary/90',
        'focus:ring-primary',
      ],
      secondary: [
        'bg-secondary',
        'text-secondary-foreground',
        'hover:bg-secondary/80',
        'focus:ring-secondary',
      ],
      ghost: [
        'hover:bg-accent',
        'hover:text-accent-foreground',
        'focus:ring-accent',
      ],
      outline: [
        'border',
        'border-input',
        'bg-background',
        'hover:bg-accent',
        'hover:text-accent-foreground',
        'focus:ring-input',
      ],
      link: [
        'text-primary',
        'underline-offset-4',
        'hover:underline',
        'focus:ring-primary',
      ],
      destructive: [
        'bg-destructive',
        'text-destructive-foreground',
        'hover:bg-destructive/90',
        'focus:ring-destructive',
      ],
    };

    const sizes = {
      sm: ['h-9', 'px-3', 'text-sm'],
      md: ['h-10', 'px-4', 'py-2'],
      lg: ['h-11', 'px-6', 'text-base'],
      icon: ['h-10', 'w-10'],
    };

    const classes = cn(
      ...baseStyles,
      ...variants[variant],
      ...sizes[size],
      {
        'w-full': fullWidth,
        'cursor-not-allowed': loading || disabled,
      },
      className
    );

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };