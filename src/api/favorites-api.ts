/**
 * Favorites API Utility Functions
 * Provides typed wrapper functions for favorites management
 *
 * Usage:
 * import { favoritesApi } from '@/api/favorites-api';
 * const favorites = await favoritesApi.getFavorites({ page: 1, limit: 20 });
 */

import api from '@/utils/api';
import { IApiResponse, IPagination } from '@/types';

/**
 * Favorite Types
 */
export interface IFavorite {
  id: string;
  userId: string;
  itemType: 'campaign' | 'influencer' | 'brand';
  itemId: string;
  itemName: string;
  itemImage?: string;
  addedAt: string;
}

export interface IFavoritesResponse {
  data: IFavorite[];
  pagination: IPagination;
}

const defaultPagination: IPagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

/**
 * Favorites API service
 * Handles all favorites-related operations
 */
export const favoritesApi = {
  /**
   * Get all favorites for the current user
   *
   * @param params - Filter and pagination parameters
   * @returns Promise resolving to paginated favorites
   *
   * @example
   * const result = await favoritesApi.getFavorites({ page: 1, limit: 20 });
   */
  getFavorites: async (
    params?: Partial<{ page: number; limit: number; itemType: string }>
  ): Promise<{ favorites: IFavorite[]; pagination: IPagination }> => {
    try {
      const response = await api.get<IApiResponse<IFavoritesResponse>>(
        '/favorites',
        { params }
      );

      const payload = response.data?.data;
      return {
        favorites: (payload?.data ?? []) as IFavorite[],
        pagination: payload?.pagination ?? defaultPagination,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch favorites';
      console.error('Error in getFavorites:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get favorite campaigns
   *
   * @param params - Pagination parameters
   * @returns Promise resolving to favorite campaigns
   *
   * @example
   * const result = await favoritesApi.getFavoriteCampaigns({ page: 1, limit: 20 });
   */
  getFavoriteCampaigns: async (
    params?: Partial<{ page: number; limit: number }>
  ): Promise<{ favorites: IFavorite[]; pagination: IPagination }> => {
    return favoritesApi.getFavorites({ ...params, itemType: 'campaign' });
  },

  /**
   * Get favorite influencers
   *
   * @param params - Pagination parameters
   * @returns Promise resolving to favorite influencers
   *
   * @example
   * const result = await favoritesApi.getFavoriteInfluencers({ page: 1, limit: 20 });
   */
  getFavoriteInfluencers: async (
    params?: Partial<{ page: number; limit: number }>
  ): Promise<{ favorites: IFavorite[]; pagination: IPagination }> => {
    return favoritesApi.getFavorites({ ...params, itemType: 'influencer' });
  },

  /**
   * Get favorite brands
   *
   * @param params - Pagination parameters
   * @returns Promise resolving to favorite brands
   *
   * @example
   * const result = await favoritesApi.getFavoriteBrands({ page: 1, limit: 20 });
   */
  getFavoriteBrands: async (
    params?: Partial<{ page: number; limit: number }>
  ): Promise<{ favorites: IFavorite[]; pagination: IPagination }> => {
    return favoritesApi.getFavorites({ ...params, itemType: 'brand' });
  },

  /**
   * Add an item to favorites
   *
   * @param itemType - Type of item (campaign, influencer, brand)
   * @param itemId - ID of the item to add
   * @returns Promise resolving to created favorite
   *
   * @example
   * await favoritesApi.addFavorite('campaign', 'camp_123');
   */
  addFavorite: async (
    itemType: 'campaign' | 'influencer' | 'brand',
    itemId: string
  ): Promise<IFavorite> => {
    try {
      if (!itemType || !itemId) {
        throw new Error('Invalid item type or ID');
      }

      const response = await api.post<IApiResponse<IFavorite>>(
        '/favorites',
        { itemType, itemId }
      );

      if (!response.data.data) {
        throw new Error('Failed to add favorite');
      }

      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to add favorite';
      console.error('Error in addFavorite:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Remove an item from favorites
   *
   * @param itemType - Type of item (campaign, influencer, brand)
   * @param itemId - ID of the item to remove
   * @returns Promise resolving to deletion response
   *
   * @example
   * await favoritesApi.removeFavorite('campaign', 'camp_123');
   */
  removeFavorite: async (
    itemType: 'campaign' | 'influencer' | 'brand',
    itemId: string
  ): Promise<{ message: string }> => {
    try {
      if (!itemType || !itemId) {
        throw new Error('Invalid item type or ID');
      }

      const response = await api.delete<IApiResponse<{ message: string }>>(
        `/favorites/${itemType}/${itemId.trim()}`
      );

      return response.data?.data ?? { message: 'Favorite removed' };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to remove favorite';
      console.error('Error in removeFavorite:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Toggle favorite status for an item
   *
   * @param itemType - Type of item
   * @param itemId - ID of the item
   * @returns Promise resolving to favorite state
   *
   * @example
   * const isFavorite = await favoritesApi.toggleFavorite('influencer', 'inf_123');
   */
  toggleFavorite: async (
    itemType: 'campaign' | 'influencer' | 'brand',
    itemId: string
  ): Promise<{ isFavorite: boolean; favorite?: IFavorite }> => {
    try {
      if (!itemType || !itemId) {
        throw new Error('Invalid item type or ID');
      }

      const response = await api.post<IApiResponse<{ isFavorite: boolean; favorite?: IFavorite }>>(
        `/favorites/${itemType}/${itemId.trim()}/toggle`,
        {}
      );

      return response.data?.data ?? { isFavorite: false };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to toggle favorite';
      console.error('Error in toggleFavorite:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Check if an item is in favorites
   *
   * @param itemType - Type of item
   * @param itemId - ID of the item
   * @returns Promise resolving to favorite status
   *
   * @example
   * const isFavorite = await favoritesApi.isFavorite('campaign', 'camp_123');
   */
  isFavorite: async (
    itemType: 'campaign' | 'influencer' | 'brand',
    itemId: string
  ): Promise<boolean> => {
    try {
      if (!itemType || !itemId) {
        throw new Error('Invalid item type or ID');
      }

      const response = await api.get<IApiResponse<{ isFavorite: boolean }>>(
        `/favorites/${itemType}/${itemId.trim()}/check`
      );

      return response.data?.data?.isFavorite ?? false;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to check favorite status';
      console.error('Error in isFavorite:', errorMessage);
      return false; // Default to not favorited on error
    }
  },
};

export default favoritesApi;
