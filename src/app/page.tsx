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

    useEffect(() => {
        // Listen for ALL ambassadors first to see if data is reaching the client
        const q = query(collection(db, 'ambassadors'));

        console.log("Setting up homepage listener...");
        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log(`Homepage snapshot received: ${snapshot.size} docs`);
            const data = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Ambassador[];

            // Filter for active ones in memory to avoid missing index issues initially
            const activeOnly = data.filter(a => a.is_active);
            console.log(`Active ambassadors count: ${activeOnly.length}`);

            setAmbassadors(activeOnly);
            setLoading(false);
        }, (error) => {
            console.error("Home Firestore listener error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-itm-red text-white py-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-white/10 skew-x-12 transform translate-x-1/2" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl text-left">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-white p-2 rounded-xl shadow-lg">
                                <img src="/logo.png" alt="ITM Logo" className="h-12 w-auto" />
                            </div>
                            <div className="h-10 w-[2px] bg-itm-gold/30" />
                            <div className="bg-itm-gold/20 text-itm-gold px-4 py-2 rounded-full font-bold text-sm border border-itm-gold/30">
                                <span>Student Connect</span>
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                            Direct Access to ITM MBA <span className="text-itm-gold">Ambassadors</span>
                        </h1>
                        <p className="text-xl text-red-50 mb-8 leading-relaxed font-medium">
                            Skip the forms. Get real insights into campus life, placements, and academics
                            directly from current students. Connect, chat, and decide with confidence.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a href="#ambassadors" className="bg-itm-gold hover:bg-itm-accent text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-itm-gold/30">
                                Connect Now
                            </a>
                            {!loading && ambassadors.length > 0 && (
                                <div className="flex -space-x-3 items-center">
                                    {ambassadors.slice(0, 3).map((a) => (
                                        <div key={a.id} className="w-10 h-10 rounded-full border-2 border-itm-red overflow-hidden shadow-lg">
                                            <img src={a.photo_url} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    <span className="ml-4 text-itm-gold font-semibold">+ {Math.max(0, ambassadors.length - 3)} others</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features/Trust Section */}
            <section className="py-12 bg-white border-b border-gray-100">
                <div className="container mx-auto px-6 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex items-start gap-4">
                            <div className="bg-red-50 p-3 rounded-lg text-itm-red shrink-0">
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Real Students</h3>
                                <p className="text-gray-500 text-sm">No bots or marketing agents. Only currently enrolled MBA students.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-red-50 p-3 rounded-lg text-itm-red shrink-0">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Direct Chat</h3>
                                <p className="text-gray-500 text-sm">Message on Instagram or LinkedIn DM for instant honest answers.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-red-50 p-3 rounded-lg text-itm-red shrink-0">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Verified Info</h3>
                                <p className="text-gray-500 text-sm">All ambassadors are verified by the ITM admissions team.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ambassador Grid */}
            <section id="ambassadors" className="py-20 min-h-[400px]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-itm-red mb-4">Meet Our Ambassadors</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Choose an ambassador based on their specialization or background to get the most relevant advice for your MBA journey.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                            <Loader2 className="animate-spin text-itm-gold" size={40} />
                            <p className="font-medium">Connecting to ambassadors...</p>
                        </div>
                    ) : (
                        <>
                            {ambassadors.length === 0 ? (
                                <div className="py-20 text-center text-gray-500">
                                    <p className="text-xl font-bold mb-2">No active ambassadors found</p>
                                    <p>Please check back later or contact admissions.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {ambassadors.map((ambassador) => (
                                        <AmbassadorCard key={ambassador.id} ambassador={ambassador} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="container mx-auto px-6 text-center">
                    <p className="mb-4">© 2026 ITM MBA Student Connect Platform. All Rights Reserved.</p>
                    <div className="flex justify-center gap-6 text-sm">
                        <a href="#" className="hover:text-itm-gold transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-itm-gold transition-colors">Terms of Service</a>
                        <a href="/admin-stats/dashboard" className="hover:text-itm-gold transition-colors">Admin Portal</a>
                    </div>
                </div>
            </footer>
        </main>
    );
}
