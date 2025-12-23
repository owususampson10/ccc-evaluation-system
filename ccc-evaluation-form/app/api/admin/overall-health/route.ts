import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { memoryCache } from '@/lib/cache';

// Simple stopword list to filter out common words
const STOP_WORDS = new Set([
    'the', 'and', 'a', 'to', 'of', 'in', 'i', 'is', 'that', 'it', 'for', 'you', 'was', 'with', 'on', 'as', 'have',
    'but', 'be', 'they', 'are', 'this', 'not', 'at', 'my', 'we', 'so', 'all', 'by', 'or', 'an', 'very', 'really',
    'just', 'more', 'me', 'do', 'can', 'if', 'your', 'from', 'would', 'service', 'church', 'ccc', 'god', 'services'
]);

// Helper to extract word frequencies
function extractKeywords(texts: string[], limit = 20) {
    const wordCounts: Record<string, number> = {};

    texts.forEach(text => {
        if (!text) return;
        // Normalize: lowercase, remove punctuation
        const words = text.toLowerCase()
            .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
            .split(/\s+/);

        words.forEach(word => {
            if (word.length > 3 && !STOP_WORDS.has(word)) {
                wordCounts[word] = (wordCounts[word] || 0) + 1;
            }
        });
    });

    return Object.entries(wordCounts)
        .map(([text, value]) => ({ text, value })) // rechart wordcloud uses 'text' and 'value' sometimes, or we adapt
        .sort((a, b) => b.value - a.value)
        .slice(0, limit);
}

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const headers = {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=59',
        };

        const cacheKey = 'admin_overall_health';
        const cachedData = memoryCache.get<any>(cacheKey);
        if (cachedData) {
            return NextResponse.json(cachedData, { headers });
        }
        const responses = await prisma.response.findMany({
            select: {
                spiritualAtmosphere: true,
                exceptionalAreas: true,
                urgentImprovements: true,
                additionalThoughts: true
            }
        });

        // 1. Spiritual Atmosphere
        const atmosphereCounts: Record<string, number> = {};
        responses.forEach((r: { spiritualAtmosphere: string }) => {
            if (r.spiritualAtmosphere) {
                atmosphereCounts[r.spiritualAtmosphere] = (atmosphereCounts[r.spiritualAtmosphere] || 0) + 1;
            }
        });

        // 2. Strengths (Exceptional Areas) Analysis
        const strengthTexts = responses.map((r: { exceptionalAreas: string }) => r.exceptionalAreas);
        const topStrengths = extractKeywords(strengthTexts);

        // 3. Weaknesses (Urgent Improvements) Analysis
        const weaknessTexts = responses.map((r: { urgentImprovements: string }) => r.urgentImprovements);
        const topWeaknesses = extractKeywords(weaknessTexts);

        // 4. Creative Ideas (Additional Thoughts) - Just recent ones for now
        const recentIdeas = responses
            .map((r: { additionalThoughts: string }) => r.additionalThoughts)
            .filter((t: string) => t && t.length > 5)
            .slice(0, 5);

        const formattedData = {
            atmosphere: Object.entries(atmosphereCounts).map(([name, value]) => ({ name, value })),
            strengths: topStrengths,
            weaknesses: topWeaknesses,
            ideas: recentIdeas
        };

        memoryCache.set(cacheKey, formattedData, 300); // Cache for 5 mins

        return NextResponse.json(formattedData, { headers });
    } catch (error) {
        console.error('Error fetching overall health data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch overall health data' },
            { status: 500 }
        );
    }
}
