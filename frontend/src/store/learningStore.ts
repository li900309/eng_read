import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  LearningSession,
  LearningQueue,
  SessionResult,
  Vocabulary,
  SessionSettings,
  SearchParams
} from '@/types';

interface LearningState {
  // Current session
  currentSession: LearningSession | null;
  currentWord: Vocabulary | null;
  sessionResults: SessionResult[];

  // Learning queue
  learningQueue: LearningQueue | null;

  // UI state
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Actions
  startSession: (settings: SessionSettings) => Promise<void>;
  pauseSession: () => Promise<void>;
  resumeSession: () => Promise<void>;
  completeSession: () => Promise<void>;
  abandonSession: () => void;

  // Word management
  nextWord: () => void;
  previousWord: () => void;
  submitAnswer: (vocabularyId: number, isCorrect: boolean, confidence: 'low' | 'medium' | 'high', timeSpent: number) => Promise<void>;
  skipWord: () => void;

  // Queue management
  loadLearningQueue: (params?: SearchParams) => Promise<void>;
  refreshQueue: () => Promise<void>;
  addWordToQueue: (vocabulary: Vocabulary) => void;
  removeWordFromQueue: (vocabularyId: number) => void;

  // Session management
  loadSession: (sessionId: number) => Promise<void>;
  updateSessionProgress: () => void;

  // Utility
  clearError: () => void;
  resetLearningState: () => void;
}

