'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { slideDown } from '@/lib/utils/animations';
import { DropdownProps } from '@/types/component-types';

/**
 * Dropdown component with keyboard navigation
 */
export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  placement = 'bottom-start',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const placementStyles = {
    'bottom-start': 'top-full left-0 mt-2',
    'bottom-end': 'top-full right-0 mt-2',
    'top-start': 'bottom-full left-0 mb-2',
    'top-end': 'bottom-full right-0 mb-2',
  };

  return (
    <div ref={dropdownRef} className="relative inline-block" onKeyDown={handleKeyDown}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              'absolute z-[var(--z-dropdown)] min-w-[200px]',
              'bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800',
              'py-2',
              placementStyles[placement]
            )}
            variants={slideDown}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ zIndex: 'var(--z-dropdown)' }}
          >
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!item.disabled && item.onClick) {
                    item.onClick();
                    setIsOpen(false);
                  }
                }}
                disabled={item.disabled}
                className={cn(
                  'w-full px-4 py-2 text-left flex items-center gap-2',
                  'transition-colors duration-150',
                  item.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer',
                  'text-neutral-700 dark:text-neutral-300'
                )}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

Dropdown.displayName = 'Dropdown';
