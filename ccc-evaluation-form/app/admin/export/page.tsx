'use client';

import React, { useState } from 'react';
import { Download, FileText, Filter, Calendar, CheckCircle } from 'lucide-react';
import Toast from '@/components/ui/Toast';

export default function ExportPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Filter States
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [serviceFilter, setServiceFilter] = useState('all');
    const [memberFilter, setMemberFilter] = useState('all');
    const [ratingFilter, setRatingFilter] = useState('all');

    const handleExport = async (type: 'full' | 'filtered') => {
        setIsLoading(true);
        try {
            const filters = type === 'filtered' ? {
                startDate: dateRange.start,
                endDate: dateRange.end,
                service: serviceFilter,
                memberStatus: memberFilter,
                rating: ratingFilter
            } : {};

            console.log('Initiating export fetch...', type);
            const response = await fetch('/api/admin/export/csv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filters)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Export API error:', response.status, errorData);
                throw new Error('Export failed');
            }

            const blob = await response.blob();
            console.log('Blob received, size:', blob.size);

            if (blob.size === 0) {
                setToast({ message: 'No data found for the selected filters.', type: 'error' });
                setIsLoading(false);
                return;
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `ccc-responses-${type}-${new Date().toISOString().split('T')[0]}.csv`;

            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 100);

            setToast({ message: 'Export downloaded successfully!', type: 'success' });
        } catch (error) {
            console.error('Export exception:', error);
            setToast({ message: 'Failed to generate export file. Check console.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-12 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Data Export Center</h1>
                <p className="text-gray-500">Download response data for external analysis or reporting.</p>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 1. Quick Export Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg w-fit mb-4">
                        <Download size={24} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Full Dataset Export</h2>
                    <p className="text-gray-500 text-sm mb-6 flex-grow">
                        Download every single response collected so far in CSV format.
                        Includes all demographics, ratings, and open-ended answers.
                        Ideal for backup or Excel pivot tables.
                    </p>
                    <button
                        onClick={() => handleExport('full')}
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? 'Generating...' : (
                            <>
                                <FileText size={18} /> Download All Data
                            </>
                        )}
                    </button>
                </div>

                {/* 2. Filtered Export Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Filter size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Custom Filter Export</h2>
                            <p className="text-gray-500 text-sm">Select specific data segments to download.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Date Range */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Calendar size={14} /> Date Range
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    className="flex-1 p-2 border border-gray-200 rounded-lg text-sm"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                />
                                <span className="text-gray-400 self-center">-</span>
                                <input
                                    type="date"
                                    className="flex-1 p-2 border border-gray-200 rounded-lg text-sm"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Service Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Service Attendance</label>
                            <select
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
                                value={serviceFilter}
                                onChange={(e) => setServiceFilter(e.target.value)}
                            >
                                <option value="all">All Services</option>
                                <option value="1st">1st Service (6-8am)</option>
                                <option value="2nd">2nd Service (8-10am)</option>
                                <option value="3rd">3rd Service (10-12pm)</option>
                            </select>
                        </div>

                        {/* Member Status */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Membership</label>
                            <select
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
                                value={memberFilter}
                                onChange={(e) => setMemberFilter(e.target.value)}
                            >
                                <option value="all">All Respondents</option>
                                <option value="member">Members Only</option>
                                <option value="visitor">Visitors Only</option>
                            </select>
                        </div>

                        {/* Rating Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Overall Rating</label>
                            <select
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
                                value={ratingFilter}
                                onChange={(e) => setRatingFilter(e.target.value)}
                            >
                                <option value="all">Any Rating</option>
                                <option value="Excellent">Excellent Only</option>
                                <option value="Good">Good Only</option>
                                <option value="Fair">Fair Only</option>
                                <option value="Needs Improvement">Needs Improvement</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-auto flex justify-end">
                        <button
                            onClick={() => handleExport('filtered')}
                            disabled={isLoading}
                            className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all shadow-md shadow-indigo-200 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading ? 'Processing...' : (
                                <>
                                    <CheckCircle size={18} /> Export Filtered Selection
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* 3. PDF Report Placeholder (Future Feature) */}
                <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center opacity-75 lg:col-span-3">
                    <div className="p-3 bg-gray-200 text-gray-500 rounded-full mb-3">
                        <FileText size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-900">PDF Report Generation</h3>
                    <p className="text-sm text-gray-500 max-w-md mt-1">
                        Professional printable reports with charts and summaries will be available in the next update.
                    </p>
                </div>
            </div>
        </div>
    );
}
