'use client';

import { clsx } from 'clsx';
import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'highlight' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
  glow?: 'cyan' | 'magenta' | 'green' | 'purple' | 'none';
}

export function Card({
  variant = 'default',
  padding = 'md',
  children,
  glow = 'none',
  className,
  ...props
}: CardProps) {
  const baseStyles = `
    rounded-2xl
    border border-[var(--card-border)]
    backdrop-blur-xl
    transition-all duration-300 ease-out
  `;

  const variants = {
    default: `
      bg-[var(--card-bg)]
    `,
    highlight: `
      bg-gradient-to-br from-[var(--background-tertiary)] to-[var(--background-secondary)]
      border-[rgba(0,212,255,0.2)]
    `,
    interactive: `
      bg-[var(--card-bg)]
      cursor-pointer
      hover:border-[var(--card-hover-border)]
      hover:-translate-y-1
      hover:shadow-lg
    `,
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };

  const glows = {
    none: '',
    cyan: 'hover:shadow-[var(--glow-cyan)]',
    magenta: 'hover:shadow-[var(--glow-magenta)]',
    green: 'hover:shadow-[var(--glow-green)]',
    purple: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]',
  };

  return (
    <div
      className={clsx(
        baseStyles,
        variants[variant],
        paddings[padding],
        glows[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  action,
  icon,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={clsx('flex items-start justify-between gap-4', className)}
      {...props}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-purple)] flex items-center justify-center text-lg">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-[var(--foreground-muted)] mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <div className={clsx('mt-4', className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div
      className={clsx(
        'mt-4 pt-4 border-t border-[var(--card-border)] flex items-center justify-between',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

