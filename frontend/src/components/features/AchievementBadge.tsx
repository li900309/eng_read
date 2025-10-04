import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/base';
import { Trophy, Star, Lock, Calendar } from 'lucide-react';
import { Achievement } from '@/types';
import { cn } from '@/utils/cn';

export interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  interactive?: boolean;
  onClick?: (achievement: Achievement) => void;
  className?: string;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  size = 'md',
  showProgress = true,
  interactive = true,
  onClick,
  className,
}) => {
  const sizes = {
    sm: {
      container: 'w-16 h-16',
      icon: 'text-xl',
      progress: 'w-4 h-4',
      text: 'text-xs',
    },
    md: {
      container: 'w-20 h-20',
      icon: 'text-2xl',
      progress: 'w-5 h-5',
      text: 'text-sm',
    },
    lg: {
      container: 'w-24 h-24',
      icon: 'text-3xl',
      progress: 'w-6 h-6',
      text: 'text-base',
    },
  };

  const currentSize = sizes[size];

  const getProgressPercentage = () => {
    if (achievement.isUnlocked) return 100;
    return Math.min(Math.max((achievement.progress.current / achievement.progress.target) * 100, 0), 100);
  };

  const getCategoryIcon = () => {
    const icons = {
      learning: <Book className={currentSize.icon} />,
      streak: <Calendar className={currentSize.icon} />,
      accuracy: <Target className={currentSize.icon} />,
      time: <Clock className={currentSize.icon} />,
      social: <Users className={currentSize.icon} />,
    };
    return icons[achievement.category] || <Star className={currentSize.icon} />;
  };

  const getCategoryColor = () => {
    const colors = {
      learning: 'from-blue-500 to-blue-600',
      streak: 'from-orange-500 to-orange-600',
      accuracy: 'from-green-500 to-green-600',
      time: 'from-purple-500 to-purple-600',
      social: 'from-pink-500 to-pink-600',
    };
    return colors[achievement.category] || colors.learning;
  };

  const handleBadgeClick = () => {
    if (interactive && onClick) {
      onClick(achievement);
    }
  };

  return (
    <motion.div
      className={cn(
        'relative flex flex-col items-center space-y-2 cursor-pointer group',
        className
      )}
      whileHover={interactive ? { scale: 1.05 } : {}}
      whileTap={interactive ? { scale: 0.95 } : {}}
      onClick={handleBadgeClick}
    >
      {/* Badge container */}
      <div
        className={cn(
          'relative rounded-full border-2 overflow-hidden',
          'transition-all duration-200',
          currentSize.container,
          achievement.isUnlocked
            ? cn(
                'bg-gradient-to-br',
                getCategoryColor(),
                'text-white shadow-lg',
                'group-hover:shadow-xl'
              )
            : 'bg-gray-200 text-gray-400 border-gray-300'
        )}
      >
        {/* Icon */}
        <div className="flex items-center justify-center h-full">
          {achievement.isUnlocked ? (
            getCategoryIcon()
          ) : (
            <Lock className={cn(currentSize.icon, 'text-gray-400')} />
          )}
        </div>

        {/* Progress ring (for incomplete achievements) */}
        {!achievement.isUnlocked && showProgress && (
          <div className="absolute inset-0">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(156, 163, 175, 0.3)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={283} // 2 * π * 45
                strokeDashoffset={283 * (1 - getProgressPercentage() / 100)}
                className="text-primary transition-all duration-300"
              />
            </svg>
          </div>
        )}

        {/* Glow effect for unlocked achievements */}
        {achievement.isUnlocked && (
          <div
            className={cn(
              'absolute inset-0 rounded-full',
              'bg-gradient-to-br',
              getCategoryColor(),
              'opacity-20 blur-md'
            )}
          />
        )}
      </div>

      {/* Progress text */}
      {showProgress && !achievement.isUnlocked && (
        <div className={cn('text-center', currentSize.text)}>
          <span className="font-medium text-foreground">
            {achievement.progress.current}
          </span>
          <span className="text-muted-foreground">
            /{achievement.progress.target}
          </span>
        </div>
      )}

      {/* Achievement name */}
      <div className={cn('text-center font-medium', currentSize.text)}>
        {achievement.name}
      </div>

      {/* Unlocked date */}
      {achievement.isUnlocked && achievement.unlockedAt && (
        <div className={cn('text-center text-muted-foreground', 'text-xs')}>
          {new Date(achievement.unlockedAt).toLocaleDateString('zh-CN')}
        </div>
      )}
    </motion.div>
  );
};

