'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TabsProps } from '@/types/component-types';

/**
 * Tabs component with keyboard navigation and animations
 */
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultValue,
  variant = 'default',
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onChange?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowLeft' && index > 0) {
      const prevTab = tabs[index - 1];
      if (!prevTab.disabled) {
        handleTabChange(prevTab.value);
      }
    } else if (e.key === 'ArrowRight' && index < tabs.length - 1) {
      const nextTab = tabs[index + 1];
      if (!nextTab.disabled) {
        handleTabChange(nextTab.value);
      }
    }
  };

  const activeContent = tabs.find(tab => tab.value === activeTab)?.content;

  // Variant styles for tab list
  const variantStyles = {
    default: 'border-b border-neutral-200 dark:border-neutral-800',
    pills: 'bg-neutral-100 dark:bg-neutral-900 p-1 rounded-lg',
    underline: 'gap-8',
  };

  // Variant styles for individual tabs
  const tabVariantStyles = {
    default: (isActive: boolean) =>
      cn(
        'px-4 py-2 font-medium transition-colors relative',
        isActive
          ? 'text-primary-600 dark:text-primary-400'
          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
      ),
    pills: (isActive: boolean) =>
      cn(
        'px-4 py-2 rounded-md font-medium transition-colors',
        isActive
          ? 'bg-white dark:bg-neutral-800 text-primary-600 dark:text-primary-400 shadow-sm'
          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
      ),
    underline: (isActive: boolean) =>
      cn(
        'px-1 py-2 font-medium transition-colors relative',
        isActive
          ? 'text-primary-600 dark:text-primary-400'
          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
      ),
  };

  return (
    <div className="w-full">
      {/* Tab List */}
      <div
        className={cn('flex', variantStyles[variant])}
        role="tablist"
      >
        {tabs.map((tab, index) => {
          const isActive = tab.value === activeTab;

          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.value}`}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && handleTabChange(tab.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                tabVariantStyles[variant](isActive),
                tab.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {tab.label}

              {/* Active indicator for default variant */}
              {variant === 'default' && isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
                  layoutId="activeTab"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              {/* Active indicator for underline variant */}
              {variant === 'underline' && isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
                  layoutId="activeTabUnderline"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        className="mt-4"
      >
        {activeContent}
      </div>
    </div>
  );
};

Tabs.displayName = 'Tabs';
