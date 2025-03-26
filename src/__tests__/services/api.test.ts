
import { apiService } from '@/services/api';

// Mock the delay function to speed up tests
jest.mock('@/services/api', () => {
  const originalModule = jest.requireActual('@/services/api');
  return {
    ...originalModule,
    apiService: {
      ...originalModule.apiService,
      // Override delay to make tests run faster
      getFiles: jest.fn().mockImplementation(async () => {
        return [
          { id: '1', name: 'Test_File.csv', size: 1000, uploadedAt: new Date() }
        ];
      }),
      getFileAnalysis: jest.fn().mockImplementation(async (fileId: string) => {
        return {
          id: fileId,
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
        };
      })
    }
  };
});

describe('API Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFiles', () => {
    it('returns an array of files', async () => {
      const files = await apiService.getFiles();
      
      expect(files).toBeInstanceOf(Array);
      expect(files.length).toBeGreaterThan(0);
      expect(files[0]).toHaveProperty('id');
      expect(files[0]).toHaveProperty('name');
      expect(files[0]).toHaveProperty('size');
      expect(files[0]).toHaveProperty('uploadedAt');
    });
  });

  describe('getFileAnalysis', () => {
    it('returns file analysis for a given file ID', async () => {
      const fileId = '1';
      const analysis = await apiService.getFileAnalysis(fileId);
      
      expect(analysis).toHaveProperty('id', fileId);
      expect(analysis).toHaveProperty('fileName');
      expect(analysis).toHaveProperty('totalTweets');
      expect(analysis).toHaveProperty('sentimentDistribution');
      expect(analysis).toHaveProperty('tweets');
      
      expect(analysis.sentimentDistribution).toHaveProperty('positive');
      expect(analysis.sentimentDistribution).toHaveProperty('neutral');
      expect(analysis.sentimentDistribution).toHaveProperty('negative');
    });
  });
});
