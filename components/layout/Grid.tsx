'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { GridProps } from '@/types/component-types';

/**
 * Grid component for responsive grid layouts
 */
export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ cols = 3, gap = 'md', className, children, ...props }, ref) => {
    const colsStyles = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
      6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
      7: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7',
      8: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8',
      9: 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-9',
      10: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-10',
      11: 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-11',
      12: 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-12',
    };

    const gapStyles = {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    };

    return (
      <div
        ref={ref}
        className={cn('grid', colsStyles[cols], gapStyles[gap], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';
