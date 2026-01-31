'use client';

import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { AvatarProps } from '@/types/component-types';

/**
 * Avatar component with image, fallback, and status indicator
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt = 'Avatar',
      fallback,
      size = 'md',
      status,
      className,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);

    // Size styles
    const sizeStyles = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl',
    };

    // Status indicator size
    const statusSizeStyles = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4',
    };

    // Status colors
    const statusColors = {
      online: 'bg-success',
      offline: 'bg-neutral-400',
      busy: 'bg-danger',
      away: 'bg-warning',
    };

    const shouldShowImage = src && !imageError;
    const initials = fallback || alt.charAt(0).toUpperCase();

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex', className)}
        {...props}
      >
        <div
          className={cn(
            'rounded-full overflow-hidden flex items-center justify-center font-semibold',
            'bg-gradient-to-br from-primary-400 to-accent-500 text-white',
            sizeStyles[size]
          )}
        >
          {shouldShowImage ? (
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-neutral-900',
              statusSizeStyles[size],
              statusColors[status]
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
