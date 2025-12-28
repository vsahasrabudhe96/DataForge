'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge, DifficultyBadge } from '@/components/ui/Badge';
import { LEARNING_TOPICS, getTopicById } from '@/data/learning-modules';
import { useStore, useUserProgress } from '@/store/useStore';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  ChevronRight,
  Lock,
  CheckCircle2,
  Play,
  Zap,
} from 'lucide-react';
import { clsx } from 'clsx';
import type { TopicCategory } from '@/types';

export default function TopicPage({ 
  params 
}: { 
  params: Promise<{ topic: string }> 
}) {
  const resolvedParams = use(params);
  const topicId = resolvedParams.topic as TopicCategory;
  const topic = getTopicById(topicId);
  const userProgress = useUserProgress();

  if (!topic) {
    notFound();
  }

  const isModuleCompleted = (moduleId: string) => {
    return userProgress.completedModules.includes(moduleId);
  };

  const isModuleLocked = (moduleId: string) => {
    const module = topic.modules.find(m => m.id === moduleId);
    if (!module) return true;
    
    // Check if all prerequisites are completed
    return module.prerequisites.some(
      prereqId => !userProgress.completedModules.includes(prereqId)
    );
  };

  const getModuleStatus = (moduleId: string) => {
    if (isModuleCompleted(moduleId)) return 'completed';
    if (isModuleLocked(moduleId)) return 'locked';
    return 'available';
  };

  const totalXP = topic.modules.reduce((sum, m) => sum + m.xpReward, 0);
  const earnedXP = topic.modules
    .filter(m => isModuleCompleted(m.id))
    .reduce((sum, m) => sum + m.xpReward, 0);

  const colorClasses = {
    cyan: {
      badge: 'cyan' as const,
      icon: 'bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]',
      border: 'border-[var(--accent-cyan)]/30',
    },
    purple: {
      badge: 'purple' as const,
      icon: 'bg-[var(--accent-purple)]/20 text-[var(--accent-purple)]',
      border: 'border-[var(--accent-purple)]/30',
    },
    green: {
      badge: 'green' as const,
      icon: 'bg-[var(--accent-green)]/20 text-[var(--accent-green)]',
      border: 'border-[var(--accent-green)]/30',
    },
    yellow: {
      badge: 'yellow' as const,
      icon: 'bg-[var(--accent-yellow)]/20 text-[var(--accent-yellow)]',
      border: 'border-[var(--accent-yellow)]/30',
    },
    magenta: {
      badge: 'magenta' as const,
      icon: 'bg-[var(--accent-magenta)]/20 text-[var(--accent-magenta)]',
      border: 'border-[var(--accent-magenta)]/30',
    },
    orange: {
      badge: 'orange' as const,
      icon: 'bg-[var(--accent-orange)]/20 text-[var(--accent-orange)]',
      border: 'border-[var(--accent-orange)]/30',
    },
  };

  const colors = colorClasses[topic.color];

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link 
        href="/learn"
        className="inline-flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Learning Path</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        <div
          className={clsx(
            'w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0',
            colors.icon
          )}
        >
          {topic.icon}
        </div>
        <div className="flex-1">
          <Badge variant={colors.badge} size="md" className="mb-2">
            {topic.modules.length} Modules
          </Badge>
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            {topic.title}
          </h1>
          <p className="text-lg text-[var(--foreground-muted)] max-w-2xl">
            {topic.description}
          </p>
        </div>
      </div>

      {/* Progress Card */}
      <Card variant="highlight" padding="lg">
        <div className="grid sm:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-[var(--foreground-muted)] mb-1">Completed</p>
            <p className="text-2xl font-bold text-[var(--foreground)]">
              {topic.modules.filter(m => isModuleCompleted(m.id)).length} / {topic.modules.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--foreground-muted)] mb-1">XP Earned</p>
            <p className="text-2xl font-bold text-[var(--accent-yellow)]">
              {earnedXP.toLocaleString()} / {totalXP.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--foreground-muted)] mb-1">Total Time</p>
            <p className="text-2xl font-bold text-[var(--foreground)]">
              {topic.modules.reduce((sum, m) => sum + m.estimatedTime, 0)} min
            </p>
          </div>
          <div className="sm:col-span-1">
            <p className="text-sm text-[var(--foreground-muted)] mb-1">Progress</p>
            <ProgressBar
              value={topic.modules.filter(m => isModuleCompleted(m.id)).length}
              max={topic.modules.length}
              variant="gradient"
              size="md"
              className="mt-3"
            />
          </div>
        </div>
      </Card>

      {/* Modules List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          Learning Modules
        </h2>

        <div className="space-y-3">
          {topic.modules.map((module, index) => {
            const status = getModuleStatus(module.id);
            const isLocked = status === 'locked';
            const isCompleted = status === 'completed';

            return (
              <Link
                key={module.id}
                href={isLocked ? '#' : `/learn/${topic.id}/${module.id}`}
                className={clsx(
                  'block group',
                  isLocked && 'cursor-not-allowed'
                )}
                onClick={(e) => isLocked && e.preventDefault()}
              >
                <Card
                  variant="interactive"
                  padding="md"
                  className={clsx(
                    'transition-all duration-200',
                    isLocked && 'opacity-50 hover:transform-none hover:shadow-none',
                    isCompleted && 'border-[var(--accent-green)]/30'
                  )}
                >
                  <div className="flex items-center gap-4">
                    {/* Module Number / Status */}
                    <div
                      className={clsx(
                        'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0',
                        isCompleted 
                          ? 'bg-[var(--accent-green)]/20 text-[var(--accent-green)]'
                          : isLocked
                          ? 'bg-[var(--background-tertiary)] text-[var(--foreground-muted)]'
                          : colors.icon
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={clsx(
                          'font-semibold transition-colors',
                          isLocked 
                            ? 'text-[var(--foreground-muted)]'
                            : 'text-[var(--foreground)] group-hover:text-[var(--accent-cyan)]'
                        )}>
                          {module.title}
                        </h3>
                        <DifficultyBadge difficulty={module.difficulty} size="sm" />
                      </div>
                      <p className="text-sm text-[var(--foreground-muted)] line-clamp-1">
                        {module.description}
                      </p>
                      
                      {/* Meta */}
                      <div className="flex items-center gap-4 mt-2 text-xs text-[var(--foreground-muted)]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{module.estimatedTime} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{module.sections.length} sections</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-[var(--accent-yellow)]" />
                          <span className="text-[var(--accent-yellow)]">+{module.xpReward} XP</span>
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <Badge variant="green" size="sm">
                          <CheckCircle2 className="w-3 h-3" />
                          Done
                        </Badge>
                      ) : isLocked ? (
                        <Badge variant="default" size="sm">
                          <Lock className="w-3 h-3" />
                          Locked
                        </Badge>
                      ) : (
                        <Button 
                          variant="primary" 
                          size="sm"
                          rightIcon={<Play className="w-4 h-4" />}
                        >
                          Start
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Prerequisites info */}
                  {isLocked && module.prerequisites.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[var(--card-border)]">
                      <p className="text-xs text-[var(--foreground-muted)]">
                        Complete first:{' '}
                        {module.prerequisites.map((prereqId, i) => {
                          const prereq = topic.modules.find(m => m.id === prereqId);
                          return (
                            <span key={prereqId}>
                              {prereq?.title}
                              {i < module.prerequisites.length - 1 && ', '}
                            </span>
                          );
                        })}
                      </p>
                    </div>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

