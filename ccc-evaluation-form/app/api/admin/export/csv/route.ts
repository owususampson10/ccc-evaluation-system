import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import Papa from 'papaparse';

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { startDate, endDate, service, memberStatus, rating } = body;

        // Build filter object
        const filters: any = {};

        if (startDate) {
            filters.createdAt = { ...filters.createdAt, gte: new Date(startDate) };
        }
        if (endDate) {
            // Set end date to end of day
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            filters.createdAt = { ...filters.createdAt, lte: end };
        }
        if (service && service !== 'all') {
            filters.serviceAttendance = { contains: service };
        }
        if (memberStatus && memberStatus !== 'all') {
            filters.isMember = memberStatus === 'member';
        }
        if (rating && rating !== 'all') {
            filters.overallRating = rating;
        }

        // Fetch filtered data
        const responses = await prisma.response.findMany({
            where: filters,
            orderBy: { createdAt: 'desc' }
        });

        // Flatten data for CSV
        const flattenData = responses.map(r => ({
            'Response ID': r.id,
            'Date Submitted': new Date(r.createdAt).toLocaleString(),
            'Entered By': r.enteredBy,

            // Section A
            'Age Group': r.ageGroup,
            'Gender': r.gender,
            'Service': r.serviceAttendance,
            'Member Status': r.isMember ? 'Member' : 'Visitor',
            'Membership Code': r.membershipCode || 'N/A',
            'Regular Visitor': r.isRegularVisitor ? 'Yes' : 'No',
            'Has Children': r.hasChildren ? 'Yes' : 'No',
            'Children Departments': r.childrenDepartments,

            // Section B
            'Overall Rating': r.overallRating,
            'Transition Smooth': r.transitionSmooth,
            'Enjoy Most': r.enjoyMost,
            'Constructive Feedback': r.improveAspects,
            'Time Convenient': r.timesConvenient ? 'Yes' : 'No',
            'Time Suggestions': r.timeSuggestions || 'N/A',

            // Section C
            'Departments Involved': r.departmentsInvolved,
            'Dept Activity': r.departmentActivity,
            'Dept Effectiveness': r.departmentEffectiveness,
            'Dept Improvements': r.departmentImprovements,

            // Section D
            'Ministries Serving': r.ministriesServing,
            'Ministry Teamwork': r.ministryTeamwork,
            'Ministry Support': r.ministrySupport,
            'Ministry Improvements': r.ministryImprovements,

            // Section E
            'Spiritual Atmosphere': r.spiritualAtmosphere,
            'Exceptional Areas': r.exceptionalAreas,
            'Urgent Improvements': r.urgentImprovements,
            'Additional Thoughts': r.additionalThoughts
        }));

        // Convert to CSV
        // Note: Papaparse handles JSON -> CSV. imports as Config, but unparse is a property on it.
        // Actually, 'papaparse' default export is called Papa usually.
        // Let's use stringify from csv-stringify or just simple map for simplicity if we want
        // But since we installed papaparse:
        const csv = Papa.unparse(flattenData);

        return new NextResponse(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename=ccc-responses-${new Date().toISOString().split('T')[0]}.csv`
            }
        });

    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json({ error: 'Failed to generate export' }, { status: 500 });
    }
}
