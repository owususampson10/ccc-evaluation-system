import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth-edge'; // Ensure this uses 'jose'

export async function proxy(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    const { pathname } = request.nextUrl;

    // 1. Public routes - allow access
    if (pathname === '/login' || pathname.startsWith('/api/auth')) {
        if (token && pathname === '/login') {
            const payload = await verifyToken(token);
            if (payload) {
                const redirectUrl = payload.role === 'admin' ? '/admin' : '/volunteer/dashboard';
                return NextResponse.redirect(new URL(redirectUrl, request.url));
            }
        }
        return NextResponse.next();
    }

    // 2. Protected routes - require authentication
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await verifyToken(token);

    if (!payload) {
        // Invalid token - clear and redirect
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('auth-token');
        return response;
    }

    // 3. Root path handling
    if (pathname === '/') {
        const redirectUrl = payload.role === 'admin' ? '/admin' : '/volunteer/dashboard';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // 4. Admin routes - require admin role
    if (pathname.startsWith('/admin') && payload.role !== 'admin') {
        const redirectUrl = payload.role === 'volunteer' ? '/volunteer/dashboard' : '/login';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // 5. Volunteer routes - require volunteer role
    if (pathname.startsWith('/volunteer') && payload.role !== 'volunteer') {
        const redirectUrl = payload.role === 'admin' ? '/admin' : '/login';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Note: 'middleware' matcher still works, but is now part of the Proxy config
    matcher: ['/', '/login', '/admin/:path*', '/form/:path*', '/volunteer/:path*'],
};