'use client';

import { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    Legend,
    ScatterChart,
    Scatter,
    ZAxis
} from 'recharts';

interface MinistryData {
    serving: { name: string; value: number }[];
    teamwork: { name: string; value: number }[];
    support: { name: string; value: number }[];
}

const MinistryCharts = () => {
    const [data, setData] = useState<MinistryData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/admin/ministries');
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error('Failed to fetch ministry data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading || !data) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                <div className="h-64 bg-gray-100 rounded-xl"></div>
                <div className="h-64 bg-gray-100 rounded-xl"></div>
            </div>
        );
    }

    const ratingOrder = ['Excellent', 'Good', 'Fair', 'Needs Improvement'];
    const sortedTeamwork = [...data.teamwork].sort((a, b) =>
        ratingOrder.indexOf(a.name) - ratingOrder.indexOf(b.name)
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Teamwork Ratings */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Ministry Teamwork</h3>
                    <div className="h-64">
                        {sortedTeamwork.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={sortedTeamwork}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" fontSize={11} interval={0} />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip cursor={{ fill: '#f3f4f6' }} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {sortedTeamwork.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={
                                                entry.name === 'Excellent' ? '#10b981' :
                                                    entry.name === 'Good' ? '#3b82f6' :
                                                        entry.name === 'Fair' ? '#f59e0b' : '#ef4444'
                                            } />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">No data available</div>
                        )}
                    </div>
                </div>

                {/* Support from Leadership */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Leadership Support</h3>
                    <div className="h-64">
                        {data.support.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.support}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.support.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={
                                                entry.name === 'Yes' ? '#10b981' :
                                                    entry.name === 'Sometimes' ? '#f59e0b' : '#ef4444'
                                            } />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">No data available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MinistryCharts;
