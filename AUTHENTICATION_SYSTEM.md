# Authentication System Documentation

## Overview
This document describes the authentication system implemented for the Phyo platform, which protects brand, influencer, and service provider routes while providing a seamless user experience through brand-specific signup.

## Authentication Flow

### 1. User Registration (Brand Signup Only)
- **Entry Point**: `/brand/signup`
- **Process**: Multi-step form using `FormContainer` component
- **Steps**:
  1. **Account Creation**: Email, password, confirm password
  2. **Brand Details**: Brand name, website (optional)
- **Integration**: Uses `AuthContext.signup()` method
- **Redirect**: After successful signup, redirects to `/brand/dashboard` or original requested URL

### 2. Route Protection
- **Server-side**: Middleware protects routes at `/brand/*`, `/influencer/*`, `/service-provider/*`, `/details/*`
- **Client-side**: `ProtectedRoute` component wraps protected pages
- **Redirect**: Unauthenticated users redirected to `/brand/signup` with original URL preserved

### 3. Logout
- **Entry Point**: `/logout` or logout button in sidebar
- **Process**: Clears tokens and redirects to home page

## Components

### AuthContext (`src/app/context/AuthContext.jsx`)
Provides authentication state and methods throughout the application.

**Key Methods**:
- `signup(userData)`: Registers new brand user
- `logout()`: Clears authentication state
- `isAuthenticated()`: Checks if user is logged in
- `getUserType()`: Returns user type (BRAND, INFLUENCER, SERVICE_PROVIDER)

**State**:
- `user`: Current user data
- `loading`: Authentication state loading
- `error`: Authentication errors

### ProtectedRoute (`src/components/ProtectedRoute.jsx`)
Client-side route protection component.

**Props**:
- `children`: Content to render if authenticated
- `userType`: Required user type (optional)
- `fallback`: Component to show while loading

**Behavior**:
- Shows loading spinner while checking authentication
- Redirects to `/brand/signup` if not authenticated
- Checks user type if specified
- Renders children if authenticated and authorized

### FormContainer (`src/app/brand/components/FormContainer.jsx`)
Multi-step form component used for brand signup.

**Features**:
- Multi-step form navigation
- Form validation using react-hook-form
- Integration with authentication system
- Error handling and loading states
- Redirect after successful submission

## Protected Routes

### Server-side Protection (Middleware)
```javascript
// src/middleware.js
const protectedRoutes = [
  '/brand',
  '/influencer', 
  '/service-provider',
  '/details'
];
```

### Client-side Protection
```javascript
// Example usage in brand layout
<ProtectedRoute userType="BRAND">
  <BrandDashboard />
</ProtectedRoute>
```

## Token Management

### Storage
- **Access Token**: Stored in HTTP-only cookies for security
- **Refresh Token**: Stored in HTTP-only cookies
- **User Data**: Stored in localStorage for quick access

### Security Features
- HTTP-only cookies prevent XSS attacks
- Automatic token refresh on API calls
- Secure logout clears all tokens

## API Integration

### Authentication Endpoints
- `POST /api/auth/signup`: Brand user registration
- `POST /api/auth/logout`: User logout
- `GET /api/auth/me`: Get current user data

### Request Headers
```javascript
// Automatic token inclusion in API calls
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

## Usage Examples

### 1. Protecting a Brand Route
```javascript
// src/app/brand/layout.jsx
import ProtectedRoute from '../../components/ProtectedRoute';

export default function BrandLayout({ children }) {
  return (
    <ProtectedRoute userType="BRAND">
      <div className="brand-layout">
        <BrandSidebar />
        {children}
      </div>
    </ProtectedRoute>
  );
}
```

### 2. Using Authentication in Components
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated()) {
    return <div>Please sign up to access this feature</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 3. Brand Signup Process
```javascript
// src/app/brand/signup/page.jsx
const steps = [
  {
    title: "Brand Registration",
    submit: "Create Account",
    fields: [
      { name: "email", type: "email", placeholder: "Email", required: true },
      { name: "password", type: "password", placeholder: "Password", required: true },
      { name: "confirmPassword", type: "password", placeholder: "Confirm Password", required: true }
    ]
  },
  {
    title: "Create Your Brand Account",
    submit: "Register Your Brand",
    fields: [
      { name: "brandName", type: "text", placeholder: "Enter Your Brand Name", required: true },
      { name: "website", type: "text", placeholder: "Enter your Website", required: false }
    ]
  }
];
```

## Error Handling

### Common Error Scenarios
1. **Invalid Credentials**: Display error message to user
2. **Network Errors**: Show generic error message
3. **Token Expired**: Automatic refresh or redirect to signup
4. **Unauthorized Access**: Redirect to brand signup page

### Error Display
```javascript
{error && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
    {error}
  </div>
)}
```

## Security Considerations

### Best Practices Implemented
1. **HTTP-only Cookies**: Prevents XSS attacks on tokens
2. **Server-side Validation**: All routes protected at middleware level
3. **Client-side Validation**: Additional protection with ProtectedRoute
4. **Automatic Redirects**: Seamless user experience
5. **Token Refresh**: Maintains session without user intervention

### Future Enhancements
1. **Rate Limiting**: Prevent brute force attacks
2. **Two-Factor Authentication**: Additional security layer
3. **Session Management**: Track active sessions
4. **Audit Logging**: Monitor authentication events

## Testing

### Manual Testing Checklist
- [ ] Brand signup process works correctly
- [ ] Protected routes redirect to brand signup when not authenticated
- [ ] Authenticated users can access protected routes
- [ ] Logout clears session and redirects to home
- [ ] Redirect after signup works correctly
- [ ] User type restrictions work properly

### Automated Testing (Recommended)
- Unit tests for AuthContext methods
- Integration tests for authentication flow
- E2E tests for complete user journeys
- Security tests for token handling

## Important Notes

### Single Signup Flow
- **Only brand signup is available**: `/brand/signup`
- **No general login page**: Removed from the system
- **Direct signup flow**: Users go directly to brand registration
- **Seamless experience**: After signup, users are immediately in their dashboard

### Redirect Strategy
- **Unauthenticated users**: Redirected to `/brand/signup`
- **Authenticated users**: Redirected to `/brand/dashboard`
- **Logout**: Redirected to home page (`/`)
- **Original URL preservation**: Users return to intended page after signup 