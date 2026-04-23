import { URLS } from '@/utils/constants';
import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';

const refreshAccessToken = async (token: JWT): Promise<JWT> => {
    try {
        const res = await fetch(URLS.google.apis.token, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                grant_type: 'refresh_token',
                refresh_token: token.refreshToken as string,
            }),
        });

        const refreshed = await res.json();
        if (!res.ok) throw refreshed;

        return {
            ...token,
            accessToken: refreshed.access_token,
            accessTokenExpires: Date.now() + refreshed.expires_in * 1000,
            refreshToken: refreshed.refresh_token ?? token.refreshToken,
        };
    } catch {
        return { ...token, error: 'RefreshAccessTokenError' };
    }
}

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: URLS.google.apis.scopes,
                    access_type: 'offline',  // Gets refresh token
                    prompt: 'consent',       // Forces refresh token on first login
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            // On first sign-in, persist tokens
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.accessTokenExpires = account.expires_at! * 1000;
            }

            // Return token if still valid
            if (Date.now() < (token.accessTokenExpires as number)) {
                return token;
            }

            // Token expired — refresh it
            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.error = token.error as string | undefined;
            return session;
        },
    },
});

export { handler as GET, handler as POST };