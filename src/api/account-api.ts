/**
 * Account API Utility Functions
 * Provides typed wrapper functions for account, billing, subscriptions, and lists management
 *
 * Usage:
 * import { accountApi } from '@/api/account-api';
 * const transactions = await accountApi.getTransactions({ page: 1, limit: 20 });
 */

import api from '@/utils/api';
import { IApiResponse, IPagination } from '@/types';

/**
 * Account and Billing Types
 */
export interface ITransaction {
  id: string;
  type: 'credit' | 'debit' | 'subscription' | 'refund';
  amount: number;
  currency: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  relatedCampaignId?: string;
  relatedInfluencerId?: string;
}

export interface IPaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'upi' | 'wallet';
  cardNumber?: string; // Last 4 digits only
  cardBrand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  holderName?: string;
  upiId?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface ISubscription {
  id: string;
  planName: string;
  planLevel: 'free' | 'silver' | 'gold' | 'premium';
  status: 'active' | 'inactive' | 'paused' | 'cancelled';
  startDate: string;
  endDate?: string;
  renewalDate: string;
  price: number;
  currency: string;
  features: string[];
  autoRenewal: boolean;
}

export interface ISubscriptionTimeline {
  events: Array<{
    date: string;
    event: string;
    description: string;
    planName?: string;
  }>;
  currentPlan: ISubscription;
  nextPaymentDate: string;
  pastPlans: Array<{
    planName: string;
    startDate: string;
    endDate: string;
  }>;
}

export interface ISubscriptionPlan {
  id: string;
  name: string;
  level: 'free' | 'silver' | 'gold' | 'premium';
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'annual';
  features: Array<{
    name: string;
    included: boolean;
    limit?: string | number;
  }>;
  description: string;
}

