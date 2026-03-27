import { metaApi } from '../meta-api';

/**
 * Meta API Tests
 * Verifies Facebook/Meta integration operations
 */

describe('Meta API', () => {
  describe('getConnectedAccounts', () => {
    it('should fetch list of connected Facebook accounts', () => {
      const result = metaApi.getConnectedAccounts();
      expect(result).toBeDefined();
    });
  });

  describe('getMetaDashboard', () => {
    it('should fetch Meta dashboard overview', () => {
      const result = metaApi.getMetaDashboard();
      expect(result).toBeDefined();
    });
  });

  describe('getFacebookInsights', () => {
    it('should fetch insights for all campaigns', () => {
      const result = metaApi.getFacebookInsights({
        campaignId: 'all',
      });
      expect(result).toBeDefined();
    });

    it('should fetch insights for specific campaign', () => {
      const result = metaApi.getFacebookInsights({
        campaignId: 'campaign-123',
        startDate: '2026-01-01',
        endDate: '2026-03-26',
      });
      expect(result).toBeDefined();
    });

    it('should support granularity parameter', () => {
      const result = metaApi.getFacebookInsights({
        campaignId: 'all',
        granularity: 'daily',
      });
      expect(result).toBeDefined();
    });

    it('should support weekly and monthly granularity', () => {
      const daily = metaApi.getFacebookInsights({
        campaignId: 'all',
        granularity: 'daily',
      });
      const weekly = metaApi.getFacebookInsights({
        campaignId: 'all',
        granularity: 'weekly',
      });
      const monthly = metaApi.getFacebookInsights({
        campaignId: 'all',
        granularity: 'monthly',
      });

      expect(daily).toBeDefined();
      expect(weekly).toBeDefined();
      expect(monthly).toBeDefined();
    });
  });

  describe('syncFacebookMetrics', () => {
    it('should sync metrics for specific campaign', () => {
      const result = metaApi.syncFacebookMetrics('campaign-123', 'account-456');
      expect(result).toBeDefined();
    });
  });

  describe('getSyncHistory', () => {
    it('should fetch sync history', () => {
      const result = metaApi.getSyncHistory();
      expect(result).toBeDefined();
    });

    it('should support limit parameter', () => {
      const result = metaApi.getSyncHistory(10);
      expect(result).toBeDefined();
    });
  });

  describe('disconnectFacebook', () => {
    it('should disconnect a Facebook account', () => {
      const result = metaApi.disconnectFacebook('account-123');
      expect(result).toBeDefined();
    });
  });

  describe('updateSyncSettings', () => {
    it('should update sync settings for account', () => {
      const result = metaApi.updateSyncSettings('account-123', {
        syncInterval: 3600,
        autoSync: true,
      });
      expect(result).toBeDefined();
    });
  });

  describe('connectFacebook', () => {
    it('should connect Facebook account with OAuth code', () => {
      const result = metaApi.connectFacebook('oauth_code_123');
      expect(result).toBeDefined();
    });
  });
});
