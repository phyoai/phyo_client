/**
 * Payment & Subscription Service
 * Handles all payment, subscription, and billing API calls
 */

import { apiClient, APIResponse } from "./api-client";
import {
  PAYMENT_ENDPOINTS,
  SUBSCRIPTION_ENDPOINTS,
  ACCOUNT_BILLING_ENDPOINTS,
} from "@/utils/api-endpoints";

/**
 * Payment Types
 */
export interface PaymentPlan {
  id: string;
  name: "silver" | "gold" | "premium";
  price: number;
  currency: string;
  features: string[];
  credits: number;
  duration: number;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  status: "active" | "paused" | "cancelled";
  startDate: string;
  endDate: string;
  nextBillingDate: string;
  autoRenewal: boolean;
  credits: number;
  usedCredits: number;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  type: "purchase" | "refund" | "withdrawal";
  planName?: string;
  transactionDate: string;
  paymentMethod?: string;
  transactionId?: string;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: "credit_card" | "debit_card" | "paypal" | "bank";
  last4?: string;
  expiryDate?: string;
  holderName?: string;
  isDefault: boolean;
  createdAt: string;
}

/**
 * Payment Service
 */
export class PaymentService {
  /**
   * Get Payment Plans
   */
  static async getPaymentPlans(): Promise<
    APIResponse<PaymentPlan[]>
  > {
    return apiClient.get(PAYMENT_ENDPOINTS.GET_PLANS);
  }

  /**
   * Get Current Plan
   */
  static async getCurrentPlan(): Promise<
    APIResponse<Subscription>
  > {
    return apiClient.get(
      PAYMENT_ENDPOINTS.GET_CURRENT_PLAN
    );
  }

  /**
   * Get Credits
   */
  static async getCredits(): Promise<
    APIResponse<{ total: number; used: number; available: number }>
  > {
    return apiClient.get(PAYMENT_ENDPOINTS.GET_CREDITS);
  }

  /**
   * Create Silver Order
   */
  static async createSilverOrder(): Promise<
    APIResponse<{ orderId: string; paymentUrl: string }>
  > {
    return apiClient.post(
      PAYMENT_ENDPOINTS.CREATE_SILVER_ORDER,
      {}
    );
  }

  /**
   * Create Gold Order
   */
  static async createGoldOrder(): Promise<
    APIResponse<{ orderId: string; paymentUrl: string }>
  > {
    return apiClient.post(
      PAYMENT_ENDPOINTS.CREATE_GOLD_ORDER,
      {}
    );
  }

  /**
   * Create Premium Order
   */
  static async createPremiumOrder(): Promise<
    APIResponse<{ orderId: string; paymentUrl: string }>
  > {
    return apiClient.post(
      PAYMENT_ENDPOINTS.CREATE_PREMIUM_ORDER,
      {}
    );
  }

  /**
   * Verify Payment
   */
  static async verifyPayment(
    orderId: string,
    paymentId: string
  ): Promise<APIResponse<Subscription>> {
    return apiClient.post(
      PAYMENT_ENDPOINTS.VERIFY_PAYMENT,
      { orderId, paymentId }
    );
  }

  /**
   * Get Payment History
   */
  static async getPaymentHistory(
    page?: number,
    limit?: number
  ): Promise<APIResponse<PaymentTransaction[]>> {
    let url = PAYMENT_ENDPOINTS.GET_PAYMENT_HISTORY;
    if (page && limit) {
      url += `?page=${page}&limit=${limit}`;
    }
    return apiClient.get(url);
  }

  /**
   * Cancel Subscription
   */
  static async cancelSubscription(): Promise<APIResponse> {
    return apiClient.post(
      PAYMENT_ENDPOINTS.CANCEL_SUBSCRIPTION,
      {}
    );
  }

  /**
   * Pause Subscription
   */
  static async pauseSubscription(days: number): Promise<APIResponse> {
    return apiClient.post(
      PAYMENT_ENDPOINTS.PAUSE_SUBSCRIPTION,
      { days }
    );
  }

  /**
   * Resume Subscription
   */
  static async resumeSubscription(): Promise<APIResponse> {
    return apiClient.post(
      PAYMENT_ENDPOINTS.RESUME_SUBSCRIPTION,
      {}
    );
  }

