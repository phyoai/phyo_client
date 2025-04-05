// middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
    const token = req.cookies.get('authtoken');

    const protectedRoutes = ['/details'];
    
    
    if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
        // console.log("running");

        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return NextResponse.next();
}


export const config = {
    matcher: ["/details/:userName"],
};