import React from 'react';
import { motion } from 'framer-motion';
import { Progress, CircularProgress } from '@/components/base';
import { cn } from '@/utils/cn';

export interface LearningProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  showPercentage?: boolean;
  showTimeRemaining?: boolean;
  timeRemaining?: number;
  variant?: 'linear' | 'circular';
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

const LearningProgressBar: React.FC<LearningProgressBarProps> = ({
  current,
  total,
  showLabel = true,
  showPercentage = true,
  showTimeRemaining = false,
  timeRemaining,
  variant = 'linear',
  size = 'md',
  color = 'default',
  className,
}) => {
  const percentage = Math.min(Math.max((current / total) * 100, 0), 100);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'default';
    if (percentage >= 40) return 'warning';
    return 'error';
  };

  const progressColor = color === 'default' ? getStatusColor() : color;

  if (variant === 'circular') {
    const circularSizes = {
      sm: 80,
      md: 120,
      lg: 160,
    };

    return (
      <div className={cn('flex flex-col items-center space-y-4', className)}>
        <CircularProgress
          value={percentage}
          size={circularSizes[size]}
          strokeWidth={size === 'sm' ? 6 : size === 'md' ? 8 : 10}
          variant={progressColor}
          showLabel={showLabel || showPercentage}
          label={showLabel ? `${current}/${total}` : undefined}
        />

        {(showLabel || showTimeRemaining) && (
          <div className="text-center space-y-1">
            {showLabel && (
              <div className="text-sm font-medium text-foreground">
                进度: {current} / {total}
              </div>
            )}

            {showTimeRemaining && timeRemaining && (
              <div className="text-xs text-muted-foreground">
                剩余时间: {formatTime(timeRemaining)}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Header with label and time */}
      {(showLabel || showTimeRemaining) && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {showLabel && (
              <span className="font-medium text-foreground">
                {current} / {total}
              </span>
            )}
            {showPercentage && (
              <span className="text-muted-foreground">
                ({Math.round(percentage)}%)
              </span>
            )}
          </div>

          {showTimeRemaining && timeRemaining && (
            <span className="text-muted-foreground">
              剩余: {formatTime(timeRemaining)}
            </span>
          )}
        </div>
      )}

      {/* Progress bar */}
      <Progress
        value={percentage}
        max={100}
        size={size}
        variant={progressColor}
        animated
      />
    </div>
  );
};

// Session progress tracker
export interface SessionProgressTrackerProps {
  sessionData: {
    currentIndex: number;
    totalWords: number;
    correctAnswers: number;
    incorrectAnswers: number;
    skippedWords: number;
    timeSpent: number;
    estimatedTimeRemaining?: number;
  };
  showDetails?: boolean;
  className?: string;
}

export const SessionProgressTracker: React.FC<SessionProgressTrackerProps> = ({
  sessionData,
  showDetails = true,
  className,
}) => {
  const {
    currentIndex,
    totalWords,
    correctAnswers,
    incorrectAnswers,
    skippedWords,
    timeSpent,
    estimatedTimeRemaining,
  } = sessionData;

  const completionRate = (currentIndex / totalWords) * 100;
  const accuracy = currentIndex > 0 ? (correctAnswers / currentIndex) * 100 : 0;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main progress */}
      <LearningProgressBar
        current={currentIndex}
        total={totalWords}
        showLabel={true}
        showPercentage={true}
        showTimeRemaining={!!estimatedTimeRemaining}
        timeRemaining={estimatedTimeRemaining}
        variant="linear"
        size="md"
      />

      {/* Detailed stats */}
      {showDetails && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            className="text-center p-3 rounded-lg bg-green-50 border border-green-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-2xl font-bold text-green-700">
              {correctAnswers}
            </div>
            <div className="text-xs text-green-600">正确</div>
          </motion.div>

          <motion.div
            className="text-center p-3 rounded-lg bg-red-50 border border-red-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-2xl font-bold text-red-700">
              {incorrectAnswers}
            </div>
            <div className="text-xs text-red-600">错误</div>
          </motion.div>

          <motion.div
            className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-2xl font-bold text-blue-700">
              {Math.round(accuracy)}%
            </div>
            <div className="text-xs text-blue-600">准确率</div>
          </motion.div>

          <motion.div
            className="text-center p-3 rounded-lg bg-gray-50 border border-gray-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-2xl font-bold text-gray-700">
              {formatTime(timeSpent)}
            </div>
            <div className="text-xs text-gray-600">用时</div>
          </motion.div>
        </div>
      )}

      {/* Skip indicator */}
      {skippedWords > 0 && (
        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            已跳过 {skippedWords} 个单词
          </span>
        </div>
      )}
    </div>
  );
};

// Word progress indicators
export interface WordProgressIndicatorProps {
  words: Array<{
    id: string;
    status: 'pending' | 'current' | 'correct' | 'incorrect' | 'skipped';
  }>;
  compact?: boolean;
  className?: string;
}

export const WordProgressIndicator: React.FC<WordProgressIndicatorProps> = ({
  words,
  compact = false,
  className,
}) => {
  const getStatusColors = (status: string) => {
    const colors = {
      pending: 'bg-gray-200',
      current: 'bg-blue-500 animate-pulse',
      correct: 'bg-green-500',
      incorrect: 'bg-red-500',
      skipped: 'bg-yellow-500',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusLabels = (status: string) => {
    const labels = {
      pending: '待答',
      current: '当前',
      correct: '正确',
      incorrect: '错误',
      skipped: '跳过',
    };
    return labels[status as keyof typeof labels] || labels.pending;
  };

  const getStatusCounts = () => {
    return words.reduce((acc, word) => {
      acc[word.status] = (acc[word.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const statusCounts = getStatusCounts();

  if (compact) {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="flex items-center gap-2">
            <div className={cn('w-3 h-3 rounded-full', getStatusColors(status))} />
            <span className="text-xs text-muted-foreground">
              {getStatusLabels(status)}: {count}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Progress dots */}
      <div className="flex flex-wrap gap-2">
        {words.map((word, index) => (
          <div
            key={word.id}
            className={cn(
              'w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-medium',
              getStatusColors(word.status),
              word.status === 'current' && 'ring-2 ring-blue-300'
            )}
            title={`${getStatusLabels(word.status)} - 第 ${index + 1} 题`}
          >
            {index + 1}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="flex items-center gap-1">
            <div className={cn('w-3 h-3 rounded-full', getStatusColors(status))} />
            <span className="text-muted-foreground">
              {getStatusLabels(status)} ({count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export {
  LearningProgressBar,
  SessionProgressTracker,
  WordProgressIndicator,
};