'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Eye,
    Download,
    Plus,
    Trash2
} from 'lucide-react';
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal';
import Toast from '@/components/ui/Toast';

interface ResponseSummary {
    id: string;
    createdAt: string;
    enteredBy: string;
    gender: string;
    membershipCode: string | null;
    serviceAttendance: string;
    isMember: boolean;
    overallRating: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const ResponsesPage = () => {
    const [responses, setResponses] = useState<ResponseSummary[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [serviceFilter, setServiceFilter] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [toDeleteId, setToDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: '20',
                    search: debouncedSearch,
                    service: serviceFilter
                });
                const res = await fetch(`/api/responses?${params.toString()}`);
                if (res.ok) {
                    const data = await res.json();
                    setResponses(data.responses);
                    setPagination(data.pagination);
                }
            } catch (error) {
                console.error('Failed to fetch responses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, debouncedSearch, serviceFilter]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && pagination && newPage <= pagination.totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const formatServiceAttendance = (attendance: string) => {
        const services = attendance.split(',').map(s => s.trim());
        const has1st = services.some(s => s.startsWith('1st'));
        const has2nd = services.some(s => s.startsWith('2nd'));
        const has3rd = services.some(s => s.startsWith('3rd'));

        if (has1st && has2nd && has3rd) return 'All Services';

        const result = [];
        if (has1st) result.push('1st');
        if (has2nd) result.push('2nd');
        if (has3rd) result.push('3rd');

        if (result.length === 0) return attendance;
        if (result.length === 1) return `${result[0]} Service`;

        return `${result.join(' & ')} Service`;
    };

    const handleDelete = async () => {
        if (!toDeleteId) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/responses/${toDeleteId}`, { method: 'DELETE' });
            if (res.ok) {
                setResponses(prev => prev.filter(r => r.id !== toDeleteId));
                setToast({ message: 'Response deleted successfully', type: 'success' });
            } else {
                setToast({ message: 'Failed to delete response', type: 'error' });
            }
        } catch (error) {
            console.error('Delete error:', error);
            setToast({ message: 'An error occurred while deleting', type: 'error' });
        } finally {
            setIsDeleting(false);
            setToDeleteId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">All Responses</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and view all submitted evaluation forms.</p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href="/form"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
                    >
                        <Plus size={16} />
                        New Response
                    </Link>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by volunteer or member code..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select
                        value={serviceFilter}
                        onChange={(e) => {
                            setServiceFilter(e.target.value);
                            setPage(1);
                        }}
                        className="pl-10 pr-8 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white text-gray-700 min-w-[180px]"
                    >
                        <option value="">All Services</option>
                        <option value="1st Service">1st Service</option>
                        <option value="2nd Service">2nd Service</option>
                        <option value="3rd Service">3rd Service</option>
                        <option value="All Services">Check All 3</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900">Date/Time</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Gender</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Member Code</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Service Attendance</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Member</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Overall</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                // Loading skeletons
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-8 ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : responses.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No responses found.
                                    </td>
                                </tr>
                            ) : (
                                responses.map((response) => (
                                    <tr key={response.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">
                                                    {new Date(response.createdAt).toLocaleDateString('en-GB')}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(response.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">
                                            {response.gender}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-gray-700">
                                            {response.isMember && response.membershipCode ? response.membershipCode : ''}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-700 break-words max-w-[200px] inline-block">
                                                {formatServiceAttendance(response.serviceAttendance)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${response.isMember
                                                ? 'bg-green-50 text-green-700'
                                                : 'bg-orange-50 text-orange-700'
                                                }`}>
                                                {response.isMember ? 'Member' : 'Visitor'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-medium text-sm ${response.overallRating === 'Excellent' ? 'text-green-600' :
                                                response.overallRating === 'Good' ? 'text-blue-600' :
                                                    response.overallRating === 'Fair' ? 'text-orange-600' : 'text-red-600'
                                                }`}>{response.overallRating}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/responses/${response.id}`}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => setToDeleteId(response.id)}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                                    title="Delete Response"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                        <p className="text-sm text-gray-500">
                            Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span> results
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === pagination.totalPages}
                                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Components */}
            <DeleteConfirmModal
                isOpen={!!toDeleteId}
                onClose={() => setToDeleteId(null)}
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default ResponsesPage;
