'use client';

import { Users, Star, Activity, Heart } from 'lucide-react';

interface OverviewStatsProps {
    summary: { total: number };
}

const OverviewStats = ({ summary }: OverviewStatsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <Users size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Total Responses</p>
                    <h3 className="text-2xl font-bold text-gray-900">{summary.total}</h3>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <Star size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Avg Satisfaction</p>
                    <h3 className="text-2xl font-bold text-gray-900">--</h3> {/* Placeholder for calculated avg */}
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <Activity size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Active Depts</p>
                    <h3 className="text-2xl font-bold text-gray-900">--</h3>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                    <Heart size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Spirit Score</p>
                    <h3 className="text-2xl font-bold text-gray-900">--</h3>
                </div>
            </div>
        </div>
    );
};

export default OverviewStats;
