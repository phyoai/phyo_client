/**
 * Campaign API Utility Functions
 * Provides typed wrapper functions for all campaign-related API operations
 *
 * Usage:
 * import { campaignApi } from '@/api/campaign-api';
 * const campaigns = await campaignApi.getAllCampaigns({ status: 'Active' }, { page: 1, limit: 10 });
 */

import api from '@/utils/api';
import {
  ICampaign,
  ICampaignCreate,
  ICampaignUpdate,
  ICampaignFilter,
  IPagination,
  IApiResponse,
  ICampaignResponse,
  IPaginatedCampaigns,
  IApplyCampaignRequest,
  ISelectInfluencerRequest,
  ICampaignActionResponse,
  IListQueryParams,
} from '@/types';

/**
 * Campaign API service
 * Handles all campaign-related operations
 */
export const campaignApi = {
  /**
   * Get a campaign by ID
   *
   * @param campaignId - The campaign ID
   * @returns Promise resolving to campaign details
   * @throws {IErrorResponse} - If campaign not found or API error
   *
   * @example
   * const campaign = await campaignApi.getCampaignById('camp_123');
   */
  getCampaignById: async (campaignId: string): Promise<ICampaign> => {
    try {
      if (!campaignId || typeof campaignId !== 'string') {
        throw new Error('Invalid campaign ID');
      }

      const response = await api.get<ICampaignResponse>(
        `/campaigns/${campaignId.trim()}`
      );

      if (!response.data.data) {
        throw new Error('Campaign not found');
      }

      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch campaign';
      console.error('Error in getCampaignById:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get all campaigns with optional filtering and pagination
   *
   * @param filters - Campaign filter parameters
   * @param pagination - Pagination parameters
   * @returns Promise resolving to paginated campaigns list
   *
   * @example
   * const result = await campaignApi.getAllCampaigns(
   *   { status: 'Active', niche: 'Fashion' },
   *   { page: 1, limit: 10 }
   * );
   */
  getAllCampaigns: async (
    filters?: ICampaignFilter,
    pagination?: Partial<IPagination>
  ): Promise<{ campaigns: ICampaign[]; pagination: IPagination }> => {
    try {
      const params: Record<string, any> = {};

      // Add filter parameters
      if (filters) {
        if (filters.status) params.status = filters.status;
        if (filters.campaignType) params.campaignType = filters.campaignType;
        if (filters.brandId) params.brandId = filters.brandId;
        if (filters.search) params.search = filters.search;
        if (filters.niche) params.niche = filters.niche;
        if (filters.minBudget !== undefined) params.minBudget = filters.minBudget;
        if (filters.maxBudget !== undefined) params.maxBudget = filters.maxBudget;
        if (filters.sortBy) params.sortBy = filters.sortBy;
        if (filters.sortOrder) params.sortOrder = filters.sortOrder;
      }

      // Add pagination parameters
      params.page = pagination?.page || 1;
      params.limit = pagination?.limit || 10;

      const response = await api.get<IPaginatedCampaigns>('/campaigns', {
        params,
      });

      return {
        campaigns: response.data.data || [],
        pagination: response.data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch campaigns';
      console.error('Error in getAllCampaigns:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get brand's own campaigns
   *
   * @param filters - Filter parameters
   * @param pagination - Pagination parameters
   * @returns Promise resolving to paginated brand campaigns
   *
   * @example
   * const result = await campaignApi.getBrandCampaigns(
   *   { status: 'Active' },
   *   { page: 1, limit: 20 }
   * );
   */
  getBrandCampaigns: async (
    filters?: Partial<ICampaignFilter>,
    pagination?: Partial<IPagination>
  ): Promise<{ campaigns: ICampaign[]; pagination: IPagination }> => {
    try {
      const params: Record<string, any> = {};

      if (filters) {
        if (filters.status) params.status = filters.status;
        if (filters.sortBy) params.sortBy = filters.sortBy;
        if (filters.sortOrder) params.sortOrder = filters.sortOrder;
      }

      params.page = pagination?.page || 1;
      params.limit = pagination?.limit || 10;

      const response = await api.get<IPaginatedCampaigns>(
        '/campaigns/brand/my-campaigns',
        { params }
      );

      return {
        campaigns: response.data.data || [],
        pagination: response.data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch brand campaigns';
      console.error('Error in getBrandCampaigns:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Create a new campaign with product image upload
   *
   * @param campaignData - Campaign creation payload
   * @param imageFiles - Product image files to upload (optional if in campaignData)
   * @returns Promise resolving to created campaign
   * @throws {IErrorResponse} - If validation fails or API error
   *
   * @example
   * const campaign = await campaignApi.createCampaign({
   *   campaignName: 'Summer Fashion 2024',
   *   campaignType: 'Product Promotion',
   *   campaignBrief: 'Summer collection promotion...',
   *   deliverables: ['1 Instagram Post', '3 Stories'],
   *   compensation: { type: 'Monetary', amount: 500, currency: 'USD' },
   *   budget: 5000,
   *   timelines: { ... },
   *   targetInfluencer: { ... },
   * }, [imageFile1, imageFile2]);
   */
  createCampaign: async (
    campaignData: ICampaignCreate,
    imageFiles?: File[]
  ): Promise<ICampaign> => {
    try {
      // Validate required fields
      const requiredFields = [
        'campaignName',
        'campaignType',
        'campaignBrief',
        'deliverables',
        'compensation',
        'budget',
        'timelines',
        'targetInfluencer',
      ];

      for (const field of requiredFields) {
        if (!campaignData[field as keyof ICampaignCreate]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Create FormData for multipart request
      const formData = new FormData();

      // Add product image files
      const filesToUpload = imageFiles || campaignData.productImages || [];
      filesToUpload.forEach((file) => {
        if (file instanceof File) {
          formData.append('productImages', file);
        }
      });

      // Add text fields - serialize nested objects as JSON strings
      const fieldsToAdd: (keyof Omit<ICampaignCreate, 'productImages'>)[] = [
        'campaignName',
        'campaignType',
        'campaignBrief',
        'budget',
        'numberOfLivePosts',
        'status',
      ];

      fieldsToAdd.forEach((field) => {
        const value = campaignData[field];
        if (value !== undefined) {
          formData.append(field, String(value));
        }
      });

      // Add array and object fields as JSON strings
      if (campaignData.deliverables) {
        formData.append('deliverables', JSON.stringify(campaignData.deliverables));
      }
      if (campaignData.compensation) {
        formData.append('compensation', JSON.stringify(campaignData.compensation));
      }
      if (campaignData.timelines) {
        formData.append('timelines', JSON.stringify(campaignData.timelines));
      }
      if (campaignData.targetInfluencer) {
        formData.append('targetInfluencer', JSON.stringify(campaignData.targetInfluencer));
      }
      if (campaignData.reels) {
        formData.append('reels', JSON.stringify(campaignData.reels));
      }

      const response = await api.post<ICampaignResponse>('/campaigns', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data.data) {
        throw new Error('Campaign creation failed - no data returned');
      }

      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to create campaign';
      console.error('Error in createCampaign:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Update an existing campaign
   *
   * @param campaignId - Campaign ID to update
   * @param updateData - Campaign update payload
   * @param imageFiles - New product image files (optional)
   * @returns Promise resolving to updated campaign
   * @throws {IErrorResponse} - If campaign not found or update fails
   *
   * @example
   * const updated = await campaignApi.updateCampaign(
   *   'camp_123',
   *   { campaignName: 'Updated Name', budget: 6000 },
   *   [newImageFile]
   * );
   */
  updateCampaign: async (
    campaignId: string,
    updateData: ICampaignUpdate,
    imageFiles?: File[]
  ): Promise<ICampaign> => {
    try {
      if (!campaignId || typeof campaignId !== 'string') {
        throw new Error('Invalid campaign ID');
      }

      // Create FormData for multipart request
      const formData = new FormData();

      // Add image files if provided
      imageFiles?.forEach((file) => {
        if (file instanceof File) {
          formData.append('productImages', file);
        }
      });

      // Add text fields
      const textFields: (keyof Omit<ICampaignUpdate, 'productImages'>)[] = [
        'campaignName',
        'campaignType',
        'campaignBrief',
        'budget',
        'numberOfLivePosts',
        'status',
      ];

      textFields.forEach((field) => {
        const value = updateData[field];
        if (value !== undefined) {
          formData.append(field, String(value));
        }
      });

      // Add array and object fields as JSON strings
      if (updateData.deliverables) {
        formData.append('deliverables', JSON.stringify(updateData.deliverables));
      }
      if (updateData.compensation) {
        formData.append('compensation', JSON.stringify(updateData.compensation));
      }
      if (updateData.timelines) {
        formData.append('timelines', JSON.stringify(updateData.timelines));
      }
      if (updateData.targetInfluencer) {
        formData.append('targetInfluencer', JSON.stringify(updateData.targetInfluencer));
      }
      if (updateData.reels) {
        formData.append('reels', JSON.stringify(updateData.reels));
      }

      const response = await api.patch<ICampaignResponse>(
        `/campaigns/${campaignId.trim()}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.data.data) {
        throw new Error('Campaign update failed - no data returned');
      }

      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to update campaign';
      console.error('Error in updateCampaign:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Delete a campaign
   *
   * @param campaignId - Campaign ID to delete
   * @returns Promise resolving to deletion response
   * @throws {IErrorResponse} - If deletion restricted or API error
   *
   * @example
   * await campaignApi.deleteCampaign('camp_123');
   */
  deleteCampaign: async (campaignId: string): Promise<ICampaignActionResponse> => {
    try {
      if (!campaignId || typeof campaignId !== 'string') {
        throw new Error('Invalid campaign ID');
      }

      const response = await api.delete<ICampaignActionResponse>(
        `/campaigns/${campaignId.trim()}`
      );

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to delete campaign';
      console.error('Error in deleteCampaign:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Apply to a campaign as an influencer
   *
   * @param campaignId - Campaign ID to apply to
   * @param applicationData - Application payload
   * @returns Promise resolving to application response
   * @throws {IErrorResponse} - If application fails
   *
   * @example
   * await campaignApi.applyToCampaign('camp_123', {
   *   message: 'Interested in this campaign!',
   *   portfolioUrl: 'https://portfolio.com'
   * });
   */
  applyToCampaign: async (
    campaignId: string,
    applicationData?: IApplyCampaignRequest
  ): Promise<ICampaignActionResponse> => {
    try {
      if (!campaignId || typeof campaignId !== 'string') {
        throw new Error('Invalid campaign ID');
      }

      const response = await api.post<ICampaignActionResponse>(
        `/campaigns/${campaignId.trim()}/apply`,
        applicationData || {}
      );

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to apply to campaign';
      console.error('Error in applyToCampaign:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Select an influencer for a campaign
   *
   * @param campaignId - Campaign ID
   * @param influencerId - Influencer ID to select
   * @param notes - Optional selection notes
   * @returns Promise resolving to selection response
   * @throws {IErrorResponse} - If selection fails
   *
   * @example
   * await campaignApi.selectInfluencer('camp_123', 'inf_456', 'Selected based on engagement');
   */
  selectInfluencer: async (
    campaignId: string,
    influencerId: string,
    notes?: string
  ): Promise<ICampaignActionResponse> => {
    try {
      if (!campaignId || typeof campaignId !== 'string') {
        throw new Error('Invalid campaign ID');
      }
      if (!influencerId || typeof influencerId !== 'string') {
        throw new Error('Invalid influencer ID');
      }

      const requestData: ISelectInfluencerRequest = {
        influencerId: influencerId.trim(),
      };

      if (notes) {
        requestData.notes = notes;
      }

      const response = await api.post<ICampaignActionResponse>(
        `/campaigns/${campaignId.trim()}/select`,
        requestData
      );

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to select influencer';
      console.error('Error in selectInfluencer:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Search campaigns
   *
   * @param searchQuery - Search query string
   * @param filters - Additional filter parameters
   * @param pagination - Pagination parameters
   * @returns Promise resolving to search results
   *
   * @example
   * const results = await campaignApi.searchCampaigns('fashion', { niche: 'Fashion' });
   */
  searchCampaigns: async (
    searchQuery: string,
    filters?: Partial<ICampaignFilter>,
    pagination?: Partial<IPagination>
  ): Promise<{ campaigns: ICampaign[]; pagination: IPagination }> => {
    try {
      if (!searchQuery || typeof searchQuery !== 'string') {
        throw new Error('Invalid search query');
      }

      const params: Record<string, any> = {
        search: searchQuery.trim(),
      };

      if (filters) {
        if (filters.status) params.status = filters.status;
        if (filters.campaignType) params.campaignType = filters.campaignType;
        if (filters.niche) params.niche = filters.niche;
        if (filters.minBudget !== undefined) params.minBudget = filters.minBudget;
        if (filters.maxBudget !== undefined) params.maxBudget = filters.maxBudget;
      }

      params.page = pagination?.page || 1;
      params.limit = pagination?.limit || 10;

      const response = await api.get<IPaginatedCampaigns>('/campaigns', { params });

      return {
        campaigns: response.data.data || [],
        pagination: response.data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to search campaigns';
      console.error('Error in searchCampaigns:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get campaigns by brand ID
   *
   * @param brandId - Brand ID
   * @param pagination - Pagination parameters
   * @returns Promise resolving to brand's campaigns
   *
   * @example
   * const campaigns = await campaignApi.getCampaignsByBrand('brand_123', { page: 1, limit: 20 });
   */
  getCampaignsByBrand: async (
    brandId: string,
    pagination?: Partial<IPagination>
  ): Promise<{ campaigns: ICampaign[]; pagination: IPagination }> => {
    try {
      if (!brandId || typeof brandId !== 'string') {
        throw new Error('Invalid brand ID');
      }

      return campaignApi.getAllCampaigns(
        { brandId: brandId.trim() },
        pagination
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch brand campaigns';
      console.error('Error in getCampaignsByBrand:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },
};

/**
 * Create FormData helper for campaign creation
 * Useful for manual FormData construction when needed
 *
 * @param campaignData - Campaign data
 * @param imageFiles - Image files to attach
 * @returns FormData object
 *
 * @example
 * const formData = createCampaignFormData(campaignData, imageFiles);
 */
export function createCampaignFormData(
  campaignData: ICampaignCreate,
  imageFiles?: File[]
): FormData {
  const formData = new FormData();

  // Add images
  imageFiles?.forEach((file) => {
    formData.append('productImages', file);
  });

  // Add string fields
  formData.append('campaignName', campaignData.campaignName);
  formData.append('campaignType', campaignData.campaignType);
  formData.append('campaignBrief', campaignData.campaignBrief);
  formData.append('budget', String(campaignData.budget));

  if (campaignData.numberOfLivePosts !== undefined) {
    formData.append('numberOfLivePosts', String(campaignData.numberOfLivePosts));
  }

  if (campaignData.status) {
    formData.append('status', campaignData.status);
  }

  // Add complex objects as JSON
  formData.append('deliverables', JSON.stringify(campaignData.deliverables));
  formData.append('compensation', JSON.stringify(campaignData.compensation));
  formData.append('timelines', JSON.stringify(campaignData.timelines));
  formData.append('targetInfluencer', JSON.stringify(campaignData.targetInfluencer));

  if (campaignData.reels) {
    formData.append('reels', JSON.stringify(campaignData.reels));
  }

  return formData;
}

export default campaignApi;
