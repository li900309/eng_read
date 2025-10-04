import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'right-start' | 'right-end';
  offset?: number;
  disabled?: boolean;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  placement = 'bottom-start',
  offset = 8,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !dropdownRef.current?.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Calculate position
  const getPosition = () => {
    if (!triggerRef.current || !dropdownRef.current) return {};

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    const scrollY = window.pageYOffset;
    const scrollX = window.pageXOffset;

    const positions = {
      'bottom-start': {
        top: triggerRect.bottom + scrollY + offset,
        left: triggerRect.left + scrollX,
      },
      'bottom-end': {
        top: triggerRect.bottom + scrollY + offset,
        left: triggerRect.right - dropdownRect.width + scrollX,
      },
      'top-start': {
        top: triggerRect.top - dropdownRect.height - offset + scrollY,
        left: triggerRect.left + scrollX,
      },
      'top-end': {
        top: triggerRect.top - dropdownRect.height - offset + scrollY,
        left: triggerRect.right - dropdownRect.width + scrollX,
      },
      'right-start': {
        top: triggerRect.top + scrollY,
        left: triggerRect.right + offset + scrollX,
      },
      'right-end': {
        top: triggerRect.bottom - dropdownRect.height + scrollY,
        left: triggerRect.right + offset + scrollX,
      },
    };

    return positions[placement];
  };

  const handleTriggerClick = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  const dropdown = (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            'fixed z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
            'animate-in fade-in-0 zoom-in-95',
            className
          )}
          style={getPosition()}
          role="menu"
        >
          {children}
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative inline-block" ref={triggerRef}>
      <div onClick={handleTriggerClick} className={disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}>
        {trigger}
      </div>
      {createPortal(dropdown, document.body)}
    </div>
  );
};

// Dropdown item component
export interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  icon?: React.ReactNode;
  shortcut?: string;
  className?: string;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onClick,
  disabled = false,
  danger = false,
  icon,
  shortcut,
  className,
}) => {
  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  return (
    <div
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        'transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        danger && 'text-destructive hover:bg-destructive hover:text-destructive-foreground',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      role="menuitem"
      onClick={handleClick}
      data-disabled={disabled}
    >
      {icon && (
        <span className="mr-2 h-4 w-4 flex-shrink-0">
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
      {shortcut && (
        <span className="ml-auto text-xs tracking-widest opacity-60">
          {shortcut}
        </span>
      )}
    </div>
  );
};

// Dropdown separator
export const DropdownSeparator: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn('my-1 h-px bg-muted', className)}
      role="separator"
    />
  );
};

// Dropdown label
export const DropdownLabel: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      className={cn('px-2 py-1.5 text-sm font-semibold', className)}
      role="presentation"
    >
      {children}
    </div>
  );
};

// Dropdown checkbox item
export interface DropdownCheckboxItemProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const DropdownCheckboxItem: React.FC<DropdownCheckboxItemProps> = ({
  checked,
  onCheckedChange,
  children,
  disabled = false,
  className,
}) => {
  const handleClick = () => {
    if (disabled) return;
    onCheckedChange(!checked);
  };

  return (
    <div
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
        'transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      role="menuitemcheckbox"
      aria-checked={checked}
      data-disabled={disabled}
      onClick={handleClick}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && (
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </span>
      <span className="flex-1">{children}</span>
    </div>
  );
};

// Dropdown radio item
export interface DropdownRadioItemProps {
  value: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const DropdownRadioItem: React.FC<DropdownRadioItemProps> = ({
  value,
  selectedValue,
  onValueChange,
  children,
  disabled = false,
  className,
}) => {
  const isSelected = value === selectedValue;

  const handleClick = () => {
    if (disabled) return;
    onValueChange(value);
  };

  return (
    <div
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
        'transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      role="menuitemradio"
      aria-checked={isSelected}
      data-disabled={disabled}
      onClick={handleClick}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && (
          <svg
            className="h-2 w-2 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 8 8"
          >
            <circle cx="4" cy="4" r="3" />
          </svg>
        )}
      </span>
      <span className="flex-1">{children}</span>
    </div>
  );
};

export {
  Dropdown,
  DropdownItem,
  DropdownCheckboxItem,
  DropdownRadioItem,
};