import api from './api';

class PaymentService {
  constructor() {
    this.razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  }

  // Get all available subscription plans
  async getPlans() {
    try {
      const response = await api.get('/payment/plans');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Get user's current plan
  async getUserPlan() {
    try {
      const response = await api.get('/payment/user-plan');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Get user's credit information
  async getCredits() {
    try {
      const response = await api.get('/payment/credits');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Create payment order
  async createOrder(planId, interval = 'MONTHLY') {
    try {
      const response = await api.post('/payment/create-order', {
        planId,
        interval
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Verify payment
  async verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature, planId) {
    try {
      const response = await api.post('/payment/verify-payment', {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        planId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Get payment history
  async getPaymentHistory(page = 1, limit = 10) {
    try {
      const response = await api.get('/payment/history', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Cancel subscription
  async cancelSubscription() {
    try {
      const response = await api.post('/payment/cancel-subscription');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Initialize Razorpay payment
  initializeRazorpay(orderData, onSuccess, onFailure) {
    if (!this.razorpayKey) {
      throw new Error('Razorpay key not found. Please check RAZORPAY_KEY_ID environment variable.');
    }

    const options = {
      key: this.razorpayKey,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.orderId,
      name: 'Phyo Platform',
      description: `Subscribe to ${orderData.plan.displayName}`,
      handler: function (response) {
        console.log('Payment success:', response);
        onSuccess(response);
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com'
      },
      theme: {
        color: '#10B981' // Green color to match the design
      },
      modal: {
        ondismiss: function() {
          console.log('Payment cancelled by user');
          onFailure('Payment cancelled');
        }
      }
    };

    // Wait for Razorpay to be loaded
    const checkRazorpay = () => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        return rzp;
      } else {
        // Try to load script if not available
        if (typeof window !== 'undefined' && !window.Razorpay) {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          script.onload = () => {
            const rzp = new window.Razorpay(options);
            rzp.open();
          };
          script.onerror = () => {
            onFailure('Failed to load Razorpay SDK');
          };
          document.head.appendChild(script);
          return null;
        }
        throw new Error('Razorpay SDK not available');
      }
    };

    return checkRazorpay();
  }

  // Test function to verify payment API connectivity
  async testConnection() {
    try {
      console.log('Testing payment API connection...');
      const plans = await this.getPlans();
      console.log('Payment API connection successful:', plans);
      return { success: true, data: plans };
    } catch (error) {
      console.error('Payment API connection failed:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new PaymentService();