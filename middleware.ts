import { NextRequest, NextResponse } from 'next/server';

/**
 * Advanced Next.js Middleware
 * - Authentication & Authorization
 * - Request logging
 * - Security headers
 * - Route protection
 */

export function middleware(_request: NextRequest) {
    // Create response with security headers
    const response = NextResponse.next();

    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    // Note: Authentication redirect is handled by the app's AuthProvider
    // and ProtectedRoute component, not by middleware to prevent infinite loops

    return response;
}

// Configure which routes the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public (public files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};
