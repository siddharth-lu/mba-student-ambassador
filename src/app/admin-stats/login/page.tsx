'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Specific ID and Password as requested
        if (id === 'admin' && password === 'itmconnect2026') {
            localStorage.setItem('isAdminAuthenticated', 'true');
            router.push('/admin-stats/ambassadors');
        } else {
            setError('Invalid ID or Password');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-3xl shadow-xl border-2 border-itm-red/10">
                        <img src="/logo.png" alt="ITM Logo" className="h-12 w-auto" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-black text-gray-900 tracking-tighter">
                    Admin Portal Login
                </h2>
                <p className="mt-2 text-center text-sm text-gray-500 font-medium">
                    Please enter your credentials to continue
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
                <div className="bg-white py-8 px-4 shadow-2xl shadow-itm-red/5 sm:rounded-3xl sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="id" className="block text-sm font-bold text-gray-700 uppercase tracking-widest">
                                Admin ID
                            </label>
                            <div className="mt-1 relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-itm-red transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    id="id"
                                    name="id"
                                    type="text"
                                    required
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border-2 border-gray-100 rounded-2xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-itm-red/20 focus:border-itm-red sm:text-sm transition-all font-medium"
                                    placeholder="Enter your ID"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-gray-700 uppercase tracking-widest">
                                Password
                            </label>
                            <div className="mt-1 relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-itm-red transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border-2 border-gray-100 rounded-2xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-itm-red/20 focus:border-itm-red sm:text-sm transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                                <AlertCircle className="text-red-500 shrink-0" size={20} />
                                <p className="text-sm text-red-600 font-bold">{error}</p>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl text-lg font-black text-white bg-itm-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-itm-red transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 tracking-widest uppercase"
                            >
                                {isLoading ? 'Authenticating...' : 'Sign In'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push('/')}
                        className="text-sm font-bold text-gray-400 hover:text-itm-red transition-colors uppercase tracking-widest"
                    >
                        ← Back to Public Site
                    </button>
                </div>
            </div>
        </div>
    );
}
