'use client';

import Link from 'next/link';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { DifficultyBadge, Badge } from './ui/Badge';
import { Clock, Zap, Trophy, Target, Flame } from 'lucide-react';
import { clsx } from 'clsx';
import type { Difficulty } from '@/types';

interface ChallengeCardProps {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'boss-battle' | 'time-trial';
  difficulty: Difficulty;
  xpReward: number;
  questionsCount: number;
  timeLimit?: number; // in minutes
  completed?: boolean;
  expiresIn?: string; // e.g., "2h 30m"
  href: string;
}

export function ChallengeCard({
  id,
  title,
  description,
  type,
  difficulty,
  xpReward,
  questionsCount,
  timeLimit,
  completed = false,
  expiresIn,
  href,
}: ChallengeCardProps) {
  const typeConfig = {
    daily: {
      label: 'Daily Challenge',
      icon: <Target className="w-4 h-4" />,
      color: 'cyan' as const,
      gradient: 'from-[var(--accent-cyan)]/20 via-transparent to-transparent',
      borderColor: 'border-[var(--accent-cyan)]/30',
    },
    weekly: {
      label: 'Weekly Quest',
      icon: <Trophy className="w-4 h-4" />,
      color: 'purple' as const,
      gradient: 'from-[var(--accent-purple)]/20 via-transparent to-transparent',
      borderColor: 'border-[var(--accent-purple)]/30',
    },
    'boss-battle': {
      label: 'Boss Battle',
      icon: <Flame className="w-4 h-4" />,
      color: 'magenta' as const,
      gradient: 'from-[var(--accent-magenta)]/20 via-[var(--accent-orange)]/10 to-transparent',
      borderColor: 'border-[var(--accent-magenta)]/30',
    },
    'time-trial': {
      label: 'Time Trial',
      icon: <Zap className="w-4 h-4" />,
      color: 'yellow' as const,
      gradient: 'from-[var(--accent-yellow)]/20 via-transparent to-transparent',
      borderColor: 'border-[var(--accent-yellow)]/30',
    },
  };

  const config = typeConfig[type];

  return (
    <Card
      variant="interactive"
      padding="none"
      className={clsx(
        'overflow-hidden relative',
        'bg-gradient-to-br',
        config.gradient,
        config.borderColor,
        completed && 'opacity-60'
      )}
    >
      {/* Completion overlay */}
      {completed && (
        <div className="absolute inset-0 bg-[var(--background)]/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[var(--accent-green)]/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-[var(--accent-green)]" />
            </div>
            <span className="text-sm font-semibold text-[var(--accent-green)]">Completed!</span>
          </div>
        </div>
      )}

      <div className="p-5">
        {/* Header badges */}
        <div className="flex items-center justify-between mb-4">
          <Badge variant={config.color} size="sm" icon={config.icon}>
            {config.label}
          </Badge>
          {expiresIn && !completed && (
            <Badge variant="orange" size="sm" icon={<Clock className="w-3 h-3" />}>
              {expiresIn}
            </Badge>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
          {title}
        </h3>
        <p className="text-sm text-[var(--foreground-muted)] line-clamp-2 mb-4">
          {description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <DifficultyBadge difficulty={difficulty} size="sm" />
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">
            {questionsCount} questions
          </div>
          {timeLimit && (
            <div className="flex items-center gap-1 text-sm text-[var(--foreground-muted)]">
              <Clock className="w-3.5 h-3.5" />
              {timeLimit}m
            </div>
          )}
        </div>

        {/* XP Reward */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--accent-yellow)]/10 border border-[var(--accent-yellow)]/30">
              <Zap className="w-4 h-4 text-[var(--accent-yellow)]" />
              <span className="text-sm font-bold text-[var(--accent-yellow)]">
                +{xpReward} XP
              </span>
            </div>
          </div>
          
          <Link href={href}>
            <Button
              variant={completed ? 'secondary' : 'primary'}
              size="sm"
              disabled={completed}
            >
              {completed ? 'Done' : 'Start'}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

interface MiniChallengeCardProps {
  type: 'daily' | 'weekly';
  title: string;
  progress: number;
  total: number;
  xpReward: number;
  href: string;
}

export function MiniChallengeCard({
  type,
  title,
  progress,
  total,
  xpReward,
  href,
}: MiniChallengeCardProps) {
  const isDaily = type === 'daily';
  const completed = progress >= total;

  return (
    <Link href={href}>
      <div
        className={clsx(
          'p-4 rounded-xl border transition-all duration-200',
          'hover:border-[var(--accent-cyan)]/40 hover:-translate-y-0.5',
          isDaily
            ? 'bg-gradient-to-r from-[var(--accent-cyan)]/10 to-transparent border-[var(--accent-cyan)]/20'
            : 'bg-gradient-to-r from-[var(--accent-purple)]/10 to-transparent border-[var(--accent-purple)]/20'
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
            {isDaily ? 'Daily' : 'Weekly'}
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-[var(--accent-yellow)]">
            <Zap className="w-3 h-3" />
            +{xpReward}
          </div>
        </div>
        <p className="text-sm font-medium text-[var(--foreground)] mb-2 truncate">
          {title}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
            <div
              className={clsx(
                'h-full rounded-full transition-all duration-500',
                completed
                  ? 'bg-[var(--accent-green)]'
                  : isDaily
                  ? 'bg-[var(--accent-cyan)]'
                  : 'bg-[var(--accent-purple)]'
              )}
              style={{ width: `${(progress / total) * 100}%` }}
            />
          </div>
          <span className="text-xs text-[var(--foreground-muted)]">
            {progress}/{total}
          </span>
        </div>
      </div>
    </Link>
  );
}

