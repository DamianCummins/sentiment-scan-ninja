
import { File, FileAnalysis, SentimentType, Tweet, UploadProgress } from '@/types';
import { toast } from '@/components/ui/sonner';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock files data
const mockFiles: File[] = [
  { id: '1', name: 'Product_Tweets.csv', size: 2500000, uploadedAt: new Date('2023-04-15') },
  { id: '2', name: 'Healthcare_Tweets.csv', size: 1800000, uploadedAt: new Date('2023-04-10') },
];

// Generate a random avatar URL
const getRandomAvatar = (username: string): string => {
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${username}&radius=50&backgroundColor=b6e3f4,c0aede,d1d4f9`;
};

// Generate mock tweets with sentiment
const generateMockTweets = (count: number, fileId: string): Tweet[] => {
  const sentiments: SentimentType[] = ['positive', 'neutral', 'negative'];
  const sentimentWeights = {
    '1': [0.6, 0.3, 0.1], // Product tweets have more positive sentiment
    '2': [0.3, 0.4, 0.3], // Healthcare tweets have more neutral sentiment
    '3': [0.2, 0.3, 0.5], // File 3 has more negative sentiment
    '4': [0.4, 0.4, 0.2], // File 4 has equal positive and neutral
    '5': [0.5, 0.2, 0.3], // File 5 has mostly positive
  };
  
  const tweetTemplates = {
    positive: [
      "Just got my hands on the new {product} 3000! The battery life is incredible, and the camera quality is out of this world! 📱 #TechLover #HappyCustomer",
      "Absolutely loving my new {product}! Customer service was exceptional and delivery was super fast. Will definitely buy again! 👍 #Recommended",
      "The {product} exceeded all my expectations. Worth every penny! 🌟 #FiveStars #Amazing",
      "My experience with {product} has been nothing short of amazing. Transformative technology at its best! 🚀 #GameChanger",
      "Cannot believe how good the new {product} is. It's intuitive, fast, and exactly what I needed! #Satisfied #GreatPurchase"
    ],
    neutral: [
      "The new {product} is decent. Good performance, but the design could be better. 👍 #TechReview #Meh",
      "Used the {product} for a week now. It does what it promises, nothing more, nothing less. #JustOkay",
      "The {product} works as expected. Not impressed, but not disappointed either. #Neutral #Average",
      "The {product} has some good features but also some drawbacks. Balanced experience overall. #MixedFeelings",
      "Got the {product} yesterday. It's functional and does the job, though nothing special to report. #Standard"
    ],
    negative: [
      "Bought the latest {product} and it's already glitching. Not impressed. 😒 #TechFail #Disappointed",
      "Customer service for {product} is terrible. Waited 45 minutes just to be hung up on. Never again. #BadExperience",
      "The {product} broke after just one week of normal use. Complete waste of money. #Refund #Angry",
      "Don't waste your money on the {product}. It's buggy, slow, and the company doesn't care about quality. #Avoid #Frustrated",
      "The new {product} update made everything worse. I can't even use basic features anymore. #Downgrade #Unusable"
    ]
  };
  
  const products = ["SuperPhone", "SmartWatch", "UltraLaptop", "MegaTablet", "PowerHeadphones", "TechGadget", "SmartDevice"];
  
  const weights = sentimentWeights[fileId as keyof typeof sentimentWeights] || [0.33, 0.33, 0.34];
  
  return Array(count).fill(0).map((_, index) => {
    // Determine sentiment based on weights
    const random = Math.random();
    let sentimentIndex: number;
    
    if (random < weights[0]) {
      sentimentIndex = 0; // positive
    } else if (random < weights[0] + weights[1]) {
      sentimentIndex = 1; // neutral
    } else {
      sentimentIndex = 2; // negative
    }
    
    const sentiment = sentiments[sentimentIndex];
    
    // Generate random username
    const usernames = ["happy_camper", "grumpygadget", "OnTheFence", "techreviewr", "gadgetlover", "deviceuser", "productfan"];
    const username = `@${usernames[Math.floor(Math.random() * usernames.length)]}${Math.floor(Math.random() * 1000)}`;
    
    // Generate random content based on sentiment
    const templates = tweetTemplates[sentiment];
    const template = templates[Math.floor(Math.random() * templates.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const content = template.replace("{product}", product);
    
    return {
      id: `tweet-${fileId}-${index}`,
      content,
      username,
      avatar: getRandomAvatar(username),
      sentiment
    };
  });
};

// Generate mock file analysis
const generateMockFileAnalysis = (fileId: string): FileAnalysis => {
  const file = mockFiles.find(f => f.id === fileId);
  if (!file) throw new Error("File not found");
  
  let tweetCount: number;
  if (fileId === '1') tweetCount = 3000;
  else if (fileId === '2') tweetCount = 2500;
  else tweetCount = 1000 + Math.floor(Math.random() * 2000);
  
  const tweets = generateMockTweets(Math.min(tweetCount, 50), fileId);
  
  // Calculate sentiment distribution
  const sentimentCounts = tweets.reduce((acc, tweet) => {
    acc[tweet.sentiment]++;
    return acc;
  }, { positive: 0, neutral: 0, negative: 0 });
  
  const sentimentDistribution = {
    positive: sentimentCounts.positive / tweets.length,
    neutral: sentimentCounts.neutral / tweets.length,
    negative: sentimentCounts.negative / tweets.length
  };
  
  return {
    id: fileId,
    fileName: file.name,
    totalTweets: tweetCount,
    sentimentDistribution,
    tweets
  };
};

export const apiService = {
  // Get all files
  getFiles: async (): Promise<File[]> => {
    await delay(800);
    return [...mockFiles];
  },
  
  // Get file analysis
  getFileAnalysis: async (fileId: string): Promise<FileAnalysis> => {
    await delay(1200);
    return generateMockFileAnalysis(fileId);
  },
  
  // Upload a new file
  uploadFile: async (file: File): Promise<UploadProgress> => {
    if (!file.name.endsWith('.csv')) {
      throw new Error('Only CSV files are allowed.');
    }
    
    const fileSize = file.size;
    const progressUpdates = 10;
    
    let progress = 0;
    
    for (let i = 0; i < progressUpdates; i++) {
      await delay(700);
      progress = Math.min((i + 1) / progressUpdates, 1) * fileSize;
      
      // Simulate progress updates
      const progressData: UploadProgress = {
        file: file.name,
        progress,
        total: fileSize,
        isComplete: i === progressUpdates - 1
      };
      
      // If it's the last update, add the file to mockFiles
      if (i === progressUpdates - 1) {
        const newFile = {
          id: (mockFiles.length + 1).toString(),
          name: file.name,
          size: fileSize,
          uploadedAt: new Date()
        };
        mockFiles.push(newFile);
        toast.success(`File ${file.name} uploaded successfully!`);
      }
      
      yield progressData;
    }
    
    return {
      file: file.name,
      progress: fileSize,
      total: fileSize,
      isComplete: true
    };
  }
};
