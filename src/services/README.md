# API Services - Complete Reference

All 122 endpoints from phyo_docker/server are organized into 15 service modules.

## 🚀 Quick Navigation

### Start Here
- **New to API integration?** → Read [INTEGRATION_QUICK_START.md](../INTEGRATION_QUICK_START.md) (5 min read)
- **Full documentation?** → Read [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) (comprehensive)
- **Integration overview?** → Read [API_CLIENT_INTEGRATION_SUMMARY.md](../API_CLIENT_INTEGRATION_SUMMARY.md)

### Service Modules

#### Authentication & Authorization
- **[auth.service.ts](./auth.service.ts)** - 12 endpoints
  - signup, login, logout, OAuth, OTP, password reset
  - Usage: `import { authService } from '@/services'`

#### User Management
- **[user.service.ts](./user.service.ts)** - 5 endpoints
  - profile, update, search, delete account
  - Usage: `import { userService } from '@/services'`

#### Campaign Management
- **[campaign.service.ts](./campaign.service.ts)** - 8 endpoints
  - create, read, update, delete, apply, select influencers
  - Usage: `import { campaignService } from '@/services'`

#### Messaging & Conversations
- **[messaging.service.ts](./messaging.service.ts)** - 9 endpoints
  - conversations, messages, read status
  - Usage: `import { messagingService } from '@/services'`

#### File Uploads
- **[upload.service.ts](./upload.service.ts)** - 3+ endpoints
  - upload, delete, history with progress tracking
  - Usage: `import { uploadService } from '@/services'`

#### Influencer Data
- **[influencer.service.ts](./influencer.service.ts)** - 9 endpoints
  - search, filter, analytics, statistics
  - Usage: `import { influencerService } from '@/services'`

#### Project Management
- **[project.service.ts](./project.service.ts)** - 6 endpoints
  - CRUD operations, statistics
  - Usage: `import { projectService } from '@/services'`

#### Portfolio Management
- **[portfolio.service.ts](./portfolio.service.ts)** - 9 endpoints
  - portfolio CRUD, client management
  - Usage: `import { portfolioService } from '@/services'`

#### Payment Integration
- **[payment.service.ts](./payment.service.ts)** - 8 endpoints
  - plans, credits, orders, verification, history
  - Usage: `import { paymentService } from '@/services'`

#### Admin Dashboard
- **[admin.service.ts](./admin.service.ts)** - 6+ endpoints
  - users, requests, statistics, manage influencers
  - Usage: `import { adminService } from '@/services'`

#### Brand Requests
- **[brandRequest.service.ts](./brandRequest.service.ts)** - 14 endpoints
  - create, accept, reject, filter, bulk actions
  - Usage: `import { brandRequestService } from '@/services'`

#### Influencer Requests
- **[influencerRequest.service.ts](./influencerRequest.service.ts)** - 13 endpoints
  - create, accept, reject, filter, bulk actions
  - Usage: `import { influencerRequestService } from '@/services'`

#### AI-Powered Search
- **[ask.service.ts](./ask.service.ts)** - 6 endpoints
  - AI search, Instagram reels, trending
  - Usage: `import { askService } from '@/services'`

#### Meta/Instagram Integration
- **[meta.service.ts](./meta.service.ts)** - 8 endpoints
  - OAuth, ad accounts, campaigns, insights
  - Usage: `import { metaService } from '@/services'`

#### Brand Assets
- **[brandUpload.service.ts](./brandUpload.service.ts)** - 5+ endpoints
  - upload, manage, verify brand assets
  - Usage: `import { brandUploadService } from '@/services'`

### Core Files

#### [api.ts](./api.ts)
Base Axios client with interceptors
- Automatic token injection in all requests
- Automatic 401 handling (redirect to login)
- Centralized error handling
- Response transformation

#### [types.ts](./types.ts)
Complete TypeScript interface definitions (400+ types)
- Request types (SignupRequest, CreateCampaignRequest, etc.)
- Response types (User, Campaign, Message, etc.)
- Pagination and utility types
- Full IntelliSense support

#### [index.ts](./index.ts)
Barrel export for all services and types
- Import everything from '@/services'
- Clean namespace management

## 📚 Usage Examples

### Basic Service Usage
```typescript
import { campaignService } from '@/services';

// Get campaigns
const campaigns = await campaignService.getCampaigns({ page: 1, limit: 10 });

// Create campaign
const campaign = await campaignService.createCampaign({
  title: 'My Campaign',
  description: 'Description',
  budget: 5000,
  startDate: '2026-03-15',
  endDate: '2026-04-15'
});
```

### Using Custom Hooks
```typescript
'use client';

import { useApiQuery } from '@/hooks/useApi';
import { campaignService } from '@/services';

export default function MyComponent() {
  const { data, loading, error } = useApiQuery(
    () => campaignService.getCampaigns(),
    [] // dependencies
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Render data */}</div>;
}
```

### Authentication
```typescript
import { authService } from '@/services';

// Login
const { token, user } = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});
// Token automatically stored and sent with all requests

// Logout
authService.logout();
```

## 🎯 Common Patterns

### Search with Pagination
See [examples/InfluencerSearchExample.tsx](../components/examples/InfluencerSearchExample.tsx)

### CRUD Operations
See [examples/CampaignsExample.tsx](../components/examples/CampaignsExample.tsx)

## 📋 Complete Endpoint List

**122+ endpoints** across 15 services:
- Authentication: 12
- Users: 5
- Campaigns: 8
- Messaging: 9
- Uploads: 3+
- Influencers: 9
- Projects: 6
- Portfolios: 9
- Payments: 8
- Admin: 6+
- Brand Requests: 14
- Influencer Requests: 13
- Ask/Search: 6
- Meta: 8
- Brand Upload: 5+

See [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) for complete reference.

## 🔒 Security

- ✅ Automatic token management
- ✅ Secure token storage (localStorage)
- ✅ JWT bearer token in headers
- ✅ Automatic logout on 401
- ✅ CORS protection
- ✅ Request validation
- ✅ Input sanitization

## 🎨 TypeScript Support

All services are fully typed:
```typescript
import type { Campaign, CreateCampaignRequest, User } from '@/services';

const campaign: Campaign = {
  id: '123',
  title: 'My Campaign',
  // Full type checking
};
```

## 🚀 Getting Started

1. **Import services** where needed
2. **Use custom hooks** for data fetching
3. **Handle errors** with try-catch
4. **Show loading states** during API calls
5. **Manage authentication** with authService

## 📞 Documentation

| Document | Purpose |
|----------|---------|
| [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) | Complete API reference with examples |
| [INTEGRATION_QUICK_START.md](../INTEGRATION_QUICK_START.md) | 5-minute quick start guide |
| [API_CLIENT_INTEGRATION_SUMMARY.md](../API_CLIENT_INTEGRATION_SUMMARY.md) | Integration overview and summary |

## ✅ Features

✅ All 122+ endpoints covered
✅ Full TypeScript support
✅ Automatic token management
✅ Custom React hooks
✅ Error handling
✅ Request/response interceptors
✅ File upload support
✅ Pagination helpers
✅ Real-time messaging (WebSocket)
✅ Production-ready

---

**Start building!** Import a service and start using the APIs in your components.
