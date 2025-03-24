import React, { useState, useEffect } from 'react';
import { File, FileAnalysis } from '@/types';
import { apiService } from '@/services/api';
import MainLayout from '@/layouts/MainLayout';
import FileExplorer from '@/components/FileExplorer';
import SentimentSummary from '@/components/SentimentSummary';
import TweetList from '@/components/TweetList';
import ProgressBar from '@/components/ProgressBar';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileAnalysis, setFileAnalysis] = useState<FileAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setLoading(true);
    
    try {
      const analysis = await apiService.getFileAnalysis(file.id);
      
      // Add a small delay for animation purposes
      setTimeout(() => {
        setFileAnalysis(analysis);
        setLoading(false);
      }, 500);
    } catch (error) {
      toast.error('Failed to load file analysis');
      setLoading(false);
    }
  };
  
  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const files = await apiService.getFiles();
        if (files.length > 0) {
          handleFileSelect(files[0]);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };
    
    loadInitialData();
  }, []);
  
  return (
    <MainLayout
      header={
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {selectedFile && fileAnalysis 
              ? `Sentiment Analysis | ${selectedFile.name}`
              : 'Sentiment Analysis'}
          </h1>
        </div>
      }
      sidebar={
        <FileExplorer 
          onFileSelect={handleFileSelect} 
          selectedFileId={selectedFile?.id}
        />
      }
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading sentiment analysis...</p>
        </div>
      ) : fileAnalysis ? (
        <div className="space-y-10 animate-fade-in">
          <section>
            <h2 className="text-xl font-semibold mb-6">Summary</h2>
            <SentimentSummary 
              totalTweets={fileAnalysis.totalTweets} 
              distribution={fileAnalysis.sentimentDistribution}
            />
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-6">Tweets</h2>
            <TweetList tweets={fileAnalysis.tweets} />
          </section>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full py-20 text-center max-w-md mx-auto">
          <h2 className="text-xl font-medium mb-3">Welcome to Sentiment Analysis</h2>
          <p className="text-muted-foreground mb-6">
            Upload a CSV file containing tweets or select an existing file from the sidebar to begin analyzing sentiment data.
          </p>
        </div>
      )}
    </MainLayout>
  );
};

export default Index;
