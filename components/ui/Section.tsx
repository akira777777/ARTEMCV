import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Section background variants
 */
const sectionBackgrounds = {
  default: 'bg-transparent',
  muted: 'bg-zinc-950/50',
  gradient: 'bg-gradient-to-b from-zinc-950/50 to-transparent',
  dots: 'bg-transparent bg-[radial-gradient(zinc-800_1px,transparent_1px)] bg-[size:24px_24px]',
} as const;

/**
 * Section padding variants
 */
const sectionPaddings = {
  none: 'py-0',
  sm: 'py-8 md:py-12',
  md: 'py-16 md:py-24',
  lg: 'py-24 md:py-32',
} as const;

/**
 * Props for the Section component
 */
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Background style variant */
  background?: keyof typeof sectionBackgrounds;
  /** Vertical padding size */
  padding?: keyof typeof sectionPaddings;
  /** Container max width */
  container?: 'default' | 'wide' | 'narrow' | 'full';
  /** Whether to add id for anchor navigation */
  id?: string;
  /** Custom class names */
  className?: string;
  /** Custom class names for the inner container */
  containerClassName?: string;
}

/**
 * Container max width styles
 */
const containerSizes = {
  default: 'max-w-7xl',
  wide: 'max-w-[1400px]',
  narrow: 'max-w-4xl',
  full: 'max-w-none',
} as const;

/**
 * Page section component with container and consistent spacing
 *
 * @example
 * ```tsx
 * <Section id="hero" background="gradient" padding="lg" container="narrow">
 *   <h1>Hero Content</h1>
 * </Section>
 * ```
 */
export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      background = 'default',
      padding = 'md',
      container = 'default',
      id,
      className,
      containerClassName,
      children,
      ...props
    },
    ref,
  ) => (
    <section
      ref={ref}
      id={id}
      className={cn(
        'relative w-full',
        sectionBackgrounds[background],
        sectionPaddings[padding],
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'mx-auto px-4 sm:px-6 lg:px-8',
          containerSizes[container],
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  ),
);

Section.displayName = 'Section';

/**
 * Props for the SectionHeader component
 */
export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Eyebrow text (small text above title) */
  eyebrow?: string;
  /** Main title */
  title?: React.ReactNode;
  /** Subtitle or description */
  subtitle?: React.ReactNode;
  /** Alignment of the header */
  align?: 'left' | 'center' | 'right';
  /** Custom class names */
  className?: string;
}

/**
 * Pre-styled section header with eyebrow, title and subtitle
 *
 * @example
 * ```tsx
 * <SectionHeader
 *   eyebrow="Portfolio"
 *   title="My Projects"
 *   subtitle="A selection of my recent work"
 *   align="center"
 * />
 * ```
 */
export const SectionHeader = React.memo<SectionHeaderProps>(
  ({ eyebrow, title, subtitle, align = 'center', className, ...props }) => {
    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    } as const;

    return (
      <div className={cn('mb-12 md:mb-16', alignClasses[align], className)} {...props}>
        {eyebrow && (
          <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-emerald-400 uppercase bg-emerald-500/10 rounded-full border border-emerald-500/20">
            {eyebrow}
          </span>
        )}
        {title && (
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-100 tracking-tight">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="mt-4 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>
    );
  },
);

SectionHeader.displayName = 'SectionHeader';
