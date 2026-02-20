'use client';

import React from 'react';
import Image from 'next/image';
import { Instagram, Linkedin } from 'lucide-react';
import { Ambassador } from '@/data/mockAmbassadors';

interface AmbassadorCardProps {
    ambassador: Ambassador;
}

const DEFAULT_PLACEHOLDER = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&h=200&auto=format&fit=crop";

const AmbassadorCard: React.FC<AmbassadorCardProps> = ({ ambassador }) => {
    const [imgSrc, setImgSrc] = React.useState(
        ambassador.photo_url?.startsWith('/uploads/') ? DEFAULT_PLACEHOLDER : (ambassador.photo_url || DEFAULT_PLACEHOLDER)
    );

    const handleConnect = async (platform: 'instagram' | 'linkedin') => {
        const url = platform === 'instagram' ? ambassador.instagram_url : ambassador.linkedin_url;

        try {
            await fetch('/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ambassador_id: ambassador.id,
                    platform,
                    referrer: document.referrer || 'direct',
                }),
            });
        } catch (error) {
            console.error('Tracking failed:', error);
        }

        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="group relative">
            {/* Animated Border Glow on Hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-itm-red to-itm-gold rounded-[2.5rem] blur opacity-0 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />

            <div className="relative bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 flex flex-col h-full group-hover:-translate-y-2">
                <div className="relative h-72 w-full overflow-hidden">
                    <Image
                        src={imgSrc}
                        alt={ambassador.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
                        onError={() => setImgSrc(DEFAULT_PLACEHOLDER)}
                        unoptimized={imgSrc.startsWith('http') && !imgSrc.includes('unsplash.com') && !imgSrc.includes('firebasestorage')}
                    />
                    <div className="absolute top-5 right-5 glass px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-itm-red">
                        {ambassador.year}
                    </div>
                    {/* Shadow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />
                </div>

                <div className="p-8 flex flex-col flex-grow relative">
                    <div className="mb-6">
                        <div className="text-itm-red font-black text-xs uppercase tracking-[0.3em] mb-2">{ambassador.specialization}</div>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tighter leading-none">{ambassador.name}</h3>
                    </div>

                    <p className="text-gray-500 font-medium text-sm mb-8 flex-grow leading-relaxed italic">
                        "{ambassador.tagline}"
                    </p>

                    <div className="grid grid-cols-2 gap-4 mt-auto">
                        <button
                            onClick={() => handleConnect('instagram')}
                            className="flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-itm-red transition-all duration-300 shadow-lg active:scale-95"
                        >
                            <Instagram size={16} />
                            <span>Instagram</span>
                        </button>

                        <button
                            onClick={() => handleConnect('linkedin')}
                            className="flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-[#0077b5] transition-all duration-300 shadow-lg active:scale-95"
                        >
                            <Linkedin size={16} />
                            <span>LinkedIn</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AmbassadorCard;
