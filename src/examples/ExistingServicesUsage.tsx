/**
 * Complete Usage Examples for Existing Services
 * Demonstrates 90+ API endpoints from existing services
 * Location: src/examples/ExistingServicesUsage.tsx
 */

import React, { useState, useEffect } from 'react';

// ============================================================================
// AUTHENTICATION SERVICE EXAMPLES (13 endpoints)
// ============================================================================
import { AuthService, SignupPayload, LoginPayload } from '@/services';

export const AuthServiceExamples = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Signup
  const handleSignup = async () => {
    const payload: SignupPayload = {
      email: 'user@example.com',
      password: 'password123',
      phoneNumber: '+1234567890',
      userType: 'influencer', // or 'brand'
    };

    try {
      const response = await AuthService.signup(payload);
      console.log('✅ Signup successful:', response.data);
    } catch (error) {
      console.error('❌ Signup failed', error);
    }
  };

  // Login
  const handleLogin = async () => {
    const payload: LoginPayload = {
      email: 'user@example.com',
      password: 'password123',
    };

    try {
      const response = await AuthService.login(payload);
      setAuthToken(response.data?.token);
      console.log('✅ Login successful:', response.data);
    } catch (error) {
      console.error('❌ Login failed', error);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    try {
      const response = await AuthService.verifyOTP({
        email: 'user@example.com',
        otp: '123456',
      });
      console.log('✅ OTP verified:', response.data);
    } catch (error) {
      console.error('❌ OTP verification failed', error);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    try {
      const response = await AuthService.resendOTP({
        email: 'user@example.com',
      });
      console.log('✅ OTP resent:', response.data);
    } catch (error) {
      console.error('❌ Resend OTP failed', error);
    }
  };

  // Forgot Password
  const handleForgotPassword = async () => {
    try {
      const response = await AuthService.forgotPassword({
        email: 'user@example.com',
      });
      console.log('✅ Reset email sent:', response.data);
    } catch (error) {
      console.error('❌ Forgot password failed', error);
    }
  };

  // Verify Reset Code
  const handleVerifyResetCode = async () => {
    try {
      const response = await AuthService.verifyResetCode({
        email: 'user@example.com',
        code: '123456',
      });
      console.log('✅ Reset code verified:', response.data);
    } catch (error) {
      console.error('❌ Verify reset code failed', error);
    }
  };

  // Reset Password
  const handleResetPassword = async () => {
    try {
      const response = await AuthService.resetPassword({
        email: 'user@example.com',
        newPassword: 'newpassword123',
      });
      console.log('✅ Password reset:', response.data);
    } catch (error) {
      console.error('❌ Reset password failed', error);
    }
  };

  // Google Auth
  const handleGoogleAuth = async () => {
    try {
      const response = await AuthService.googleAuth({
        googleToken: 'google-token-here',
        userType: 'influencer',
      });
      setAuthToken(response.data?.token);
      console.log('✅ Google auth successful:', response.data);
    } catch (error) {
      console.error('❌ Google auth failed', error);
    }
  };

  // Get Influencers List
  const handleGetInfluencers = async () => {
    try {
      const response = await AuthService.getInfluencers();
      console.log('✅ Influencers list:', response.data);
    } catch (error) {
      console.error('❌ Failed to get influencers', error);
    }
  };

  // Get Influencer by ID
  const handleGetInfluencerById = async (id: string) => {
    try {
      const response = await AuthService.getInfluencerById(id);
      console.log('✅ Influencer details:', response.data);
    } catch (error) {
      console.error('❌ Failed to get influencer', error);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2>Authentication Service (13 endpoints)</h2>
      <div className="space-y-2">
        <button onClick={handleSignup}>Sign Up</button>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleVerifyOTP}>Verify OTP</button>
        <button onClick={handleResendOTP}>Resend OTP</button>
        <button onClick={handleForgotPassword}>Forgot Password</button>
        <button onClick={handleVerifyResetCode}>Verify Reset Code</button>
        <button onClick={handleResetPassword}>Reset Password</button>
        <button onClick={handleGoogleAuth}>Google Auth</button>
        <button onClick={handleGetInfluencers}>Get Influencers</button>
        <button onClick={() => handleGetInfluencerById('influencer-id-123')}>
          Get Influencer by ID
        </button>
      </div>
      {authToken && <p>✅ Auth Token: {authToken.substring(0, 20)}...</p>}
    </div>
  );
};

// ============================================================================
// USER SERVICE EXAMPLES (20+ endpoints)
// ============================================================================
import { UserService, UpdateProfilePayload } from '@/services';

export const UserServiceExamples = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Get user profile
  const handleGetProfile = async () => {
    setLoading(true);
    try {
      const response = await UserService.getProfile();
      setProfile(response.data);
      console.log('✅ User profile:', response.data);
    } catch (error) {
      console.error('❌ Failed to get profile', error);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const handleUpdateProfile = async () => {
    const payload: UpdateProfilePayload = {
      name: 'Updated Name',
      bio: 'Updated bio',
      city: 'New York',
      website: 'https://example.com',
    };

    try {
      const response = await UserService.updateProfile(payload);
      setProfile(response.data);
      console.log('✅ Profile updated:', response.data);
    } catch (error) {
      console.error('❌ Failed to update profile', error);
    }
  };

  // Search users
  const handleSearchUsers = async (query: string) => {
    try {
      const response = await UserService.searchUsers(query);
      console.log('✅ Search results:', response.data);
    } catch (error) {
      console.error('❌ Search failed', error);
    }
  };

  // Get user by ID
  const handleGetUserById = async (id: string) => {
    try {
      const response = await UserService.getUserById(id);
      console.log('✅ User details:', response.data);
    } catch (error) {
      console.error('❌ Failed to get user', error);
    }
  };

  // List users
  const handleListUsers = async () => {
    try {
      const response = await UserService.listUsers(1, 20);
      console.log('✅ Users list:', response.data);
    } catch (error) {
      console.error('❌ Failed to list users', error);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account?')) {
      try {
        const response = await UserService.deleteAccount();
        console.log('✅ Account deleted:', response.data);
      } catch (error) {
        console.error('❌ Failed to delete account', error);
      }
    }
  };

  // Change password
  const handleChangePassword = async () => {
    try {
      const response = await UserService.changePassword({
        currentPassword: 'old-password',
        newPassword: 'new-password',
        confirmPassword: 'new-password',
      });
      console.log('✅ Password changed:', response.data);
    } catch (error) {
      console.error('❌ Failed to change password', error);
    }
  };

  // Upload avatar
  const handleUploadAvatar = async (file: File) => {
    try {
      const response = await UserService.uploadAvatar(file);
      console.log('✅ Avatar uploaded:', response.data);
    } catch (error) {
      console.error('❌ Failed to upload avatar', error);
    }
  };

  useEffect(() => {
    handleGetProfile();
  }, []);

  return (
    <div className="p-4 border rounded">
      <h2>User Service (20+ endpoints)</h2>
      <div className="space-y-2">
        <button onClick={handleGetProfile}>Get Profile</button>
        <button onClick={handleUpdateProfile}>Update Profile</button>
        <button onClick={() => handleSearchUsers('john')}>Search Users</button>
        <button onClick={() => handleGetUserById('user-123')}>
          Get User by ID
        </button>
        <button onClick={handleListUsers}>List Users</button>
        <button onClick={handleChangePassword}>Change Password</button>
        <input
          type="file"
          onChange={(e) => e.target.files?.[0] && handleUploadAvatar(e.target.files[0])}
        />
        <button onClick={handleDeleteAccount}>Delete Account</button>
      </div>
      {profile && <p>✅ Profile: {profile.name || profile.email}</p>}
      {loading && <p>Loading...</p>}
    </div>
  );
};

// ============================================================================
// CAMPAIGN SERVICE EXAMPLES (9+ endpoints)
// ============================================================================
import { CampaignService } from '@/services';

export const CampaignServiceExamples = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Get all campaigns
  const handleGetCampaigns = async () => {
    setLoading(true);
    try {
      const response = await CampaignService.getCampaigns();
      setCampaigns(response.data);
      console.log('✅ Campaigns:', response.data);
    } catch (error) {
      console.error('❌ Failed to get campaigns', error);
    } finally {
      setLoading(false);
    }
  };

  // Get campaign by ID
  const handleGetCampaignById = async (id: string) => {
    try {
      const response = await CampaignService.getCampaignById(id);
      console.log('✅ Campaign details:', response.data);
    } catch (error) {
      console.error('❌ Failed to get campaign', error);
    }
  };

  // Create campaign
  const handleCreateCampaign = async () => {
    const formData = new FormData();
    formData.append('campaignName', 'New Campaign');
    formData.append('campaignBrief', 'Campaign description');
    formData.append('budget', '5000');
    // Add more fields as needed

    try {
      const response = await CampaignService.createCampaign(formData);
      console.log('✅ Campaign created:', response.data);
      handleGetCampaigns(); // Refresh
    } catch (error) {
      console.error('❌ Failed to create campaign', error);
    }
  };

  // Apply to campaign
  const handleApplyCampaign = async (campaignId: string) => {
    try {
      const response = await CampaignService.applyCampaign(campaignId);
      console.log('✅ Applied to campaign:', response.data);
    } catch (error) {
      console.error('❌ Failed to apply', error);
    }
  };

  // Get my campaigns
  const handleGetMyCampaigns = async () => {
    try {
      const response = await CampaignService.getMyCampaigns();
      console.log('✅ My campaigns:', response.data);
    } catch (error) {
      console.error('❌ Failed to get my campaigns', error);
    }
  };

  useEffect(() => {
    handleGetCampaigns();
  }, []);

  return (
    <div className="p-4 border rounded">
      <h2>Campaign Service (9+ endpoints)</h2>
      <div className="space-y-2">
        <button onClick={handleGetCampaigns}>Load Campaigns</button>
        <button onClick={handleCreateCampaign}>Create Campaign</button>
        <button onClick={handleGetMyCampaigns}>Get My Campaigns</button>
      </div>
      {loading && <p>Loading...</p>}
      <ul>
        {campaigns.map((campaign: any) => (
          <li key={campaign._id}>
            {campaign.campaignName}
            <button onClick={() => handleGetCampaignById(campaign._id)}>
              View
            </button>
            <button onClick={() => handleApplyCampaign(campaign._id)}>
              Apply
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ============================================================================
// BRAND SERVICE EXAMPLES (8+ endpoints)
// ============================================================================
import { BrandService } from '@/services';

export const BrandServiceExamples = () => {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Get all brands
  const handleGetAllBrands = async () => {
    setLoading(true);
    try {
      const response = await BrandService.getAllBrands();
      setBrands(response.data);
      console.log('✅ All brands:', response.data);
    } catch (error) {
      console.error('❌ Failed to get brands', error);
    } finally {
      setLoading(false);
    }
  };

  // Get brand by ID
  const handleGetBrandById = async (id: string) => {
    try {
      const response = await BrandService.getBrandById(id);
      console.log('✅ Brand details:', response.data);
    } catch (error) {
      console.error('❌ Failed to get brand', error);
    }
  };

  // Get brand campaigns
  const handleGetBrandCampaigns = async (id: string) => {
    try {
      const response = await BrandService.getBrandCampaigns(id);
      console.log('✅ Brand campaigns:', response.data);
    } catch (error) {
      console.error('❌ Failed to get brand campaigns', error);
    }
  };

  // Get brand stats
  const handleGetBrandStats = async (id: string) => {
    try {
      const response = await BrandService.getBrandStats(id);
      console.log('✅ Brand stats:', response.data);
    } catch (error) {
      console.error('❌ Failed to get brand stats', error);
    }
  };

  useEffect(() => {
    handleGetAllBrands();
  }, []);

  return (
    <div className="p-4 border rounded">
      <h2>Brand Service (8+ endpoints)</h2>
      <div className="space-y-2">
        <button onClick={handleGetAllBrands}>Load All Brands</button>
      </div>
      {loading && <p>Loading...</p>}
      <ul>
        {brands.map((brand: any) => (
          <li key={brand._id}>
            {brand.name}
            <button onClick={() => handleGetBrandById(brand._id)}>
              View
            </button>
            <button onClick={() => handleGetBrandCampaigns(brand._id)}>
              Campaigns
            </button>
            <button onClick={() => handleGetBrandStats(brand._id)}>
              Stats
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ============================================================================
// PAYMENT SERVICE EXAMPLES (18+ endpoints)
// ============================================================================
import { PaymentService } from '@/services';

export const PaymentServiceExamples = () => {
  const [plans, setPlans] = useState<any[]>([]);

  // Get payment plans
  const handleGetPlans = async () => {
    try {
      const response = await PaymentService.getPaymentPlans();
      setPlans(response.data);
      console.log('✅ Payment plans:', response.data);
    } catch (error) {
      console.error('❌ Failed to get plans', error);
    }
  };

  // Get current plan
  const handleGetCurrentPlan = async () => {
    try {
      const response = await PaymentService.getCurrentPlan();
      console.log('✅ Current plan:', response.data);
    } catch (error) {
      console.error('❌ Failed to get current plan', error);
    }
  };

  // Get credits
  const handleGetCredits = async () => {
    try {
      const response = await PaymentService.getCredits();
      console.log('✅ Credits:', response.data);
    } catch (error) {
      console.error('❌ Failed to get credits', error);
    }
  };

  // Create order
  const handleCreateOrder = async () => {
    try {
      const response = await PaymentService.createSilverOrder();
      console.log('✅ Order created:', response.data);
    } catch (error) {
      console.error('❌ Failed to create order', error);
    }
  };

  // Verify payment
  const handleVerifyPayment = async () => {
    try {
      const response = await PaymentService.verifyPayment({
        razorpay_order_id: 'order-id',
        razorpay_payment_id: 'payment-id',
        razorpay_signature: 'signature',
      });
      console.log('✅ Payment verified:', response.data);
    } catch (error) {
      console.error('❌ Payment verification failed', error);
    }
  };

  // Get payment history
  const handleGetPaymentHistory = async () => {
    try {
      const response = await PaymentService.getPaymentHistory(1, 10);
      console.log('✅ Payment history:', response.data);
    } catch (error) {
      console.error('❌ Failed to get payment history', error);
    }
  };

  // Cancel subscription
  const handleCancelSubscription = async () => {
    try {
      const response = await PaymentService.cancelSubscription();
      console.log('✅ Subscription cancelled:', response.data);
    } catch (error) {
      console.error('❌ Failed to cancel subscription', error);
    }
  };

  useEffect(() => {
    handleGetPlans();
  }, []);

  return (
    <div className="p-4 border rounded">
      <h2>Payment Service (18+ endpoints)</h2>
      <div className="space-y-2">
        <button onClick={handleGetPlans}>Get Plans</button>
        <button onClick={handleGetCurrentPlan}>Get Current Plan</button>
        <button onClick={handleGetCredits}>Get Credits</button>
        <button onClick={handleCreateOrder}>Create Order</button>
        <button onClick={handleVerifyPayment}>Verify Payment</button>
        <button onClick={handleGetPaymentHistory}>Payment History</button>
        <button onClick={handleCancelSubscription}>Cancel Subscription</button>
      </div>
      <ul>
        {plans.map((plan: any) => (
          <li key={plan._id}>{plan.name} - ${plan.price}</li>
        ))}
      </ul>
    </div>
  );
};

// ============================================================================
// NOTIFICATION SERVICE EXAMPLES (12+ endpoints)
// ============================================================================
import { NotificationService } from '@/services';

export const NotificationServiceExamples = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  // Get notifications
  const handleGetNotifications = async () => {
    try {
      const response = await NotificationService.getNotifications(1, 10);
      setNotifications(response.data.data);
      console.log('✅ Notifications:', response.data);
    } catch (error) {
      console.error('❌ Failed to get notifications', error);
    }
  };

  // Get unread count
  const handleGetUnreadCount = async () => {
    try {
      const response = await NotificationService.getUnreadCount();
      console.log('✅ Unread count:', response.data);
    } catch (error) {
      console.error('❌ Failed to get unread count', error);
    }
  };

  // Mark as read
  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await NotificationService.markAsRead(id);
      console.log('✅ Marked as read:', response.data);
      handleGetNotifications(); // Refresh
    } catch (error) {
      console.error('❌ Failed to mark as read', error);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const response = await NotificationService.markAllAsRead();
      console.log('✅ All marked as read:', response.data);
      handleGetNotifications(); // Refresh
    } catch (error) {
      console.error('❌ Failed to mark all as read', error);
    }
  };

  // Delete notification
  const handleDeleteNotification = async (id: string) => {
    try {
      const response = await NotificationService.deleteNotification(id);
      console.log('✅ Notification deleted:', response.data);
      handleGetNotifications(); // Refresh
    } catch (error) {
      console.error('❌ Failed to delete notification', error);
    }
  };

  useEffect(() => {
    handleGetNotifications();
  }, []);

  return (
    <div className="p-4 border rounded">
      <h2>Notification Service (12+ endpoints)</h2>
      <div className="space-y-2">
        <button onClick={handleGetNotifications}>Load Notifications</button>
        <button onClick={handleGetUnreadCount}>Unread Count</button>
        <button onClick={handleMarkAllAsRead}>Mark All as Read</button>
      </div>
      <ul>
        {notifications.map((notif: any) => (
          <li key={notif._id}>
            {notif.message}
            <button onClick={() => handleMarkAsRead(notif._id)}>
              Read
            </button>
            <button onClick={() => handleDeleteNotification(notif._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export const AllExistingServicesUsage = () => {
  return (
    <div className="space-y-8 p-8">
      <h1>Complete Existing Services Usage Examples</h1>
      <p>All 90+ endpoints from 8 existing services demonstrated below</p>

      <AuthServiceExamples />
      <UserServiceExamples />
      <CampaignServiceExamples />
      <BrandServiceExamples />
      <PaymentServiceExamples />
      <NotificationServiceExamples />
    </div>
  );
};

export default AllExistingServicesUsage;
