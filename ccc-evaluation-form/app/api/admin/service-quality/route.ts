import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { memoryCache } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const headers = {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=59',
        };

        const cacheKey = 'admin_service_quality';
        const cachedData = memoryCache.get<any>(cacheKey);
        if (cachedData) {
            return NextResponse.json(cachedData, { headers });
        }
        // 1. Overall Rating Distribution
        const ratings = await prisma.response.groupBy({
            by: ['overallRating'],
            _count: { overallRating: true },
        });

        // 2. Transition Smoothness
        const transitions = await prisma.response.groupBy({
            by: ['transitionSmooth'],
            _count: { transitionSmooth: true },
        });

        // 3. Service Convenience
        const convenience = await prisma.response.groupBy({
            by: ['timesConvenient'],
            _count: { timesConvenient: true },
        });

        // 4. Spiritual Atmosphere
        const atmosphere = await prisma.response.groupBy({
            by: ['spiritualAtmosphere'],
            _count: { spiritualAtmosphere: true },
        });

        const formattedData = {
            ratings: ratings.map((r: { overallRating: string; _count: { overallRating: number } }) => ({ name: r.overallRating, value: r._count.overallRating })),
            transitions: transitions.map((t: { transitionSmooth: string; _count: { transitionSmooth: number } }) => ({ name: t.transitionSmooth, value: t._count.transitionSmooth })),
            convenience: convenience.map((c: { timesConvenient: boolean; _count: { timesConvenient: number } }) => ({ name: c.timesConvenient ? 'Convenient' : 'Inconvenient', value: c._count.timesConvenient })),
            atmosphere: atmosphere.map((a: { spiritualAtmosphere: string; _count: { spiritualAtmosphere: number } }) => ({ name: a.spiritualAtmosphere, value: a._count.spiritualAtmosphere })),
        };

        memoryCache.set(cacheKey, formattedData, 300); // Cache for 5 mins

        return NextResponse.json(formattedData, { headers });
    } catch (error) {
        console.error('Error fetching service quality data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch service quality data' },
            { status: 500 }
        );
    }
}
