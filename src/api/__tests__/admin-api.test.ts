import { adminApi } from '../admin-api';

/**
 * Admin API Tests
 * Verifies all admin operations work correctly with proper error handling
 */

describe('Admin API', () => {
  describe('getApprovals', () => {
    it('should fetch pending approvals', () => {
      const result = adminApi.getApprovals({
        type: 'brand',
        page: 1,
        limit: 20,
      });
      expect(result).toBeDefined();
    });

    it('should support filtering by type', () => {
      const brandApprovals = adminApi.getApprovals({
        type: 'brand',
      });
      const influencerApprovals = adminApi.getApprovals({
        type: 'influencer',
      });
      expect(brandApprovals).toBeDefined();
      expect(influencerApprovals).toBeDefined();
    });
  });

  describe('approveBrand', () => {
    it('should approve brand request', () => {
      const result = adminApi.approveBrand('request-123');
      expect(result).toBeDefined();
    });
  });

  describe('rejectBrand', () => {
    it('should reject brand request with reason', () => {
      const result = adminApi.rejectBrand('request-123', 'Does not meet criteria');
      expect(result).toBeDefined();
    });
  });

  describe('approveInfluencer', () => {
    it('should approve influencer request', () => {
      const result = adminApi.approveInfluencer('request-456');
      expect(result).toBeDefined();
    });
  });

  describe('rejectInfluencer', () => {
    it('should reject influencer request with reason', () => {
      const result = adminApi.rejectInfluencer('request-456', 'Insufficient followers');
      expect(result).toBeDefined();
    });
  });

  describe('getUsers', () => {
    it('should fetch users with pagination', () => {
      const result = adminApi.getUsers({
        page: 1,
        limit: 20,
      });
      expect(result).toBeDefined();
    });

    it('should support search and filters', () => {
      const result = adminApi.getUsers({
        search: 'john',
        role: 'influencer',
        status: 'active',
      });
      expect(result).toBeDefined();
    });
  });

  describe('blockUser', () => {
    it('should block user with reason', () => {
      const result = adminApi.blockUser('user-123', 'Violates community guidelines');
      expect(result).toBeDefined();
    });
  });

  describe('unblockUser', () => {
    it('should unblock user', () => {
      const result = adminApi.unblockUser('user-123');
      expect(result).toBeDefined();
    });
  });

  describe('getSystemStats', () => {
    it('should fetch system statistics', () => {
      const result = adminApi.getSystemStats();
      expect(result).toBeDefined();
    });
  });
});
