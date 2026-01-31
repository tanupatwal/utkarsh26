'use client';

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CardProps, CardHeaderProps, CardContentProps, CardFooterProps } from '@/types/component-types';

/**
 * Card component - Main container
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hoverable = false, className, children }, ref) => {
    const variantStyles = {
      default: 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800',
      outlined: 'bg-transparent border-2 border-neutral-300 dark:border-neutral-700',
      elevated: 'bg-white dark:bg-neutral-900 shadow-lg border border-neutral-100 dark:border-neutral-800',
    };

    const baseStyles = 'rounded-xl overflow-hidden transition-all duration-200';

    const cardClasses = cn(baseStyles, variantStyles[variant], className);

    if (hoverable) {
      return (
        <motion.div
          ref={ref}
          className={cardClasses}
          whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={cardClasses}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * CardHeader - Top section of the card
 */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4 border-b border-neutral-200 dark:border-neutral-800', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/**
 * CardContent - Main content area of the card
 */
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('px-6 py-4', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

/**
 * CardFooter - Bottom section of the card
 */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
