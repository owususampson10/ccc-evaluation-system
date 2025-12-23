'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';

const ExportButton = () => {
    const [downloading, setDownloading] = useState(false);

    const handleExport = async () => {
        try {
            setDownloading(true);
            const response = await fetch('/api/admin/export');

            if (!response.ok) {
                throw new Error('Export failed');
            }

            // Get the filename from headers or default
            const filename = 'ccc_responses.csv';

            // Convert to blob and download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download report. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-2">
                <Download className="w-5 h-5 text-indigo-200" />
                <h3 className="text-lg font-bold">Export Data</h3>
            </div>

            <p className="text-indigo-100 text-sm mb-6">
                Download all responses in CSV format for offline analysis in Excel or other tools.
            </p>

            <button
                onClick={handleExport}
                disabled={downloading}
                className="w-full bg-white text-indigo-600 py-2.5 px-4 rounded-lg font-semibold text-sm hover:bg-indigo-50 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
                {downloading ? (
                    <>
                        <span className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                        Generating CSV...
                    </>
                ) : (
                    'Download CSV Report'
                )}
            </button>
        </div>
    );
};

export default ExportButton;
