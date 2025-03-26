
import React from 'react';
import { render, screen } from '@testing-library/react';
import TweetList from '@/components/TweetList';
import { Tweet } from '@/types';

describe('TweetList Component', () => {
  const mockTweets: Tweet[] = [
    {
      id: '1',
      content: 'This is a positive tweet',
      username: '@user1',
      sentiment: 'positive',
      avatar: 'https://example.com/avatar1.jpg'
    },
    {
      id: '2',
      content: 'This is a neutral tweet',
      username: '@user2',
      sentiment: 'neutral',
      avatar: 'https://example.com/avatar2.jpg'
    },
    {
      id: '3',
      content: 'This is a negative tweet',
      username: '@user3',
      sentiment: 'negative',
      avatar: 'https://example.com/avatar3.jpg'
    }
  ];

  it('renders the component with correct number of tweets', () => {
    render(<TweetList tweets={mockTweets} />);
    
    // Check if all tweets are rendered
    expect(screen.getAllByRole('article')).toHaveLength(3);
  });

  it('displays tweet content correctly', () => {
    render(<TweetList tweets={mockTweets} />);
    
    // Check if tweet content is displayed
    expect(screen.getByText('This is a positive tweet')).toBeInTheDocument();
    expect(screen.getByText('This is a neutral tweet')).toBeInTheDocument();
    expect(screen.getByText('This is a negative tweet')).toBeInTheDocument();
  });

  it('displays usernames correctly', () => {
    render(<TweetList tweets={mockTweets} />);
    
    // Check if usernames are displayed
    expect(screen.getByText('@user1')).toBeInTheDocument();
    expect(screen.getByText('@user2')).toBeInTheDocument();
    expect(screen.getByText('@user3')).toBeInTheDocument();
  });
});
