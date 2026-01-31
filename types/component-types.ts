import { ReactNode, HTMLAttributes } from 'react';

/* ============================================
   COMMON TYPES
   ============================================ */

/**
 * Size variants for components
 */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Theme mode
 */
export type Theme = 'light' | 'dark';

/**
 * Common variant types
 */
export type Variant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

/* ============================================
   BUTTON TYPES
   ============================================ */

export type ButtonVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  children?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

/* ============================================
   INPUT TYPES
   ============================================ */

export type InputSize = 'sm' | 'md' | 'lg';
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

export interface InputProps extends Omit<HTMLAttributes<HTMLInputElement>, 'size'> {
  type?: InputType;
  size?: InputSize;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  value?: string;
  placeholder?: string;
  required?: boolean;
}

/* ============================================
   CARD TYPES
   ============================================ */

export type CardVariant = 'default' | 'outlined' | 'elevated';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverable?: boolean;
  children?: ReactNode;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/* ============================================
   BADGE TYPES
   ============================================ */

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeShape = 'pill' | 'square';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  shape?: BadgeShape;
  icon?: ReactNode;
  children?: ReactNode;
}

/* ============================================
   AVATAR TYPES
   ============================================ */

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
}

/* ============================================
   MODAL TYPES
   ============================================ */

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: ModalSize;
  title?: string;
  children?: ReactNode;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}

/* ============================================
   DROPDOWN TYPES
   ============================================ */

export interface DropdownItem {
  label: string;
  value: string;
  icon?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}

/* ============================================
   TABS TYPES
   ============================================ */

export type TabsVariant = 'default' | 'pills' | 'underline';

export interface Tab {
  label: string;
  value: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  defaultValue?: string;
  variant?: TabsVariant;
  onChange?: (value: string) => void;
}

/* ============================================
   LAYOUT TYPES
   ============================================ */

export type ContainerVariant = 'default' | 'fluid' | 'narrow' | 'wide';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ContainerVariant;
  children?: ReactNode;
}

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children?: ReactNode;
}

export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children?: ReactNode;
}
