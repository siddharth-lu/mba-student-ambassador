'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Users,
    LogOut,
    ChevronRight,
    ExternalLink,
    Menu,
    X,
    Loader2
} from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        // Simple authentication check using localStorage
        const authStatus = localStorage.getItem('isAdminAuthenticated');
        if (authStatus !== 'true' && pathname !== '/admin-stats/login') {
            setIsAuthenticated(false);
            router.push('/admin-stats/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [pathname, router]);

    const handleLogout = () => {
        localStorage.removeItem('isAdminAuthenticated');
        router.push('/admin-stats/login');
    };

    // Simplified menu items - removed Dashboard and Logs
    const menuItems = [
        { name: 'Ambassadors', icon: Users, path: '/admin-stats/ambassadors' },
    ];

    // Show loading state while checking authentication
    if (isAuthenticated === null && pathname !== '/admin-stats/login') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 text-itm-red">
                <Loader2 className="animate-spin" size={48} />
                <span className="font-black tracking-widest uppercase">Verifying Session...</span>
            </div>
        );
    }

    // Don't show sidebar/header on login page
    if (pathname === '/admin-stats/login') {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 bg-itm-red text-white h-16 px-4 flex items-center justify-between z-30 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-1.5 rounded-lg shadow-inner">
                        <img src="/logo.png" alt="ITM Logo" className="h-6 w-auto" />
                    </div>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                    <Menu size={24} />
                </button>
            </header>

            {/* Backdrop for Mobile Sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[40] lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`w-64 bg-itm-red text-white flex flex-col fixed h-full z-[50] shadow-2xl transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="p-6 flex flex-col gap-4 border-b border-white/10">
                    <div className="flex items-center justify-between lg:block">
                        <div className="bg-white p-3 rounded-2xl shadow-inner flex justify-center items-center grow lg:grow-0">
                            <img src="/logo.png" alt="ITM Logo" className="h-10 w-auto" />
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors ml-4"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="px-2">
                        <h2 className="font-bold text-lg leading-tight text-white">Admin Management</h2>
                        <p className="text-itm-gold text-xs font-bold tracking-widest uppercase">MBA Connect</p>
                    </div>
                </div>

                <nav className="flex-grow p-4 space-y-2 mt-4 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsSidebarOpen(false)}
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
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-50 hover:bg-white/10 transition-all text-sm cursor-pointer"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow lg:ml-64 p-4 sm:p-6 md:p-8 pt-20 lg:pt-8 transition-all">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
