'use client';

import React, { useState, useEffect } from 'react';
import AmbassadorCard from '@/components/AmbassadorCard';
import { Ambassador } from '@/data/mockAmbassadors';
import { GraduationCap, Users, MessageSquare, ShieldCheck, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';

export default function Home() {
    const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
    const [loading, setLoading] = useState(true);
    const [words] = useState(['STUDENT', 'AMBASSADOR', 'ROCKETS']);
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % words.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [words]);

    useEffect(() => {
        const q = query(collection(db, 'ambassadors'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Ambassador[];
            setAmbassadors(data.filter(a => a.is_active));
            setLoading(false);
        }, () => setLoading(false));
        return () => unsubscribe();
    }, []);

    const Marquee = ({ text }: { text: string }) => (
        <div className="bg-white overflow-hidden py-6 border-y border-gray-100 relative z-20">
            <div className="animate-marquee whitespace-nowrap">
                {[...Array(10)].map((_, i) => (
                    <span key={i} className="text-gray-200 text-4xl font-black uppercase tracking-tighter mx-8 inline-block select-none">
                        {text} <span className="text-itm-red">•</span>
                    </span>
                ))}
            </div>
        </div>
    );

    return (
        <main className="min-h-screen bg-white selection:bg-itm-red/20 selection:text-itm-red">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white pt-20">
                {/* Dynamic Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-itm-red/[0.03] rounded-full blur-[140px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-itm-gold/[0.03] rounded-full blur-[140px]" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-full mb-10 animate-float shadow-sm">
                            <span className="w-2 h-2 bg-itm-red rounded-full animate-ping" />
                            <span className="text-itm-red text-xs font-black tracking-[0.2em] uppercase">Live Ambassador Network</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-gray-900 mb-8 tracking-tighter leading-none uppercase">
                            <span className="block mb-2 whitespace-nowrap">ITM MBA iConnect's</span>
                            <span
                                key={wordIndex}
                                className="gradient-text word-animate-in inline-block py-2"
                            >
                                {words[wordIndex]}
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-500 mb-14 max-w-2xl mx-auto font-medium leading-relaxed">
                            Skip the filtered brochures. Connect with verified ITM MBA students for raw, honest insights.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <a href="#ambassadors" className="group relative bg-itm-red text-white px-12 py-5 rounded-3xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-itm-red/30 overflow-hidden">
                                <span className="relative z-10 tracking-widest">START CONNECTING</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-itm-red via-red-500 to-itm-red translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out opacity-20" />
                            </a>

                            {!loading && ambassadors.length > 0 && (
                                <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-3xl border border-gray-100 shadow-sm">
                                    <div className="flex -space-x-4">
                                        {ambassadors.slice(0, 3).map((a) => (
                                            <div key={a.id} className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden relative group">
                                                <img src={a.photo_url} alt="" className="w-full h-full object-cover transition-all duration-500" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-gray-900 font-black text-lg">+{ambassadors.length} Students</div>
                                        <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-none">Awaiting Chat</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Scrolling Bar (Marquee) */}
                <div className="absolute bottom-0 left-0 w-full">
                    <Marquee text="REAL INSIGHTS • NO BOTS • CAMPUS LIFE • PLACEMENT TRUTH • ACADEMIC REALITY" />
                </div>
            </section>

            {/* Scrolling Stats Section */}
            <div className="bg-white py-12 border-b border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: 'Active Connects', val: '2.5k+' },
                            { label: 'Response Rate', val: '98%' },
                            { label: 'Verified Campus', val: '100%' },
                            { label: 'Avg Feedback', val: '4.9/5' }
                        ].map((s, i) => (
                            <div key={i} className="text-center group cursor-default">
                                <div className="text-itm-red text-4xl font-black mb-1 group-hover:scale-110 transition-transform duration-300">{s.val}</div>
                                <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ambassador Grid */}
            <section id="ambassadors" className="py-24 bg-gray-50/50">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter">
                                THE <span className="text-itm-red">AMBASSADORS</span>
                            </h2>
                            <p className="text-xl text-gray-500 font-medium">
                                Filtered through transparency. Choose your mentor for the journey ahead.
                            </p>
                        </div>
                        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                            {['All', 'Marketing', 'Finance', 'HR', 'Ops'].map(tag => (
                                <button key={tag} className="px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-itm-red/5 hover:text-itm-red transition-all cursor-pointer">
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-20 flex flex-col items-center gap-4 text-itm-gold">
                            <Loader2 className="animate-spin" size={48} />
                            <span className="font-black tracking-widest uppercase">Fetching Network...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {ambassadors.map((ambassador) => (
                                <div key={ambassador.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both" style={{ animationDelay: `${Math.random() * 500}ms` }}>
                                    <AmbassadorCard ambassador={ambassador} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Why Experience ITM? */}
            <section className="py-32 bg-white overflow-hidden relative">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {[
                            { icon: <Users size={32} />, title: "Student Led", desc: "No admissions office filters. Just raw student experiences." },
                            { icon: <MessageSquare size={32} />, title: "Instant Chat", desc: "Connect via Instagram or LinkedIn DMs with one click." },
                            { icon: <ShieldCheck size={32} />, title: "ITM Verified", desc: "Every ambassador is authenticated by current enrollment records." }
                        ].map((f, i) => (
                            <div key={i} className="group p-10 rounded-[2.5rem] bg-gray-50 hover:bg-itm-red transition-all duration-500 cursor-default shadow-sm hover:shadow-2xl hover:shadow-itm-red/20 border border-gray-100">
                                <div className="bg-itm-red group-hover:bg-white text-white group-hover:text-itm-red p-5 rounded-2xl inline-block mb-8 transition-colors duration-500">
                                    {f.icon}
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 group-hover:text-white mb-4 transition-colors duration-500">{f.title}</h3>
                                <p className="text-gray-500 group-hover:text-white/70 font-medium transition-colors duration-500">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 text-gray-400 py-24 border-t border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-20">
                        <div className="flex items-center gap-4 grayscale opacity-50">
                            <img src="/logo.png" alt="ITM" className="h-10 w-auto" />
                            <div className="h-8 w-[1px] bg-gray-200" />
                            <div className="font-black tracking-[0.2em] text-lg text-gray-900">STUDENT CONNECT</div>
                        </div>
                        <div className="flex gap-10 text-[10px] font-black tracking-[0.3em] uppercase text-gray-400">
                            <a href="#" className="hover:text-itm-red transition-colors">Privacy</a>
                            <a href="#" className="hover:text-itm-red transition-colors">Terms</a>
                            <a href="/admin-stats/dashboard" className="hover:text-itm-red transition-colors">Admin</a>
                        </div>
                    </div>
                    <div className="text-center text-[10px] font-black tracking-[0.4em] uppercase opacity-40 text-gray-400">
                        © 2026 ITM MBA STUDENT CONNECT PLATFORM • TRANSFORMING ADMISSIONS
                    </div>
                </div>
            </footer>
        </main>
    );
}
