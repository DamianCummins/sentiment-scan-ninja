
export interface File {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
}

export type SentimentType = 'positive' | 'neutral' | 'negative';

export interface SentimentDistribution {
  positive: number;
  neutral: number;
  negative: number;
}

export interface Tweet {
  id: string;
  content: string;
  username: string;
  avatar?: string;
  sentiment: SentimentType;
}

export interface FileAnalysis {
  id: string;
  fileName: string;
  totalTweets: number;
  sentimentDistribution: SentimentDistribution;
  tweets: Tweet[];
}

export interface UploadProgress {
  file: string;
  progress: number;
  total: number;
  isComplete: boolean;
}
