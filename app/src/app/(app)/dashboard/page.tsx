'use client';

import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar, XPProgressBar } from '@/components/ui/ProgressBar';
import { LevelBadge, StreakBadge, Badge } from '@/components/ui/Badge';
import { TopicCard } from '@/components/TopicCard';
import { ChallengeCard, MiniChallengeCard } from '@/components/ChallengeCard';
import { AchievementBadge } from '@/components/AchievementBadge';
import { useUserProgress } from '@/store/useStore';
import { LEVEL_THRESHOLDS } from '@/types';
import {
  Flame,
  Target,
  Trophy,
  Zap,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

// Mock data for the dashboard
const recentTopics = [
  {
    id: 'data-modeling',
    title: 'Data Modeling Fundamentals',
    description: 'Learn about fact tables, dimension tables, and schema design patterns.',
    icon: '🏗️',
    category: 'data-modeling' as const,
    difficulty: 'beginner' as const,
    estimatedTime: 45,
    lessonsCount: 8,
    progress: 65,
    href: '/learn/data-modeling',
    color: 'cyan' as const,
  },
  {
    id: 'scd-types',
    title: 'Slowly Changing Dimensions',
    description: 'Master all SCD types with real-world SQL implementations.',
    icon: '🔄',
    category: 'scd' as const,
    difficulty: 'intermediate' as const,
    estimatedTime: 60,
    lessonsCount: 12,
    progress: 30,
    href: '/learn/scd',
    color: 'purple' as const,
  },
  {
    id: 'loading-patterns',
    title: 'Data Loading Patterns',
    description: 'Incremental loads, watermarking, and CDC strategies.',
    icon: '📥',
    category: 'loading-patterns' as const,
    difficulty: 'intermediate' as const,
    estimatedTime: 50,
    lessonsCount: 10,
    progress: 0,
    href: '/learn/loading-patterns',
    color: 'green' as const,
  },
];

const dailyChallenges = [
  {
    id: 'daily-1',
    title: 'SCD Type 2 Implementation',
    description: 'Write a SQL query to implement SCD Type 2 for a customer dimension table.',
    type: 'daily' as const,
    difficulty: 'intermediate' as const,
    xpReward: 100,
    questionsCount: 3,
    timeLimit: 15,
    expiresIn: '18h 30m',
    href: '/practice/challenges/daily-1',
  },
];

const weeklyChallenges = [
  {
    id: 'weekly-1',
    title: 'Data Warehouse Design Challenge',
    description: 'Design a complete star schema for an e-commerce analytics platform.',
    type: 'weekly' as const,
    difficulty: 'advanced' as const,
    xpReward: 500,
    questionsCount: 10,
    timeLimit: 60,
    expiresIn: '5d',
    href: '/practice/challenges/weekly-1',
  },
];

const recentAchievements = [
  { id: '1', name: 'First Steps', description: 'Complete your first lesson', icon: '🎯', category: 'mastery' as const, unlocked: true, xpReward: 50 },
  { id: '2', name: '7-Day Streak', description: 'Practice for 7 consecutive days', icon: '🔥', category: 'streak' as const, unlocked: true, xpReward: 100 },
  { id: '3', name: 'Data Modeler', description: 'Complete the Data Modeling module', icon: '🏗️', category: 'mastery' as const, unlocked: false, xpReward: 200, progress: 65, maxProgress: 100 },
  { id: '4', name: 'Speed Demon', description: 'Complete a quiz under 5 minutes', icon: '⚡', category: 'speed' as const, unlocked: false, xpReward: 150 },
];

const weakAreas = [
  { topic: 'SCD Type 6', accuracy: 45, color: 'magenta' as const },
  { topic: 'Watermarking', accuracy: 52, color: 'orange' as const },
  { topic: 'Z-Ordering', accuracy: 60, color: 'yellow' as const },
];

export default function DashboardPage() {
  const userProgress = useUserProgress();
  const levelThreshold = LEVEL_THRESHOLDS[userProgress.level];

  // Calculate some stats
  const totalQuestionsAttempted = Object.values(userProgress.topicScores).reduce(
    (sum, topic) => sum + topic.questionsAttempted,
    0
  );
  const totalQuestionsCorrect = Object.values(userProgress.topicScores).reduce(
    (sum, topic) => sum + topic.questionsCorrect,
    0
  );
  const accuracy = totalQuestionsAttempted > 0
    ? Math.round((totalQuestionsCorrect / totalQuestionsAttempted) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Welcome back! 👋
          </h1>
          <p className="text-[var(--foreground-muted)] mt-1">
            You&apos;re making great progress. Keep up the momentum!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LevelBadge level={userProgress.level} size="lg" />
          <StreakBadge streak={userProgress.streak} size="lg" />
        </div>
      </div>

      {/* Progress Overview Cards */}
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
                {accuracy}%
              </p>
              <p className="text-sm text-[var(--foreground-muted)]">Accuracy</p>
            </div>
          </div>
        </Card>

        <Card variant="interactive" padding="md" glow="magenta">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-magenta)]/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-[var(--accent-magenta)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {userProgress.achievements.length}
              </p>
              <p className="text-sm text-[var(--foreground-muted)]">Achievements</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Level Progress */}
      <Card variant="highlight" padding="lg">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[var(--accent-cyan)]" />
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Level Progress
              </h2>
            </div>
            <XPProgressBar
              currentXP={userProgress.totalXp}
              levelMinXP={levelThreshold.min}
              levelMaxXP={levelThreshold.max === Infinity ? levelThreshold.min + 30000 : levelThreshold.max}
              level={levelThreshold.title}
            />
          </div>
          <div className="lg:w-48">
            <p className="text-sm text-[var(--foreground-muted)] mb-2">Next Level</p>
            <p className="text-lg font-semibold text-[var(--foreground)]">
              {levelThreshold.max === Infinity
                ? 'Max Level Reached!'
                : `${(levelThreshold.max - userProgress.totalXp + 1).toLocaleString()} XP to go`}
            </p>
          </div>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[var(--foreground)] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[var(--accent-cyan)]" />
              Continue Learning
            </h2>
            <Link href="/learn">
              <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                View All
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentTopics.map((topic) => (
              <TopicCard key={topic.id} {...topic} />
            ))}
          </div>

          {/* Challenges Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[var(--foreground)] flex items-center gap-2">
                <Target className="w-5 h-5 text-[var(--accent-purple)]" />
                Today&apos;s Challenges
              </h2>
              <Link href="/practice/challenges">
                <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                  All Challenges
                </Button>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {dailyChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} {...challenge} />
              ))}
              {weeklyChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} {...challenge} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card variant="default" padding="md">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Quick Start
            </h3>
            <div className="space-y-2">
              <Link href="/practice/quiz" className="block">
                <Button variant="secondary" size="sm" className="w-full justify-start" leftIcon={<Zap className="w-4 h-4" />}>
                  Quick Quiz (5 min)
                </Button>
              </Link>
              <Link href="/practice/flashcards" className="block">
                <Button variant="secondary" size="sm" className="w-full justify-start" leftIcon={<BookOpen className="w-4 h-4" />}>
                  Review Flashcards
                </Button>
              </Link>
              <Link href="/sandbox" className="block">
                <Button variant="secondary" size="sm" className="w-full justify-start" leftIcon={<Target className="w-4 h-4" />}>
                  SQL Sandbox
                </Button>
              </Link>
            </div>
          </Card>

          {/* Weak Areas */}
          <Card variant="default" padding="md">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Areas to Improve
            </h3>
            <div className="space-y-4">
              {weakAreas.map((area) => (
                <div key={area.topic}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[var(--foreground)]">{area.topic}</span>
                    <span className="text-xs text-[var(--foreground-muted)]">{area.accuracy}%</span>
                  </div>
                  <ProgressBar
                    value={area.accuracy}
                    size="sm"
                    variant={area.accuracy < 50 ? 'danger' : area.accuracy < 70 ? 'warning' : 'default'}
                  />
                </div>
              ))}
            </div>
            <Link href="/practice/quiz?focus=weak">
              <Button variant="primary" size="sm" className="w-full mt-4">
                Practice Weak Areas
              </Button>
            </Link>
          </Card>

          {/* Recent Achievements */}
          <Card variant="default" padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                Achievements
              </h3>
              <Link href="/progress/achievements">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {recentAchievements.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  {...achievement}
                  size="sm"
                />
              ))}
            </div>
          </Card>

          {/* Study Streak */}
          <Card variant="highlight" padding="md" className="bg-gradient-to-br from-[var(--accent-orange)]/10 to-[var(--accent-yellow)]/10 border-[var(--accent-orange)]/30">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[var(--accent-orange)] to-[var(--accent-yellow)] flex items-center justify-center">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-1">
                {userProgress.streak} Day Streak!
              </h3>
              <p className="text-sm text-[var(--foreground-muted)] mb-3">
                Keep it up! Your best is {userProgress.longestStreak} days.
              </p>
              <Badge variant="yellow" size="sm">
                <Clock className="w-3 h-3" />
                Practice today to extend
              </Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

