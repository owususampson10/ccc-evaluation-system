import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function DELETE(request: Request) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (session.role !== 'admin') {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        const body = await request.json().catch(() => null) as { confirmText?: string; password?: string } | null;

        if (!body || body.confirmText !== 'DELETE ALL') {
            return NextResponse.json(
                { error: 'Invalid confirmation phrase. Type DELETE ALL to confirm.' },
                { status: 400 }
            );
        }

        if (!body.password) {
            return NextResponse.json(
                { error: 'Password is required to purge the database.' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({ where: { username: session.username } });
        if (!user) {
            return NextResponse.json(
                { error: 'Admin account not found.' },
                { status: 400 }
            );
        }

        const isValid = await bcrypt.compare(body.password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid password.' },
                { status: 401 }
            );
        }

        const result = await prisma.response.deleteMany();

        return NextResponse.json({
            success: true,
            deletedCount: result.count,
        });
    } catch (error) {
        console.error('Error purging database:', error);
        return NextResponse.json(
            { error: 'Failed to purge database' },
            { status: 500 }
        );
    }
}
