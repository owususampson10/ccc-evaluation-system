'use client';

import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const styles = {
        success: 'bg-green-50 border-green-100 text-green-800',
        error: 'bg-red-50 border-red-100 text-red-800',
        info: 'bg-blue-50 border-blue-100 text-blue-800'
    };

    const icons = {
        success: <CheckCircle className="text-green-500" size={20} />,
        error: <AlertCircle className="text-red-500" size={20} />,
        info: <AlertCircle className="text-blue-500" size={20} />
    };

    return (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slideUp ${styles[type]}`}>
            {icons[type]}
            <p className="text-sm font-semibold">{message}</p>
            <button
                onClick={onClose}
                className="p-1 hover:bg-black/5 rounded-full transition-colors ml-2"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