// Achievement grid component
export interface AchievementGridProps {
  achievements: Achievement[];
  layout?: 'grid' | 'list';
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  filter?: 'all' | 'unlocked' | 'locked';
  sortBy?: 'recent' | 'progress' | 'name';
  onAchievementClick?: (achievement: Achievement) => void;
  className?: string;
}

export const AchievementGrid: React.FC<AchievementGridProps> = ({
  achievements,
  layout = 'grid',
  size = 'md',
  showProgress = true,
  filter = 'all',
  sortBy = 'recent',
  onAchievementClick,
  className,
}) => {
  // Filter achievements
  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'unlocked') return achievement.isUnlocked;
    if (filter === 'locked') return !achievement.isUnlocked;
    return true;
  });

  // Sort achievements
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        const aDate = a.unlockedAt ? new Date(a.unlockedAt).getTime() : 0;
        const bDate = b.unlockedAt ? new Date(b.unlockedAt).getTime() : 0;
        return bDate - aDate;
      case 'progress':
        const aProgress = a.progress.percentage;
        const bProgress = b.progress.percentage;
        return bProgress - aProgress;
      case 'name':
        return a.name.localeCompare(b.name, 'zh-CN');
      default:
        return 0;
    }
  });

  if (layout === 'list') {
    return (
      <div className={cn('space-y-3', className)}>
        {sortedAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            showProgress={showProgress}
            onClick={onAchievementClick}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn(
      'grid gap-6',
      size === 'sm' ? 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8' :
      size === 'md' ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6' :
      'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
      className
    )}>
      {sortedAchievements.map((achievement) => (
        <AchievementBadge
          key={achievement.id}
          achievement={achievement}
          size={size}
          showProgress={showProgress}
          onClick={onAchievementClick}
        />
      ))}
    </div>
  );
};

// Achievement card component for list view
export interface AchievementCardProps {
  achievement: Achievement;
  showProgress?: boolean;
  onClick?: (achievement: Achievement) => void;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  showProgress = true,
  onClick,
}) => {
  const getCategoryColor = () => {
    const colors = {
      learning: 'border-blue-200 bg-blue-50',
      streak: 'border-orange-200 bg-orange-50',
      accuracy: 'border-green-200 bg-green-50',
      time: 'border-purple-200 bg-purple-50',
      social: 'border-pink-200 bg-pink-50',
    };
    return colors[achievement.category] || colors.learning;
  };

  return (
    <Card
      variant="outlined"
      hoverable={!!onClick}
      className="p-4"
      onClick={() => onClick?.(achievement)}
    >
      <CardContent className="p-0">
        <div className="flex items-center space-x-4">
          {/* Badge */}
          <AchievementBadge
            achievement={achievement}
            size="sm"
            showProgress={false}
            interactive={false}
          />

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground mb-1">
              {achievement.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {achievement.description}
            </p>

            {/* Progress */}
            {showProgress && !achievement.isUnlocked && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">进度</span>
                  <span className="font-medium text-foreground">
                    {achievement.progress.current} / {achievement.progress.target}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${achievement.progress.percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Unlocked date */}
            {achievement.isUnlocked && achievement.unlockedAt && (
              <div className="flex items-center gap-1 mt-2">
                <Trophy className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-muted-foreground">
                  获得于 {new Date(achievement.unlockedAt).toLocaleDateString('zh-CN')}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Import required icons
const Book = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const Target = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export {
  AchievementBadge,
  AchievementGrid,
  AchievementCard,
};