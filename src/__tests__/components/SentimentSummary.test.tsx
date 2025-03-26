
import React from 'react';
import { render, screen } from '@testing-library/react';
import SentimentSummary from '@/components/SentimentSummary';

describe('SentimentSummary Component', () => {
  const mockDistribution = {
    positive: 0.5,
    neutral: 0.3,
    negative: 0.2
  };

  it('renders the component with correct total count', () => {
    render(<SentimentSummary totalTweets={1000} distribution={mockDistribution} />);
    
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('Total Tweets')).toBeInTheDocument();
  });

  it('displays the correct sentiment percentages', () => {
    render(<SentimentSummary totalTweets={1000} distribution={mockDistribution} />);
    
    // Check if percentages are displayed correctly
    expect(screen.getByText('50%')).toBeInTheDocument(); // Positive
    expect(screen.getByText('30%')).toBeInTheDocument(); // Neutral
    expect(screen.getByText('20%')).toBeInTheDocument(); // Negative
  });
});
