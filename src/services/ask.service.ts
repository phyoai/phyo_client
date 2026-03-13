import apiClient from './api';
import { AskSearchRequest, AskSearchResponse, ReelData } from './types';

export const askService = {
  // POST /api/ask - AI-powered search
  search: async (data: AskSearchRequest): Promise<AskSearchResponse> => {
    const response = await apiClient.post('/ask', data);
    return response.data.data;
  },

  // GET /api/ask/details - Get detailed results
  getDetails: async (query: string): Promise<any> => {
    const response = await apiClient.get('/ask/details', {
      params: { query }
    });
    return response.data.data;
  },

  // GET /api/ask/debug - Debug endpoint
  debug: async (query: string): Promise<any> => {
    const response = await apiClient.get('/ask/debug', {
      params: { query }
    });
    return response.data.data;
  },

  // GET /api/ask/test-brightdata - Test BrightData connection
  testBrightData: async (): Promise<any> => {
    const response = await apiClient.get('/ask/test-brightdata');
    return response.data.data;
  },

  // GET /api/ask/test-snapshot - Test Snapshot API
  testSnapshot: async (): Promise<any> => {
    const response = await apiClient.get('/ask/test-snapshot');
    return response.data.data;
  },

  // POST /api/ask/reel - Fetch Instagram reels
  fetchReels: async (query: string, limit?: number): Promise<ReelData[]> => {
    const response = await apiClient.post('/ask/reel', { query, limit });
    return response.data.data;
  },

  // POST /api/ask/advanced-query
  advancedQuery: async (query: string, filters?: any): Promise<any> => {
    const response = await apiClient.post('/ask/advanced-query', { query, filters });
    return response.data.data;
  },

  // GET /api/ask/trending
  getTrending: async (category?: string): Promise<any> => {
    const response = await apiClient.get('/ask/trending', {
      params: { category }
    });
    return response.data.data;
  }
};
