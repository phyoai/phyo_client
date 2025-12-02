# Google OAuth Integration Documentation

## Overview
This document explains the Google OAuth integration implemented in the Phyo application, allowing users to sign in/sign up using their Google accounts.

## Features Implemented

### 1. **Backend (Already Existing) ✅**
- Google OAuth endpoint: `POST /api/user/google`
- Verifies Google ID tokens using `google-auth-library`
- Supports linking existing email accounts with Google OAuth
- Creates new users if they don't exist
- Returns JWT token for authenticated sessions

### 2. **Frontend (Newly Implemented) ✅**

#### Files Modified/Created:

1. **`.env.local`** - Added Google Client ID configuration
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=1056581199715-rk69h1nevsldlek1sb3oft4itnnd5qoo.apps.googleusercontent.com
   ```

2. **`src/utils/googleAuth.js`** - Google OAuth utility functions
   - Loads Google Identity Services script dynamically
   - Initializes Google OAuth client
   - Handles sign-in prompts and button rendering

3. **`src/app/login/page.jsx`** - Updated Login Page
   - Integrated Google Sign-In button
   - Added `handleGoogleCallback` function
   - Communicates with backend API at `/api/user/google`
   - Stores authentication token and user data
   - Redirects to dashboard on successful login

4. **`src/app/signup/page.jsx`** - Updated Signup Page
   - Added Google Sign-Up button
   - Same OAuth flow as login
   - Creates new account or links existing account

## How It Works

### User Flow:

1. **User clicks "Continue with Google" button**
2. **Google Sign-In popup appears**
3. **User selects Google account and authorizes**
4. **Google returns ID token to frontend**
5. **Frontend sends ID token to backend** (`POST /api/user/google`)
6. **Backend verifies token with Google**
7. **Backend checks if user exists:**
   - If user exists with same email → Link Google OAuth to existing account
   - If user exists with Google ID → Login user
   - If new user → Create new account with type 'USER'
8. **Backend returns JWT token and user data**
9. **Frontend stores token and redirects to dashboard**

## API Endpoints

### Backend API: `POST {API_URL}/user/google`

The API URL is configured via environment variable:
- **Development**: `http://localhost:4000/api`
- **Production**: `https://api.phyo.ai/api`

**Request Body:**
```json
{
  "idToken": "string (Google ID token)",
  "type": "USER" | "BRAND" | "INFLUENCER" | "SERVICE_PROVIDER"
}
```

**Success Response (200):**
```json
{
  "message": "Google OAuth login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "type": "USER",
    "googleId": "google_user_id",
    "googleEmail": "user@example.com",
    "googleName": "User Name",
    "googlePicture": "profile_pic_url"
  }
}
```

**Error Response:**
```json
{
  "message": "Error message"
}
```

## Important Features

### ✅ Same Email Account Linking
- If a user previously signed up with email/password and later tries to sign in with Google using the same email, the system will:
  - Link the Google OAuth credentials to the existing account
  - User can now login with either method (email/password OR Google)
  - No duplicate accounts are created

### ✅ User Type Management
- Default user type is set to `'USER'` for both login and signup
- Can be customized based on requirements (BRAND, INFLUENCER, SERVICE_PROVIDER)

### ✅ Token Storage
- JWT token stored in `localStorage` as `authToken`
- User data stored in `localStorage` as `userData`
- User email stored in `localStorage` as `userEmail`

### ✅ Loading States
- Visual feedback during Google authentication process
- Disabled buttons prevent multiple submissions
- Error messages displayed for failed authentication

## Environment Variables Required

### Frontend (`.env.local`):
```env
# API Base URL (change based on environment)
NEXT_PUBLIC_API_URL=http://localhost:4000/api  # Development
# NEXT_PUBLIC_API_URL=https://api.phyo.ai/api  # Production

# Google OAuth Client ID
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1056581199715-rk69h1nevsldlek1sb3oft4itnnd5qoo.apps.googleusercontent.com

# Razorpay (optional, for payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RbXvyl4Znqufal
```

### Backend (`.env`):
```env
GOOGLE_CLIENT_ID=1056581199715-rk69h1nevsldlek1sb3oft4itnnd5qoo.apps.googleusercontent.com
JWT_SECRET=SECRET
```

## Google Cloud Console Setup

The Google OAuth credentials are already configured with:
- **Client ID**: `1056581199715-rk69h1nevsldlek1sb3oft4itnnd5qoo.apps.googleusercontent.com`
- **Authorized JavaScript origins**: Your frontend domain
- **Authorized redirect URIs**: Your callback URLs

## Testing the Integration

### Login Flow:
1. Go to `/login` page
2. Click "Continue with Google"
3. Select Google account
4. Should redirect to dashboard with token stored

### Signup Flow:
1. Go to `/signup` page
2. Click "Continue with Google"
3. Select Google account
4. Should create account and redirect to dashboard

### Account Linking Test:
1. Create account with email/password
2. Logout
3. Try to login with Google using same email
4. Account should be linked successfully
5. Can now login with either method

## Security Features

✅ **ID Token Verification**: Backend verifies token with Google  
✅ **JWT Authentication**: Secure session management  
✅ **No Password Storage**: Google OAuth users don't need passwords  
✅ **Account Linking**: Prevents duplicate accounts  
✅ **HTTPS Communication**: All API calls over secure connection  

## Troubleshooting

### Common Issues:

1. **"Failed to load Google script"**
   - Check internet connection
   - Verify Google Identity Services is not blocked

2. **"Invalid Google token"**
   - Check `GOOGLE_CLIENT_ID` matches in frontend and backend
   - Verify token hasn't expired

3. **"Failed to sign in with Google"**
   - Check backend API is running
   - Verify API endpoint URL is correct
   - Check CORS settings

4. **CORS / FedCM Errors** ✅ FIXED
   - **Issue**: `ERR_FAILED` or "Server did not send the correct CORS headers"
   - **Solution**: Disabled FedCM (Federated Credential Management) in Google Sign-In initialization
   - **Implementation**: Using `renderButton()` method instead of `prompt()` to avoid CORS issues
   - The Google button now renders directly in a div element instead of using popup prompt

### Recent Fixes Applied:

✅ **Updated Google OAuth Implementation** (December 2, 2025)
- Changed from popup-based `prompt()` to button-based `renderButton()` approach
- Disabled FedCM to prevent CORS issues: `use_fedcm_for_prompt: false`
- Added dedicated div containers (`#google-signin-button`, `#google-signup-button`) for Google buttons
- Google now renders its official button directly in the page
- More reliable and follows Google's latest best practices

✅ **Environment Variable Configuration** (December 2, 2025)
- All API URLs now use `NEXT_PUBLIC_API_URL` from environment variables
- Easy switching between development (`localhost:4000`) and production (`api.phyo.ai`)
- No hardcoded URLs in the codebase
- Fallback to localhost if env variable is not set

## Future Enhancements

- [ ] Add Google One Tap sign-in
- [ ] Implement automatic token refresh
- [ ] Add option to unlink Google account
- [ ] Support for multiple OAuth providers (LinkedIn, Facebook)
- [ ] Admin panel to manage OAuth users

## Support

For issues or questions, contact the development team.

---

**Last Updated**: December 2, 2025  
**Version**: 1.0.0
