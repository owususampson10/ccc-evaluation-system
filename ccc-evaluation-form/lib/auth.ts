import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
);

export interface TokenPayload extends JWTPayload {
    username: string;
    role: 'admin' | 'volunteer';
}

export const signToken = async (payload: TokenPayload): Promise<string> => {
    const token = await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('8h')
        .setIssuedAt()
        .sign(JWT_SECRET);

    return token;
};

export const verifyToken = async (token: string): Promise<TokenPayload | null> => {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as TokenPayload;
    } catch {
        return null;
    }
};

export const getSession = async (): Promise<TokenPayload | null> => {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) return null;

    return verifyToken(token);
};

export const setAuthCookie = async (token: string): Promise<void> => {
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 8 * 60 * 60, // 8 hours
        path: '/',
    });
};

export const clearAuthCookie = async (): Promise<void> => {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
};
