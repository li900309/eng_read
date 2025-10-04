import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface QuizOptionProps {
  id: string;
  letter: string;
  content: React.ReactNode;
  selected?: boolean;
  correct?: boolean;
  incorrect?: boolean;
  disabled?: boolean;
  showResult?: boolean;
  onClick?: (id: string) => void;
  className?: string;
}

const QuizOption: React.FC<QuizOptionProps> = ({
  id,
  letter,
  content,
  selected = false,
  correct = false,
  incorrect = false,
  disabled = false,
  showResult = false,
  onClick,
  className,
}) => {
  const handleClick = () => {
    if (disabled || !onClick) return;
    onClick(id);
  };

  const getStatusStyles = () => {
    if (!showResult) {
      return selected
        ? 'border-primary bg-primary/10'
        : 'border-border bg-card hover:border-primary/50 hover:bg-accent/50';
    }

    if (correct) {
      return 'border-green-500 bg-green-50 text-green-800';
    }

    if (incorrect) {
      return 'border-red-500 bg-red-50 text-red-800';
    }

    return 'border-border bg-card opacity-60';
  };

  const getLetterStyles = () => {
    if (!showResult) {
      return selected
        ? 'bg-primary text-primary-foreground'
        : 'bg-muted text-muted-foreground';
    }

    if (correct) {
      return 'bg-green-500 text-white';
    }

    if (incorrect) {
      return 'bg-red-500 text-white';
    }

    return 'bg-muted text-muted-foreground';
  };

  return (
    <motion.div
      className={cn(
        'relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200',
        getStatusStyles(),
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      whileHover={!disabled && !showResult ? { scale: 1.01 } : {}}
      whileTap={!disabled && !showResult ? { scale: 0.99 } : {}}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-selected={selected}
      aria-disabled={disabled}
    >
      {/* Option letter */}
      <div
        className={cn(
          'absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
          getLetterStyles()
        )}
      >
        {letter}
      </div>

      {/* Content */}
      <div className="pl-12">
        {content}
      </div>

      {/* Result indicator */}
      {showResult && (correct || incorrect) && (
        <div className="absolute right-4 top-4">
          {correct ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
              <svg
                className="h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
              <svg
                className="h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Multiple choice quiz component
export interface MultipleChoiceQuizProps {
  question: string;
  options: Array<{
    id: string;
    content: React.ReactNode;
  }>;
  selectedAnswer?: string;
  correctAnswer?: string;
  showResult?: boolean;
  disabled?: boolean;
  onAnswerSelect?: (answerId: string) => void;
  className?: string;
}

export const MultipleChoiceQuiz: React.FC<MultipleChoiceQuizProps> = ({
  question,
  options,
  selectedAnswer,
  correctAnswer,
  showResult = false,
  disabled = false,
  onAnswerSelect,
  className,
}) => {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Question */}
      <div className="text-lg font-semibold text-foreground">
        {question}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <QuizOption
            key={option.id}
            id={option.id}
            letter={letters[index] || String.fromCharCode(65 + index)}
            content={option.content}
            selected={selectedAnswer === option.id}
            correct={showResult && option.id === correctAnswer}
            incorrect={
              showResult &&
              selectedAnswer === option.id &&
              option.id !== correctAnswer
            }
            disabled={disabled || showResult}
            showResult={showResult}
            onClick={onAnswerSelect}
          />
        ))}
      </div>

      {/* Result feedback */}
      {showResult && selectedAnswer && (
        <div className="mt-6 p-4 rounded-lg border">
          {selectedAnswer === correctAnswer ? (
            <div className="flex items-center gap-2 text-green-700">
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">正确！</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-700">
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">不正确</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// True/False quiz component
export interface TrueFalseQuizProps {
  question: string;
  selectedAnswer?: boolean;
  correctAnswer?: boolean;
  showResult?: boolean;
  disabled?: boolean;
  onAnswerSelect?: (answer: boolean) => void;
  className?: string;
}

export const TrueFalseQuiz: React.FC<TrueFalseQuizProps> = ({
  question,
  selectedAnswer,
  correctAnswer,
  showResult = false,
  disabled = false,
  onAnswerSelect,
  className,
}) => {
  const options = [
    { id: 'true', label: '正确', content: '✓ 正确' },
    { id: 'false', label: '错误', content: '✗ 错误' },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Question */}
      <div className="text-lg font-semibold text-foreground">
        {question}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => (
          <QuizOption
            key={option.id}
            id={option.id}
            letter=""
            content={
              <div className="text-center font-medium">
                {option.content}
              </div>
            }
            selected={
              selectedAnswer === (option.id === 'true')
            }
            correct={
              showResult && correctAnswer === (option.id === 'true')
            }
            incorrect={
              showResult &&
              selectedAnswer === (option.id === 'true') &&
              correctAnswer !== (option.id === 'true')
            }
            disabled={disabled || showResult}
            showResult={showResult}
            onClick={() => onAnswerSelect?.(option.id === 'true')}
          />
        ))}
      </div>

      {/* Result feedback */}
      {showResult && selectedAnswer !== undefined && (
        <div className="mt-6 p-4 rounded-lg border">
          {selectedAnswer === correctAnswer ? (
            <div className="flex items-center gap-2 text-green-700">
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">正确！</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-700">
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">不正确</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { QuizOption, MultipleChoiceQuiz, TrueFalseQuiz };