export interface IList {
  id: string;
  name: string;
  description?: string;
  type: 'campaigns' | 'influencers' | 'brands' | 'custom';
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IListItem {
  id: string;
  listId: string;
  itemId: string;
  itemType: string; // 'campaign', 'influencer', 'brand'
  itemName: string;
  addedAt: string;
}

const defaultPagination: IPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

/**
 * Account API service
 * Handles account, billing, subscriptions, and list management
 */
export const accountApi = {
  // ============ TRANSACTIONS ============

  /**
   * Get all transactions with pagination and filtering
   *
   * @param params - Filter and pagination parameters
   * @returns Promise resolving to paginated transactions
   */
  getTransactions: async (
    params?: Partial<{ page: number; limit: number; type: string; dateFrom: string; dateTo: string }>
  ): Promise<{ transactions: ITransaction[]; pagination: IPagination }> => {
    try {
      const response = await api.get<IApiResponse<{
        data: ITransaction[];
        pagination: IPagination;
      }>>('/account/transactions', { params });

      const payload = response.data?.data;
      return {
        transactions: (payload?.data ?? []) as ITransaction[],
        pagination: payload?.pagination ?? defaultPagination,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch transactions';
      console.error('Error in getTransactions:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  // ============ PAYMENT HISTORY ============

  /**
   * Get payment history
   *
   * @param params - Filter and pagination parameters
   * @returns Promise resolving to payment history
   */
  getPaymentHistory: async (
    params?: Partial<{ page: number; limit: number; status: string; dateFrom: string; dateTo: string }>
  ): Promise<{ payments: any[]; pagination: IPagination }> => {
    try {
      const response = await api.get<IApiResponse<any>>('/account/payments/history', { params });

      return {
        payments: response.data?.data ?? [],
        pagination: response.data?.pagination ?? defaultPagination,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch payment history';
      console.error('Error in getPaymentHistory:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  // ============ PAYMENT METHODS ============

  /**
   * Add a new payment method
   *
   * @param paymentMethodData - Payment method details
   * @returns Promise resolving to created payment method
   */
  addPaymentMethod: async (
    paymentMethodData: Partial<IPaymentMethod>
  ): Promise<IPaymentMethod> => {
    try {
      const response = await api.post<IApiResponse<IPaymentMethod>>(
        '/account/payments/methods',
        paymentMethodData
      );
      return response.data?.data as IPaymentMethod;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to add payment method';
      console.error('Error in addPaymentMethod:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get all saved payment methods
   *
   * @returns Promise resolving to list of payment methods
   */
  getPaymentMethods: async (): Promise<IPaymentMethod[]> => {
    try {
      const response = await api.get<IApiResponse<IPaymentMethod[]>>(
        '/account/payments/methods'
      );
      return (response.data?.data ?? []) as IPaymentMethod[];
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch payment methods';
      console.error('Error in getPaymentMethods:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Set a payment method as default
   *
   * @param paymentMethodId - Payment method ID
   * @returns Promise resolving to updated payment method
   */
  setDefaultPaymentMethod: async (paymentMethodId: string): Promise<IPaymentMethod> => {
    try {
      if (!paymentMethodId) {
        throw new Error('Payment method ID is required');
      }

      const response = await api.put<IApiResponse<IPaymentMethod>>(
        `/account/payments/methods/${paymentMethodId}/default`
      );
      return response.data?.data as IPaymentMethod;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to set default payment method';
      console.error('Error in setDefaultPaymentMethod:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Delete a payment method
   *
   * @param paymentMethodId - Payment method ID
   * @returns Promise resolving to success response
   */
  deletePaymentMethod: async (paymentMethodId: string): Promise<{ success: boolean }> => {
    try {
      if (!paymentMethodId) {
        throw new Error('Payment method ID is required');
      }

      const response = await api.delete<IApiResponse<{ success: boolean }>>(
        `/account/payments/methods/${paymentMethodId}`
      );
      return (response.data?.data ?? { success: true }) as { success: boolean };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to delete payment method';
      console.error('Error in deletePaymentMethod:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  // ============ SUBSCRIPTIONS ============

  /**
   * Get current subscription
   *
   * @returns Promise resolving to current subscription
   */
  getCurrentSubscription: async (): Promise<ISubscription> => {
    try {
      const response = await api.get<IApiResponse<ISubscription>>(
        '/account/subscriptions/current'
      );
      return response.data?.data as ISubscription;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch current subscription';
      console.error('Error in getCurrentSubscription:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get subscription timeline and history
   *
   * @returns Promise resolving to subscription timeline
   */
  getSubscriptionTimeline: async (): Promise<ISubscriptionTimeline> => {
    try {
      const response = await api.get<IApiResponse<ISubscriptionTimeline>>(
        '/account/subscriptions/timeline'
      );
      return response.data?.data as ISubscriptionTimeline;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch subscription timeline';
      console.error('Error in getSubscriptionTimeline:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get all available subscription plans
   *
   * @returns Promise resolving to subscription plans
   */
  getSubscriptionPlans: async (): Promise<ISubscriptionPlan[]> => {
    try {
      const response = await api.get<IApiResponse<ISubscriptionPlan[]>>(
        '/account/subscriptions/plans'
      );
      return (response.data?.data ?? []) as ISubscriptionPlan[];
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch subscription plans';
      console.error('Error in getSubscriptionPlans:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Upgrade subscription to a higher plan
   *
   * @param planId - Target plan ID
   * @returns Promise resolving to new subscription
   */
  upgradeSubscription: async (planId: string): Promise<ISubscription> => {
    try {
      if (!planId) {
        throw new Error('Plan ID is required');
      }

      const response = await api.post<IApiResponse<ISubscription>>(
        '/account/subscriptions/upgrade',
        { planId }
      );
      return response.data?.data as ISubscription;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to upgrade subscription';
      console.error('Error in upgradeSubscription:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Downgrade subscription to a lower plan
   *
   * @param planId - Target plan ID
   * @returns Promise resolving to new subscription
   */
  downgradeSubscription: async (planId: string): Promise<ISubscription> => {
    try {
      if (!planId) {
        throw new Error('Plan ID is required');
      }

      const response = await api.post<IApiResponse<ISubscription>>(
        '/account/subscriptions/downgrade',
        { planId }
      );
      return response.data?.data as ISubscription;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to downgrade subscription';
      console.error('Error in downgradeSubscription:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Cancel current subscription
   *
   * @param reason - Reason for cancellation (optional)
   * @returns Promise resolving to cancellation confirmation
   */
  cancelSubscription: async (reason?: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post<IApiResponse<{ success: boolean; message: string }>>(
        '/account/subscriptions/cancel',
        { reason }
      );
      return (response.data?.data ?? { success: true, message: 'Subscription cancelled' }) as { success: boolean; message: string };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to cancel subscription';
      console.error('Error in cancelSubscription:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  // ============ LISTS ============

  /**
   * Get all lists for current user
   *
   * @param params - Filter parameters
   * @returns Promise resolving to user lists
   */
  getLists: async (params?: Record<string, any>): Promise<IList[]> => {
    try {
      const response = await api.get<IApiResponse<IList[]>>('/account/lists', { params });
      return (response.data?.data ?? []) as IList[];
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch lists';
      console.error('Error in getLists:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Create a new list
   *
   * @param listData - List details
   * @returns Promise resolving to created list
   */
  createList: async (
    listData: Partial<Omit<IList, 'id' | 'createdAt' | 'updatedAt' | 'itemCount'>>
  ): Promise<IList> => {
    try {
      if (!listData.name || !listData.type) {
        throw new Error('List name and type are required');
      }

      const response = await api.post<IApiResponse<IList>>('/account/lists', listData);
      return response.data?.data as IList;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to create list';
      console.error('Error in createList:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Get items in a list
   *
   * @param listId - List ID
   * @param params - Pagination parameters
   * @returns Promise resolving to list items
   */
  getListItems: async (
    listId: string,
    params?: Partial<{ page: number; limit: number }>
  ): Promise<{ items: IListItem[]; pagination: IPagination }> => {
    try {
      if (!listId) {
        throw new Error('List ID is required');
      }

      const response = await api.get<IApiResponse<{
        data: IListItem[];
        pagination: IPagination;
      }>>(`/account/lists/${listId}/items`, { params });

      const payload = response.data?.data;
      return {
        items: (payload?.data ?? []) as IListItem[],
        pagination: payload?.pagination ?? defaultPagination,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch list items';
      console.error('Error in getListItems:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Add an item to a list
   *
   * @param listId - List ID
   * @param itemData - Item to add
   * @returns Promise resolving to added item
   */
  addListItem: async (
    listId: string,
    itemData: Omit<IListItem, 'id' | 'listId' | 'addedAt'>
  ): Promise<IListItem> => {
    try {
      if (!listId) {
        throw new Error('List ID is required');
      }

      const response = await api.post<IApiResponse<IListItem>>(
        `/account/lists/${listId}/items`,
        itemData
      );
      return response.data?.data as IListItem;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to add item to list';
      console.error('Error in addListItem:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },

  /**
   * Remove an item from a list
   *
   * @param listId - List ID
   * @param itemId - Item ID
   * @returns Promise resolving to success response
   */
  removeListItem: async (listId: string, itemId: string): Promise<{ success: boolean }> => {
    try {
      if (!listId || !itemId) {
        throw new Error('List ID and Item ID are required');
      }

      const response = await api.delete<IApiResponse<{ success: boolean }>>(
        `/account/lists/${listId}/items/${itemId}`
      );
      return (response.data?.data ?? { success: true }) as { success: boolean };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to remove item from list';
      console.error('Error in removeListItem:', errorMessage);
      throw error.response?.data || { message: errorMessage };
    }
  },
};
