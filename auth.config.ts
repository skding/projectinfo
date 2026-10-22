import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnLoginPage = nextUrl.pathname.startsWith('/login');
            const isApi = nextUrl.pathname.startsWith('/api');

            if (isApi) return true; // Let API routes handle their own auth or be public for file download (if decided)

            if (isOnLoginPage) {
                if (isLoggedIn) {
                    // Use a relative path for redirect to avoid IP/Port mismatch issues in cloud environments
                    return Response.redirect(new URL('/', nextUrl.origin));
                }
                return true;
            }

            if (isLoggedIn) return true;

            return false; // Redirect unauthenticated users to login page
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
