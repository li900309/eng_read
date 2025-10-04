import { useCallback, useEffect } from 'react';
import { useLearningStore, useAuthStore } from '@/store';
import { SessionSettings, SearchParams } from '@/types';

export const useLearning = () => {
  const {
    currentSession,
    currentWord,
    sessionResults,
    learningQueue,
    isLoading,
    isSubmitting,
    error,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    abandonSession,
    nextWord,
    previousWord,
    submitAnswer,
    skipWord,
    loadLearningQueue,
    refreshQueue,
    clearError,
    updateSessionProgress,
  } = useLearningStore();

  const { isAuthenticated } = useAuthStore();

  // Load learning queue on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && !learningQueue) {
      loadLearningQueue();
    }
  }, [isAuthenticated, learningQueue, loadLearningQueue]);

  // Start a new learning session
  const handleStartSession = useCallback(async (settings: SessionSettings) => {
    try {
      await startSession(settings);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to start session',
      };
    }
  }, [startSession]);

  // Submit answer with validation
  const handleSubmitAnswer = useCallback(async (
    vocabularyId: number,
    isCorrect: boolean,
    confidence: 'low' | 'medium' | 'high',
    timeSpent: number
  ) => {
    try {
      await submitAnswer(vocabularyId, isCorrect, confidence, timeSpent);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit answer',
      };
    }
  }, [submitAnswer]);

  // Calculate session statistics
  const getSessionStats = useCallback(() => {
    if (!currentSession) {
      return {
        totalWords: 0,
        completedWords: 0,
        correctAnswers: 0,
        accuracy: 0,
        timeSpent: 0,
        progress: 0,
      };
    }

    const correctAnswers = sessionResults.filter(result => result.isCorrect).length;
    const accuracy = sessionResults.length > 0 ? (correctAnswers / sessionResults.length) * 100 : 0;
    const progress = currentSession.progress?.completionRate || 0;

    return {
      totalWords: currentSession.settings.sessionSize,
      completedWords: sessionResults.length,
      correctAnswers,
      accuracy: Math.round(accuracy),
      timeSpent: currentSession.progress?.currentIndex ?
        sessionResults.reduce((total, result) => total + result.timeSpent, 0) : 0,
      progress: Math.round(progress),
    };
  }, [currentSession, sessionResults]);

  // Check if session can be continued
  const canContinueSession = useCallback(() => {
    return currentSession?.status === 'active' &&
           sessionResults.length < currentSession.settings.sessionSize;
  }, [currentSession, sessionResults]);

  // Check if session is completed
  const isSessionCompleted = useCallback(() => {
    return currentSession?.status === 'completed' ||
           (currentSession && sessionResults.length >= currentSession.settings.sessionSize);
  }, [currentSession, sessionResults]);

  // Get current word index
  const getCurrentWordIndex = useCallback(() => {
    return sessionResults.length;
  }, [sessionResults]);

  // Get session completion percentage
  const getCompletionPercentage = useCallback(() => {
    if (!currentSession) return 0;
    return (sessionResults.length / currentSession.settings.sessionSize) * 100;
  }, [currentSession, sessionResults]);

  // Calculate estimated time remaining
  const getEstimatedTimeRemaining = useCallback(() => {
    if (!currentSession || sessionResults.length === 0) return 0;

    const averageTimePerWord = sessionResults.reduce(
      (total, result) => total + result.timeSpent, 0
    ) / sessionResults.length;

    const remainingWords = currentSession.settings.sessionSize - sessionResults.length;
    return Math.round(remainingWords * averageTimePerWord);
  }, [currentSession, sessionResults]);

  // Get current difficulty distribution
  const getDifficultyDistribution = useCallback(() => {
    if (!learningQueue) return { easy: 0, medium: 0, hard: 0, expert: 0 };

    const distribution = { easy: 0, medium: 0, hard: 0, expert: 0 };

    learningQueue.newWords.forEach(word => {
      distribution[word.difficulty]++;
    });

    learningQueue.reviewWords.forEach(word => {
      distribution[word.difficulty]++;
    });

    learningQueue.priorityWords.forEach(word => {
      distribution[word.difficulty]++;
    });

    return distribution;
  }, [learningQueue]);

  // Format time display
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Get learning streak information
  const getLearningStreak = useCallback(() => {
    // This would typically come from user statistics
    // For now, return a placeholder implementation
    return {
      currentStreak: 0,
      longestStreak: 0,
      streakGoal: 7,
    };
  }, []);

  // Refresh learning queue with optional parameters
  const refreshLearningQueue = useCallback(async (params?: SearchParams) => {
    try {
      await loadLearningQueue(params);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to refresh queue',
      };
    }
  }, [loadLearningQueue]);

  return {
    // State
    currentSession,
    currentWord,
    sessionResults,
    learningQueue,
    isLoading,
    isSubmitting,
    error,

    // Actions
    startSession: handleStartSession,
    pauseSession,
    resumeSession,
    completeSession,
    abandonSession,
    nextWord,
    previousWord,
    submitAnswer: handleSubmitAnswer,
    skipWord,
    loadLearningQueue,
    refreshQueue,
    clearError,
    updateSessionProgress,

    // Computed values
    sessionStats: getSessionStats(),
    canContinueSession: canContinueSession(),
    isSessionCompleted: isSessionCompleted(),
    currentWordIndex: getCurrentWordIndex(),
    completionPercentage: getCompletionPercentage(),
    estimatedTimeRemaining: getEstimatedTimeRemaining(),
    difficultyDistribution: getDifficultyDistribution(),
    learningStreak: getLearningStreak(),

    // Utilities
    formatTime,
    refreshLearningQueue,
  };
};