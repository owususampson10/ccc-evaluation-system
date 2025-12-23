'use client';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

interface EngagementChartsProps {
    data: {
        departmentActivity: any[];
        ministryTeamwork: any[];
    };
}

const EngagementCharts = ({ data }: EngagementChartsProps) => {

    const activityData = data.departmentActivity.map(item => ({
        name: item.departmentActivity,
        count: item._count
    }));

    const teamworkData = data.ministryTeamwork.map(item => ({
        name: item.ministryTeamwork,
        count: item._count
    }));

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Engagement & Functionality</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Department Activity */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
                    <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">Department Activity Levels</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={activityData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip cursor={{ fill: '#f3f4f6' }} />
                            <Bar dataKey="count" fill="#ec4899" radius={[4, 4, 0, 0]} name="Count" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Ministry Teamwork */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
                    <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">Ministry Teamwork Ratings</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={teamworkData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip cursor={{ fill: '#f3f4f6' }} />
                            <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Count" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default EngagementCharts;
