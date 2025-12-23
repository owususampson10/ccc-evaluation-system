import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [
            totalResponses,
            ageGroups,
            genderDistribution,
            serviceAttendance,
            memberStatus,
            overallRatings,
            transitionSmoothness,
            serviceConvenience,
            departmentActivity,
            ministryTeamwork,
            spiritualAtmosphere
        ] = await Promise.all([
            // Total count
            prisma.response.count(),

            // Demographics
            prisma.response.groupBy({ by: ['ageGroup'], _count: true }),
            prisma.response.groupBy({ by: ['gender'], _count: true }),
            prisma.response.groupBy({ by: ['serviceAttendance'], _count: true }),
            prisma.response.groupBy({ by: ['isMember'], _count: true }),

            // Service Experience
            prisma.response.groupBy({ by: ['overallRating'], _count: true }),
            prisma.response.groupBy({ by: ['transitionSmooth'], _count: true }),
            prisma.response.groupBy({ by: ['timesConvenient'], _count: true }),

            // Departments & Ministries
            prisma.response.groupBy({ by: ['departmentActivity'], _count: true }),
            prisma.response.groupBy({ by: ['ministryTeamwork'], _count: true }),

            // Overall Health
            prisma.response.groupBy({ by: ['spiritualAtmosphere'], _count: true }),
        ]);

        return NextResponse.json({
            summary: { total: totalResponses },
            demographics: {
                ageGroups,
                gender: genderDistribution,
                serviceAttendance,
                memberStatus
            },
            serviceQuality: {
                overallRatings,
                transitionSmoothness,
                convenience: serviceConvenience
            },
            engagement: {
                departmentActivity,
                ministryTeamwork
            },
            health: {
                spiritualAtmosphere
            }
        });

    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
    }
}
