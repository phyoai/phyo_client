/**
 * Influencer API Utility Functions
 * Provides typed wrapper functions for all influencer-related API operations
 *
 * Usage:
 * import { influencerApi } from '@/api/influencer-api';
 * const influencers = await influencerApi.getAllInfluencers({ niche: 'Fashion' });
 */

import api from '@/utils/api';
import {
  IInfluencer,
  IInfluencerFilter,
  IPagination,
  IApiResponse,
  IInfluencerResponse,
  IPaginatedInfluencers,
  IListQueryParams,
} from '@/types';

/**
 * Influencer API service
 * Handles all influencer-related operations
 */
export const influencerApi = {
  /**
   * Get an influencer by ID
   *
   * Supports both endpoints:
   * - GET /api/user/influencer/:id
   * - GET /api/influencers/:id
   *
   * @param influencerId - The influencer/user ID
   * @returns Promise resolving to influencer details
   * @throws {IErrorResponse} - If influencer not found or API error
   *
   * @example
   * const influencer = await influencerApi.getInfluencerById('user_123');
   */
  getInfluencerById: async (influencerId: string): Promise<IInfluencer> => {
    try {
      if (!influencerId || typeof influencerId !== 'string') {
        throw new Error('Invalid influencer ID');
      }

      const trimmedId = influencerId.trim();

      // API handoff doc: GET /api/influencers/:id — response at response.data.data or response.data
      const response = await api.get<IInfluencerResponse>(`/influencers/${trimmedId}`);
      const influencer = response.data?.data || response.data;
      if (!influencer) {
        throw new Error('Influencer not found');
      }

      return influencer;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch influencer';
      console.error('Error in getInfluencerById:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get all influencers with optional filtering and pagination
   *
   * Supports both endpoints:
   * - GET /api/user/influencers
   * - GET /api/influencers
   *
   * @param filters - Influencer filter parameters
   * @param pagination - Pagination parameters
   * @returns Promise resolving to paginated influencers list
   *
   * @example
   * const result = await influencerApi.getAllInfluencers(
   *   { niche: 'Fashion', minFollowers: 10000 },
   *   { page: 1, limit: 20 }
   * );
   */
  getAllInfluencers: async (
    filters?: IInfluencerFilter,
    pagination?: Partial<IPagination>
  ): Promise<{ influencers: IInfluencer[]; pagination: IPagination }> => {
    try {
      const params: Record<string, any> = {};

      // Add filter parameters
      if (filters) {
        if (filters.niche) params.niche = filters.niche;
        if (filters.minFollowers !== undefined) params.minFollowers = filters.minFollowers;
        if (filters.maxFollowers !== undefined) params.maxFollowers = filters.maxFollowers;
        if (filters.country) params.country = filters.country;
        if (filters.gender) params.gender = filters.gender;
        if (filters.minEngagement !== undefined) params.minEngagement = filters.minEngagement;
        if (filters.maxEngagement !== undefined) params.maxEngagement = filters.maxEngagement;
        if (filters.search) params.search = filters.search;
        if (filters.verified !== undefined) params.verified = filters.verified;
        if (filters.sortBy) params.sortBy = filters.sortBy;
        if (filters.sortOrder) params.sortOrder = filters.sortOrder;
      }

      // Add pagination parameters
      params.page = pagination?.page || 1;
      params.limit = pagination?.limit || 10;

      // Try the /api/influencers endpoint first
      try {
        const response = await api.get<IPaginatedInfluencers>('/influencers', {
          params,
        });

        return {
          influencers: response.data.data || [],
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
        // If 404 or auth error on auth endpoint, try the influencer endpoint
        if (error.response?.status === 404 || error.response?.status === 403) {
          const fallbackResponse = await api.get<IPaginatedInfluencers>(
            '/influencer',
            { params }
          );

          return {
            influencers: fallbackResponse.data.data || [],
            pagination: fallbackResponse.data.pagination || {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          };
        }
        throw error;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch influencers';
      console.error('Error in getAllInfluencers:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Search for influencers by query
   *
   * @param searchQuery - Search query string
   * @param filters - Additional filter parameters
   * @param pagination - Pagination parameters
   * @returns Promise resolving to search results
   *
   * @example
   * const results = await influencerApi.searchInfluencers('fashion', { country: 'US' });
   */
  searchInfluencers: async (
    searchQuery: string,
    filters?: Partial<IInfluencerFilter>,
    pagination?: Partial<IPagination>
  ): Promise<{ influencers: IInfluencer[]; pagination: IPagination }> => {
    try {
      if (!searchQuery || typeof searchQuery !== 'string') {
        throw new Error('Invalid search query');
      }

      const params: Record<string, any> = {
        search: searchQuery.trim(),
      };

      if (filters) {
        if (filters.niche) params.niche = filters.niche;
        if (filters.minFollowers !== undefined) params.minFollowers = filters.minFollowers;
        if (filters.maxFollowers !== undefined) params.maxFollowers = filters.maxFollowers;
        if (filters.country) params.country = filters.country;
        if (filters.gender) params.gender = filters.gender;
        if (filters.minEngagement !== undefined) params.minEngagement = filters.minEngagement;
        if (filters.maxEngagement !== undefined) params.maxEngagement = filters.maxEngagement;
      }

      params.page = pagination?.page || 1;
      params.limit = pagination?.limit || 10;

      const response = await api.get<IPaginatedInfluencers>('/influencers', {
        params,
      });

      return {
        influencers: response.data.data || [],
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
        error.response?.data?.message || error.message || 'Failed to search influencers';
      console.error('Error in searchInfluencers:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get influencers by niche/category
   *
   * @param niche - Niche/category name
   * @param pagination - Pagination parameters
   * @returns Promise resolving to influencers in niche
   *
   * @example
   * const fashionInfluencers = await influencerApi.getInfluencersByNiche('Fashion');
   */
  getInfluencersByNiche: async (
    niche: string,
    pagination?: Partial<IPagination>
  ): Promise<{ influencers: IInfluencer[]; pagination: IPagination }> => {
    try {
      if (!niche || typeof niche !== 'string') {
        throw new Error('Invalid niche');
      }

      return influencerApi.getAllInfluencers(
        { niche: niche.trim() },
        pagination
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch influencers by niche';
      console.error('Error in getInfluencersByNiche:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get influencers by country
   *
   * @param country - Country name or code
   * @param pagination - Pagination parameters
   * @returns Promise resolving to influencers from country
   *
   * @example
   * const usInfluencers = await influencerApi.getInfluencersByCountry('United States');
   */
  getInfluencersByCountry: async (
    country: string,
    pagination?: Partial<IPagination>
  ): Promise<{ influencers: IInfluencer[]; pagination: IPagination }> => {
    try {
      if (!country || typeof country !== 'string') {
        throw new Error('Invalid country');
      }

      return influencerApi.getAllInfluencers(
        { country: country.trim() },
        pagination
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch influencers by country';
      console.error('Error in getInfluencersByCountry:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get influencers by follower count range
   *
   * @param minFollowers - Minimum follower count
   * @param maxFollowers - Maximum follower count
   * @param pagination - Pagination parameters
   * @returns Promise resolving to influencers in follower range
   *
   * @example
   * const topInfluencers = await influencerApi.getInfluencersByFollowers(100000, 1000000);
   */
  getInfluencersByFollowers: async (
    minFollowers: number,
    maxFollowers: number,
    pagination?: Partial<IPagination>
  ): Promise<{ influencers: IInfluencer[]; pagination: IPagination }> => {
    try {
      if (typeof minFollowers !== 'number' || typeof maxFollowers !== 'number') {
        throw new Error('Invalid follower count range');
      }

      if (minFollowers < 0 || maxFollowers < minFollowers) {
        throw new Error('Invalid follower range: min must be >= 0 and <= max');
      }

      return influencerApi.getAllInfluencers(
        { minFollowers, maxFollowers },
        pagination
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch influencers';
      console.error('Error in getInfluencersByFollowers:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get verified influencers only
   *
   * @param pagination - Pagination parameters
   * @returns Promise resolving to verified influencers
   *
   * @example
   * const verified = await influencerApi.getVerifiedInfluencers({ page: 1, limit: 50 });
   */
  getVerifiedInfluencers: async (
    pagination?: Partial<IPagination>
  ): Promise<{ influencers: IInfluencer[]; pagination: IPagination }> => {
    try {
      return influencerApi.getAllInfluencers({ verified: true }, pagination);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch verified influencers';
      console.error('Error in getVerifiedInfluencers:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get top influencers by engagement rate
   *
   * @param limit - Number of top influencers to return
   * @returns Promise resolving to top influencers
   *
   * @example
   * const top = await influencerApi.getTopInfluencers(20);
   */
  getTopInfluencers: async (
    limit: number = 20
  ): Promise<{ influencers: IInfluencer[]; pagination: IPagination }> => {
    try {
      if (typeof limit !== 'number' || limit < 1) {
        throw new Error('Invalid limit');
      }

      return influencerApi.getAllInfluencers(
        { sortBy: 'avgEngagementRate', sortOrder: 'desc' },
        { page: 1, limit }
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch top influencers';
      console.error('Error in getTopInfluencers:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Advanced search with multiple criteria
   *
   * @param criteria - Complex search criteria
   * @param pagination - Pagination parameters
   * @returns Promise resolving to search results
   *
   * @example
   * const results = await influencerApi.advancedSearch({
   *   niche: 'Fashion',
   *   minFollowers: 50000,
   *   maxFollowers: 500000,
   *   minEngagement: 3,
   *   country: 'United States',
   *   verified: true
   * });
   */
  advancedSearch: async (
    criteria: Partial<IInfluencerFilter>,
    pagination?: Partial<IPagination>
  ): Promise<{ influencers: IInfluencer[]; pagination: IPagination }> => {
    try {
      if (!criteria || typeof criteria !== 'object') {
        throw new Error('Invalid search criteria');
      }

      return influencerApi.getAllInfluencers(criteria, pagination);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Advanced search failed';
      console.error('Error in advancedSearch:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Check if an influencer profile exists
   *
   * @param influencerId - Influencer ID to check
   * @returns Promise resolving to boolean indicating if profile exists
   *
   * @example
   * const exists = await influencerApi.influencerExists('user_123');
   */
  influencerExists: async (influencerId: string): Promise<boolean> => {
    try {
      if (!influencerId || typeof influencerId !== 'string') {
        return false;
      }

      await influencerApi.getInfluencerById(influencerId);
      return true;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return false;
      }
      // Re-throw for other errors
      throw error;
    }
  },

  /**
   * Get influencer count by filters
   *
   * @param filters - Filter parameters
   * @returns Promise resolving to total count
   *
   * @example
   * const count = await influencerApi.countInfluencers({ niche: 'Fashion' });
   */
  countInfluencers: async (
    filters?: Partial<IInfluencerFilter>
  ): Promise<number> => {
    try {
      const result = await influencerApi.getAllInfluencers(filters, {
        page: 1,
        limit: 1,
      });

      return result.pagination.total;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to count influencers';
      console.error('Error in countInfluencers:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get influencer by username
   *
   * @param username - Influencer username
   * @returns Promise resolving to influencer details
   *
   * @example
   * const influencer = await influencerApi.getInfluencerByUsername('fashion_guru');
   */
  getInfluencerByUsername: async (username: string): Promise<IInfluencer | null> => {
    try {
      if (!username || typeof username !== 'string') {
        throw new Error('Invalid username');
      }

      const result = await influencerApi.searchInfluencers(username, {}, { limit: 1 });

      if (result.influencers.length === 0) {
        return null;
      }

      // Find exact match if possible
      const exactMatch = result.influencers.find(
        (inf) => inf.profile.username?.toLowerCase() === username.toLowerCase()
      );

      return exactMatch || result.influencers[0];
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch influencer by username';
      console.error('Error in getInfluencerByUsername:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },
};

/**
 * Helper function to build influencer filter query
 * Useful for complex filter building
 *
 * @param filters - Partial filter object
 * @returns Complete filter object with defaults
 *
 * @example
 * const filters = buildInfluencerFilter({ niche: 'Fashion', minFollowers: 10000 });
 */
export function buildInfluencerFilter(
  filters?: Partial<IInfluencerFilter>
): Partial<IInfluencerFilter> {
  if (!filters) return {};

  const result: Partial<IInfluencerFilter> = {};

  if (filters.niche) result.niche = filters.niche;
  if (filters.minFollowers !== undefined) result.minFollowers = Math.max(0, filters.minFollowers);
  if (filters.maxFollowers !== undefined)
    result.maxFollowers = Math.max(0, filters.maxFollowers);
  if (filters.country) result.country = filters.country;
  if (filters.gender) result.gender = filters.gender;
  if (filters.minEngagement !== undefined) result.minEngagement = Math.max(0, filters.minEngagement);
  if (filters.maxEngagement !== undefined)
    result.maxEngagement = Math.min(100, Math.max(0, filters.maxEngagement));
  if (filters.search) result.search = filters.search;
  if (filters.verified !== undefined) result.verified = filters.verified;
  if (filters.sortBy) result.sortBy = filters.sortBy;
  if (filters.sortOrder) result.sortOrder = filters.sortOrder;

  return result;
}

/**
 * Validate influencer filter parameters
 *
 * @param filters - Filters to validate
 * @returns Object with validation status and errors if any
 *
 * @example
 * const validation = validateInfluencerFilter(filters);
 * if (!validation.isValid) console.error(validation.errors);
 */
export function validateInfluencerFilter(filters: Partial<IInfluencerFilter>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (
    filters.minFollowers !== undefined &&
    filters.maxFollowers !== undefined &&
    filters.minFollowers > filters.maxFollowers
  ) {
    errors.push('minFollowers must be less than or equal to maxFollowers');
  }

  if (
    filters.minEngagement !== undefined &&
    filters.maxEngagement !== undefined &&
    filters.minEngagement > filters.maxEngagement
  ) {
    errors.push('minEngagement must be less than or equal to maxEngagement');
  }

  if (filters.minFollowers !== undefined && filters.minFollowers < 0) {
    errors.push('minFollowers must be non-negative');
  }

  if (filters.maxFollowers !== undefined && filters.maxFollowers < 0) {
    errors.push('maxFollowers must be non-negative');
  }

  if (filters.minEngagement !== undefined && (filters.minEngagement < 0 || filters.minEngagement > 100)) {
    errors.push('minEngagement must be between 0 and 100');
  }

  if (filters.maxEngagement !== undefined && (filters.maxEngagement < 0 || filters.maxEngagement > 100)) {
    errors.push('maxEngagement must be between 0 and 100');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export default influencerApi;
