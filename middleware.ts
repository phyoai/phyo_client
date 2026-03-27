import { NextRequest, NextResponse } from 'next/server';

/**
 * Advanced Next.js Middleware
 * - Authentication & Authorization
 * - Request logging
 * - Security headers
 * - Route protection
 */

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    // Get token from cookies
    const token = request.cookies.get('authToken')?.value;

    // Public routes that should never be blocked
    const publicRoutes = [
        '/brand/signup',
        '/brand/login',
        '/login',
        '/logout',
        '/influencer/signup'
    ];

    if (publicRoutes.some(route => pathname.startsWith(route))) {
        const response = NextResponse.next();
        addSecurityHeaders(response);
        return response;
    }

    // Protected routes that require authentication
    const protectedRoutes = [
        '/brand/dashboard',
        '/brand/campaigns',
        '/brand/account',
        '/brand/help',
        '/brand/inbox',
        '/brand/settings',
        '/user/dashboard',
        '/user/campaigns',
        '/user/account',
        '/user/help',
        '/user/inbox',
        '/user/settings',
        '/user/influencer-search',
        '/user/influencers',
        '/user/notifications',
        '/influencer',
        '/service-provider'
    ];

    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    // If accessing a protected route without token, redirect to login
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', `${pathname}${search || ''}`);
        return NextResponse.redirect(loginUrl);
    }

    // If user is authenticated and trying to access brand signup, redirect to dashboard
    if (token && pathname === '/brand/signup') {
        return NextResponse.redirect(new URL('/brand/dashboard', request.url));
    }

    // Create response with security headers
    const response = NextResponse.next();
    addSecurityHeaders(response);

    return response;
}

// Helper function to add security headers
function addSecurityHeaders(response: NextResponse) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
}

// Configure which routes the middleware should run on
export const config = {
    matcher: [
        '/brand/:path*',
        '/user/:path*',
        '/influencer/:path*',
        '/service-provider/:path*',
        '/details/:path*',
        '/login',
        '/logout'
    ],
};