  /**
   * Get Billing Summary
   */
  static async getBillingSummary(): Promise<APIResponse> {
    return apiClient.get(
      PAYMENT_ENDPOINTS.GET_BILLING_SUMMARY
    );
  }

  /**
   * Subscription - Get Plans
   */
  static async getSubscriptionPlans(): Promise<
    APIResponse<PaymentPlan[]>
  > {
    return apiClient.get(
      SUBSCRIPTION_ENDPOINTS.GET_PLANS
    );
  }

  /**
   * Subscription - Get Current
   */
  static async getSubscriptionCurrent(): Promise<
    APIResponse<Subscription>
  > {
    return apiClient.get(
      SUBSCRIPTION_ENDPOINTS.GET_CURRENT
    );
  }

  /**
   * Subscription - Upgrade
   */
  static async upgradeSubscription(
    planId: string
  ): Promise<APIResponse> {
    return apiClient.post(
      SUBSCRIPTION_ENDPOINTS.UPGRADE,
      { planId }
    );
  }

  /**
   * Subscription - Downgrade
   */
  static async downgradeSubscription(
    planId: string
  ): Promise<APIResponse> {
    return apiClient.post(
      SUBSCRIPTION_ENDPOINTS.DOWNGRADE,
      { planId }
    );
  }

  /**
   * Subscription - Pause
   */
  static async pauseSubscriptionSub(
    days: number
  ): Promise<APIResponse> {
    return apiClient.post(
      SUBSCRIPTION_ENDPOINTS.PAUSE,
      { days }
    );
  }

  /**
   * Subscription - Resume
   */
  static async resumeSubscriptionSub(): Promise<APIResponse> {
    return apiClient.post(SUBSCRIPTION_ENDPOINTS.RESUME, {});
  }

  /**
   * Subscription - Cancel
   */
  static async cancelSubscriptionSub(): Promise<APIResponse> {
    return apiClient.post(SUBSCRIPTION_ENDPOINTS.CANCEL, {});
  }

  /**
   * Subscription - Toggle Auto Renewal
   */
  static async toggleAutoRenewal(
    enabled: boolean
  ): Promise<APIResponse> {
    return apiClient.post(
      SUBSCRIPTION_ENDPOINTS.TOGGLE_AUTO_RENEWAL,
      { enabled }
    );
  }

  /**
   * Subscription - Get History
   */
  static async getSubscriptionHistory(): Promise<APIResponse> {
    return apiClient.get(
      SUBSCRIPTION_ENDPOINTS.GET_HISTORY
    );
  }

  /**
   * Subscription - Get Billing Dates
   */
  static async getSubscriptionBillingDates(): Promise<APIResponse> {
    return apiClient.get(
      SUBSCRIPTION_ENDPOINTS.GET_BILLING_DATES
    );
  }

  /**
   * Account Billing - Get Transactions
   */
  static async getTransactions(): Promise<
    APIResponse<PaymentTransaction[]>
  > {
    return apiClient.get(
      ACCOUNT_BILLING_ENDPOINTS.GET_TRANSACTIONS
    );
  }

  /**
   * Account Billing - Add Payment Method
   */
  static async addPaymentMethod(
    payload: any
  ): Promise<APIResponse<PaymentMethod>> {
    return apiClient.post(
      ACCOUNT_BILLING_ENDPOINTS.ADD_PAYMENT_METHOD,
      payload
    );
  }

  /**
   * Account Billing - Get Payment Methods
   */
  static async getPaymentMethods(): Promise<
    APIResponse<PaymentMethod[]>
  > {
    return apiClient.get(
      ACCOUNT_BILLING_ENDPOINTS.GET_PAYMENT_METHODS
    );
  }

  /**
   * Account Billing - Set Default Payment Method
   */
  static async setDefaultPaymentMethod(
    id: string
  ): Promise<APIResponse> {
    return apiClient.put(
      ACCOUNT_BILLING_ENDPOINTS.SET_DEFAULT_PAYMENT_METHOD(
        id
      ),
      {}
    );
  }

  /**
   * Account Billing - Delete Payment Method
   */
  static async deletePaymentMethod(id: string): Promise<APIResponse> {
    return apiClient.delete(
      ACCOUNT_BILLING_ENDPOINTS.DELETE_PAYMENT_METHOD(id)
    );
  }
}

export default PaymentService;
