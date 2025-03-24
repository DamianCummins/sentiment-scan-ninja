
import React from 'react';
import { SentimentDistribution } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SentimentSummaryProps {
  totalTweets: number;
  distribution: SentimentDistribution;
  className?: string;
}

const SentimentSummary: React.FC<SentimentSummaryProps> = ({
  totalTweets,
  distribution,
  className
}) => {
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };
  
  const renderBar = (label: string, value: number, color: string) => {
    const percentage = Math.round(value * 100);
    
    return (
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{label}</span>
          <span className="text-muted-foreground">{percentage}%</span>
        </div>
        <div className="sentiment-bar">
          <div 
            className={cn("sentiment-bar-progress", color)} 
            style={{ width: `${percentage}%` }} 
            aria-label={`${label} sentiment: ${percentage}%`}
          />
        </div>
      </div>
    );
  };
  
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
      <Card className="card-glass">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Tweets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{formatNumber(totalTweets)}</p>
        </CardContent>
      </Card>
      
      <Card className="card-glass">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Sentiment Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderBar('Positive', distribution.positive, 'bg-sentiment-positive')}
          {renderBar('Neutral', distribution.neutral, 'bg-sentiment-neutral')}
          {renderBar('Negative', distribution.negative, 'bg-sentiment-negative')}
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentSummary;
