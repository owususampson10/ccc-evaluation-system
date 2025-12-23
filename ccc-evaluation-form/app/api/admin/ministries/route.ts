import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { memoryCache } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const headers = {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=59',
        };

        const cacheKey = 'admin_ministries';
        const cachedData = memoryCache.get<any>(cacheKey);
        if (cachedData) {
            return NextResponse.json(cachedData, { headers });
        }
        const responses = await prisma.response.findMany({
            select: {
                ministriesServing: true,
                ministryTeamwork: true,
                ministrySupport: true
            }
        });

        // 1. Ministry Serving Counts
        const ministryCounts: Record<string, number> = {};

        responses.forEach((r: { ministriesServing: string }) => {
            if (!r.ministriesServing) return;

            const ministries = r.ministriesServing.split(',').map((m: string) => m.trim()).filter((m: string) => m.length > 0);

            ministries.forEach((min: string) => {
                ministryCounts[min] = (ministryCounts[min] || 0) + 1;
            });
        });

        const servingData = Object.entries(ministryCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);

        // 2. Teamwork Ratings
        const teamworkCounts: Record<string, number> = {};
        responses.forEach((r: { ministryTeamwork: string }) => {
            if (r.ministryTeamwork) {
                teamworkCounts[r.ministryTeamwork] = (teamworkCounts[r.ministryTeamwork] || 0) + 1;
            }
        });

        // 3. Support Ratings
        const supportCounts: Record<string, number> = {};
        responses.forEach((r: { ministrySupport: string }) => {
            if (r.ministrySupport) {
                supportCounts[r.ministrySupport] = (supportCounts[r.ministrySupport] || 0) + 1;
            }
        });

        const formattedData = {
            serving: servingData,
            teamwork: Object.entries(teamworkCounts).map(([name, value]) => ({ name, value })),
            support: Object.entries(supportCounts).map(([name, value]) => ({ name, value })),
        };

        memoryCache.set(cacheKey, formattedData, 300); // Cache for 5 mins

        return NextResponse.json(formattedData, { headers });
    } catch (error) {
        console.error('Error fetching ministry data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch ministry data' },
            { status: 500 }
        );
    }
}
