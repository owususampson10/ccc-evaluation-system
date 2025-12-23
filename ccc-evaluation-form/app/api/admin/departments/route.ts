import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { memoryCache } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const headers = {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=59',
        };

        const cacheKey = 'admin_departments';
        const cachedData = memoryCache.get<any>(cacheKey);
        if (cachedData) {
            return NextResponse.json(cachedData, { headers });
        }
        // Fetch all responses to process complex text fields
        const responses = await prisma.response.findMany({
            select: {
                departmentsInvolved: true,
                departmentActivity: true,
                departmentEffectiveness: true
            }
        });

        // 1. Department Involvement Counts
        const deptCounts: Record<string, number> = {};

        responses.forEach((r: { departmentsInvolved: string }) => {
            if (!r.departmentsInvolved) return;

            // Split by comma if multiple departments are listed
            const depts = r.departmentsInvolved.split(',').map((d: string) => d.trim()).filter((d: string) => d.length > 0);

            depts.forEach((dept: string) => {
                // Normalize slightly to avoid duplicates due to casing
                const key = dept; // .toLowerCase(); 
                deptCounts[key] = (deptCounts[key] || 0) + 1;
            });
        });

        const involvementData = Object.entries(deptCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10); // Top 10

        // 2. Activity Levels
        const activityCounts: Record<string, number> = {};
        responses.forEach((r: { departmentActivity: string }) => {
            if (r.departmentActivity) {
                activityCounts[r.departmentActivity] = (activityCounts[r.departmentActivity] || 0) + 1;
            }
        });

        // 3. Effectiveness
        const effectivenessCounts: Record<string, number> = {};
        responses.forEach((r: { departmentEffectiveness: string }) => {
            if (r.departmentEffectiveness) {
                effectivenessCounts[r.departmentEffectiveness] = (effectivenessCounts[r.departmentEffectiveness] || 0) + 1;
            }
        });

        const formattedData = {
            involvement: involvementData,
            activity: Object.entries(activityCounts).map(([name, value]) => ({ name, value })),
            effectiveness: Object.entries(effectivenessCounts).map(([name, value]) => ({ name, value })),
        };

        memoryCache.set(cacheKey, formattedData, 300); // Cache for 5 mins

        return NextResponse.json(formattedData, { headers });
    } catch (error) {
        console.error('Error fetching department data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch department data' },
            { status: 500 }
        );
    }
}
