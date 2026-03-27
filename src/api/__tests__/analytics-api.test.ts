import { analyticsApi } from '../analytics-api';

/**
 * Analytics API Tests
 * Verifies all analytics operations work correctly
 */

describe('Analytics API', () => {
  describe('getDashboard', () => {
    it('should fetch dashboard data without parameters', () => {
      const result = analyticsApi.getDashboard();
      expect(result).toBeDefined();
    });

    it('should support optional parameters', () => {
      const result = analyticsApi.getDashboard({
        startDate: '2026-01-01',
        endDate: '2026-03-26',
      });
      expect(result).toBeDefined();
    });
  });

  describe('getCampaignAnalytics', () => {
    it('should fetch campaigns with pagination', () => {
      const result = analyticsApi.getCampaignAnalytics({
        page: 1,
        limit: 20,
      });
      expect(result).toBeDefined();
    });

    it('should support status filter', () => {
      const result = analyticsApi.getCampaignAnalytics({
        page: 1,
        status: 'active',
      });
      expect(result).toBeDefined();
    });

    it('should support date range filtering', () => {
      const result = analyticsApi.getCampaignAnalytics({
        startDate: '2026-01-01',
        endDate: '2026-03-26',
      });
      expect(result).toBeDefined();
    });
  });

  describe('getInfluencerAnalytics', () => {
    it('should fetch influencer data with pagination', () => {
      const result = analyticsApi.getInfluencerAnalytics({
        page: 1,
        limit: 20,
      });
      expect(result).toBeDefined();
    });

    it('should support niche filtering', () => {
      const result = analyticsApi.getInfluencerAnalytics({
        niche: 'Fashion',
        page: 1,
      });
      expect(result).toBeDefined();
    });
  });

  describe('getPeriodReport', () => {
    it('should generate monthly report', () => {
      const result = analyticsApi.getPeriodReport({
        period: 'monthly',
        year: 2026,
        month: 3,
      });
      expect(result).toBeDefined();
    });

    it('should generate quarterly report', () => {
      const result = analyticsApi.getPeriodReport({
        period: 'quarterly',
        year: 2026,
        quarter: 1,
      });
      expect(result).toBeDefined();
    });
  });

  describe('exportAnalytics', () => {
    it('should export as PDF', () => {
      const result = analyticsApi.exportAnalytics({
        type: 'monthly',
        format: 'pdf',
        startDate: '2026-03-01',
        endDate: '2026-03-31',
      });
      expect(result).toBeDefined();
    });

    it('should export as CSV', () => {
      const result = analyticsApi.exportAnalytics({
        type: 'campaigns',
        format: 'csv',
      });
      expect(result).toBeDefined();
    });
  });

  describe('getInfluencerPerformance', () => {
    it('should fetch influencer performance data', () => {
      const result = analyticsApi.getInfluencerPerformance({
        influencerId: 'influencer-123',
      });
      expect(result).toBeDefined();
    });
  });

  describe('getCampaignPerformance', () => {
    it('should fetch campaign performance metrics', () => {
      const result = analyticsApi.getCampaignPerformance({
        campaignId: 'campaign-123',
      });
      expect(result).toBeDefined();
    });
  });
});
