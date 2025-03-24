
import React from 'react';
import { Tweet, SentimentType } from '@/types';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';

interface TweetListProps {
  tweets: Tweet[];
  isLoading?: boolean;
}

const TweetList: React.FC<TweetListProps> = ({ tweets, isLoading = false }) => {
  // Function to get sentiment color
  const getSentimentColor = (sentiment: SentimentType): string => {
    switch (sentiment) {
      case 'positive': return 'bg-sentiment-positive';
      case 'neutral': return 'bg-sentiment-neutral';
      case 'negative': return 'bg-sentiment-negative';
      default: return 'bg-gray-300';
    }
  };
  
  // Function to get sentiment icon
  const getSentimentIcon = (sentiment: SentimentType) => {
    switch (sentiment) {
      case 'positive': return <div className="h-3 w-3 rounded-full bg-sentiment-positive" />;
      case 'neutral': return <div className="h-3 w-3 rounded-full bg-sentiment-neutral" />;
      case 'negative': return <div className="h-3 w-3 rounded-full bg-sentiment-negative" />;
      default: return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="tweet-card animate-pulse">
            <div className="flex">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
              <div className="flex-1 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (tweets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No tweets found</h3>
        <p className="text-sm text-gray-500">This file doesn't contain any tweets or they haven't been analyzed yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 animate-fade-in">
      {tweets.map((tweet) => (
        <Card key={tweet.id} className="tweet-card" tabIndex={0}>
          <div className="flex">
            <div className="mr-4 flex-shrink-0">
              {tweet.avatar ? (
                <img 
                  src={tweet.avatar} 
                  alt={`${tweet.username}'s avatar`} 
                  className="w-12 h-12 rounded-full"
                  loading="lazy"
                />
              ) : (
                <div className="avatar-placeholder w-12 h-12">
                  {tweet.username.charAt(1).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <div className="font-medium text-sm text-gray-600">{tweet.username}</div>
                <div className="flex items-center">
                  <span 
                    className={cn("text-xs px-2 py-0.5 rounded-full font-medium", {
                      "bg-green-100 text-green-800": tweet.sentiment === 'positive',
                      "bg-gray-100 text-gray-800": tweet.sentiment === 'neutral',
                      "bg-red-100 text-red-800": tweet.sentiment === 'negative',
                    })}
                    aria-label={`Sentiment: ${tweet.sentiment}`}
                  >
                    {tweet.sentiment.charAt(0).toUpperCase() + tweet.sentiment.slice(1)}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-800 mb-1">{tweet.content}</p>
              
              <div className="flex justify-between items-center mt-2">
                <div 
                  className="flex items-center"
                  aria-label={`Sentiment: ${tweet.sentiment}`}
                >
                  <div className={cn("w-3 h-3 rounded-full mr-2", getSentimentColor(tweet.sentiment))} />
                </div>
                
                {/* Empty div to maintain space */}
                <div></div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TweetList;
