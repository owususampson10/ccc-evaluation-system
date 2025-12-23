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
    Legend
} from 'recharts';

interface DepartmentData {
    involvement: { name: string; value: number }[];
    activity: { name: string; value: number }[];
    effectiveness: { name: string; value: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DepartmentCharts = () => {
    const [data, setData] = useState<DepartmentData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/admin/departments');
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error('Failed to fetch department data', err);
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

    // Sort effectiveness logically
    const ratingOrder = ['Excellent', 'Good', 'Fair', 'Needs Improvement'];
    const sortedEffectiveness = [...data.effectiveness].sort((a, b) =>
        ratingOrder.indexOf(a.name) - ratingOrder.indexOf(b.name)
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Level - Pie */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Activity Level</h3>
                    <div className="h-64">
                        {data.activity.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.activity}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.activity.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={
                                                entry.name === 'Very Active' ? '#10b981' :
                                                    entry.name === 'Active' ? '#3b82f6' : '#9ca3af'
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

                {/* Effectiveness - Bar */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Effectiveness Ratings</h3>
                    <div className="h-64">
                        {sortedEffectiveness.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={sortedEffectiveness}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" fontSize={11} interval={0} />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip cursor={{ fill: '#f3f4f6' }} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {sortedEffectiveness.map((entry, index) => (
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

                {/* Involvement - Horizontal Bar */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Active Departments (by Involvement)</h3>
                    <div className="h-72">
                        {data.involvement.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.involvement} layout="vertical" margin={{ left: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                    <XAxis type="number" allowDecimals={false} />
                                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 13 }} />
                                    <Tooltip cursor={{ fill: '#f3f4f6' }} />
                                    <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">No department data recorded yet</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentCharts;
