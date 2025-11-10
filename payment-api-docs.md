# Payment & Subscription API Documentation

## Overview

The Phyo platform provides a comprehensive payment and subscription system powered by Razorpay. This API allows users to manage their subscriptions, credits, and payments with secure integration.

### Key Features
- **4 Subscription Plans**: Bronze (Free), Silver ($19/month), Gold ($79/month), Premium ($199/month)
- **Credit-based Usage**: Silver and Gold plans include monthly credits for platform features
- **Secure Payments**: Razorpay integration with signature verification
- **Automatic Webhooks**: Real-time payment confirmation and subscription activation
- **Plan-based Access Control**: Feature restrictions based on subscription level

## Authentication

All payment endpoints require authentication using JWT tokens.

```javascript
// Include JWT token in Authorization header
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN',
  'Content-Type': 'application/json'
}
```

## Subscription Plans

| Plan | Price | Credits | Key Features |
|------|-------|---------|--------------|
| **Bronze** | Free | 0 | Creator Search, Basic Insights |
| **Silver** | $19/month | 50 | Advanced Filters, Historical Cost, Brand Analysis, Campaign Reports |
| **Gold** | $79/month | 250 | Role-based Access, Volume Discounts, Platform Training, Dedicated Support |
| **Premium** | $199/month | Unlimited | All features, unlimited usage |

---

## API Endpoints

### 1. Get All Subscription Plans

**Endpoint:** `GET /api/payment/plans`

**Description:** Retrieve all available subscription plans with their features and pricing.

#### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "bronze-monthly",
      "name": "BRONZE",
      "displayName": "Bronze Plan",
      "price": 0,
      "currency": "INR",
      "interval": "MONTHLY",
      "features": {
        "creatorSearch": true,
        "creatorInsights": "BASIC",
        "advancedFilters": false,
        "audienceBasedSearch": false,
        "historicalCost": false,
        "preCuratedList": false,
        "brandAnalysis": false,
        "costingInsights": false,
        "openAccessInfluencerDatabase": false,
        "campaignReports": false,
        "roleBasedAccess": false,
        "volumeBasedDiscount": false,
        "platformTraining": false,
        "dedicatedCustomerSuccess": false,
        "credits": 0
      },
      "isActive": true
    }
  ]
}
```

---

### 2. Get User's Current Plan

**Endpoint:** `GET /api/payment/user-plan`

**Description:** Get the authenticated user's current subscription plan and status.

#### Response
```json
{
  "success": true,
  "data": {
    "currentPlan": "SILVER",
    "subscription": {
      "userId": "user_id",
      "planId": "silver-monthly",
      "plan": { /* plan details */ },
      "status": "ACTIVE",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-02-01T00:00:00.000Z",
      "creditsRemaining": 35,
      "creditsUsedThisMonth": 15
    },
    "creditsRemaining": 35,
    "features": { /* plan features */ },
    "isActive": true
  }
}
```

---

### 3. Get User's Credit Information

**Endpoint:** `GET /api/payment/credits`

**Description:** Get detailed credit information including usage statistics.

#### Response
```json
{
  "success": true,
  "data": {
    "currentPlan": "SILVER",
    "creditsRemaining": 35,
    "creditsUsedThisMonth": 15,
    "lastReset": "2024-01-01T00:00:00.000Z",
    "isUnlimited": false
  }
}
```

---

### 4. Create Payment Order

**Endpoint:** `POST /api/payment/create-order`

**Description:** Create a Razorpay payment order for subscription upgrade/purchase.

#### Request Body
```json
{
  "planId": "silver-monthly",
  "interval": "MONTHLY"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "orderId": "order_xyz123",
    "amount": 1900,
    "currency": "INR",
    "plan": { /* plan details */ },
    "razorpayKey": "rzp_test_RbXvyl4Znqufal"
  }
}
```

#### Frontend Integration
```javascript
// 1. Create order
const orderResponse = await fetch('/api/payment/create-order', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    planId: 'silver-monthly',
    interval: 'MONTHLY'
  })
});

