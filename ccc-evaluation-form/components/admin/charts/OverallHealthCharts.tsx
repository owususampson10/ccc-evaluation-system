'use client';

import { useEffect, useState } from 'react';
import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';

interface HealthData {
    atmosphere: { name: string; value: number }[];
    strengths: { text: string; value: number }[];
    weaknesses: { text: string; value: number }[];
    ideas: string[];
}

const OverallHealthCharts = () => {
    const [data, setData] = useState<HealthData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/admin/overall-health');
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error('Failed to fetch health data', err);
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

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Spiritual Atmosphere */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 w-full">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Spiritual Atmosphere</h3>
                            <p className="text-sm text-gray-500 mb-4">How the congregation perceives the spiritual state.</p>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.atmosphere}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={(props: any) => `${props.name} ${((props.percent || 0) * 100).toFixed(0)}%`}
                                        >
                                            {data.atmosphere.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={
                                                    entry.name === 'Vibrant' ? '#10b981' :
                                                        entry.name === 'Encouraging' ? '#3b82f6' :
                                                            entry.name === 'Neutral' ? '#f59e0b' : '#ef4444'
                                                } />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="flex-1 w-full bg-blue-50 p-6 rounded-xl">
                            <h4 className="font-bold text-blue-900 mb-4">Recent Innovative Ideas</h4>
                            <ul className="space-y-3">
                                {data.ideas.map((idea, idx) => (
                                    <li key={idx} className="flex gap-3 text-sm text-blue-800 bg-white p-3 rounded-lg shadow-sm">
                                        <span className="text-blue-400 font-bold">•</span>
                                        {idea}
                                    </li>
                                ))}
                                {data.ideas.length === 0 && <li className="text-gray-500 italic">No ideas submitted yet.</li>}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Top Strengths (Keywords) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Mentioned Strengths</h3>
                    <div className="h-64">
                        {data.strengths.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.strengths} layout="vertical" margin={{ left: 30 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="text" type="category" width={100} tick={{ fontSize: 13 }} />
                                    <Tooltip cursor={{ fill: '#f3f4f6' }} />
                                    <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} name="Mentions" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">No data available</div>
                        )}
                    </div>
                </div>

                {/* Top Weaknesses (Keywords) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Areas for Improvement</h3>
                    <div className="h-64">
                        {data.weaknesses.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.weaknesses} layout="vertical" margin={{ left: 30 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="text" type="category" width={100} tick={{ fontSize: 13 }} />
                                    <Tooltip cursor={{ fill: '#f3f4f6' }} />
                                    <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} name="Mentions" />
                                </BarChart>
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

export default OverallHealthCharts;
