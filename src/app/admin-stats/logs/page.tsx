'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    Download,
    Filter,
    Instagram,
    Linkedin,
    Smartphone,
    Monitor,
    Calendar,
    Loader2
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import Papa from 'papaparse';

export default function InteractionLogs() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'interaction_logs'), orderBy('created_at', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Format date for display
                dateFormatted: doc.data().created_at
                    ? new Date(doc.data().created_at.seconds * 1000).toLocaleString()
                    : 'Pending...'
            }));
            setLogs(data);
            setLoading(false);
        }, (error) => {
            console.error("Logs listener error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const exportToCSV = () => {
        const csv = Papa.unparse(logs);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `itm_connect_logs_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredLogs = logs.filter(log =>
        log.ambassador_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.platform.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-itm-red">Interaction Logs</h1>
                    <p className="text-gray-500 mt-1">A detailed record of every prospect-student connection.</p>
                </div>
                <button
                    onClick={exportToCSV}
                    className="bg-itm-red hover:bg-red-800 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-itm-red/20 text-sm md:text-base w-full md:w-auto"
                >
                    <Download size={18} />
                    <span>Export CSV</span>
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-2">
                <div className="flex-grow relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by ambassador ID or platform..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-itm-gold/20 transition-all text-gray-900"
                    />
                </div>
                <button className="flex items-center justify-center gap-2 px-6 bg-red-50 hover:bg-red-100 rounded-xl py-4 md:py-0 transition-all">
                    <Filter size={18} className="text-itm-red" />
                    <span className="text-[10px] md:text-sm font-black text-itm-red uppercase tracking-widest">Filter</span>
                </button>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="py-20 text-center text-gray-400 font-medium flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-itm-gold" size={40} />
                        Loading logs...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Prospect Action</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ambassador ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Device</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Source</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-gray-400 italic">No matching logs found.</td>
                                    </tr>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${log.platform === 'instagram' ? 'bg-pink-50 text-pink-500' : 'bg-blue-50 text-blue-600'}`}>
                                                        {log.platform === 'instagram' ? <Instagram size={16} /> : <Linkedin size={16} />}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900">Chat on {log.platform}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {log.ambassador_id}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    {log.device_type === 'mobile' ? <Smartphone size={16} /> : <Monitor size={16} />}
                                                    <span className="text-xs font-medium capitalize">{log.device_type}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-medium text-gray-400 italic">
                                                    {log.referrer || 'direct'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Calendar size={14} />
                                                    <span className="text-xs font-medium">{log.dateFormatted}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
