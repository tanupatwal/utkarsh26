'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { BadgeProps } from '@/types/component-types';

/**
 * Badge component for status indicators and labels
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      shape = 'pill',
      icon,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors';

    // Variant styles
    const variantStyles = {
      default: 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
      primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
      secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300',
      success: 'bg-success-light text-success-dark dark:bg-success-dark/30 dark:text-success-light',
      warning: 'bg-warning-light text-warning-dark dark:bg-warning-dark/30 dark:text-warning-light',
      danger: 'bg-danger-light text-danger-dark dark:bg-danger-dark/30 dark:text-danger-light',
    };

    // Size styles
    const sizeStyles = {
      sm: 'text-xs px-2 py-0.5 gap-1',
      md: 'text-sm px-2.5 py-1 gap-1.5',
      lg: 'text-base px-3 py-1.5 gap-2',
    };

    // Shape styles
    const shapeStyles = {
      pill: 'rounded-full',
      square: 'rounded-md',
    };

    const badgeClasses = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      shapeStyles[shape],
      className
    );

    return (
      <span ref={ref} className={badgeClasses} {...props}>
        {icon && icon}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
