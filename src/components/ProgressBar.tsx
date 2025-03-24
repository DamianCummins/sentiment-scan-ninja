
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  total: number;
  showLabel?: boolean;
  className?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  unit?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  total,
  showLabel = true,
  className,
  color = 'bg-primary',
  size = 'md',
  unit = 'GB'
}) => {
  const percentage = Math.min(Math.round((progress / total) * 100), 100);
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  const formatSize = (bytes: number): string => {
    if (unit === 'GB') {
      return (bytes / (1024 * 1024 * 1024)).toFixed(1);
    }
    if (unit === 'MB') {
      return (bytes / (1024 * 1024)).toFixed(1);
    }
    return bytes.toString();
  };
  
  return (
    <div className={cn('w-full space-y-1', className)}>
      <div className={cn('bg-gray-200 rounded-full overflow-hidden', sizeClasses[size])}>
        <div 
          className={cn('transition-all duration-500 ease-out rounded-full', color)} 
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{formatSize(progress)}/{formatSize(total)} {unit}</span>
          <span>{percentage}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
