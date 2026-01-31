'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ContainerProps } from '@/types/component-types';

/**
 * Container component for responsive layouts
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const variantStyles = {
      default: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      fluid: 'w-full px-4 sm:px-6 lg:px-8',
      narrow: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
      wide: 'max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8',
    };

    return (
      <div
        ref={ref}
        className={cn(variantStyles[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';
