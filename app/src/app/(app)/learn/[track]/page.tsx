'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge, DifficultyBadge } from '@/components/ui/Badge';
import { getTopicsBySkillLevel, getSkillTrackById, SKILL_TRACKS } from '@/data/learning-modules';
import { useUserProgress } from '@/store/useStore';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  CheckCircle2,
  Lock,
  Zap,
  Trophy,
} from 'lucide-react';
import { clsx } from 'clsx';
import type { SkillLevel } from '@/types';

export default function SkillTrackPage({ 
  params 
}: { 
  params: Promise<{ track: string }> 
}) {
  const resolvedParams = use(params);
  const trackId = resolvedParams.track as SkillLevel;
  
  const track = getSkillTrackById(trackId);
  const topics = getTopicsBySkillLevel(trackId);
  const userProgress = useUserProgress();
  
  if (!track || !['beginner', 'intermediate', 'advanced'].includes(trackId)) {
    notFound();
  }

  // Calculate track progress
  const totalModules = topics.reduce((sum, t) => sum + t.modules.length, 0);
  const completedModules = topics.reduce((sum, t) => 
    sum + t.modules.filter(m => userProgress.completedModules.includes(m.id)).length, 0);
  const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  
  // Calculate total XP available
  const totalXpAvailable = topics.reduce((sum, t) => 
    sum + t.modules.reduce((mSum, m) => mSum + m.xpReward, 0), 0);
  
  // Calculate total time
  const totalTime = topics.reduce((sum, t) => 
    sum + t.modules.reduce((mSum, m) => mSum + m.estimatedTime, 0), 0);

  const getTrackColor = (id: SkillLevel) => {
    switch (id) {
      case 'beginner': return 'green';
      case 'intermediate': return 'cyan';
      case 'advanced': return 'purple';
      default: return 'cyan';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Navigation */}
      <Link 
        href="/learn"
        className="inline-flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Learning Paths</span>
      </Link>

      {/* Track Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant={getTrackColor(trackId)} size="lg">
            <span className="text-lg mr-1">{track.icon}</span>
            {track.title.toUpperCase()}
          </Badge>
          <Badge variant="default" size="sm">
            <Clock className="w-3 h-3 mr-1" />
            ~{Math.round(totalTime / 60)}h total
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-[var(--foreground)]">
          {track.title}
        </h1>
        
        <p className="text-lg text-[var(--foreground-muted)] max-w-2xl">
          {track.description}
        </p>
      </div>

      {/* Progress Overview */}
      <Card variant="highlight" padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">Progress</span>
            </div>
            <div className="text-2xl font-bold text-[var(--foreground)]">
              {completedModules} / {totalModules}
            </div>
            <p className="text-xs text-[var(--foreground-muted)]">Modules completed</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">Completion</span>
            </div>
            <div className="text-2xl font-bold text-[var(--foreground)]">
              {progressPercent}%
            </div>
            <ProgressBar value={progressPercent} max={100} variant="gradient" size="sm" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <Zap className="w-4 h-4" />
              <span className="text-sm">Available XP</span>
            </div>
            <div className="text-2xl font-bold text-[var(--accent-yellow)]">
              {totalXpAvailable.toLocaleString()}
            </div>
            <p className="text-xs text-[var(--foreground-muted)]">Points to earn</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Time Estimate</span>
            </div>
            <div className="text-2xl font-bold text-[var(--foreground)]">
              {Math.round(totalTime / 60)}h {totalTime % 60}m
            </div>
            <p className="text-xs text-[var(--foreground-muted)]">Total learning time</p>
          </div>
        </div>
      </Card>

      {/* Topics in this Track */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          Topics in this Track
        </h2>
        
        {topics.map((topic, topicIndex) => {
          const topicCompletedModules = topic.modules.filter(m => 
            userProgress.completedModules.includes(m.id)
          ).length;
          const topicProgress = topic.modules.length > 0 
            ? Math.round((topicCompletedModules / topic.modules.length) * 100) 
            : 0;
          const topicXp = topic.modules.reduce((sum, m) => sum + m.xpReward, 0);
          
          return (
            <Card key={topic.id} variant="default" padding="lg" className="space-y-6">
              {/* Topic Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={clsx(
                    'w-14 h-14 rounded-xl flex items-center justify-center text-2xl',
                    'bg-gradient-to-br from-[var(--accent-cyan)]/20 to-[var(--accent-purple)]/20'
                  )}>
                    {topic.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--foreground)]">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      {topic.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="yellow" size="sm">
                    <Zap className="w-3 h-3" />
                    {topicXp} XP
                  </Badge>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--foreground-muted)]">
                    {topicCompletedModules} of {topic.modules.length} modules
                  </span>
                  <span className="text-[var(--foreground)]">{topicProgress}%</span>
                </div>
                <ProgressBar value={topicProgress} max={100} variant="gradient" size="sm" />
              </div>

              {/* Modules List */}
              <div className="space-y-3">
                {topic.modules.map((module, moduleIndex) => {
                  const isCompleted = userProgress.completedModules.includes(module.id);
                  const prereqsMet = module.prerequisites.every(p => 
                    userProgress.completedModules.includes(p)
                  );
                  const isLocked = !prereqsMet && moduleIndex > 0;
                  
                  return (
                    <Link
                      key={module.id}
                      href={isLocked ? '#' : `/learn/${trackId}/${module.id}`}
                      className={clsx(
                        'flex items-center gap-4 p-4 rounded-xl transition-all',
                        'border border-[var(--card-border)]',
                        isLocked 
                          ? 'opacity-50 cursor-not-allowed bg-[var(--background-tertiary)]/50'
                          : 'hover:bg-[var(--background-tertiary)] hover:border-[var(--accent-cyan)]/30',
                        isCompleted && 'bg-[var(--accent-green)]/5 border-[var(--accent-green)]/30'
                      )}
                      onClick={(e) => isLocked && e.preventDefault()}
                    >
                      {/* Module Number/Status */}
                      <div className={clsx(
                        'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold',
                        isCompleted 
                          ? 'bg-[var(--accent-green)] text-white'
                          : isLocked
                            ? 'bg-[var(--background-tertiary)] text-[var(--foreground-muted)]'
                            : 'bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]'
                      )}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : isLocked ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          moduleIndex + 1
                        )}
                      </div>
                      
                      {/* Module Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-[var(--foreground)] truncate">
                            {module.title}
                          </h4>
                          <DifficultyBadge difficulty={module.difficulty} size="sm" />
                        </div>
                        <p className="text-sm text-[var(--foreground-muted)] line-clamp-1">
                          {module.description}
                        </p>
                      </div>
                      
                      {/* Module Meta */}
                      <div className="flex items-center gap-4 text-sm text-[var(--foreground-muted)]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{module.estimatedTime}m</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{module.sections.length}</span>
                        </div>
                        <Badge variant={isCompleted ? 'green' : 'cyan'} size="sm">
                          {isCompleted ? 'Done' : `+${module.xpReward} XP`}
                        </Badge>
                      </div>
                      
                      {!isLocked && !isCompleted && (
                        <ArrowRight className="w-5 h-5 text-[var(--foreground-muted)]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Navigation to other tracks */}
      <div className="pt-8 border-t border-[var(--card-border)]">
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
          Continue Your Journey
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SKILL_TRACKS.filter(t => t.id !== trackId).map(otherTrack => (
            <Link key={otherTrack.id} href={`/learn/${otherTrack.id}`}>
              <Card variant="interactive" padding="md" className="h-full">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{otherTrack.icon}</div>
                  <div>
                    <h4 className="font-medium text-[var(--foreground)]">
                      {otherTrack.title}
                    </h4>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      ~{otherTrack.estimatedHours}h
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[var(--foreground-muted)] ml-auto" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

