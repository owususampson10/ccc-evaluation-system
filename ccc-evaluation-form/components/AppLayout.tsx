'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { TokenPayload } from '@/lib/auth';
import Sidebar from './Sidebar';

interface AppLayoutProps {
    children: React.ReactNode;
    session: TokenPayload | null;
}

export default function AppLayout({ children, session }: AppLayoutProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Pages that shouldn't have the sidebar
    const isExcluded = pathname === '/login' || pathname === '/';

    if (isExcluded) {
        return <main className="min-h-screen bg-gray-50">{children}</main>;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar session={session} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'pl-20' : 'pl-72'}`}>
                <div className="mx-auto max-w-7xl p-8 animate-fadeIn">
                    {children}
                </div>
            </main>
        </div>
    );
}
