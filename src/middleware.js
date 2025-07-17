// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;
    
    // Get token from cookies
    const token = request.cookies.get('authToken')?.value;
    
    // Protected routes that require authentication (excluding signup)
    const protectedRoutes = [
        '/brand/dashboard',
        '/brand/campaigns',
        '/brand/account',
        '/brand/help',
        '/brand/inbox',
        '/brand/settings',
        '/influencer',
        '/service-provider',
        '/details'
    ];
    
    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => 
        pathname.startsWith(route)
    );
    
    // If accessing a protected route without token, redirect to brand signup
    if (isProtectedRoute && !token) {
        const signupUrl = new URL('/brand/signup', request.url);
        signupUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(signupUrl);
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
        '/influencer/:path*',
        '/service-provider/:path*',
        '/details/:path*'
    ]
};