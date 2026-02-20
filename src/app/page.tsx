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
    const [selectedTag, setSelectedTag] = useState('All');
    const [selectedAmbassador, setSelectedAmbassador] = useState<Ambassador | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % words.length);
        }, 4000);
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
    const filteredAmbassadors = selectedTag === 'All'
        ? ambassadors
        : ambassadors.filter(a => {
            const spec = a.specialization?.toLowerCase() || '';
            const tag = selectedTag.toLowerCase();
            if (tag === 'ops') return spec.includes('operations') || spec.includes('ops');
            return spec.includes(tag);
        });


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
            {/* Sticky Navbar */}
            <nav className="sticky top-0 z-[60] bg-itm-red px-6 py-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="ITM" className="h-8 w-auto" />
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-[540px] md:min-h-[85vh] flex items-start md:items-center justify-center overflow-hidden bg-white pt-10 md:pt-12 pb-6 md:pb-24">
                {/* Dynamic Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-itm-red/[0.03] rounded-full blur-[140px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-itm-gold/[0.03] rounded-full blur-[140px]" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-4 md:mb-6 tracking-tighter leading-[1.1]">
                            <span className="block mb-2 uppercase">ITM MBA <span className="lowercase">i</span>CONNECT'S</span>
                            <span
                                key={wordIndex}
                                className="gradient-text word-animate-in inline-block py-1 text-4xl md:text-7xl lg:text-9xl uppercase"
                            >
                                {words[wordIndex]}
                            </span>
                        </h1>

                        <p className="text-base md:text-xl text-gray-500 mb-4 md:mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                            Skip the filtered brochures. Connect with verified ITM MBA students for raw, honest insights.
                        </p>

                        <div className="flex justify-center">
                            <a href="#ambassadors" className="group relative bg-itm-red text-white px-10 py-4 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-itm-red/30 overflow-hidden">
                                <span className="relative z-10 tracking-widest">START CONNECTING</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-itm-red via-red-500 to-itm-red translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out opacity-20" />
                            </a>
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
                            { label: 'Avg Package', val: '8.5L' },
                            { label: 'Highest Package', val: '21L' },
                            { label: 'Professional Certs', val: '35+' },
                            { label: 'Paid Internship', val: '5 Months' }
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
                        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto max-w-full">
                            {['All', 'Marketing', 'Finance', 'HR', 'Ops'].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(tag)}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${selectedTag === tag
                                        ? 'bg-itm-red text-white shadow-lg'
                                        : 'text-gray-400 hover:bg-itm-red/5 hover:text-itm-red'
                                        }`}
                                >
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
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                            {filteredAmbassadors.map((ambassador) => (
                                <div
                                    key={ambassador.id}
                                    className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both cursor-pointer"
                                    onClick={() => setSelectedAmbassador(ambassador)}
                                >
                                    <AmbassadorCard ambassador={ambassador} isCompact={true} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Ambassador Detail Modal */}
            {selectedAmbassador && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300"
                    onClick={() => setSelectedAmbassador(null)}
                >
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xl" />
                    <div
                        className="relative w-full max-w-lg animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute -top-12 right-0 text-white hover:text-itm-red transition-colors font-black text-sm tracking-widest uppercase flex items-center gap-2"
                            onClick={() => setSelectedAmbassador(null)}
                        >
                            <span>Close</span>
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✕</div>
                        </button>
                        <AmbassadorCard ambassador={selectedAmbassador} />
                    </div>
                </div>
            )}

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
