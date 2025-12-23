import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET /api/admin/backup?format=json|csv|sql
// Admin-only: returns a downloadable backup of all responses.
export async function GET(request: Request) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (session.role !== 'admin') {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const format = (searchParams.get('format') || 'json').toLowerCase();

        if (!['json', 'csv', 'sql'].includes(format)) {
            return NextResponse.json(
                { error: 'Invalid format. Use json, csv, or sql.' },
                { status: 400 }
            );
        }

        const responses = await prisma.response.findMany();
        const total = responses.length;

        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '-');
        const baseName = `ccc-backup-${timestamp}`;

        const appVersion = '1.0.0';

        if (format === 'json') {
            const payload = {
                metadata: {
                    backupDate: now.toISOString(),
                    totalRecords: total,
                    appVersion,
                    format: 'json',
                },
                responses,
            };

            const body = JSON.stringify(payload, null, 2);
            const filename = `${baseName}.json`;

            return new Response(body, {
                status: 200,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Content-Disposition': `attachment; filename="${filename}"`,
                    'X-Total-Responses': total.toString(),
                },
            });
        }

        if (format === 'csv') {
            // Very simple CSV for spreadsheet use; columns mirror the Response model.
            const headers = [
                'id',
                'createdAt',
                'updatedAt',
                'enteredBy',
                'ageGroup',
                'gender',
                'serviceAttendance',
                'isMember',
                'membershipCode',
                'isRegularVisitor',
                'hasChildren',
                'childrenDepartments',
                'overallRating',
                'transitionSmooth',
                'enjoyMost',
                'improveAspects',
                'timesConvenient',
                'timeSuggestions',
                'departmentsInvolved',
                'departmentActivity',
                'departmentEffectiveness',
                'departmentImprovements',
                'ministriesServing',
                'ministryTeamwork',
                'ministrySupport',
                'ministryImprovements',
                'spiritualAtmosphere',
                'exceptionalAreas',
                'urgentImprovements',
                'additionalThoughts',
                'lastEditedBy',
                'lastEditedAt',
                'editHistory',
            ];

            const escape = (value: unknown): string => {
                if (value === null || value === undefined) return '';
                const str = String(value);
                if (str.includes('"') || str.includes(',') || str.includes('\n')) {
                    return '"' + str.replace(/"/g, '""') + '"';
                }
                return str;
            };

            const lines: string[] = [];
            lines.push(headers.join(','));

            for (const r of responses) {
                const row = [
                    r.id,
                    r.createdAt.toISOString(),
                    r.updatedAt.toISOString(),
                    r.enteredBy,
                    r.ageGroup,
                    r.gender,
                    r.serviceAttendance,
                    r.isMember,
                    r.membershipCode,
                    r.isRegularVisitor,
                    r.hasChildren,
                    r.childrenDepartments,
                    r.overallRating,
                    r.transitionSmooth,
                    r.enjoyMost,
                    r.improveAspects,
                    r.timesConvenient,
                    r.timeSuggestions,
                    r.departmentsInvolved,
                    r.departmentActivity,
                    r.departmentEffectiveness,
                    r.departmentImprovements,
                    r.ministriesServing,
                    r.ministryTeamwork,
                    r.ministrySupport,
                    r.ministryImprovements,
                    r.spiritualAtmosphere,
                    r.exceptionalAreas,
                    r.urgentImprovements,
                    r.additionalThoughts,
                    r.lastEditedBy,
                    r.lastEditedAt ? r.lastEditedAt.toISOString() : '',
                    r.editHistory,
                ].map(escape);
                lines.push(row.join(','));
            }

            const body = lines.join('\n');
            const filename = `${baseName}.csv`;

            return new Response(body, {
                status: 200,
                headers: {
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': `attachment; filename="${filename}"`,
                    'X-Total-Responses': total.toString(),
                },
            });
        }

        // SQL dumps are database-specific; this app uses SQLite and does not expose a SQL dump.
        return NextResponse.json(
            { error: 'SQL dump format is not supported for this database. Please use JSON or CSV.' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Error creating backup:', error);
        return NextResponse.json(
            { error: 'Failed to create backup' },
            { status: 500 }
        );
    }
}
