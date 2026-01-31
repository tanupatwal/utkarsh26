'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { FlexProps } from '@/types/component-types';

/**
 * Flex component for flexbox layouts
 */
export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      direction = 'row',
      justify = 'start',
      align = 'start',
      wrap = 'nowrap',
      gap = 'md',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const directionStyles = {
      row: 'flex-row',
      'row-reverse': 'flex-row-reverse',
      col: 'flex-col',
      'col-reverse': 'flex-col-reverse',
    };

    const justifyStyles = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };

    const alignStyles = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    };

    const wrapStyles = {
      nowrap: 'flex-nowrap',
      wrap: 'flex-wrap',
      'wrap-reverse': 'flex-wrap-reverse',
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
        className={cn(
          'flex',
          directionStyles[direction],
          justifyStyles[justify],
          alignStyles[align],
          wrapStyles[wrap],
          gapStyles[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Flex.displayName = 'Flex';
