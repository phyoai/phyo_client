import apiClient from './api';
import {
  PaymentPlan,
  PaymentOrder,
  PaymentVerification,
  PaymentHistory,
  CurrentPlan,
  PaginationParams
} from './types';

export const paymentService = {
  // GET /api/payment/plans
  getPlans: async (): Promise<PaymentPlan[]> => {
    const response = await apiClient.get('/payment/plans');
    return response.data.data;
  },

  // GET /api/payment/current-plan
  getCurrentPlan: async (): Promise<CurrentPlan> => {
    const response = await apiClient.get('/payment/current-plan');
    return response.data.data;
  },

  // GET /api/payment/credits
  getCredits: async (): Promise<any> => {
    const response = await apiClient.get('/payment/credits');
    return response.data.data;
  },

  // POST /api/payment/order
  createOrder: async (planId: string): Promise<PaymentOrder> => {
    const response = await apiClient.post('/payment/order', { planId });
    return response.data.data;
  },

  // POST /api/payment/verify
  verifyPayment: async (data: PaymentVerification): Promise<any> => {
    const response = await apiClient.post('/payment/verify', data);
    return response.data;
  },

  // GET /api/payment/history
  getPaymentHistory: async (params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get('/payment/history', { params });
    return response.data;
  },

  // POST /api/payment/cancel
  cancelSubscription: async (): Promise<any> => {
    const response = await apiClient.post('/payment/cancel', {});
    return response.data;
  },

  // GET /api/payment/invoice/:id
  getInvoice: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/payment/invoice/${id}`);
    return response.data.data;
  },

  // POST /api/payment/retry - Retry failed payment
  retryPayment: async (orderId: string): Promise<PaymentOrder> => {
    const response = await apiClient.post('/payment/retry', { orderId });
    return response.data.data;
  }
};
