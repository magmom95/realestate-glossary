const LEVEL_CLASS: Record<string, string> = {
  '입문': 'badge-beginner',
  '중급': 'badge-intermediate',
  '고급': 'badge-advanced',
};

interface LevelBadgeProps {
  level: string;
  className?: string;
}

export default function LevelBadge({ level, className = '' }: LevelBadgeProps) {
  return (
    <span className={`badge ${LEVEL_CLASS[level] || 'badge-beginner'} ${className}`}>
      {level}
    </span>
  );
}
