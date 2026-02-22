import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Card Props Interface
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'interactive' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  isHoverable?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Modern Card Component
 *
 * @example
 * <Card variant="glass" padding="md">
 *   <Card.Header>Title</Card.Header>
 *   <Card.Content>Content here</Card.Content>
 * </Card>
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { children, variant = 'default', padding = 'md', isHoverable = false, className, ...props },
    ref,
  ) => {
    const baseStyles = `
      rounded-2xl border
      transition-all duration-300 ease-out
    `;

    const variants = {
      default: `
        bg-[#141414] 
        border-white/[0.06]
      `,
      glass: `
        bg-white/[0.03]
        backdrop-blur-xl
        border-white/[0.06]
      `,
      interactive: `
        bg-[#141414]
        border-white/[0.06]
        cursor-pointer
        hover:border-white/20
        hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]
        hover:-translate-y-1
      `,
      elevated: `
        bg-[#1a1a1a]
        border-white/[0.08]
        shadow-xl
      `,
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const hoverStyles =
      isHoverable && variant !== 'interactive'
        ? 'hover:border-white/20 hover:-translate-y-0.5'
        : '';

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, variants[variant], paddings[padding], hoverStyles, className)}
        whileHover={isHoverable ? { y: -2 } : undefined}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

Card.displayName = 'Card';

/**
 * Card Header Component
 */
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode;
}

Card.Header = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, action, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-start justify-between gap-4 mb-4', className)}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  ),
);

Card.Header.displayName = 'CardHeader';

/**
 * Card Content Component
 */
Card.Content = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('', className)} {...props} />,
);

Card.Content.displayName = 'CardContent';

/**
 * Card Footer Component
 */
Card.Footer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-between gap-4 mt-4 pt-4 border-t border-white/[0.06]',
        className,
      )}
      {...props}
    />
  ),
);

Card.Footer.displayName = 'CardFooter';

export default Card;