const { data } = await orderResponse.json();

// 2. Initialize Razorpay
const options = {
  key: data.razorpayKey,
  amount: data.amount,
  currency: data.currency,
  order_id: data.orderId,
  name: 'Phyo Platform',
  description: `Subscribe to ${data.plan.displayName}`,
  handler: function (response) {
    // Handle successful payment
    verifyPayment(response);
  }
};

const rzp = new Razorpay(options);
rzp.open();
```

---

### 5. Verify Payment

**Endpoint:** `POST /api/payment/verify-payment`

**Description:** Verify payment after successful Razorpay checkout and activate subscription.

#### Request Body
```json
{
  "razorpayOrderId": "order_xyz123",
  "razorpayPaymentId": "pay_abc456",
  "razorpaySignature": "signature_hash",
  "planId": "silver-monthly"
}
```

#### Response
```json
{
  "success": true,
  "message": "Payment verified and subscription activated",
  "data": {
    "plan": "SILVER",
    "subscriptionId": "sub_xyz789",
    "creditsRemaining": 50
  }
}
```

#### Frontend Integration
```javascript
async function verifyPayment(razorpayResponse) {
  try {
    const response = await fetch('/api/payment/verify-payment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        razorpayOrderId: razorpayResponse.razorpay_order_id,
        razorpayPaymentId: razorpayResponse.razorpay_payment_id,
        razorpaySignature: razorpayResponse.razorpay_signature,
        planId: 'silver-monthly' // From original order creation
      })
    });

    const result = await response.json();
    if (result.success) {
      // Payment successful, subscription activated
      console.log('Subscription activated:', result.data);
      // Refresh user data or redirect to success page
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
  }
}
```

---

### 6. Get Payment History

**Endpoint:** `GET /api/payment/history?page=1&limit=10`

**Description:** Get user's payment transaction history with pagination.

#### Query Parameters
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

#### Response
```json
{
  "success": true,
  "data": [
    {
      "userId": "user_id",
      "amount": 1900,
      "currency": "INR",
      "status": "COMPLETED",
      "paymentMethod": "RAZORPAY",
      "razorpayOrderId": "order_xyz123",
      "razorpayPaymentId": "pay_abc456",
      "description": "Payment for Silver Plan",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:05:00.000Z"
    }
  ]
}
```

---

### 7. Cancel Subscription

**Endpoint:** `POST /api/payment/cancel-subscription`

**Description:** Cancel the user's active subscription.

#### Response
```json
{
  "success": true,
  "message": "Subscription cancelled successfully"
}
```

---

## Error Handling

All API endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message description",
  "code": "ERROR_CODE" // Optional error code
}
```

### Common Error Codes

| Error Code | Description |
|------------|-------------|
| `INVALID_PLAN` | Plan ID not found or inactive |
| `INSUFFICIENT_CREDITS` | User doesn't have enough credits |
| `PAYMENT_FAILED` | Payment processing failed |
| `SUBSCRIPTION_NOT_FOUND` | No active subscription found |
| `INVALID_SIGNATURE` | Webhook signature verification failed |

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions/credits)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Frontend Integration Guide

### 1. Setup Razorpay SDK

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### 2. Payment Flow Implementation

```javascript
class PaymentService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  // Get available plans
  async getPlans() {
    const response = await fetch('/api/payment/plans', {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    return response.json();
  }

  // Get user's current plan
  async getUserPlan() {
    const response = await fetch('/api/payment/user-plan', {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    return response.json();
  }

  // Create payment order
  async createOrder(planId) {
    const response = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ planId, interval: 'MONTHLY' })
    });
    return response.json();
  }

  // Initialize Razorpay payment
  initializePayment(orderData) {
    const options = {
      key: orderData.razorpayKey,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.orderId,
      name: 'Phyo Platform',
      description: `Subscribe to ${orderData.plan.displayName}`,
      handler: (response) => {
        this.verifyPayment(response, orderData.plan.id);
      },
      prefill: {
        // Optional: prefill user details
        name: 'User Name',
        email: 'user@example.com'
      }
    };

    const rzp = new Razorpay(options);
    return rzp;
  }

  // Verify payment after completion
  async verifyPayment(razorpayResponse, planId) {
    const response = await fetch('/api/payment/verify-payment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        razorpayOrderId: razorpayResponse.razorpay_order_id,
        razorpayPaymentId: razorpayResponse.razorpay_payment_id,
        razorpaySignature: razorpayResponse.razorpay_signature,
        planId: planId
      })
    });

    return response.json();
  }

  // Get payment history
  async getPaymentHistory(page = 1, limit = 10) {
    const response = await fetch(`/api/payment/history?page=${page}&limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    return response.json();
  }
}

// Usage example
const paymentService = new PaymentService();

// Subscribe to a plan
async function subscribeToPlan(planId) {
  try {
    // Create order
    const orderResult = await paymentService.createOrder(planId);
    if (!orderResult.success) throw new Error(orderResult.error);

    // Initialize payment
    const rzp = paymentService.initializePayment(orderResult.data);

    // Open payment modal
    rzp.open();
  } catch (error) {
    console.error('Subscription failed:', error);
  }
}
```

### 3. Credit Usage Tracking

```javascript
// Check credits before operations
async function checkCredits() {
  const result = await paymentService.getUserPlan();
  if (result.success) {
    const { creditsRemaining, currentPlan } = result.data;
    console.log(`Credits remaining: ${creditsRemaining}`);
    return creditsRemaining > 0 || currentPlan === 'PREMIUM';
  }
  return false;
}

// Example: Check credits before AI search
async function performAISearch(query) {
  if (!(await checkCredits())) {
    alert('Insufficient credits. Please upgrade your plan.');
    return;
  }

  // Proceed with search
  const searchResult = await fetch('/api/ask', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt: query })
  });

  return searchResult.json();
}
```

### 4. Subscription Status Monitoring

```javascript
// Check subscription status periodically
async function checkSubscriptionStatus() {
  const result = await paymentService.getUserPlan();
  if (result.success) {
    const { isActive, currentPlan, subscription } = result.data;

    if (!isActive) {
      // Handle inactive subscription
      showUpgradePrompt();
    }

    return { isActive, currentPlan, subscription };
  }
}

// Auto-refresh credits every 5 minutes
setInterval(async () => {
  const creditResult = await paymentService.getUserPlan();
  if (creditResult.success) {
    updateCreditDisplay(creditResult.data.creditsRemaining);
  }
}, 5 * 60 * 1000);
```

---

## Testing

### Using Postman Collection

1. Import the `Phyo_Server_API.postman_collection.json`
2. Set authentication token in collection variables
3. Test endpoints in the "Payment & Subscription Management" folder

### Test Payment Flow

1. **Create Order**: Use `/api/payment/create-order`
2. **Simulate Payment**: Use Razorpay test credentials
3. **Verify Payment**: Use `/api/payment/verify-payment` with test data

### Test Credentials (Sandbox)

```javascript
const RAZORPAY_TEST_KEY = 'rzp_test_RbXvyl4Znqufal';
const TEST_PAYMENT_ID = 'pay_test_abc123'; // Use actual test payment ID
const TEST_ORDER_ID = 'order_test_xyz789'; // Use actual test order ID
const TEST_SIGNATURE = 'test_signature_hash'; // Use actual signature
```

---

## Security Considerations

- **Never expose Razorpay keys** on the frontend
- **Always verify payments** on the backend
- **Use HTTPS** for all payment-related requests
- **Validate all input data** before processing
- **Implement rate limiting** on payment endpoints

---

## Support

For integration issues or questions:
- Check server logs for detailed error messages
- Use the test scripts: `npm run test:crypto`, `npm run test:webhook`
- Refer to Razorpay documentation for payment-specific issues
- Contact the development team for custom integration requirements

---

**Last Updated:** November 2025  
**Version:** 1.0.0  
**API Base URL:** `https://your-domain.com/api/payment/`
