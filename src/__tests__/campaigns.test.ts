import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import api from '@/utils/api';
import { CampaignService } from '@/services';

describe('CampaignService Integration Tests', () => {
  let mockAdapter: MockAdapter;

  beforeEach(() => {
    mockAdapter = new MockAdapter(api);
  });

  afterEach(() => {
    mockAdapter.reset();
  });

  describe('createCampaign', () => {
    it('should create a campaign successfully', async () => {
      const campaignData = {
        title: 'Summer Promotion',
        description: 'Promote summer products',
        budget: 5000,
        startDate: '2024-04-01',
        endDate: '2024-06-30',
        niche: 'Fashion',
        status: 'Active',
      };

      const mockResponse = {
        success: true,
        data: {
          _id: 'campaign-123',
          ...campaignData,
          createdAt: new Date().toISOString(),
        },
      };

      mockAdapter.onPost('/api/campaigns').reply(201, mockResponse);

      const result = await CampaignService.createCampaign(campaignData);

      expect(result.success).toBe(true);
      expect(result.data._id).toBe('campaign-123');
      expect(result.data.title).toBe('Summer Promotion');
    });

    it('should fail with missing required fields', async () => {
      const campaignData = {
        description: 'Missing title',
        budget: 5000,
      };

      mockAdapter.onPost('/api/campaigns').reply(400, {
        success: false,
        message: 'Missing required fields: title, niche',
      });

      try {
        await CampaignService.createCampaign(campaignData);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });

    it('should fail with invalid budget', async () => {
      const campaignData = {
        title: 'Campaign',
        description: 'Test',
        budget: -100,
        niche: 'Fashion',
      };

      mockAdapter.onPost('/api/campaigns').reply(400, {
        success: false,
        message: 'Budget must be a positive number',
      });

      try {
        await CampaignService.createCampaign(campaignData);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });
  });

  describe('getCampaigns', () => {
    it('should fetch all campaigns', async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            _id: 'campaign-1',
            title: 'Campaign 1',
            budget: 5000,
            status: 'Active',
          },
          {
            _id: 'campaign-2',
            title: 'Campaign 2',
            budget: 3000,
            status: 'Active',
          },
        ],
      };

      mockAdapter.onGet('/api/campaigns').reply(200, mockResponse);

      const result = await CampaignService.getCampaigns();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].title).toBe('Campaign 1');
    });

    it('should fetch campaigns with filters', async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            _id: 'campaign-1',
            title: 'Fashion Campaign',
            budget: 5000,
            niche: 'Fashion',
            status: 'Active',
          },
        ],
      };

      mockAdapter.onGet('/api/campaigns?niche=Fashion&status=Active').reply(200, mockResponse);

      const result = await CampaignService.getCampaigns({ niche: 'Fashion', status: 'Active' });

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].niche).toBe('Fashion');
    });

    it('should fetch campaigns with pagination', async () => {
      const mockResponse = {
        success: true,
        data: [
          { _id: 'campaign-1', title: 'Campaign 1' },
          { _id: 'campaign-2', title: 'Campaign 2' },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 5,
          pageSize: 2,
          total: 10,
        },
      };

      mockAdapter.onGet('/api/campaigns?page=1&limit=2').reply(200, mockResponse);

      const result = await CampaignService.getCampaigns({ page: 1, limit: 2 });

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.pagination.currentPage).toBe(1);
    });

    it('should return empty array when no campaigns found', async () => {
      mockAdapter.onGet('/api/campaigns').reply(200, {
        success: true,
        data: [],
      });

      const result = await CampaignService.getCampaigns();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(0);
    });
  });

  describe('getCampaignById', () => {
    it('should fetch campaign by ID', async () => {
      const mockResponse = {
        success: true,
        data: {
          _id: 'campaign-123',
          title: 'Summer Campaign',
          budget: 5000,
          applications: [
            {
              _id: 'app-1',
              influencerId: 'influencer-1',
              influencer: {
                name: 'John Influencer',
                followers: 50000,
                engagement: 4.5,
              },
              status: 'Pending',
            },
          ],
        },
      };

      mockAdapter.onGet('/api/campaigns/campaign-123').reply(200, mockResponse);

      const result = await CampaignService.getCampaignById('campaign-123');

      expect(result.success).toBe(true);
      expect(result.data.title).toBe('Summer Campaign');
      expect(result.data.applications).toHaveLength(1);
      expect(result.data.applications[0].influencer.name).toBe('John Influencer');
    });

    it('should fail when campaign not found', async () => {
      mockAdapter.onGet('/api/campaigns/non-existent').reply(404, {
        success: false,
        message: 'Campaign not found',
      });

      try {
        await CampaignService.getCampaignById('non-existent');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('updateCampaign', () => {
    it('should update campaign successfully', async () => {
      const updateData = {
        title: 'Updated Campaign',
        budget: 7000,
      };

      const mockResponse = {
        success: true,
        data: {
          _id: 'campaign-123',
          ...updateData,
          updatedAt: new Date().toISOString(),
        },
      };

      mockAdapter.onPatch('/api/campaigns/campaign-123').reply(200, mockResponse);

      const result = await CampaignService.updateCampaign('campaign-123', updateData);

      expect(result.success).toBe(true);
      expect(result.data.title).toBe('Updated Campaign');
      expect(result.data.budget).toBe(7000);
    });

    it('should fail when campaign not found', async () => {
      mockAdapter.onPatch('/api/campaigns/non-existent').reply(404, {
        success: false,
        message: 'Campaign not found',
      });

      try {
        await CampaignService.updateCampaign('non-existent', { title: 'Updated' });
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('deleteCampaign', () => {
    it('should delete campaign successfully', async () => {
      mockAdapter.onDelete('/api/campaigns/campaign-123').reply(200, {
        success: true,
        message: 'Campaign deleted successfully',
      });

      const result = await CampaignService.deleteCampaign('campaign-123');

      expect(result.success).toBe(true);
    });

    it('should fail when campaign not found', async () => {
      mockAdapter.onDelete('/api/campaigns/non-existent').reply(404, {
        success: false,
        message: 'Campaign not found',
      });

      try {
        await CampaignService.deleteCampaign('non-existent');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('applyToCampaign', () => {
    it('should apply to campaign successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          _id: 'application-123',
          campaignId: 'campaign-123',
          influencerId: 'influencer-123',
          status: 'Pending',
          createdAt: new Date().toISOString(),
        },
      };

      mockAdapter.onPost('/api/campaigns/campaign-123/apply').reply(201, mockResponse);

      const result = await CampaignService.applyToCampaign('campaign-123');

      expect(result.success).toBe(true);
      expect(result.data.status).toBe('Pending');
    });

    it('should fail when already applied', async () => {
      mockAdapter.onPost('/api/campaigns/campaign-123/apply').reply(409, {
        success: false,
        message: 'Already applied to this campaign',
      });

      try {
        await CampaignService.applyToCampaign('campaign-123');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(409);
      }
    });
  });

  describe('selectInfluencer', () => {
    it('should select influencer for campaign', async () => {
      const mockResponse = {
        success: true,
        data: {
          campaignId: 'campaign-123',
          selectedInfluencerId: 'influencer-123',
          status: 'Selected',
        },
      };

      mockAdapter.onPost('/api/campaigns/campaign-123/select').reply(200, mockResponse);

      const result = await CampaignService.selectInfluencer('campaign-123', 'influencer-123');

      expect(result.success).toBe(true);
      expect(result.data.status).toBe('Selected');
    });
  });
});
