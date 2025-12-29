import { LearningModule, TopicCategory, SkillTrack, SkillLevel } from '@/types';
import { BEGINNER_TOPICS } from './tracks/beginner-track';
import { INTERMEDIATE_TOPICS } from './tracks/intermediate-track';
import { ADVANCED_TOPICS } from './tracks/advanced-track';

export interface TopicConfig {
  id: TopicCategory;
  title: string;
  description: string;
  icon: string;
  color: 'cyan' | 'purple' | 'green' | 'yellow' | 'magenta' | 'orange';
  skillLevel: SkillLevel;
  modules: LearningModule[];
}

// Skill Tracks Definition
export const SKILL_TRACKS: SkillTrack[] = [
  {
    id: 'beginner',
    title: 'Beginner Track',
    description: 'Master the fundamentals of data engineering. Start with data modeling basics, normalization, star schemas, and dimensional design. Perfect for those new to data warehousing.',
    icon: '🌱',
    color: 'green',
    topics: ['data-modeling'],
    estimatedHours: 10,
  },
  {
    id: 'intermediate',
    title: 'Intermediate Track',
    description: 'Dive deeper into slowly changing dimensions (SCDs), incremental loading, CDC, and idempotent pipelines. Build production-ready data pipelines.',
    icon: '🚀',
    color: 'cyan',
    topics: ['scd', 'loading-patterns'],
    estimatedHours: 14,
  },
  {
    id: 'advanced',
    title: 'Advanced Track',
    description: 'Master modern data lakehouse architectures with Delta Lake and Iceberg, implement data quality frameworks, and optimize query performance at scale.',
    icon: '⚡',
    color: 'purple',
    topics: ['lakehouse', 'data-quality', 'performance'],
    estimatedHours: 18,
  },
];

// Combine all topics from track files
export const LEARNING_TOPICS: TopicConfig[] = [
  ...BEGINNER_TOPICS,
  ...INTERMEDIATE_TOPICS,
  ...ADVANCED_TOPICS,
];

// Helper functions
export function getTopicsBySkillLevel(level: SkillLevel): TopicConfig[] {
  return LEARNING_TOPICS.filter(topic => topic.skillLevel === level);
}

export function getModulesBySkillLevel(level: SkillLevel): LearningModule[] {
  return LEARNING_TOPICS
    .filter(topic => topic.skillLevel === level)
    .flatMap(topic => topic.modules);
}

export function getSkillTrackById(trackId: string): SkillTrack | undefined {
  return SKILL_TRACKS.find(track => track.id === trackId);
}

export function getTopicById(topicId: TopicCategory): TopicConfig | undefined {
  return LEARNING_TOPICS.find(topic => topic.id === topicId);
}

export function getModuleById(moduleId: string): LearningModule | undefined {
  for (const topic of LEARNING_TOPICS) {
    const module = topic.modules.find(m => m.id === moduleId);
    if (module) return module;
  }
  return undefined;
}

export function getModulesByTopic(topicId: TopicCategory): LearningModule[] {
  const topic = getTopicById(topicId);
  return topic ? topic.modules : [];
}

export function getNextModule(currentModuleId: string): LearningModule | undefined {
  for (const topic of LEARNING_TOPICS) {
    const moduleIndex = topic.modules.findIndex(m => m.id === currentModuleId);
    if (moduleIndex !== -1 && moduleIndex < topic.modules.length - 1) {
      return topic.modules[moduleIndex + 1];
    }
  }
  return undefined;
}

export function getPreviousModule(currentModuleId: string): LearningModule | undefined {
  for (const topic of LEARNING_TOPICS) {
    const moduleIndex = topic.modules.findIndex(m => m.id === currentModuleId);
    if (moduleIndex > 0) {
      return topic.modules[moduleIndex - 1];
    }
  }
  return undefined;
}

export function getTrackForModule(moduleId: string): SkillLevel | undefined {
  for (const topic of LEARNING_TOPICS) {
    const module = topic.modules.find(m => m.id === moduleId);
    if (module) return topic.skillLevel;
  }
  return undefined;
}

export function getTopicForModule(moduleId: string): TopicConfig | undefined {
  for (const topic of LEARNING_TOPICS) {
    const module = topic.modules.find(m => m.id === moduleId);
    if (module) return topic;
  }
  return undefined;
}

// Calculate total modules and estimated time
export function getTrackStats(trackId: SkillLevel) {
  const topics = getTopicsBySkillLevel(trackId);
  const modules = getModulesBySkillLevel(trackId);
  const totalTime = modules.reduce((sum, m) => sum + m.estimatedTime, 0);
  const totalXp = modules.reduce((sum, m) => sum + m.xpReward, 0);
  
  return {
    topicCount: topics.length,
    moduleCount: modules.length,
    totalTimeMinutes: totalTime,
    totalTimeHours: Math.ceil(totalTime / 60),
    totalXp,
  };
}
