import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { memoryCache } from '@/lib/cache';

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Allow both admins and volunteers to view shared dashboard statistics
        if (session.role !== 'admin' && session.role !== 'volunteer') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        // Very short in-memory cache so multiple dashboards share the same
        // computed stats without hammering the database. TTL ~5 seconds.
        const cacheKey = 'shared_response_stats';
        const cachedStats = memoryCache.get<any>(cacheKey);
        if (cachedStats) {
            return NextResponse.json(cachedStats, {
                headers: {
                    'Cache-Control': 'no-store',
                },
            });
        }

        // Get current date boundaries
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(todayStart);
        weekStart.setDate(weekStart.getDate() - 7);

        // Get statistics
        const [total, today, thisWeek, activeUserRows] = await Promise.all([
            prisma.response.count(),
            prisma.response.count({
                where: {
                    createdAt: {
                        gte: todayStart,
                    },
                },
            }),
            prisma.response.count({
                where: {
                    createdAt: {
                        gte: weekStart,
                    },
                },
            }),
            prisma.response.findMany({
                where: {
                    createdAt: {
                        gte: weekStart,
                    },
                },
                select: {
                    enteredBy: true,
                },
            }),
        ]);

        const activeUsers = new Set(activeUserRows.map((row) => row.enteredBy)).size;

        const stats = {
            total,
            today,
            thisWeek,
            activeUsers,
        };

        // Always return fresh stats (no caching) so both dashboards stay in sync
        return NextResponse.json(stats, {
            headers: {
                'Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}
