import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, Badge, Button } from '@/components/base';
import { Volume2, BookOpen, Star, Clock, Eye, EyeOff } from 'lucide-react';
import { Vocabulary } from '@/types';
import { cn } from '@/utils/cn';

export interface VocabularyCardProps {
  vocabulary: Vocabulary;
  showDefinition?: boolean;
  showTranslation?: boolean;
  showExample?: boolean;
  interactive?: boolean;
  onBookmark?: (vocabulary: Vocabulary) => void;
  onPlayAudio?: (vocabulary: Vocabulary) => void;
  onViewDetails?: (vocabulary: Vocabulary) => void;
  className?: string;
}

const VocabularyCard: React.FC<VocabularyCardProps> = ({
  vocabulary,
  showDefinition = true,
  showTranslation = true,
  showExample = true,
  interactive = true,
  onBookmark,
  onPlayAudio,
  onViewDetails,
  className,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showAllContent, setShowAllContent] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(vocabulary);
  };

  const handlePlayAudio = async () => {
    if (isPlaying || !vocabulary.audioUrl) return;

    setIsPlaying(true);
    try {
      onPlayAudio?.(vocabulary);

      // Simulate audio playing
      if (vocabulary.audioUrl) {
        const audio = new Audio(vocabulary.audioUrl);
        audio.play();
        audio.onended = () => setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      hard: 'bg-red-100 text-red-800 border-red-200',
      expert: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[difficulty as keyof typeof colors] || colors.medium;
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      easy: '简单',
      medium: '中等',
      hard: '困难',
      expert: '专家',
    };
    return labels[difficulty as keyof typeof labels] || labels.medium;
  };

  return (
    <Card
      variant="elevated"
      hoverable={interactive}
      className={cn(
        'relative overflow-hidden',
        'transition-all duration-300',
        interactive && 'cursor-pointer',
        className
      )}
      onClick={() => interactive && onViewDetails?.(vocabulary)}
    >
      {/* Difficulty indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

      <CardContent className="p-6">
        {/* Header with word and actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {vocabulary.word}
            </h3>
            {vocabulary.pronunciation && (
              <p className="text-lg text-muted-foreground font-mono mb-2">
                {vocabulary.pronunciation}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 ml-4">
            {vocabulary.audioUrl && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayAudio();
                }}
                disabled={isPlaying}
                className="h-8 w-8"
              >
                <Volume2 className={cn('h-4 w-4', isPlaying && 'animate-pulse')} />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleBookmark();
              }}
              className="h-8 w-8"
            >
              <Star
                className={cn(
                  'h-4 w-4',
                  isBookmarked && 'fill-yellow-400 text-yellow-400'
                )}
              />
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-4">
          <Badge
            variant="outline"
            className={getDifficultyColor(vocabulary.difficulty)}
          >
            {getDifficultyLabel(vocabulary.difficulty)}
          </Badge>

          {vocabulary.frequency && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              频率: {vocabulary.frequency}
            </Badge>
          )}

          {vocabulary.category && (
            <Badge variant="outline" style={{ backgroundColor: vocabulary.category.color }}>
              {vocabulary.category.name}
            </Badge>
          )}
        </div>

        {/* Tags */}
        {vocabulary.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {vocabulary.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="space-y-3">
          {showDefinition && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                定义
              </h4>
              <p className="text-sm text-foreground leading-relaxed">
                {vocabulary.definition}
              </p>
            </div>
          )}

          {showTranslation && vocabulary.translation && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">
                翻译
              </h4>
              <p className="text-sm text-foreground leading-relaxed">
                {vocabulary.translation}
              </p>
            </div>
          )}

          {showExample && vocabulary.example && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">
                例句
              </h4>
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                {vocabulary.example}
              </p>
            </div>
          )}
        </div>

        {/* Toggle content button */}
        {interactive && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowAllContent(!showAllContent);
              }}
              className="w-full"
            >
              {showAllContent ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  隐藏详细内容
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  显示详细内容
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>

      {/* Image preview */}
      {vocabulary.imageUrl && (
        <div className="absolute bottom-4 right-4 w-16 h-16 rounded-lg overflow-hidden shadow-medium">
          <img
            src={vocabulary.imageUrl}
            alt={vocabulary.word}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </Card>
  );
};

// Compact version for lists
export interface VocabularyCardCompactProps {
  vocabulary: Vocabulary;
  showTranslation?: boolean;
  onSelect?: (vocabulary: Vocabulary) => void;
  selected?: boolean;
  className?: string;
}

export const VocabularyCardCompact: React.FC<VocabularyCardCompactProps> = ({
  vocabulary,
  showTranslation = false,
  onSelect,
  selected = false,
  className,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800',
      expert: 'bg-purple-100 text-purple-800',
    };
    return colors[difficulty as keyof typeof colors] || colors.medium;
  };

  return (
    <motion.div
      className={cn(
        'p-4 border rounded-lg cursor-pointer transition-all duration-200',
        'hover:border-primary/50 hover:bg-accent/50',
        selected && 'border-primary bg-primary/5',
        className
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onSelect?.(vocabulary)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-foreground">{vocabulary.word}</h4>
            <Badge
              variant="secondary"
              className={cn('text-xs', getDifficultyColor(vocabulary.difficulty))}
            >
              {vocabulary.difficulty}
            </Badge>
          </div>

          {vocabulary.pronunciation && (
            <p className="text-sm text-muted-foreground font-mono mb-1">
              {vocabulary.pronunciation}
            </p>
          )}

          <p className="text-sm text-muted-foreground line-clamp-1">
            {vocabulary.definition}
          </p>

          {showTranslation && vocabulary.translation && (
            <p className="text-sm text-foreground mt-1">
              {vocabulary.translation}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          {vocabulary.audioUrl && (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Volume2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export { VocabularyCard, VocabularyCardCompact };