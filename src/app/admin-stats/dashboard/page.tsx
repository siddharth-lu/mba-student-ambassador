'use client';

import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    Users,
    MousePointer2,
    TrendingUp,
    Instagram,
    Linkedin,
    Loader2
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, limit, orderBy } from 'firebase/firestore';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalHits: 0,
        activeAmbassadors: 0,
        igDirects: 0,
        liDirects: 0
    });
    const [recentLogs, setRecentLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listener for Ambassadors count
        const unsubAmb = onSnapshot(collection(db, 'ambassadors'), (snapshot) => {
            setStats(prev => ({
                ...prev,
                activeAmbassadors: snapshot.docs.filter(d => d.data().is_active).length
            }));
        });

        // Listener for Interaction Logs
        const qLogs = query(collection(db, 'interaction_logs'), orderBy('created_at', 'desc'));
        const unsubLogs = onSnapshot(qLogs, (snapshot) => {
            const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const ig = logs.filter((l: any) => l.platform === 'instagram').length;
            const li = logs.filter((l: any) => l.platform === 'linkedin').length;

            setStats(prev => ({
                ...prev,
                totalHits: logs.length,
                igDirects: ig,
                liDirects: li
            }));
            setRecentLogs(logs.slice(0, 5));
            setLoading(false);
        });

        return () => {
            unsubAmb();
            unsubLogs();
        };
    }, []);

    const statCards = [
        { label: 'Total Hits', value: stats.totalHits.toLocaleString(), icon: MousePointer2, color: 'text-itm-gold', bg: 'bg-itm-gold/10' },
        { label: 'Ambassadors', value: stats.activeAmbassadors.toLocaleString(), icon: Users, color: 'text-itm-red', bg: 'bg-red-50' },
        { label: 'IG Directs', value: stats.igDirects.toLocaleString(), icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-50' },
        { label: 'LI Directs', value: stats.liDirects.toLocaleString(), icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-100' },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                <Loader2 className="animate-spin text-itm-gold" size={40} />
                <p className="font-medium">Loading analytics...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-itm-red">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Real-time performance metrics of ITM MBA Student Connect.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${card.bg} ${card.color} p-3 rounded-xl`}>
                                <card.icon size={24} />
                            </div>
                            <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                                <TrendingUp size={12} /> Live
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                        <div className="text-sm font-medium text-gray-400">{card.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <BarChart3 size={20} className="text-itm-gold" />
                            Recent Interactions
                        </h3>
                        <button className="text-xs font-bold text-itm-red hover:text-itm-gold transition-colors">VIEW ALL</button>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {recentLogs.length === 0 ? (
                                <p className="text-center py-10 text-gray-400">No interactions recorded yet.</p>
                            ) : (
                                recentLogs.map((log: any) => (
                                    <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl transition-all hover:bg-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${log.platform === 'instagram' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {log.platform === 'instagram' ? <Instagram size={18} /> : <Linkedin size={18} />}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">Prospect Clicked {log.platform}</div>
                                                <div className="text-xs text-gray-400">ID: {log.ambassador_id}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-gray-500 uppercase">{log.device_type}</div>
                                            <div className="text-[10px] text-gray-400">{new Date(log.created_at?.seconds * 1000).toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-itm-red rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl">
                    <div>
                        <h3 className="text-xl font-bold mb-4 italic">Next Steps...</h3>
                        <p className="text-red-50/70 text-sm leading-relaxed mb-6">
                            "Every click is a potential student. Your ambassadors are doing a great job connecting ITM to the world."
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-itm-gold" />
                                <span className="text-sm font-medium">Verify new student profiles</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-itm-gold" />
                                <span className="text-sm font-medium">Export weekly lead data</span>
                            </div>
                        </div>
                    </div>
                    <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-all mt-8">
                        Manage Team
                    </button>
                </div>
            </div>
        </div>
    );
}
