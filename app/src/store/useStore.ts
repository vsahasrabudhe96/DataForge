import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  UserProgress, 
  Level, 
  Achievement, 
  QuizSession, 
  TopicCategory,
  LEVEL_THRESHOLDS,
  XP_REWARDS 
} from '@/types';

interface AppState {
  // User Progress
  userProgress: UserProgress;
  
  // Active sessions
  currentQuizSession: QuizSession | null;
  
  // UI State
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  
  // Actions
  addXp: (amount: number, topic?: TopicCategory) => void;
  updateStreak: () => void;
  completeModule: (moduleId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  recordQuizResult: (questionId: string, correct: boolean, timeSpent: number) => void;
  startQuizSession: (session: QuizSession) => void;
  endQuizSession: () => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  resetProgress: () => void;
}

const calculateLevel = (xp: number): Level => {
  if (xp >= LEVEL_THRESHOLDS.principal.min) return 'principal';
  if (xp >= LEVEL_THRESHOLDS.staff.min) return 'staff';
  if (xp >= LEVEL_THRESHOLDS.senior.min) return 'senior';
  if (xp >= LEVEL_THRESHOLDS.mid.min) return 'mid';
  return 'junior';
};

const getNextLevelXp = (level: Level): number => {
  return LEVEL_THRESHOLDS[level].max + 1;
};

const getCurrentLevelXp = (level: Level): number => {
  return LEVEL_THRESHOLDS[level].min;
};

const initialProgress: UserProgress = {
  userId: 'guest',
  level: 'junior',
  xp: 0,
  totalXp: 0,
  streak: 0,
  longestStreak: 0,
  lastActive: new Date(),
  completedModules: [],
  achievements: [],
  topicScores: {},
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      userProgress: initialProgress,
      currentQuizSession: null,
      sidebarOpen: true,
      theme: 'dark',

      addXp: (amount: number, topic?: TopicCategory) => {
        set((state) => {
          const newTotalXp = state.userProgress.totalXp + amount;
          const newLevel = calculateLevel(newTotalXp);
          
          // Calculate XP within current level
          const currentLevelMin = getCurrentLevelXp(newLevel);
          const newXp = newTotalXp - currentLevelMin;
          
          // Update topic scores if topic provided
          let newTopicScores = { ...state.userProgress.topicScores };
          if (topic) {
            const existing = newTopicScores[topic] || {
              questionsAttempted: 0,
              questionsCorrect: 0,
              lastPracticed: new Date(),
            };
            newTopicScores[topic] = {
              ...existing,
              lastPracticed: new Date(),
            };
          }
          
          return {
            userProgress: {
              ...state.userProgress,
              xp: newXp,
              totalXp: newTotalXp,
              level: newLevel,
              topicScores: newTopicScores,
            },
          };
        });
      },

      updateStreak: () => {
        set((state) => {
          const lastActive = new Date(state.userProgress.lastActive);
          const today = new Date();
          const diffDays = Math.floor(
            (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          let newStreak = state.userProgress.streak;
          
          if (diffDays === 0) {
            // Same day, no change
          } else if (diffDays === 1) {
            // Next day, increment streak
            newStreak += 1;
          } else {
            // More than a day, reset streak
            newStreak = 1;
          }
          
          const longestStreak = Math.max(newStreak, state.userProgress.longestStreak);
          
          // Add streak bonus XP
          const streakBonus = XP_REWARDS.streakBonus(newStreak);
          
          return {
            userProgress: {
              ...state.userProgress,
              streak: newStreak,
              longestStreak,
              lastActive: today,
              totalXp: state.userProgress.totalXp + streakBonus,
            },
          };
        });
      },

      completeModule: (moduleId: string) => {
        set((state) => {
          if (state.userProgress.completedModules.includes(moduleId)) {
            return state;
          }
          
          return {
            userProgress: {
              ...state.userProgress,
              completedModules: [...state.userProgress.completedModules, moduleId],
              totalXp: state.userProgress.totalXp + XP_REWARDS.moduleComplete,
            },
          };
        });
      },

      unlockAchievement: (achievementId: string) => {
        set((state) => {
          if (state.userProgress.achievements.includes(achievementId)) {
            return state;
          }
          
          return {
            userProgress: {
              ...state.userProgress,
              achievements: [...state.userProgress.achievements, achievementId],
            },
          };
        });
      },

      recordQuizResult: (questionId: string, correct: boolean, timeSpent: number) => {
        set((state) => {
          const session = state.currentQuizSession;
          if (!session) return state;
          
          const question = session.questions.find(q => q.id === questionId);
          if (!question) return state;
          
          const xpEarned = correct ? question.xpReward : 0;
          
          // Update topic scores
          const topic = question.topic;
          const existing = state.userProgress.topicScores[topic] || {
            questionsAttempted: 0,
            questionsCorrect: 0,
            lastPracticed: new Date(),
          };
          
          const newTopicScores = {
            ...state.userProgress.topicScores,
            [topic]: {
              questionsAttempted: existing.questionsAttempted + 1,
              questionsCorrect: existing.questionsCorrect + (correct ? 1 : 0),
              lastPracticed: new Date(),
            },
          };
          
          return {
            userProgress: {
              ...state.userProgress,
              totalXp: state.userProgress.totalXp + xpEarned,
              topicScores: newTopicScores,
            },
            currentQuizSession: {
              ...session,
              results: [
                ...session.results,
                {
                  questionId,
                  correct,
                  userAnswer: '',
                  timeSpent,
                  hintsUsed: 0,
                  xpEarned,
                },
              ],
              totalXpEarned: session.totalXpEarned + xpEarned,
            },
          };
        });
      },

      startQuizSession: (session: QuizSession) => {
        set({ currentQuizSession: session });
      },

      endQuizSession: () => {
        set((state) => {
          const session = state.currentQuizSession;
          if (!session) return state;
          
          return {
            currentQuizSession: null,
          };
        });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      toggleTheme: () => {
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' }));
      },

      resetProgress: () => {
        set({ userProgress: initialProgress, currentQuizSession: null });
      },
    }),
    {
      name: 'dataforge-storage',
      partialize: (state) => ({
        userProgress: state.userProgress,
        theme: state.theme,
      }),
    }
  )
);

// Selector hooks for performance
export const useUserProgress = () => useStore((state) => state.userProgress);
export const useCurrentSession = () => useStore((state) => state.currentQuizSession);
export const useSidebarOpen = () => useStore((state) => state.sidebarOpen);
export const useTheme = () => useStore((state) => state.theme);

