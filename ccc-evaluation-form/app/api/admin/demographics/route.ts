import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { memoryCache } from '@/lib/cache';

export const dynamic = 'force-dynamic'; // Ensure it's not statically generated at build time

export async function GET() {
    try {
        // Cache for 5 minutes (300 seconds)
        const headers = {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=59',
        };

        const cacheKey = 'admin_demographics';
        const cachedData = memoryCache.get<any>(cacheKey);
        if (cachedData) {
            return NextResponse.json(cachedData, { headers });
        }
        // 1. Age Group Distribution
        const ageGroups = await prisma.response.groupBy({
            by: ['ageGroup'],
            _count: {
                ageGroup: true,
            },
        });

        // 2. Gender Distribution
        const genderDistribution = await prisma.response.groupBy({
            by: ['gender'],
            _count: {
                gender: true,
            },
        });

        // 3. Member Status
        const memberStatus = await prisma.response.groupBy({
            by: ['isMember'],
            _count: {
                isMember: true,
            },
        });

        // 4. Children Families
        const childrenStats = await prisma.response.groupBy({
            by: ['hasChildren'],
            _count: {
                hasChildren: true,
            },
        });

        // Format data for frontend charts
        const formattedData = {
            ageRaw: ageGroups.map((g: { ageGroup: string; _count: { ageGroup: number } }) => ({ name: g.ageGroup, value: g._count.ageGroup })),
            genderRaw: genderDistribution.map((g: { gender: string; _count: { gender: number } }) => ({ name: g.gender, value: g._count.gender })),
            memberRaw: memberStatus.map((m: { isMember: boolean; _count: { isMember: number } }) => ({ name: m.isMember ? 'Member' : 'Visitor', value: m._count.isMember })),
            childrenRaw: childrenStats.map((c: { hasChildren: boolean; _count: { hasChildren: number } }) => ({ name: c.hasChildren ? 'Has Children' : 'No Children', value: c._count.hasChildren })),
        };

        memoryCache.set(cacheKey, formattedData, 300); // Cache for 5 mins

        return NextResponse.json(formattedData, { headers });
    } catch (error) {
        console.error('Error fetching demographics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch demographics data' },
            { status: 500 }
        );
    }
}
