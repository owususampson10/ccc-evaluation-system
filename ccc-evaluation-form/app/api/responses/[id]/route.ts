import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { formSchema } from '@/lib/validations';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        const { id } = await params;

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const response = await prisma.response.findUnique({
            where: { id },
        });

        if (!response) {
            return NextResponse.json(
                { error: 'Response not found' },
                { status: 404 }
            );
        }


        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching response:', error);
        return NextResponse.json(
            { error: 'Failed to fetch response' },
            { status: 500 }
        );
    }
}

// DELETE - Remove a response
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        const { id } = await params;

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch the response to check ownership if volunteer
        const response = await prisma.response.findUnique({
            where: { id },
            select: { enteredBy: true }
        });

        if (!response) {
            return NextResponse.json({ error: 'Response not found' }, { status: 404 });
        }

        // Volunteers can only delete their own responses
        if (session.role === 'volunteer' && response.enteredBy !== session.username) {
            return NextResponse.json(
                { error: 'Forbidden: You can only delete your own responses' },
                { status: 403 }
            );
        }

        // Admin can delete any response
        // Volunteer can delete their own (checked above)
        await prisma.response.delete({
            where: { id }
        });

        // Clear cache
        const { memoryCache } = await import('@/lib/cache');
        memoryCache.clear();

        return NextResponse.json({ success: true, message: 'Response deleted' });
    } catch (error) {
        console.error('Error deleting response:', error);
        return NextResponse.json({ error: 'Failed to delete response' }, { status: 500 });
    }
}

// PUT - Update a response
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        const { id } = await params;

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch the response to check ownership if volunteer
        const response = await prisma.response.findUnique({
            where: { id },
            select: { enteredBy: true }
        });

        if (!response) {
            return NextResponse.json({ error: 'Response not found' }, { status: 404 });
        }

        // Volunteers can update any response (restriction removed)
        // if (session.role === 'volunteer' && response.enteredBy !== session.username) { ... }

        const body = await request.json();
        const validationResult = formSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validationResult.error.flatten() },
                { status: 400 }
            );
        }

        const data = validationResult.data;

        // Fetch existing for audit history
        const existing = await prisma.response.findUnique({
            where: { id },
            select: { editHistory: true }
        });

        if (!existing) {
            return NextResponse.json({ error: 'Response not found' }, { status: 404 });
        }

        let editHistory = [];
        try {
            if (existing.editHistory) {
                editHistory = JSON.parse(existing.editHistory);
            }
        } catch (e) {
            console.error('Error parsing edit history:', e);
        }

        const editEntry = {
            username: session.username,
            timestamp: new Date().toISOString()
        };
        editHistory.push(editEntry);

        const updatedResponse = await prisma.response.update({
            where: { id },
            data: {
                // Section A
                ageGroup: data.ageGroup,
                gender: data.gender,
                serviceAttendance: data.serviceAttendance.join(', '),
                isMember: data.isMember === 'Yes',
                membershipCode: data.membershipCode || null,
                isRegularVisitor: data.isRegularVisitor === 'Yes',
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
                // Audit
                lastEditedBy: session.username,
                lastEditedAt: new Date(),
                editHistory: JSON.stringify(editHistory),
            },
        });

        // Clear cache
        const { memoryCache } = await import('@/lib/cache');
        memoryCache.clear();

        return NextResponse.json({ success: true, response: updatedResponse });
    } catch (error) {
        console.error('Error updating response:', error);
        return NextResponse.json({ error: 'Failed to update response' }, { status: 500 });
    }
}
