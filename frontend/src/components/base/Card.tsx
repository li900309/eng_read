import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      hoverable = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = [
      'rounded-lg',
      'bg-card',
      'text-card-foreground',
      'transition-all',
      'duration-200',
    ];

    const variants = {
      default: ['border', 'border-border', 'shadow-soft'],
      outlined: ['border', 'border-input'],
      elevated: ['shadow-medium', 'border-transparent'],
      flat: ['border-transparent'],
    };

    const paddings = {
      none: [],
      sm: ['p-4'],
      md: ['p-6'],
      lg: ['p-8'],
    };

    const hoverStyles = hoverable
      ? [
          'hover:shadow-medium',
          'hover:-translate-y-1',
          'cursor-pointer',
        ]
      : [];

    const classes = cn(
      ...baseStyles,
      ...variants[variant],
      ...paddings[padding],
      ...hoverStyles,
      className
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card subcomponents
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const classes = cn(
      'flex',
      'flex-col',
      'space-y-1.5',
      'p-6',
      className
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => {
    const classes = cn(
      'text-2xl',
      'font-semibold',
      'leading-none',
      'tracking-tight',
      className
    );

    return (
      <h3 ref={ref} className={classes} {...props}>
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    const classes = cn('text-sm', 'text-muted-foreground', className);

    return (
      <p ref={ref} className={classes} {...props}>
        {children}
      </p>
    );
  }
);

CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    const classes = cn('p-6', 'pt-0', className);

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    const classes = cn(
      'flex',
      'items-center',
      'p-6',
      'pt-0',
      className
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };