# Phyo API Client Integration Guide

Complete integration of all 122 APIs from phyo_docker/server into phyo_client.

## Overview

All APIs are organized into logical service modules that can be imported and used throughout the application:

- **authService** - Authentication (12 endpoints)
- **userService** - User Management (5 endpoints)
- **campaignService** - Campaign Management (8 endpoints)
- **messagingService** - Conversations & Messages (9 endpoints)
- **uploadService** - File Management (3+ endpoints)
- **influencerService** - Influencer Data (9 endpoints)
- **projectService** - Project Management (6 endpoints)
- **portfolioService** - Portfolio Management (9 endpoints)
- **paymentService** - Payment Integration (8 endpoints)
- **adminService** - Admin Dashboard (6+ endpoints)
- **brandRequestService** - Brand Requests (14 endpoints)
- **influencerRequestService** - Influencer Requests (13 endpoints)
- **askService** - AI-powered Search (6 endpoints)
- **metaService** - Meta/Instagram Integration (8 endpoints)
- **brandUploadService** - Brand Assets (5+ endpoints)

**Total: 122+ endpoints**

## Installation & Setup

The API client is pre-configured with:
- Axios for HTTP requests
- Automatic token management (JWT)
- Request/response interceptors
- Error handling
- TypeScript support

## Basic Usage

### 1. Importing Services

```typescript
import { authService, userService, campaignService } from '@/services';
```

### 2. Using Services in Components

#### Class Component Example
```typescript
import { Component } from 'react';
import { campaignService } from '@/services';

class CampaignPage extends Component {
  state = { campaigns: [], loading: true, error: null };

  async componentDidMount() {
    try {
      const data = await campaignService.getCampaigns();
      this.setState({ campaigns: data.data, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }

  render() {
    const { campaigns, loading, error } = this.state;
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return <div>{/* Render campaigns */}</div>;
  }
}
```

#### Function Component with Hooks
```typescript
'use client';

import { useEffect, useState } from 'react';
import { campaignService } from '@/services';

export default function CampaignPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    campaignService
      .getCampaigns()
      .then((data) => {
        setCampaigns(data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{/* Render campaigns */}</div>;
}
```

#### Using Custom API Hooks (Recommended)
```typescript
'use client';

import { useApiQuery, useApiMutation } from '@/hooks/useApi';
import { campaignService, CreateCampaignRequest } from '@/services';

export default function CampaignPage() {
  // Query - for fetching data
  const { data: campaigns, loading, error } = useApiQuery(
    () => campaignService.getCampaigns(),
    []
  );

  // Mutation - for creating/updating data
  const { submit: createCampaign, loading: creating } = useApiMutation(
    (data: CreateCampaignRequest) => campaignService.createCampaign(data)
  );

  const handleCreate = async () => {
    try {
      await createCampaign({
        title: 'My Campaign',
        description: 'Campaign description',
        startDate: '2026-03-15',
        endDate: '2026-04-15',
        budget: 5000
      });
    } catch (error) {
      console.error('Failed to create campaign');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={handleCreate} disabled={creating}>
        {creating ? 'Creating...' : 'Create Campaign'}
      </button>
      {campaigns?.data?.map((campaign) => (
        <div key={campaign.id}>{campaign.title}</div>
      ))}
    </div>
  );
}
```

## Service Examples

### Authentication

```typescript
import { authService } from '@/services';

// Sign up
await authService.signup({
  email: 'user@example.com',
  password: 'password123',
  confirmPassword: 'password123',
  role: 'influencer'
});

// Login
await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Logout
authService.logout();

// Google OAuth
await authService.googleAuth({
  token: 'google_token',
  role: 'brand'
});
```

### Campaigns

```typescript
import { campaignService } from '@/services';

// Get all campaigns
const response = await campaignService.getCampaigns({ page: 1, limit: 10 });

// Create campaign
await campaignService.createCampaign({
  title: 'Campaign Title',
  description: 'Description',
  startDate: '2026-03-15',
  endDate: '2026-04-15',
  budget: 10000
});

// Update campaign
await campaignService.updateCampaign('campaignId', {
  title: 'Updated Title',
  status: 'paused'
});

// Apply to campaign (Influencer)
await campaignService.applyToCampaign('campaignId');

// Select influencer (Brand)
await campaignService.selectInfluencer('campaignId', 'influencerId');
```

### Messaging

```typescript
import { messagingService } from '@/services';

// Create conversation
const conversation = await messagingService.createConversation(['userId1', 'userId2']);

// Send message
await messagingService.sendMessage('conversationId', 'Hello!');

// Send message with file
const file = new File(['...'], 'document.pdf');
await messagingService.sendMessage('conversationId', 'See attachment', file);

// Get messages
const messages = await messagingService.getMessages('conversationId', { page: 1, limit: 20 });

// Mark as read
await messagingService.markAsRead('messageId');
```

### File Upload

```typescript
import { uploadService } from '@/services';

// Upload single file
const file = new File(['...'], 'image.jpg');
const response = await uploadService.uploadFile(file);
console.log(response.url); // Public URL

// Upload image (with compression)
const imageResponse = await uploadService.uploadImage(imageFile);

// Upload video with progress
await uploadService.uploadVideo(videoFile, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});

// Delete file
await uploadService.deleteFile('fileId');
```

### Influencers

```typescript
import { influencerService } from '@/services';

// Search influencers
const results = await influencerService.searchInfluencers('Instagram', {
  category: 'fashion',
  minFollowers: 10000
});

// Advanced search
const filtered = await influencerService.advancedSearch({
  category: 'technology',
  platforms: ['Instagram', 'TikTok'],
  minFollowers: 50000,
  sortBy: 'engagement'
});

// Get influencer details
const influencer = await influencerService.getInfluencerById('influencerId');

// Get influencer stats
const stats = await influencerService.getInfluencerStats('influencerId');

// Rate influencer
await influencerService.rateInfluencer('influencerId', 5, 'Great work!');
```

### Payment

```typescript
import { paymentService } from '@/services';

// Get payment plans
const plans = await paymentService.getPlans();

// Get current plan
const currentPlan = await paymentService.getCurrentPlan();

// Create order
const order = await paymentService.createOrder('planId');

// Verify payment (after Razorpay)
await paymentService.verifyPayment({
  razorpayPaymentId: 'pay_xxx',
  razorpayOrderId: 'order_xxx',
  razorpaySignature: 'sig_xxx'
});

// Get payment history
const history = await paymentService.getPaymentHistory({ page: 1, limit: 10 });

// Get credits
const credits = await paymentService.getCredits();

// Cancel subscription
await paymentService.cancelSubscription();
```

### Admin Dashboard

```typescript
import { adminService } from '@/services';

// Get dashboard stats
const stats = await adminService.getStats();

// Get pending requests
const requests = await adminService.getRequests({ page: 1, limit: 20 });

// Approve request
await adminService.approveRequest('requestId', 'Approved');

// Reject request
await adminService.rejectRequest('requestId', 'Reason for rejection');

// Get all users
const users = await adminService.getUsers({ page: 1, limit: 10 });

// Get all influencers
const influencers = await adminService.getInfluencers({ page: 1, limit: 10 });

// Delete user
await adminService.deleteUser('userId');
```

### Requests (Brand & Influencer)

```typescript
import { brandRequestService, influencerRequestService } from '@/services';

// Brand requesting influencer
await brandRequestService.createRequest({
  influencerId: 'influencerId',
  campaignId: 'campaignId',
  type: 'collaboration',
  message: 'Would you like to collaborate?'
});

// Accept brand request
await influencerRequestService.acceptRequest('requestId');

// Reject influencer request
await brandRequestService.rejectRequest('requestId', 'Not interested');

// Get pending count
const count = await brandRequestService.getPendingCount();
```

### Meta/Instagram Integration

```typescript
import { metaService } from '@/services';

// Get OAuth URL
const { url, state } = await metaService.getOAuthUrl();
// Redirect user to url

// Handle OAuth callback
await metaService.handleOAuthCallback('code', 'state');

// Check connection status
const status = await metaService.getStatus();
if (status.connected) {
  console.log('Connected to account:', status.accountName);
}

// Get ad accounts
const accounts = await metaService.getAdAccounts();

// Get campaign insights
const insights = await metaService.getCampaignInsights('campaignId');

// Disconnect
await metaService.disconnect();
```

## Error Handling

```typescript
import { useApiMutation } from '@/hooks/useApi';
import { campaignService } from '@/services';

const { submit, loading, error } = useApiMutation(
  (data) => campaignService.createCampaign(data)
);

try {
  await submit({ title: 'Campaign', /* ... */ });
} catch (error) {
  if (error.response?.status === 400) {
    console.error('Validation error:', error.response.data);
  } else if (error.response?.status === 401) {
    console.error('Unauthorized - please login');
  } else {
    console.error('Error:', error.message);
  }
}

if (error) {
  return <div>Error: {error.message}</div>;
}
```

## Token Management

Tokens are automatically managed:

```typescript
// Token is automatically stored after login/signup
await authService.login({ email: '...', password: '...' });
// localStorage.authToken is set automatically

// Token is automatically sent with every request
// (handled by request interceptor)

// Token is removed on logout
authService.logout();
// localStorage.authToken is removed
```

## TypeScript Types

All services are fully typed:

```typescript
import type {
  Campaign,
  CreateCampaignRequest,
  Influencer,
  User,
  Message,
  PaymentPlan,
  AdminStats
} from '@/services';

const campaign: Campaign = {
  id: '...',
  title: '...',
  // ...
};
```

## Custom API Client

If you need to make custom API calls:

```typescript
import { apiClient } from '@/services';

// GET request
const response = await apiClient.get('/custom-endpoint');

// POST request
await apiClient.post('/custom-endpoint', { data: 'value' });

// PUT request
await apiClient.put('/custom-endpoint', { data: 'value' });

// DELETE request
await apiClient.delete('/custom-endpoint');
```

## API Configuration

The API client is configured in `.env.local`:

```
NEXT_PUBLIC_API_URL=https://api.phyo.ai/api
NEXT_PUBLIC_WS_URL=https://api.phyo.ai
```

## Real-time Updates (WebSocket)

For real-time messaging:

```typescript
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_WS_URL);

// Join conversation
socket.emit('join-conversation', { conversationId: '...' });

// Listen for messages
socket.on('message-received', (message) => {
  console.log('New message:', message);
});

// Send message via WebSocket (alternative to REST)
socket.emit('send-message', {
  conversationId: '...',
  content: 'Hello!'
});

// Listen for typing indicator
socket.on('user-typing', (data) => {
  console.log(`${data.userId} is typing...`);
});
```

## Best Practices

1. **Use custom hooks** - Prefer `useApiQuery` and `useApiMutation` over direct service calls
2. **Handle errors** - Always wrap API calls in try-catch or use error state
3. **Show loading states** - Display loading indicators during API calls
4. **Pagination** - Use `usePagination` hook for list pagination
5. **Type safety** - Always use TypeScript types from services
6. **Token refresh** - Tokens are automatically validated (401 redirects to login)
7. **Environment variables** - Use environment variables for API URLs
8. **Debounce searches** - Debounce search API calls to avoid rate limiting

## Summary

- 15 service modules covering all 122 endpoints
- Full TypeScript support
- Automatic token management
- Custom React hooks for common patterns
- Comprehensive error handling
- Ready for production use

All services are organized, documented, and ready to integrate into any component!
