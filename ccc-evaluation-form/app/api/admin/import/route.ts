import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

// POST /api/admin/import
// Admin-only: multipart/form-data with fields:
// - file: backup file (.json recommended)
// - mode: 'add' | 'replace'
export async function POST(request: Request) {
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

        const formData = await request.formData();
        const file = formData.get('file');
        const mode = (formData.get('mode') as string | null) || 'add';

        if (!(file instanceof Blob)) {
            return NextResponse.json(
                { error: 'No file uploaded.' },
                { status: 400 }
            );
        }

        if (mode !== 'add' && mode !== 'replace') {
            return NextResponse.json(
                { error: 'Invalid import mode. Use add or replace.' },
                { status: 400 }
            );
        }

        // File size limit ~50MB
        if (file.size > 50 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 50MB.' },
                { status: 400 }
            );
        }

        const name = (file as File).name || 'backup';
        const ext = name.split('.').pop()?.toLowerCase() || '';

        if (!['json', 'csv', 'sql'].includes(ext)) {
            return NextResponse.json(
                { error: 'Unsupported file type. Use .json, .csv, or .sql.' },
                { status: 400 }
            );
        }

        // For now, JSON is the fully supported import format.
        if (ext !== 'json') {
            return NextResponse.json(
                { error: 'Only JSON backups can be imported in this version. Please export/import using JSON.' },
                { status: 400 }
            );
        }

        const text = await file.text();

        let raw: any;
        try {
            raw = JSON.parse(text);
        } catch {
            return NextResponse.json(
                { error: 'Invalid JSON backup file.' },
                { status: 400 }
            );
        }

        let records: any[] = [];
        if (Array.isArray(raw)) {
            records = raw;
        } else if (raw && Array.isArray(raw.responses)) {
            records = raw.responses;
        } else {
            return NextResponse.json(
                { error: 'JSON backup format not recognized. Expected an array or { responses: [...] }.' },
                { status: 400 }
            );
        }

        if (records.length === 0) {
            return NextResponse.json(
                { error: 'Backup file contains no records to import.' },
                { status: 400 }
            );
        }

        // Ensure required fields exist; we trust backup source so only minimal shape checks.
        const sanitized = records.map((r) => {
            return {
                id: r.id,
                createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
                updatedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
                enteredBy: r.enteredBy,
                ageGroup: r.ageGroup,
                gender: r.gender,
                serviceAttendance: r.serviceAttendance,
                isMember: r.isMember,
                membershipCode: r.membershipCode ?? null,
                isRegularVisitor: r.isRegularVisitor ?? null,
                hasChildren: r.hasChildren,
                childrenDepartments: r.childrenDepartments,
                overallRating: r.overallRating,
                transitionSmooth: r.transitionSmooth,
                enjoyMost: r.enjoyMost ?? '',
                improveAspects: r.improveAspects ?? '',
                timesConvenient: r.timesConvenient,
                timeSuggestions: r.timeSuggestions ?? null,
                departmentsInvolved: r.departmentsInvolved ?? '',
                departmentActivity: r.departmentActivity,
                departmentEffectiveness: r.departmentEffectiveness,
                departmentImprovements: r.departmentImprovements ?? '',
                ministriesServing: r.ministriesServing ?? '',
                ministryTeamwork: r.ministryTeamwork,
                ministrySupport: r.ministrySupport,
                ministryImprovements: r.ministryImprovements ?? '',
                spiritualAtmosphere: r.spiritualAtmosphere,
                exceptionalAreas: r.exceptionalAreas ?? '',
                urgentImprovements: r.urgentImprovements ?? '',
                additionalThoughts: r.additionalThoughts ?? '',
                lastEditedBy: r.lastEditedBy ?? null,
                lastEditedAt: r.lastEditedAt ? new Date(r.lastEditedAt) : null,
                editHistory: r.editHistory ?? null,
            };
        });

        let importedCount = 0;
        let skippedCount = 0;

        if (mode === 'replace') {
            await prisma.response.deleteMany();
        }

        const result = await prisma.response.createMany({
            data: sanitized,
        });

        importedCount = result.count;
        skippedCount = sanitized.length - importedCount;

        return NextResponse.json({
            success: true,
            importedCount,
            skippedCount,
            errorCount: 0,
        });
    } catch (error) {
        console.error('Error importing backup:', error);
        return NextResponse.json(
            { error: 'Failed to import data' },
            { status: 500 }
        );
    }
}
