'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    LogOut,
    GraduationCap,
    ChevronRight,
    ExternalLink,
    ScrollText
} from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin-stats/dashboard' },
        { name: 'Ambassadors', icon: Users, path: '/admin-stats/ambassadors' },
        { name: 'Interaction Logs', icon: ScrollText, path: '/admin-stats/logs' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-itm-red text-white flex flex-col fixed h-full z-20 shadow-2xl">
                <div className="p-6 flex flex-col gap-4 border-b border-white/10">
                    <div className="bg-white p-3 rounded-2xl shadow-inner flex justify-center items-center">
                        <img src="/logo.png" alt="ITM Logo" className="h-10 w-auto" />
                    </div>
                    <div className="px-2">
                        <h2 className="font-bold text-lg leading-tight">Analytics Portal</h2>
                        <p className="text-itm-gold text-xs font-bold tracking-widest uppercase">MBA Connect</p>
                    </div>
                </div>

                <nav className="flex-grow p-4 space-y-2 mt-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-white text-itm-red font-bold shadow-lg'
                                    : 'text-red-50 hover:bg-white/10'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span>{item.name}</span>
                                {isActive && <ChevronRight size={16} className="ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 space-y-2">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-50 hover:bg-white/10 transition-all text-sm"
                    >
                        <ExternalLink size={18} />
                        <span>View Public Site</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
