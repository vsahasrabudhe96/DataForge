'use client';

import { Card } from '@/components/ui/Card';
import { ProgressBar, XPProgressBar } from '@/components/ui/ProgressBar';
import { Badge, LevelBadge, StreakBadge } from '@/components/ui/Badge';
import { AchievementCard } from '@/components/AchievementBadge';
import { useUserProgress } from '@/store/useStore';
import { LEVEL_THRESHOLDS, TOPIC_METADATA } from '@/types';
import type { TopicCategory } from '@/types';
import {
  Trophy,
  TrendingUp,
  Target,
  Zap,
  Flame,
  Clock,
  BookOpen,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { clsx } from 'clsx';

const allAchievements = [
  { id: 'first-steps', name: 'First Steps', description: 'Complete your first lesson', icon: '🎯', category: 'mastery' as const, xpReward: 50, requirement: 1 },
  { id: 'data-modeler', name: 'Data Modeler', description: 'Complete the Data Modeling module', icon: '🏗️', category: 'mastery' as const, xpReward: 200, requirement: 1 },
  { id: 'scd-master', name: 'SCD Master', description: 'Complete all SCD lessons', icon: '🔄', category: 'mastery' as const, xpReward: 300, requirement: 1 },
  { id: 'streak-7', name: '7-Day Streak', description: 'Practice for 7 consecutive days', icon: '🔥', category: 'streak' as const, xpReward: 100, requirement: 7 },
  { id: 'streak-30', name: 'Monthly Master', description: 'Practice for 30 consecutive days', icon: '📅', category: 'streak' as const, xpReward: 500, requirement: 30 },
  { id: 'speed-demon', name: 'Speed Demon', description: 'Complete a quiz under 5 minutes', icon: '⚡', category: 'speed' as const, xpReward: 150, requirement: 1 },
  { id: 'perfect-score', name: 'Perfect Score', description: 'Get 100% on a quiz', icon: '💯', category: 'challenge' as const, xpReward: 200, requirement: 1 },
  { id: 'challenge-champion', name: 'Challenge Champion', description: 'Complete 10 daily challenges', icon: '🏆', category: 'challenge' as const, xpReward: 400, requirement: 10 },
];

export default function ProgressPage() {
  const userProgress = useUserProgress();
  const levelThreshold = LEVEL_THRESHOLDS[userProgress.level];

  // Calculate stats
  const totalQuestionsAttempted = Object.values(userProgress.topicScores).reduce(
    (sum, topic) => sum + topic.questionsAttempted,
    0
  );
  const totalQuestionsCorrect = Object.values(userProgress.topicScores).reduce(
    (sum, topic) => sum + topic.questionsCorrect,
    0
  );
  const overallAccuracy = totalQuestionsAttempted > 0
    ? Math.round((totalQuestionsCorrect / totalQuestionsAttempted) * 100)
    : 0;

  const unlockedAchievements = allAchievements.filter(a => 
    userProgress.achievements.includes(a.id)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="purple" size="md">
            <Trophy className="w-4 h-4" />
            Your Progress
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
          Track Your Journey
        </h1>
        <p className="text-[var(--foreground-muted)]">
          Monitor your progress, achievements, and growth as a data engineer.
        </p>
      </div>

      {/* Level Progress */}
      <Card variant="highlight" padding="lg">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-purple)] flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {userProgress.level.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <LevelBadge level={userProgress.level} size="lg" />
                <StreakBadge streak={userProgress.streak} size="lg" />
              </div>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {levelThreshold.title}
              </p>
            </div>
          </div>
          
          <div className="flex-1">
            <XPProgressBar
              currentXP={userProgress.totalXp}
              levelMinXP={levelThreshold.min}
              levelMaxXP={levelThreshold.max === Infinity ? levelThreshold.min + 30000 : levelThreshold.max}
              level={`Level ${userProgress.level}`}
            />
            <p className="text-sm text-[var(--foreground-muted)] mt-2">
              {levelThreshold.max === Infinity
                ? '🎉 You\'ve reached the highest level!'
                : `${(levelThreshold.max - userProgress.totalXp + 1).toLocaleString()} XP until next level`
              }
            </p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="interactive" padding="md" glow="cyan">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-cyan)]/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-[var(--accent-cyan)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {userProgress.totalXp.toLocaleString()}
              </p>
              <p className="text-sm text-[var(--foreground-muted)]">Total XP</p>
            </div>
          </div>
        </Card>

        <Card variant="interactive" padding="md" glow="green">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-green)]/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[var(--accent-green)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {userProgress.completedModules.length}
              </p>
              <p className="text-sm text-[var(--foreground-muted)]">Modules Done</p>
            </div>
          </div>
        </Card>

        <Card variant="interactive" padding="md" glow="purple">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-purple)]/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-[var(--accent-purple)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {overallAccuracy}%
              </p>
              <p className="text-sm text-[var(--foreground-muted)]">Accuracy</p>
            </div>
          </div>
        </Card>

        <Card variant="interactive" padding="md" className="bg-gradient-to-br from-[var(--accent-orange)]/10 to-[var(--accent-yellow)]/10 border-[var(--accent-orange)]/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-orange)] to-[var(--accent-yellow)] flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {userProgress.streak}
              </p>
              <p className="text-sm text-[var(--foreground-muted)]">Day Streak</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Topic Progress */}
      <Card variant="default" padding="lg">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-[var(--accent-cyan)]" />
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Topic Performance
          </h2>
        </div>

        <div className="space-y-4">
          {Object.entries(TOPIC_METADATA).map(([topicId, meta]) => {
            const score = userProgress.topicScores[topicId as TopicCategory];
            const attempted = score?.questionsAttempted || 0;
            const correct = score?.questionsCorrect || 0;
            const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

            return (
              <div key={topicId} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--background-tertiary)] flex items-center justify-center text-xl">
                  {meta.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-[var(--foreground)]">{meta.name}</span>
                    <span className="text-sm text-[var(--foreground-muted)]">
                      {correct}/{attempted} correct
                    </span>
                  </div>
                  <ProgressBar
                    value={accuracy}
                    size="sm"
                    variant={accuracy >= 80 ? 'success' : accuracy >= 50 ? 'warning' : 'danger'}
                  />
                </div>
                <div className="w-16 text-right">
                  <span className={clsx(
                    'text-lg font-bold',
                    accuracy >= 80 ? 'text-[var(--accent-green)]' :
                    accuracy >= 50 ? 'text-[var(--accent-yellow)]' :
                    'text-[var(--accent-magenta)]'
                  )}>
                    {accuracy}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[var(--accent-yellow)]" />
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              Achievements
            </h2>
          </div>
          <Badge variant="yellow" size="md">
            {unlockedAchievements.length} / {allAchievements.length} Unlocked
          </Badge>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {allAchievements.map((achievement) => {
            const unlocked = userProgress.achievements.includes(achievement.id);
            let progress = 0;
            
            // Calculate progress based on achievement type
            if (achievement.category === 'streak') {
              progress = Math.min(userProgress.streak, achievement.requirement);
            } else if (achievement.category === 'mastery') {
              progress = unlocked ? achievement.requirement : 0;
            }

            return (
              <AchievementCard
                key={achievement.id}
                {...achievement}
                unlocked={unlocked}
                progress={progress}
                maxProgress={achievement.requirement}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

