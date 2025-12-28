'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { LEARNING_TOPICS } from '@/data/learning-modules';
import { useUserProgress } from '@/store/useStore';
import {
  BookOpen,
  Clock,
  ChevronRight,
  Target,
  Sparkles,
} from 'lucide-react';
import { clsx } from 'clsx';

export default function LearnPage() {
  const userProgress = useUserProgress();

  const calculateTopicProgress = (topicId: string) => {
    const topic = LEARNING_TOPICS.find(t => t.id === topicId);
    if (!topic) return 0;
    
    const completedCount = topic.modules.filter(m => 
      userProgress.completedModules.includes(m.id)
    ).length;
    
    return topic.modules.length > 0 
      ? Math.round((completedCount / topic.modules.length) * 100)
      : 0;
  };

  const getTotalEstimatedTime = (topicId: string) => {
    const topic = LEARNING_TOPICS.find(t => t.id === topicId);
    if (!topic) return 0;
    return topic.modules.reduce((sum, m) => sum + m.estimatedTime, 0);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="cyan" size="md">
            <BookOpen className="w-4 h-4" />
            Learning Path
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
          Master Data Engineering
        </h1>
        <p className="text-[var(--foreground-muted)] max-w-2xl">
          Structured learning paths covering essential concepts for data engineering interviews.
          Start from the fundamentals and progress to advanced topics.
        </p>
      </div>

      {/* Progress Overview */}
      <Card variant="highlight" padding="lg">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-[var(--accent-cyan)]" />
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Overall Progress
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-2xl font-bold text-[var(--foreground)]">
                  {userProgress.completedModules.length}
                </p>
                <p className="text-sm text-[var(--foreground-muted)]">Modules Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--foreground)]">
                  {LEARNING_TOPICS.reduce((sum, t) => sum + t.modules.length, 0)}
                </p>
                <p className="text-sm text-[var(--foreground-muted)]">Total Modules</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--foreground)]">
                  {Math.round((userProgress.completedModules.length / 
                    LEARNING_TOPICS.reduce((sum, t) => sum + t.modules.length, 0)) * 100) || 0}%
                </p>
                <p className="text-sm text-[var(--foreground-muted)]">Complete</p>
              </div>
            </div>
            <ProgressBar
              value={userProgress.completedModules.length}
              max={LEARNING_TOPICS.reduce((sum, t) => sum + t.modules.length, 0)}
              variant="gradient"
              size="md"
            />
          </div>
          <div className="md:w-48 flex items-center gap-3 p-4 rounded-xl bg-[var(--background-tertiary)]">
            <Sparkles className="w-8 h-8 text-[var(--accent-yellow)]" />
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">Potential XP</p>
              <p className="text-xl font-bold text-[var(--accent-yellow)]">
                {LEARNING_TOPICS.reduce((sum, t) => 
                  sum + t.modules.reduce((mSum, m) => mSum + m.xpReward, 0), 0
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Topic Cards */}
      <div className="grid gap-6">
        {LEARNING_TOPICS.map((topic) => {
          const progress = calculateTopicProgress(topic.id);
          const totalTime = getTotalEstimatedTime(topic.id);
          const completedModules = topic.modules.filter(m => 
            userProgress.completedModules.includes(m.id)
          ).length;

          const colorClasses = {
            cyan: 'from-[var(--accent-cyan)]/20 to-transparent border-[var(--accent-cyan)]/30 hover:border-[var(--accent-cyan)]/60',
            purple: 'from-[var(--accent-purple)]/20 to-transparent border-[var(--accent-purple)]/30 hover:border-[var(--accent-purple)]/60',
            green: 'from-[var(--accent-green)]/20 to-transparent border-[var(--accent-green)]/30 hover:border-[var(--accent-green)]/60',
            yellow: 'from-[var(--accent-yellow)]/20 to-transparent border-[var(--accent-yellow)]/30 hover:border-[var(--accent-yellow)]/60',
            magenta: 'from-[var(--accent-magenta)]/20 to-transparent border-[var(--accent-magenta)]/30 hover:border-[var(--accent-magenta)]/60',
            orange: 'from-[var(--accent-orange)]/20 to-transparent border-[var(--accent-orange)]/30 hover:border-[var(--accent-orange)]/60',
          };

          const iconBgClasses = {
            cyan: 'bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]',
            purple: 'bg-[var(--accent-purple)]/20 text-[var(--accent-purple)]',
            green: 'bg-[var(--accent-green)]/20 text-[var(--accent-green)]',
            yellow: 'bg-[var(--accent-yellow)]/20 text-[var(--accent-yellow)]',
            magenta: 'bg-[var(--accent-magenta)]/20 text-[var(--accent-magenta)]',
            orange: 'bg-[var(--accent-orange)]/20 text-[var(--accent-orange)]',
          };

          return (
            <Link 
              key={topic.id}
              href={`/learn/${topic.id}`}
              className="block group"
            >
              <Card
                variant="interactive"
                padding="lg"
                className={clsx(
                  'bg-gradient-to-br transition-all duration-300',
                  colorClasses[topic.color]
                )}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={clsx(
                        'w-16 h-16 rounded-2xl flex items-center justify-center text-3xl',
                        'transition-transform duration-300 group-hover:scale-110',
                        iconBgClasses[topic.color]
                      )}
                    >
                      {topic.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-[var(--foreground)] mb-1 group-hover:text-[var(--accent-cyan)] transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-[var(--foreground-muted)] line-clamp-2">
                        {topic.description}
                      </p>
                      
                      {/* Meta */}
                      <div className="flex items-center gap-4 mt-3 text-sm text-[var(--foreground-muted)]">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4" />
                          <span>{topic.modules.length} modules</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{totalTime} min total</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="md:w-48">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[var(--foreground-muted)]">Progress</span>
                      <span className="text-sm font-semibold text-[var(--foreground)]">
                        {completedModules}/{topic.modules.length}
                      </span>
                    </div>
                    <ProgressBar
                      value={progress}
                      size="md"
                      variant={progress === 100 ? 'success' : 'gradient'}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-[var(--foreground-muted)]">
                        {progress === 0 ? 'Not started' : progress === 100 ? 'Completed!' : `${progress}%`}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-[var(--accent-cyan)] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

