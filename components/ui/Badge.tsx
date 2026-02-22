import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Badge variant styles
 */
const badgeVariants = {
  default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  error: 'bg-red-500/15 text-red-400 border-red-500/30',
  info: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
} as const;

/**
 * Badge size styles
 */
const badgeSizes = {
  sm: 'px-2 py-0.5 text-[10px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
} as const;

/**
 * Props for the Badge component
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual style variant */
  variant?: keyof typeof badgeVariants;
  /** Size of the badge */
  size?: keyof typeof badgeSizes;
  /** Icon to display before the text */
  icon?: React.ReactNode;
  /** Whether the badge is clickable */
  clickable?: boolean;
  /** Custom class names */
  className?: string;
}

/**
 * Badge component for labels and statuses
 *
 * @example
 * ```tsx
 * <Badge variant="success" size="md" icon={<CheckIcon />}>Completed</Badge>
 * ```
 */
export const Badge = React.memo<BadgeProps>(
  ({
    variant = 'default',
    size = 'md',
    icon,
    clickable = false,
    className,
    children,
    ...props
  }) => (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors',
        badgeVariants[variant],
        badgeSizes[size],
        clickable && 'cursor-pointer hover:opacity-80',
        className,
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  ),
);

Badge.displayName = 'Badge';
