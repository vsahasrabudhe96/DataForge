'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { SKILL_TRACKS, getTopicsBySkillLevel, getModulesBySkillLevel } from '@/data/learning-modules';
import { useUserProgress } from '@/store/useStore';
import {
  ArrowRight,
  BookOpen,
  Clock,
  Zap,
  Trophy,
  CheckCircle2,
  Target,
  Sparkles,
} from 'lucide-react';
import { clsx } from 'clsx';
import type { SkillLevel } from '@/types';

export default function LearnPage() {
  const userProgress = useUserProgress();

  // Calculate overall stats
  const allModules = SKILL_TRACKS.flatMap(track => getModulesBySkillLevel(track.id));
  const totalModules = allModules.length;
  const completedModules = allModules.filter(m => 
    userProgress.completedModules.includes(m.id)
  ).length;
  const overallProgress = totalModules > 0 
    ? Math.round((completedModules / totalModules) * 100) 
    : 0;
  const totalXp = allModules.reduce((sum, m) => sum + m.xpReward, 0);

  const getTrackStats = (trackId: SkillLevel) => {
    const modules = getModulesBySkillLevel(trackId);
    const completed = modules.filter(m => userProgress.completedModules.includes(m.id)).length;
    const progress = modules.length > 0 ? Math.round((completed / modules.length) * 100) : 0;
    const xp = modules.reduce((sum, m) => sum + m.xpReward, 0);
    const time = modules.reduce((sum, m) => sum + m.estimatedTime, 0);
    return { total: modules.length, completed, progress, xp, time };
  };

  const getTrackColor = (id: SkillLevel): 'green' | 'cyan' | 'purple' => {
    switch (id) {
      case 'beginner': return 'green';
      case 'intermediate': return 'cyan';
      case 'advanced': return 'purple';
      default: return 'cyan';
    }
  };

  const getRecommendedTrack = (): SkillLevel => {
    // Find the first incomplete track
    for (const track of SKILL_TRACKS) {
      const stats = getTrackStats(track.id);
      if (stats.progress < 100) return track.id;
    }
    return 'beginner';
  };

  const recommendedTrack = getRecommendedTrack();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Badge variant="cyan" size="md">
          <BookOpen className="w-4 h-4" />
          LEARNING PATHS
        </Badge>
        <h1 className="text-4xl font-bold text-[var(--foreground)]">
          Master Data Engineering
        </h1>
        <p className="text-lg text-[var(--foreground-muted)] max-w-2xl">
          Structured learning paths from fundamentals to advanced concepts. 
          Choose your track based on your experience level.
        </p>
      </div>

      {/* Overall Progress Card */}
      <Card variant="highlight" padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <Target className="w-4 h-4" />
              <span className="text-sm">Overall Progress</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[var(--foreground)]">
                {overallProgress}%
              </span>
            </div>
            <ProgressBar value={overallProgress} max={100} variant="gradient" size="sm" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">Modules</span>
            </div>
            <div className="text-3xl font-bold text-[var(--foreground)]">
              {completedModules}/{totalModules}
            </div>
            <p className="text-xs text-[var(--foreground-muted)]">Completed</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <Zap className="w-4 h-4" />
              <span className="text-sm">Potential XP</span>
            </div>
            <div className="text-3xl font-bold text-[var(--accent-yellow)]">
              {totalXp.toLocaleString()}
            </div>
            <p className="text-xs text-[var(--foreground-muted)]">Available to earn</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <Trophy className="w-4 h-4" />
              <span className="text-sm">Your XP</span>
            </div>
            <div className="text-3xl font-bold text-[var(--accent-cyan)]">
              {userProgress.totalXp.toLocaleString()}
            </div>
            <p className="text-xs text-[var(--foreground-muted)]">Earned so far</p>
          </div>
        </div>
      </Card>

      {/* Skill Tracks */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          Choose Your Path
        </h2>
        
        <div className="grid gap-6">
          {SKILL_TRACKS.map((track) => {
            const stats = getTrackStats(track.id);
            const isRecommended = track.id === recommendedTrack;
            const isComplete = stats.progress === 100;
            
            return (
              <Link key={track.id} href={`/learn/${track.id}`}>
                <Card 
                  variant={isRecommended ? 'highlight' : 'interactive'} 
                  padding="lg"
                  className={clsx(
                    'relative overflow-hidden transition-all',
                    isRecommended && 'ring-2 ring-[var(--accent-cyan)]/50'
                  )}
                >
                  {isRecommended && (
                    <div className="absolute top-0 right-0">
                      <Badge variant="cyan" size="sm" className="rounded-tl-none rounded-br-none">
                        <Sparkles className="w-3 h-3" />
                        Recommended
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Track Icon & Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className={clsx(
                        'w-16 h-16 rounded-2xl flex items-center justify-center text-3xl',
                        'bg-gradient-to-br',
                        track.id === 'beginner' && 'from-green-500/20 to-emerald-500/20',
                        track.id === 'intermediate' && 'from-cyan-500/20 to-blue-500/20',
                        track.id === 'advanced' && 'from-purple-500/20 to-pink-500/20'
                      )}>
                        {track.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-[var(--foreground)]">
                            {track.title}
                          </h3>
                          {isComplete && (
                            <Badge variant="green" size="sm">
                              <CheckCircle2 className="w-3 h-3" />
                              Complete
                            </Badge>
                          )}
                        </div>
                        <p className="text-[var(--foreground-muted)] text-sm mb-3">
                          {track.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-[var(--foreground-muted)]">
                            <BookOpen className="w-4 h-4" />
                            <span>{stats.total} modules</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[var(--foreground-muted)]">
                            <Clock className="w-4 h-4" />
                            <span>~{Math.round(stats.time / 60)}h</span>
                          </div>
                          <Badge variant={getTrackColor(track.id)} size="sm">
                            <Zap className="w-3 h-3" />
                            {stats.xp} XP
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Section */}
                    <div className="lg:w-64 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--foreground-muted)]">Progress</span>
                        <span className="font-medium text-[var(--foreground)]">
                          {stats.completed}/{stats.total} completed
                        </span>
                      </div>
                      <ProgressBar 
                        value={stats.progress} 
                        max={100} 
                        variant="gradient" 
                        size="md" 
                      />
                      
                      <Button 
                        variant={isRecommended ? 'primary' : 'secondary'}
                        size="sm"
                        className="w-full"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        {stats.progress === 0 ? 'Start' : stats.progress === 100 ? 'Review' : 'Continue'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Tips */}
      <Card variant="default" padding="lg">
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
          💡 Learning Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-[var(--background-tertiary)]">
            <h4 className="font-medium text-[var(--foreground)] mb-2">Start with Fundamentals</h4>
            <p className="text-sm text-[var(--foreground-muted)]">
              Even experienced engineers benefit from reviewing basics like normalization and star schemas.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[var(--background-tertiary)]">
            <h4 className="font-medium text-[var(--foreground)] mb-2">Practice with SQL</h4>
            <p className="text-sm text-[var(--foreground-muted)]">
              Use the SQL Sandbox to experiment with the concepts you learn.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[var(--background-tertiary)]">
            <h4 className="font-medium text-[var(--foreground)] mb-2">Test Your Knowledge</h4>
            <p className="text-sm text-[var(--foreground-muted)]">
              Take quizzes after each module to reinforce your learning.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
