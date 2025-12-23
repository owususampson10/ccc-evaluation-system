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
    Pie
} from 'recharts';

interface ServiceQualityData {
    ratings: { name: string; value: number }[];
    transitions: { name: string; value: number }[];
    convenience: { name: string; value: number }[];
    atmosphere: { name: string; value: number }[];
}

const ServiceQualityCharts = () => {
    const [data, setData] = useState<ServiceQualityData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/admin/service-quality');
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error('Failed to fetch service quality data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading || !data) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
                <div className="h-72 bg-gray-100 rounded-xl"></div>
                <div className="h-72 bg-gray-100 rounded-xl"></div>
            </div>
        );
    }

    // Helper to sort ratings logically (Excellent -> Needs Improvement)
    const ratingOrder = ['Excellent', 'Good', 'Fair', 'Needs Improvement'];
    const sortedRatings = [...data.ratings].sort((a, b) =>
        ratingOrder.indexOf(a.name) - ratingOrder.indexOf(b.name)
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Overall Ratings */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Overall Service Ratings</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sortedRatings} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 13 }} />
                                <Tooltip
                                    cursor={{ fill: '#f3f4f6' }}
                                    contentStyle={{ borderRadius: '8px' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {sortedRatings.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                entry.name === 'Excellent' ? '#10b981' :
                                                    entry.name === 'Good' ? '#3b82f6' :
                                                        entry.name === 'Fair' ? '#f59e0b' : '#ef4444'
                                            }
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Transition Smoothness */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Transition Smoothness</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.transitions}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={(props: any) => `${props.name} ${((props.percent || 0) * 100).toFixed(0)}%`}
                                >
                                    {data.transitions.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                entry.name === 'Yes' ? '#10b981' :
                                                    entry.name === 'Somewhat' ? '#f59e0b' : '#ef4444'
                                            }
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Spiritual Atmosphere */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Spiritual Atmosphere</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.atmosphere}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={11} interval={0} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceQualityCharts;
