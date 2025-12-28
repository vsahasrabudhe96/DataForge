'use client';

import Link from 'next/link';
import { Card } from './ui/Card';
import { ProgressBar } from './ui/ProgressBar';
import { DifficultyBadge } from './ui/Badge';
import { Clock, BookOpen, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import type { Difficulty, TopicCategory } from '@/types';

interface TopicCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: TopicCategory;
  difficulty: Difficulty;
  estimatedTime: number;
  lessonsCount: number;
  progress: number;
  href: string;
  color?: 'cyan' | 'magenta' | 'green' | 'purple' | 'yellow' | 'orange';
}

export function TopicCard({
  id,
  title,
  description,
  icon,
  category,
  difficulty,
  estimatedTime,
  lessonsCount,
  progress,
  href,
  color = 'cyan',
}: TopicCardProps) {
  const colorClasses = {
    cyan: 'from-[var(--accent-cyan)]/20 to-transparent border-[var(--accent-cyan)]/30 group-hover:border-[var(--accent-cyan)]/60',
    magenta: 'from-[var(--accent-magenta)]/20 to-transparent border-[var(--accent-magenta)]/30 group-hover:border-[var(--accent-magenta)]/60',
    green: 'from-[var(--accent-green)]/20 to-transparent border-[var(--accent-green)]/30 group-hover:border-[var(--accent-green)]/60',
    purple: 'from-[var(--accent-purple)]/20 to-transparent border-[var(--accent-purple)]/30 group-hover:border-[var(--accent-purple)]/60',
    yellow: 'from-[var(--accent-yellow)]/20 to-transparent border-[var(--accent-yellow)]/30 group-hover:border-[var(--accent-yellow)]/60',
    orange: 'from-[var(--accent-orange)]/20 to-transparent border-[var(--accent-orange)]/30 group-hover:border-[var(--accent-orange)]/60',
  };

  const iconBgClasses = {
    cyan: 'bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]',
    magenta: 'bg-[var(--accent-magenta)]/20 text-[var(--accent-magenta)]',
    green: 'bg-[var(--accent-green)]/20 text-[var(--accent-green)]',
    purple: 'bg-[var(--accent-purple)]/20 text-[var(--accent-purple)]',
    yellow: 'bg-[var(--accent-yellow)]/20 text-[var(--accent-yellow)]',
    orange: 'bg-[var(--accent-orange)]/20 text-[var(--accent-orange)]',
  };

  const progressVariant = {
    cyan: 'default' as const,
    magenta: 'danger' as const,
    green: 'success' as const,
    purple: 'gradient' as const,
    yellow: 'warning' as const,
    orange: 'warning' as const,
  };

  return (
    <Link href={href} className="group block">
      <Card
        variant="interactive"
        padding="none"
        className={clsx(
          'overflow-hidden transition-all duration-300',
          'bg-gradient-to-br',
          colorClasses[color]
        )}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div
              className={clsx(
                'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                'transition-transform duration-300 group-hover:scale-110',
                iconBgClasses[color]
              )}
            >
              {icon}
            </div>
            <DifficultyBadge difficulty={difficulty} size="sm" />
          </div>

          {/* Title & Description */}
          <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 group-hover:text-[var(--accent-cyan)] transition-colors">
            {title}
          </h3>
          <p className="text-sm text-[var(--foreground-muted)] line-clamp-2 mb-4">
            {description}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)] mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{estimatedTime} min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lessonsCount} lessons</span>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <ProgressBar
              value={progress}
              variant={progressVariant[color]}
              size="sm"
              animated={progress > 0 && progress < 100}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--foreground-muted)]">
                {progress === 0 ? 'Not started' : progress === 100 ? 'Completed' : `${progress}% complete`}
              </span>
              <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-[var(--accent-cyan)] group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

