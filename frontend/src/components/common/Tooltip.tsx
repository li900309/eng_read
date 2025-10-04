import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 300,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const showTooltip = () => {
    if (disabled) return;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const id = setTimeout(() => {
      setIsOpen(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsOpen(false);
  };

  // Calculate position
  const getPosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return {};

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollY = window.pageYOffset;
    const scrollX = window.pageXOffset;

    const arrowSize = 8;
    const offset = 8;

    const positions = {
      top: {
        bottom: triggerRect.top + scrollY - offset,
        left: triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2,
      },
      bottom: {
        top: triggerRect.bottom + scrollY + offset,
        left: triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2,
      },
      left: {
        top: triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2,
        right: triggerRect.left + scrollX - offset,
      },
      right: {
        top: triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2,
        left: triggerRect.right + scrollX + offset,
      },
    };

    return positions[placement];
  };

  // Arrow position
  const getArrowPosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return {};

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    const positions = {
      top: {
        bottom: -arrowSize / 2,
        left: '50%',
        transform: 'translateX(-50%) rotate(45deg)',
      },
      bottom: {
        top: -arrowSize / 2,
        left: '50%',
        transform: 'translateX(-50%) rotate(45deg)',
      },
      left: {
        right: -arrowSize / 2,
        top: '50%',
        transform: 'translateY(-50%) rotate(45deg)',
      },
      right: {
        left: -arrowSize / 2,
        top: '50%',
        transform: 'translateY(-50%) rotate(45deg)',
      },
    };

    return positions[placement];
  };

  const tooltip = (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={tooltipRef}
          className={cn(
            'absolute z-50 px-3 py-2 text-sm bg-popover text-popover-foreground rounded-md shadow-md border',
            'max-w-xs',
            'pointer-events-none',
            'animate-in fade-in-0 zoom-in-95',
            className
          )}
          style={getPosition()}
          role="tooltip"
        >
          {content}
          <div
            className="absolute w-2 h-2 bg-popover border rotate-45"
            style={getArrowPosition()}
          />
        </div>
      )}
    </AnimatePresence>
  );

  // Clone child to add event handlers
  const child = React.Children.only(children) as React.ReactElement;
  const enhancedChild = React.cloneElement(child, {
    ref: triggerRef,
    onMouseEnter: showTooltip,
    onMouseLeave: hideTooltip,
    onFocus: showTooltip,
    onBlur: hideTooltip,
  });

  return (
    <>
      {enhancedChild}
      {createPortal(tooltip, document.body)}
    </>
  );
};

// Simple tooltip for common use cases
export const SimpleTooltip: React.FC<
  Omit<TooltipProps, 'children'> & {
    children: React.ReactNode;
  }
> = ({ content, children, ...props }) => {
  return (
    <Tooltip content={content} {...props}>
      <span className="inline-flex">{children}</span>
    </Tooltip>
  );
};

// Text tooltip for truncating text
export const TextTooltip: React.FC<{
  text: string;
  maxLength?: number;
  className?: string;
}> = ({ text, maxLength = 30, className }) => {
  const shouldShowTooltip = text.length > maxLength;
  const truncatedText = shouldShowTooltip ? `${text.slice(0, maxLength)}...` : text;

  if (!shouldShowTooltip) {
    return <span className={className}>{text}</span>;
  }

  return (
    <Tooltip content={text}>
      <span className={className}>{truncatedText}</span>
    </Tooltip>
  );
};

export { Tooltip };