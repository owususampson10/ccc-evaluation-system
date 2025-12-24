// lib/auth-edge.ts
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload as { role: string; [key: string]: any };
    } catch (error) {
        return null;
    }
}