export const useLearningStore = create<LearningState>()(
  immer((set, get) => ({
    // Initial state
    currentSession: null,
    currentWord: null,
    sessionResults: [],
    learningQueue: null,
    isLoading: false,
    isSubmitting: false,
    error: null,

    // Start a new learning session
    startSession: async (settings: SessionSettings) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const response = await fetch('/api/learning/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({ settings }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to start session');
        }

        set((state) => {
          state.currentSession = data.session;
          state.currentWord = data.currentWord;
          state.sessionResults = [];
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.isLoading = false;
          state.error = error instanceof Error ? error.message : 'Failed to start session';
        });
        throw error;
      }
    },

    // Pause current session
    pauseSession: async () => {
      const { currentSession } = get();

      if (!currentSession || currentSession.status !== 'active') {
        return;
      }

      set((state) => {
        state.isLoading = true;
      });

      try {
        const response = await fetch(`/api/learning/session/${currentSession.id}/pause`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to pause session');
        }

        set((state) => {
          if (state.currentSession) {
            state.currentSession.status = 'paused';
          }
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.isLoading = false;
          state.error = error instanceof Error ? error.message : 'Failed to pause session';
        });
      }
    },

    // Resume paused session
    resumeSession: async () => {
      const { currentSession } = get();

      if (!currentSession || currentSession.status !== 'paused') {
        return;
      }

      set((state) => {
        state.isLoading = true;
      });

      try {
        const response = await fetch(`/api/learning/session/${currentSession.id}/resume`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to resume session');
        }

        set((state) => {
          if (state.currentSession) {
            state.currentSession.status = 'active';
          }
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.isLoading = false;
          state.error = error instanceof Error ? error.message : 'Failed to resume session';
        });
      }
    },

    // Complete current session
    completeSession: async () => {
      const { currentSession, sessionResults } = get();

      if (!currentSession) {
        return;
      }

      set((state) => {
        state.isLoading = true;
      });

      try {
        const response = await fetch(`/api/learning/session/${currentSession.id}/complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({ results: sessionResults }),
        });

        if (!response.ok) {
          throw new Error('Failed to complete session');
        }

        set((state) => {
          if (state.currentSession) {
            state.currentSession.status = 'completed';
            state.currentSession.endTime = new Date().toISOString();
          }
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.isLoading = false;
          state.error = error instanceof Error ? error.message : 'Failed to complete session';
        });
      }
    },

    // Abandon current session
    abandonSession: () => {
      set((state) => {
        state.currentSession = null;
        state.currentWord = null;
        state.sessionResults = [];
        state.error = null;
      });
    },

    // Move to next word
    nextWord: () => {
      const { currentSession, sessionResults } = get();

      if (!currentSession) {
        return;
      }

      // This would typically fetch the next word from the backend
      // For now, we'll simulate it
      const nextIndex = sessionResults.length;

      if (nextIndex < currentSession.settings.sessionSize) {
        // Fetch next word from API
        fetch(`/api/learning/session/${currentSession.id}/next`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            set((state) => {
              state.currentWord = data.word;
            });
          })
          .catch((error) => {
            set((state) => {
              state.error = error.message;
            });
          });
      } else {
        // Session completed
        get().completeSession();
      }
    },

    // Move to previous word
    previousWord: () => {
      const { sessionResults } = get();

      if (sessionResults.length > 0) {
        // Remove the last result and go back
        set((state) => {
          state.sessionResults = state.sessionResults.slice(0, -1);
        });

        // Would need to fetch the previous word from backend
        // This is a simplified implementation
      }
    },

    // Submit answer for current word
    submitAnswer: async (vocabularyId: number, isCorrect: boolean, confidence: 'low' | 'medium' | 'high', timeSpent: number) => {
      const { currentSession, sessionResults } = get();

      if (!currentSession) {
        return;
      }

      set((state) => {
        state.isSubmitting = true;
      });

      try {
        const result: SessionResult = {
          vocabularyId,
          isCorrect,
          timeSpent,
          attempts: 1, // Would be calculated based on previous attempts
          confidence,
        };

        const response = await fetch(`/api/learning/session/${currentSession.id}/answer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify(result),
        });

        if (!response.ok) {
          throw new Error('Failed to submit answer');
        }

        set((state) => {
          state.sessionResults = [...state.sessionResults, result];
          state.isSubmitting = false;
        });

        // Move to next word
        get().nextWord();
      } catch (error) {
        set((state) => {
          state.isSubmitting = false;
          state.error = error instanceof Error ? error.message : 'Failed to submit answer';
        });
      }
    },

    // Skip current word
    skipWord: () => {
      const { currentSession } = get();

      if (!currentSession) {
        return;
      }

      set((state) => {
        state.sessionResults = [
          ...state.sessionResults,
          {
            vocabularyId: state.currentWord?.id || 0,
            isCorrect: false,
            timeSpent: 0,
            attempts: 1,
            confidence: 'low',
          },
        ];
      });

      get().nextWord();
    },

    // Load learning queue
    loadLearningQueue: async (params?: SearchParams) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const queryString = params ? new URLSearchParams(params as any).toString() : '';
        const response = await fetch(`/api/learning/queue?${queryString}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load learning queue');
        }

        set((state) => {
          state.learningQueue = data.queue;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.isLoading = false;
          state.error = error instanceof Error ? error.message : 'Failed to load learning queue';
        });
      }
    },

    // Refresh learning queue
    refreshQueue: async () => {
      get().loadLearningQueue();
    },

    // Add word to queue
    addWordToQueue: (vocabulary: Vocabulary) => {
      set((state) => {
        if (state.learningQueue) {
          state.learningQueue.newWords = [...state.learningQueue.newWords, vocabulary];
        }
      });
    },

    // Remove word from queue
    removeWordFromQueue: (vocabularyId: number) => {
      set((state) => {
        if (state.learningQueue) {
          state.learningQueue.newWords = state.learningQueue.newWords.filter(
            word => word.id !== vocabularyId
          );
          state.learningQueue.reviewWords = state.learningQueue.reviewWords.filter(
            word => word.id !== vocabularyId
          );
          state.learningQueue.priorityWords = state.learningQueue.priorityWords.filter(
            word => word.id !== vocabularyId
          );
        }
      });
    },

    // Load existing session
    loadSession: async (sessionId: number) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const response = await fetch(`/api/learning/session/${sessionId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load session');
        }

        set((state) => {
          state.currentSession = data.session;
          state.currentWord = data.currentWord;
          state.sessionResults = data.results || [];
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.isLoading = false;
          state.error = error instanceof Error ? error.message : 'Failed to load session';
        });
      }
    },

    // Update session progress
    updateSessionProgress: () => {
      const { currentSession, sessionResults } = get();

      if (!currentSession) {
        return;
      }

      const correctAnswers = sessionResults.filter(result => result.isCorrect).length;
      const incorrectAnswers = sessionResults.filter(result => !result.isCorrect).length;
      const skippedWords = 0; // Would be tracked separately
      const completionRate = (sessionResults.length / currentSession.settings.sessionSize) * 100;

      set((state) => {
        if (state.currentSession) {
          state.currentSession.progress = {
            currentIndex: sessionResults.length,
            correctAnswers,
            incorrectAnswers,
            skippedWords,
            completionRate,
          };
        }
      });
    },

    // Clear error
    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },

    // Reset learning state
    resetLearningState: () => {
      set((state) => {
        state.currentSession = null;
        state.currentWord = null;
        state.sessionResults = [];
        state.learningQueue = null;
        state.error = null;
        state.isLoading = false;
        state.isSubmitting = false;
      });
    },
  }))
);

// Selectors
export const useCurrentSession = () => useLearningStore((state) => state.currentSession);
export const useCurrentWord = () => useLearningStore((state) => state.currentWord);
export const useSessionResults = () => useLearningStore((state) => state.sessionResults);
export const useLearningQueue = () => useLearningStore((state) => state.learningQueue);
export const useLearningLoading = () => useLearningStore((state) => state.isLoading);
export const useLearningError = () => useLearningStore((state) => state.error);