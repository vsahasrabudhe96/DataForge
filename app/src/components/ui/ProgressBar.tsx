'use client';

import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label,
  animated = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variants = {
    default: 'bg-[var(--accent-cyan)]',
    gradient: 'bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)]',
    success: 'bg-[var(--accent-green)]',
    warning: 'bg-[var(--accent-yellow)]',
    danger: 'bg-[var(--accent-magenta)]',
  };

  return (
    <div className={clsx('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-[var(--foreground-muted)]">
            {label || 'Progress'}
          </span>
          <span className="text-[var(--foreground)] font-medium">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={clsx(
          'w-full bg-[var(--background-tertiary)] rounded-full overflow-hidden',
          heights[size]
        )}
      >
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-500 ease-out',
            variants[variant],
            animated && 'relative overflow-hidden'
          )}
          style={{ width: `${percentage}%` }}
        >
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </div>
      </div>
    </div>
  );
}

interface XPProgressBarProps {
  currentXP: number;
  levelMinXP: number;
  levelMaxXP: number;
  level: string;
  className?: string;
}

export function XPProgressBar({
  currentXP,
  levelMinXP,
  levelMaxXP,
  level,
  className,
}: XPProgressBarProps) {
  const xpInLevel = currentXP - levelMinXP;
  const xpNeeded = levelMaxXP - levelMinXP;
  const percentage = (xpInLevel / xpNeeded) * 100;

  return (
    <div className={clsx('w-full', className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--accent-cyan)] uppercase tracking-wider">
            {level}
          </span>
        </div>
        <span className="text-sm text-[var(--foreground-muted)]">
          <span className="text-[var(--foreground)] font-semibold">
            {xpInLevel.toLocaleString()}
          </span>
          {' / '}
          {xpNeeded.toLocaleString()} XP
        </span>
      </div>
      <div className="relative h-3 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--accent-cyan)] via-[var(--accent-purple)] to-[var(--accent-magenta)] rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        </div>
        {/* Milestone markers */}
        <div className="absolute inset-y-0 left-1/4 w-px bg-[var(--foreground-muted)]/20" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-[var(--foreground-muted)]/20" />
        <div className="absolute inset-y-0 left-3/4 w-px bg-[var(--foreground-muted)]/20" />
      </div>
    </div>
  );
}

// Shimmer animation for progress bars
const shimmerKeyframes = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmerKeyframes + `
    .animate-shimmer {
      animation: shimmer 2s infinite;
    }
  `;
  if (!document.querySelector('[data-progress-styles]')) {
    style.setAttribute('data-progress-styles', '');
    document.head.appendChild(style);
  }
}

