// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname, search } = request.nextUrl;
    
    // Get token and user type from cookies
    const token = request.cookies.get('authToken')?.value;
    const userType = request.cookies.get('userType')?.value; // 'BRAND' | 'INFLUENCER' | 'USER'

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

    // All other routes reached by the matcher require authentication
    if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', `${pathname}${search || ''}`);
        return NextResponse.redirect(loginUrl);
    }
    
    // If token exists but userType cookie is missing, clear session and force re-login
    if (!userType) {
        const res = NextResponse.redirect(new URL('/login', request.url));
        res.cookies.delete('authToken');
        res.cookies.delete('token');
        return res;
    }

    // Role-based route protection
    const isBrandRoute      = pathname.startsWith('/brand');
    const isInfluencerRoute = pathname.startsWith('/influencer');
    const isUserRoute       = pathname.startsWith('/user');

    const forbidden =
        (userType === 'BRAND'      && (isInfluencerRoute || isUserRoute)) ||
        (userType === 'INFLUENCER' && (isBrandRoute      || isUserRoute)) ||
        (userType === 'USER'       && (isBrandRoute      || isInfluencerRoute));

    if (forbidden) {
        return NextResponse.redirect(new URL('/login', request.url));
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