import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { formSchema } from '@/lib/validations';
import { memoryCache } from '@/lib/cache';

// POST - Create new response (volunteer only)
export async function POST(request: Request) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Validate the data
        const validationResult = formSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validationResult.error.flatten() },
                { status: 400 }
            );
        }

        const data = validationResult.data;

        // --- Duplication Check: Membership Code ---
        if (data.isMember === 'Yes' && data.membershipCode) {
            const existingResponse = await prisma.response.findFirst({
                where: {
                    membershipCode: data.membershipCode,
                },
            });

            if (existingResponse) {
                return NextResponse.json(
                    { error: 'A response with this membership code already exists.' },
                    { status: 409 } // 409 Conflict
                );
            }
        }
        // --- End Duplication Check ---

        // Create the response
        const response = await prisma.response.create({
            data: {
                enteredBy: session.username,
                // Section A
                ageGroup: data.ageGroup,
                gender: data.gender,
                serviceAttendance: data.serviceAttendance.join(', '),
                isMember: data.isMember === 'Yes',
                membershipCode: data.membershipCode || null,
                isRegularVisitor: data.isRegularVisitor === 'Yes' ? true : data.isRegularVisitor === 'No' ? false : null,
                hasChildren: data.hasChildren === 'Yes',
                childrenDepartments: JSON.stringify(data.childrenDepartments || []),
                // Section B
                overallRating: data.overallRating,
                transitionSmooth: data.transitionSmooth,
                enjoyMost: data.enjoyMost,
                improveAspects: data.improveAspects,
                timesConvenient: data.timesConvenient === 'Yes',
                timeSuggestions: data.timeSuggestions || null,
                // Section C
                departmentsInvolved: data.departmentsInvolved,
                departmentActivity: data.departmentActivity,
                departmentEffectiveness: data.departmentEffectiveness,
                departmentImprovements: data.departmentImprovements,
                // Section D
                ministriesServing: data.ministriesServing,
                ministryTeamwork: data.ministryTeamwork,
                ministrySupport: data.ministrySupport,
                ministryImprovements: data.ministryImprovements,
                // Section E
                spiritualAtmosphere: data.spiritualAtmosphere,
                exceptionalAreas: data.exceptionalAreas,
                urgentImprovements: data.urgentImprovements,
                additionalThoughts: data.additionalThoughts,
            },
        });

        // Clear admin cache as data has changed
        memoryCache.clear();

        return NextResponse.json({
            success: true,
            id: response.id,
            message: 'Response submitted successfully',
        });
    } catch (error) {
        console.error('Error creating response:', error);
        return NextResponse.json(
            { error: 'Failed to submit response' },
            { status: 500 }
        );
    }
}

// GET - Get all responses (admin only)
export async function GET(request: Request) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Allow both admins and volunteers to view responses. No filtering by enteredBy.
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const search = searchParams.get('search') || '';
        const service = searchParams.get('service') || '';
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { enteredBy: { contains: search } },
                { membershipCode: { contains: search } },
                { serviceAttendance: { contains: search } },
            ];
        }

        if (service) {
            if (service === 'All Services') {
                where.serviceAttendance = {
                    contains: '1st',
                    AND: [
                        { contains: '2nd' },
                        { contains: '3rd' }
                    ]
                };
            } else {
                where.serviceAttendance = { contains: service.split(' ')[0] }; // e.g. "1st" from "1st Service"
            }
        }

        const [responses, total] = await Promise.all([
            prisma.response.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    createdAt: true,
                    enteredBy: true,
                    gender: true,
                    membershipCode: true,
                    serviceAttendance: true,
                    isMember: true,
                    overallRating: true,
                },
            }),
            prisma.response.count({ where }),
        ]);

        return NextResponse.json({
            responses,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        }, {
            headers: {
                'Cache-Control': 'private, max-age=10, stale-while-revalidate=30', // Private because it might be user specific in future or just safe
            },
        });
    } catch (error) {
        console.error('Error fetching responses:', error);
        return NextResponse.json(
            { error: 'Failed to fetch responses' },
            { status: 500 }
        );
    }
}