import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    const pathname = request.nextUrl.pathname;

    // Public routes - allow access
    if (pathname === '/login' || pathname.startsWith('/api/auth')) {
        // If already logged in, redirect to appropriate page
        if (token && pathname === '/login') {
            const payload = await verifyToken(token);
            if (payload) {
                const redirectUrl = payload.role === 'admin' ? '/admin' : '/volunteer/dashboard';
                return NextResponse.redirect(new URL(redirectUrl, request.url));
            }
        }
        return NextResponse.next();
    }

    // Root path handling
    if (pathname === '/') {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        const redirectUrl = payload.role === 'admin' ? '/admin' : '/volunteer/dashboard';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // Protected routes - require authentication
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await verifyToken(token);

    if (!payload) {
        // Invalid token - clear and redirect to login
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('auth-token');
        return response;
    }

    // Admin routes - require admin role
    if (pathname.startsWith('/admin')) {
        if (payload.role !== 'admin') {
            // Redirect non-admins to volunteer dashboard or login if not volunteer
            const redirectUrl = payload.role === 'volunteer' ? '/volunteer/dashboard' : '/login';
            return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
    }

    // Volunteer routes - require volunteer role
    if (pathname.startsWith('/volunteer')) {
        if (payload.role !== 'volunteer') {
            // Redirect non-volunteers to admin dashboard or login if not admin
            const redirectUrl = payload.role === 'admin' ? '/admin' : '/login';
            return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
    }

    // Form routes - require authenticated user (both admins and volunteers can access)
    if (pathname.startsWith('/form')) {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login', '/admin/:path*', '/form/:path*', '/volunteer/:path*'],
};
