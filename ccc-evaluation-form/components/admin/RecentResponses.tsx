'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, ArrowRight, User } from 'lucide-react';

interface ResponseSummary {
    id: string;
    createdAt: string;
    enteredBy: string;
    serviceAttendance: string;
    overallRating: string;
}

const RecentResponses = () => {
    const [responses, setResponses] = useState<ResponseSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const res = await fetch('/api/responses?limit=5');
                if (res.ok) {
                    const data = await res.json();
                    setResponses(data.responses);
                }
            } catch (error) {
                console.error('Failed to fetch recent responses', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecent();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Responses</h3>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (responses.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <FileText className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">No responses yet</h3>
                <p className="text-sm text-gray-500 mt-1 mb-4">
                    Once volunteers submit forms, they will appear here.
                </p>
                <Link
                    href="/form"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    Enter a response manually &rarr;
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Recent Responses</h3>
                <Link
                    href="/admin/responses"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                    View All <ArrowRight size={16} />
                </Link>
            </div>

            <div className="divide-y divide-gray-100 overflow-y-auto flex-1">
                {responses.map((response) => (
                    <Link
                        key={response.id}
                        href={`/admin/responses/${response.id}`}
                        className="block p-4 hover:bg-gray-50 transition-colors group"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex gap-3">
                                <div className="mt-1 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                                    {response.overallRating === 'Excellent' ? 'A+' :
                                        response.overallRating === 'Good' ? 'A' :
                                            response.overallRating === 'Fair' ? 'B' : 'C'}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {response.serviceAttendance}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <User size={12} className="text-gray-400" />
                                        <p className="text-xs text-gray-500">
                                            By {response.enteredBy}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${response.overallRating === 'Excellent' ? 'bg-green-100 text-green-800' :
                                    response.overallRating === 'Good' ? 'bg-blue-100 text-blue-800' :
                                        response.overallRating === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                    }`}>
                                    {response.overallRating}
                                </span>
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(response.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RecentResponses;
