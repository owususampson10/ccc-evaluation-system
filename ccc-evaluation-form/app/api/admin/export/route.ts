import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import Papa from 'papaparse';

export async function GET() {
    try {
        const responses = await prisma.response.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Transform data for CSV (flatten objects if needed, handle nulls)
        const csvData = responses.map((r: any) => ({
            ...r,
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),
            // Ensure booleans are readable
            isMember: r.isMember ? 'Yes' : 'No',
            isRegularVisitor: r.isRegularVisitor === null ? '' : (r.isRegularVisitor ? 'Yes' : 'No'),
            hasChildren: r.hasChildren ? 'Yes' : 'No',
            timesConvenient: r.timesConvenient ? 'Yes' : 'No',
        }));

        const csvString = Papa.unparse(csvData);

        // Create response with CSV content
        return new NextResponse(csvString, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="ccc_responses_${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });
    } catch (error) {
        console.error('Error exporting data:', error);
        return NextResponse.json(
            { error: 'Failed to export data' },
            { status: 500 }
        );
    }
}
