// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
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
        return NextResponse.next();
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
        // '/details' is now public
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
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/brand/:path*',
        '/user/:path*',
        '/influencer/:path*',
        '/service-provider/:path*',
        '/details/:path*'
    ]
};