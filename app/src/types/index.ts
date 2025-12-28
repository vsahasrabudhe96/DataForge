// User Progress & Gamification Types

export type Level = 'junior' | 'mid' | 'senior' | 'staff' | 'principal';

export interface UserProgress {
  userId: string;
  level: Level;
  xp: number;
  totalXp: number;
  streak: number;
  longestStreak: number;
  lastActive: Date;
  completedModules: string[];
  achievements: string[];
  topicScores: {
    [topic: string]: {
      questionsAttempted: number;
      questionsCorrect: number;
      lastPracticed: Date;
    };
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'mastery' | 'streak' | 'speed' | 'challenge';
  requirement: number;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

// Learning Module Types

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: TopicCategory;
  difficulty: Difficulty;
  estimatedTime: number; // in minutes
  xpReward: number;
  prerequisites: string[];
  sections: ModuleSection[];
  completed: boolean;
  progress: number; // 0-100
}

export interface ModuleSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'code' | 'diagram' | 'interactive';
  codeExample?: CodeExample;
}

export interface CodeExample {
  language: 'sql' | 'python' | 'spark' | 'dbt';
  code: string;
  description: string;
  runnable: boolean;
}

// Question & Quiz Types

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type QuestionType = 'mcq' | 'sql' | 'design' | 'scenario' | 'code-review';
export type TopicCategory = 
  | 'data-modeling' 
  | 'scd' 
  | 'loading-patterns' 
  | 'lakehouse' 
  | 'data-quality' 
  | 'performance';

export interface Question {
  id: string;
  topic: TopicCategory;
  difficulty: Difficulty;
  type: QuestionType;
  title: string;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  hints?: string[];
  relatedTopics: string[];
  xpReward: number;
  timeLimit?: number; // in seconds
}

export interface QuizResult {
  questionId: string;
  correct: boolean;
  userAnswer: string | string[];
  timeSpent: number;
  hintsUsed: number;
  xpEarned: number;
}

export interface QuizSession {
  id: string;
  type: 'daily' | 'weekly' | 'boss-battle' | 'time-trial' | 'practice';
  questions: Question[];
  results: QuizResult[];
  startedAt: Date;
  completedAt?: Date;
  totalXpEarned: number;
}

// Challenge Types

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'boss-battle';
  difficulty: Difficulty;
  xpReward: number;
  questions: Question[];
  timeLimit?: number; // in seconds
  requirements?: {
    minCorrect: number;
    maxTime?: number;
  };
  completed: boolean;
  expiresAt?: Date;
}

// Flashcard Types

export interface Flashcard {
  id: string;
  topic: TopicCategory;
  front: string;
  back: string;
  difficulty: Difficulty;
  lastReviewed?: Date;
  nextReview?: Date;
  repetitions: number;
  easeFactor: number;
}

// Leaderboard Types

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  xp: number;
  level: Level;
  streak: number;
}

// Schema Designer Types

export interface SchemaTable {
  id: string;
  name: string;
  type: 'fact' | 'dimension';
  columns: SchemaColumn[];
  position: { x: number; y: number };
}

export interface SchemaColumn {
  id: string;
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  references?: { tableId: string; columnId: string };
  nullable: boolean;
}

export interface SchemaRelationship {
  id: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

// Resource Types

export interface CheatSheet {
  id: string;
  title: string;
  topic: TopicCategory;
  content: string;
  downloadUrl?: string;
}

export interface SQLSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  topic: TopicCategory;
  tags: string[];
}

// Study Plan Types

export interface StudyPlan {
  id: string;
  name: string;
  duration: '1-week' | '1-month' | '3-months';
  dailyGoals: DailyGoal[];
  focusAreas: TopicCategory[];
  createdAt: Date;
}

export interface DailyGoal {
  date: Date;
  tasks: StudyTask[];
  completed: boolean;
}

export interface StudyTask {
  id: string;
  type: 'module' | 'quiz' | 'challenge' | 'review';
  targetId: string;
  title: string;
  completed: boolean;
  xpReward: number;
}

// Level thresholds
export const LEVEL_THRESHOLDS: Record<Level, { min: number; max: number; title: string }> = {
  junior: { min: 0, max: 999, title: 'Junior Data Engineer' },
  mid: { min: 1000, max: 4999, title: 'Mid Data Engineer' },
  senior: { min: 5000, max: 14999, title: 'Senior Data Engineer' },
  staff: { min: 15000, max: 29999, title: 'Staff Data Engineer' },
  principal: { min: 30000, max: Infinity, title: 'Principal Data Engineer' },
};

// XP rewards
export const XP_REWARDS = {
  correctAnswer: 10,
  perfectQuiz: 50,
  dailyChallenge: 100,
  weeklyQuest: 500,
  bossBattle: 1000,
  moduleComplete: 200,
  streakBonus: (days: number) => Math.min(days * 5, 50),
  speedBonus: (percentUnderTime: number) => Math.floor(percentUnderTime * 20),
};

// Topic metadata
export const TOPIC_METADATA: Record<TopicCategory, { name: string; icon: string; color: string }> = {
  'data-modeling': { name: 'Data Modeling', icon: '🏗️', color: 'cyan' },
  'scd': { name: 'Slowly Changing Dimensions', icon: '🔄', color: 'purple' },
  'loading-patterns': { name: 'Loading Patterns', icon: '📥', color: 'green' },
  'lakehouse': { name: 'Data Lakehouse', icon: '🏠', color: 'yellow' },
  'data-quality': { name: 'Data Quality', icon: '✅', color: 'magenta' },
  'performance': { name: 'Performance', icon: '⚡', color: 'orange' },
};

