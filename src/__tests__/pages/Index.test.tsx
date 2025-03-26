
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Index from '@/pages/Index';
import { apiService } from '@/services/api';

// Mock the API service
jest.mock('@/services/api');
jest.mock('@/components/FileExplorer', () => () => <div data-testid="file-explorer">File Explorer</div>);
jest.mock('@/components/SentimentSummary', () => ({ totalTweets, distribution }: any) => (
  <div data-testid="sentiment-summary">
    Sentiment Summary - Total: {totalTweets}
  </div>
));
jest.mock('@/components/TweetList', () => ({ tweets }: any) => (
  <div data-testid="tweet-list">
    Tweet List - Count: {tweets.length}
  </div>
));

describe('Index Page', () => {
  beforeEach(() => {
    // Setup mocks
    (apiService.getFiles as jest.Mock).mockResolvedValue([
      { id: '1', name: 'Test_File.csv', size: 1000, uploadedAt: new Date() }
    ]);
    
    (apiService.getFileAnalysis as jest.Mock).mockResolvedValue({
      id: '1',
      fileName: 'Test_File.csv',
      totalTweets: 100,
      sentimentDistribution: {
        positive: 0.5,
        neutral: 0.3,
        negative: 0.2
      },
      tweets: [
        {
          id: '1',
          content: 'Test tweet',
          username: '@testuser',
          sentiment: 'positive'
        }
      ]
    });
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main components', async () => {
    render(<Index />);
    
    // Check for loading state first
    expect(screen.getByText(/Loading sentiment analysis/i)).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId('file-explorer')).toBeInTheDocument();
      expect(screen.getByTestId('sentiment-summary')).toBeInTheDocument();
      expect(screen.getByTestId('tweet-list')).toBeInTheDocument();
    });
  });

  it('calls the API to get files and analysis on initial load', async () => {
    render(<Index />);
    
    await waitFor(() => {
      expect(apiService.getFiles).toHaveBeenCalledTimes(1);
      expect(apiService.getFileAnalysis).toHaveBeenCalledTimes(1);
      expect(apiService.getFileAnalysis).toHaveBeenCalledWith('1');
    });
  });
});
