import { type ClassValue, clsx } from 'clsx';

/**
 * Utility function to merge class names
 * Handles conditional classes and tailwind class conflicts
 * 
 * @param inputs - Class values to merge
 * @returns Merged class names
 * 
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'rounded')
 * // Returns: 'px-4 py-2 bg-blue-500 rounded'
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
