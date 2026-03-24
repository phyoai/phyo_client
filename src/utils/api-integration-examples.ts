// @ts-nocheck
/**
 * API Integration Examples - Quick Reference
 * Shows how to use all 118+ API endpoints in your components
 * Location: src/utils/api-integration-examples.ts
 */

// ============================================================================
// 1. CONVERSATION SERVICE - 4 ENDPOINTS
// ============================================================================
import { ConversationService, IConversation, CreateConversationPayload } from '@/services';

// Example: Fetch all conversations
export async function fetchAllConversations() {
  try {
    const response = await ConversationService.getConversations();
    console.log('All conversations:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
}

// Example: Create new conversation
export async function createNewConversation(participantId: string) {
  try {
    const payload: CreateConversationPayload = { participantId };
    const response = await ConversationService.createConversation(payload);
    return response.data;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
}

// Example: Get conversation details
export async function fetchConversationDetails(conversationId: string) {
  try {
    const response = await ConversationService.getConversationById(conversationId);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
}

// Example: Delete conversation
export async function removeConversation(conversationId: string) {
  try {
    const response = await ConversationService.deleteConversation(conversationId);
    return response;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error;
  }
}

// ============================================================================
// 2. PORTFOLIO SERVICE - 9 ENDPOINTS
// ============================================================================
import {
  PortfolioService,
  IPortfolio,
  CreatePortfolioPayload,
  CreateClientPayload,
} from '@/services';

// Example: Complete portfolio workflow
export async function portfolioWorkflow() {
  try {
    // Create portfolio
    const createPayload: CreatePortfolioPayload = {
      title: 'My Professional Portfolio',
      description: 'Showcase of my best work',
    };
    const portfolioRes = await PortfolioService.createPortfolio(createPayload);
    const portfolioId = portfolioRes.data._id;

    // Get all portfolios
    const allRes = await PortfolioService.getPortfolios(1, 10);
    console.log('All portfolios:', allRes.data);

    // Get specific portfolio
    const detailRes = await PortfolioService.getPortfolioById(portfolioId);
    console.log('Portfolio details:', detailRes.data);

    // Add client
    const clientPayload: CreateClientPayload = {
      projectTitle: 'E-commerce Platform',
      clientName: 'Tech Company Inc',
      servicesProvided: ['Web Design', 'Development'],
      budget: 10000,
      projectStatus: 'Completed',
      startDate: '2024-01-01',
      endDate: '2024-06-01',
    };
    const clientRes = await PortfolioService.addClient(portfolioId, clientPayload);
    const clientId = clientRes.data.clients[0]._id;

    // Update client
    await PortfolioService.updateClient(portfolioId, clientId, {
      budget: 12000,
    });

    // Get stats
    const statsRes = await PortfolioService.getPortfolioStats(portfolioId);
    console.log('Portfolio stats:', statsRes.data);

    // Update portfolio
    await PortfolioService.updatePortfolio(portfolioId, {
      title: 'Updated Portfolio Title',
    });

    // Remove client
    await PortfolioService.removeClient(portfolioId, clientId);

    // Delete portfolio
    await PortfolioService.deletePortfolio(portfolioId);

    console.log('✅ Portfolio workflow complete');
  } catch (error) {
    console.error('❌ Portfolio workflow error:', error);
  }
}

// ============================================================================
// 3. PROJECT SERVICE - 6 ENDPOINTS
// ============================================================================
import { ProjectService, CreateProjectPayload } from '@/services';

// Example: Complete project workflow
export async function projectWorkflow() {
  try {
    // Create project
    const payload: CreateProjectPayload = {
      name: 'Mobile App Development',
      description: 'React Native application',
      progressPercentage: 0,
      date: new Date().toISOString(),
      status: 'In Progress',
    };
    const createRes = await ProjectService.createProject(payload);
    const projectId = createRes.data._id;

    // Get all projects
    const allRes = await ProjectService.getProjects({ status: 'In Progress' }, 1, 10);
    console.log('All projects:', allRes.data);

    // Get specific project
    const detailRes = await ProjectService.getProjectById(projectId);
    console.log('Project details:', detailRes.data);

    // Update project progress
    await ProjectService.updateProject(projectId, {
      progressPercentage: 50,
    });

    // Get project stats
    const statsRes = await ProjectService.getProjectStats();
    console.log('Project stats:', statsRes.data);

    // Delete project
    await ProjectService.deleteProject(projectId);

    console.log('✅ Project workflow complete');
  } catch (error) {
    console.error('❌ Project workflow error:', error);
  }
}

// ============================================================================
// 4. FILE UPLOAD SERVICE - 2 ENDPOINTS
// ============================================================================
import { FileUploadService } from '@/services';

// Example: Upload and delete file
export async function fileUploadWorkflow(file: File) {
  try {
    // Upload file
    const uploadRes = await FileUploadService.uploadFile(file);
    const fileKey = uploadRes.data.key;
    console.log('File uploaded:', uploadRes.data.url);

    // Delete file
    await FileUploadService.deleteFile(fileKey);
    console.log('File deleted');
  } catch (error) {
    console.error('File upload error:', error);
  }
}

// ============================================================================
// 5. TRENDING SERVICE - 4 ENDPOINTS
// ============================================================================
import { TrendingService } from '@/services';

// Example: Fetch all trending data
export async function fetchTrendingData() {
  try {
    const [influencers, campaigns, brands, categories] = await Promise.all([
      TrendingService.getTrendingInfluencers(20, 0),
      TrendingService.getTrendingCampaigns(6, 0),
      TrendingService.getTrendingBrands(8, 0),
      TrendingService.getTrendingCategories(),
    ]);

    return {
      trendingInfluencers: influencers.data.data,
      trendingCampaigns: campaigns.data.data,
      trendingBrands: brands.data.data,
      trendingCategories: categories.data.data,
    };
  } catch (error) {
    console.error('Error fetching trending data:', error);
    throw error;
  }
}

// ============================================================================
// 6. AI SEARCH SERVICE - 3 ENDPOINTS
// ============================================================================
import { AISearchService } from '@/services';

// Example: AI influencer search
export async function searchInfluencersWithAI(searchQuery: string) {
  try {
    // Search influencers
    const searchRes = await AISearchService.searchInfluencers(searchQuery);
    console.log('Search results:', searchRes.data);

    if (searchRes.data.data.length > 0) {
      // Get details of first result
      const firstResult = searchRes.data.data[0];
      const detailRes = await AISearchService.getInfluencerDetails(
        firstResult.name
      );
      console.log('Influencer details:', detailRes.data);
    }

    // Get debug info
    const debugRes = await AISearchService.getDebugInfo();
    console.log('Database info:', debugRes.data);

    return searchRes.data.data;
  } catch (error) {
    console.error('AI search error:', error);
    throw error;
  }
}

// ============================================================================
// 7. AUTH SERVICE - 13 ENDPOINTS
// ============================================================================
import { AuthService, SignupPayload, LoginPayload } from '@/services';

// Example: Complete auth workflow
export async function authWorkflow() {
  try {
    // Signup
    const signupPayload: SignupPayload = {
      email: 'user@example.com',
      password: 'password123',
      phoneNumber: '+1234567890',
      userType: 'influencer',
    };
    const signupRes = await AuthService.signup(signupPayload);
    console.log('User registered:', signupRes.data);

    // Login
    const loginPayload: LoginPayload = {
      email: 'user@example.com',
      password: 'password123',
    };
    const loginRes = await AuthService.login(loginPayload);
    const token = loginRes.data.token;
    console.log('User logged in, token:', token);

    // Verify OTP
    await AuthService.verifyOTP({
      email: 'user@example.com',
      otp: '123456',
    });

    // Get influencers list
    const influencersRes = await AuthService.getInfluencers();
    console.log('Influencers:', influencersRes.data);
  } catch (error) {
    console.error('Auth workflow error:', error);
  }
}

// ============================================================================
// 8. USER SERVICE - 20+ ENDPOINTS
// ============================================================================
import { UserService, UpdateProfilePayload } from '@/services';

// Example: User profile management
export async function userProfileWorkflow() {
  try {
    // Get profile
    const profileRes = await UserService.getProfile();
    console.log('User profile:', profileRes.data);

    // Update profile
    const updatePayload: UpdateProfilePayload = {
      name: 'Updated Name',
      bio: 'Professional bio',
      website: 'https://example.com',
    };
    const updateRes = await UserService.updateProfile(updatePayload);
    console.log('Profile updated:', updateRes.data);

    // Search users
    const searchRes = await UserService.searchUsers('john');
    console.log('Search results:', searchRes.data);

    // Get activity log
    const activityRes = await UserService.getActivityLog();
    console.log('Activity log:', activityRes.data);

    // Change password
    await UserService.changePassword({
      currentPassword: 'old-pass',
      newPassword: 'new-pass',
      confirmPassword: 'new-pass',
    });
    console.log('Password changed');
  } catch (error) {
    console.error('User profile error:', error);
  }
}

// ============================================================================
// 9. CAMPAIGN SERVICE - 9+ ENDPOINTS
// ============================================================================
import { CampaignService } from '@/services';

// Example: Campaign management
export async function campaignWorkflow() {
  try {
    // Get all campaigns
    const allRes = await CampaignService.getCampaigns();
    console.log('All campaigns:', allRes.data);

    if (allRes.data.length > 0) {
      const campaignId = allRes.data[0]._id;

      // Get specific campaign
      const detailRes = await CampaignService.getCampaignById(campaignId);
      console.log('Campaign details:', detailRes.data);

      // Apply to campaign
      const applyRes = await CampaignService.applyCampaign(campaignId);
      console.log('Applied to campaign:', applyRes.data);
    }

    // Get my campaigns
    const myRes = await CampaignService.getMyCampaigns();
    console.log('My campaigns:', myRes.data);
  } catch (error) {
    console.error('Campaign error:', error);
  }
}

// ============================================================================
// 10. BRAND SERVICE - 8+ ENDPOINTS
// ============================================================================
import { BrandService } from '@/services';

// Example: Brand management
export async function brandWorkflow() {
  try {
    // Get all brands
    const allRes = await BrandService.getAllBrands();
    console.log('All brands:', allRes.data);

    if (allRes.data.length > 0) {
      const brandId = allRes.data[0]._id;

      // Get brand details
      const detailRes = await BrandService.getBrandById(brandId);
      console.log('Brand details:', detailRes.data);

      // Get brand campaigns
      const campaignsRes = await BrandService.getBrandCampaigns(brandId);
      console.log('Brand campaigns:', campaignsRes.data);

      // Get brand stats
      const statsRes = await BrandService.getBrandStats(brandId);
      console.log('Brand stats:', statsRes.data);
    }
  } catch (error) {
    console.error('Brand error:', error);
  }
}

// ============================================================================
// 11. PAYMENT SERVICE - 18+ ENDPOINTS
// ============================================================================
import { PaymentService } from '@/services';

// Example: Payment workflow
export async function paymentWorkflow() {
  try {
    // Get plans
    const plansRes = await PaymentService.getPaymentPlans();
    console.log('Payment plans:', plansRes.data);

    // Get current plan
    const currentRes = await PaymentService.getCurrentPlan();
    console.log('Current plan:', currentRes.data);

    // Get credits
    const creditsRes = await PaymentService.getCredits();
    console.log('Credits:', creditsRes.data);

    // Create order
    const orderRes = await PaymentService.createSilverOrder();
    console.log('Order created:', orderRes.data);

    // Verify payment
    const verifyRes = await PaymentService.verifyPayment({
      razorpay_order_id: 'order-123',
      razorpay_payment_id: 'payment-123',
      razorpay_signature: 'sig-123',
    });
    console.log('Payment verified:', verifyRes.data);

    // Get payment history
    const historyRes = await PaymentService.getPaymentHistory(1, 10);
    console.log('Payment history:', historyRes.data);
  } catch (error) {
    console.error('Payment error:', error);
  }
}

// ============================================================================
// 12. NOTIFICATION SERVICE - 12+ ENDPOINTS
// ============================================================================
import { NotificationService } from '@/services';

// Example: Notification management
export async function notificationWorkflow() {
  try {
    // Get notifications
    const notifRes = await NotificationService.getNotifications(1, 10);
    console.log('Notifications:', notifRes.data);

    // Get unread count
    const countRes = await NotificationService.getUnreadCount();
    console.log('Unread count:', countRes.data);

    // Mark all as read
    await NotificationService.markAllAsRead();
    console.log('All marked as read');

    // Get notification settings
    const settingsRes = await NotificationService.getNotificationSettings();
    console.log('Settings:', settingsRes.data);
  } catch (error) {
    console.error('Notification error:', error);
  }
}

// ============================================================================
// MASTER FUNCTION - Run all examples
// ============================================================================
export async function runAllApiExamples() {
  console.log('🚀 Starting all API examples...\n');

  try {
    console.log('1️⃣ Running conversation workflow...');
    await fetchAllConversations();

    console.log('2️⃣ Running portfolio workflow...');
    await portfolioWorkflow();

    console.log('3️⃣ Running project workflow...');
    await projectWorkflow();

    console.log('4️⃣ Running trending data fetch...');
    await fetchTrendingData();

    console.log('5️⃣ Running AI search...');
    await searchInfluencersWithAI('fashion influencers');

    console.log('6️⃣ Running auth workflow...');
    await authWorkflow();

    console.log('7️⃣ Running user profile workflow...');
    await userProfileWorkflow();

    console.log('8️⃣ Running campaign workflow...');
    await campaignWorkflow();

    console.log('9️⃣ Running brand workflow...');
    await brandWorkflow();

    console.log('🔟 Running payment workflow...');
    await paymentWorkflow();

    console.log('1️⃣1️⃣ Running notification workflow...');
    await notificationWorkflow();

    console.log('\n✅ All API examples completed successfully!');
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

// ============================================================================
// UTILITY: Check API endpoint availability
// ============================================================================
export async function checkApiHealth() {
  const endpoints = [
    { name: 'Conversations', endpoint: '/api/conversation' },
    { name: 'Portfolios', endpoint: '/api/portfolios' },
    { name: 'Projects', endpoint: '/api/projects' },
    { name: 'Trending', endpoint: '/api/trending/influencers' },
    { name: 'AI Search', endpoint: '/api/ask' },
    { name: 'Brands', endpoint: '/api/brand' },
    { name: 'Users', endpoint: '/api/users/profile' },
    { name: 'Campaigns', endpoint: '/api/campaigns' },
    { name: 'Payments', endpoint: '/api/payment/plans' },
    { name: 'Notifications', endpoint: '/api/notifications' },
  ];

  console.log('🏥 Checking API health...\n');

  for (const { name, endpoint } of endpoints) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      const status = response.status === 200 ? '✅' : '⚠️';
      console.log(`${status} ${name}: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${name}: Connection failed`);
    }
  }
}

// ============================================================================
// Export all functions
// ============================================================================
export const ApiExamples = {
  conversations: {
    fetchAll: fetchAllConversations,
    create: createNewConversation,
    getDetails: fetchConversationDetails,
    delete: removeConversation,
  },
  portfolio: {
    workflow: portfolioWorkflow,
  },
  projects: {
    workflow: projectWorkflow,
  },
  files: {
    workflow: fileUploadWorkflow,
  },
  trending: {
    fetchAll: fetchTrendingData,
  },
  aiSearch: {
    search: searchInfluencersWithAI,
  },
  auth: {
    workflow: authWorkflow,
  },
  users: {
    workflow: userProfileWorkflow,
  },
  campaigns: {
    workflow: campaignWorkflow,
  },
  brands: {
    workflow: brandWorkflow,
  },
  payments: {
    workflow: paymentWorkflow,
  },
  notifications: {
    workflow: notificationWorkflow,
  },
  health: {
    check: checkApiHealth,
  },
  runAll: runAllApiExamples,
};
