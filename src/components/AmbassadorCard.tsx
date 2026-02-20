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
        // ... (existing code remains same)
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

        // Redirect to the platform link
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
            <div className="relative h-64 w-full bg-gray-50">
                <Image
                    src={imgSrc}
                    alt={ambassador.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={() => setImgSrc(DEFAULT_PLACEHOLDER)}
                    unoptimized={imgSrc.startsWith('http') && !imgSrc.includes('unsplash.com') && !imgSrc.includes('firebasestorage')}
                />
                <div className="absolute top-4 right-4 bg-itm-gold/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {ambassador.year}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-itm-red mb-1">{ambassador.name}</h3>
                    <p className="text-itm-gold font-semibold text-sm">{ambassador.specialization}</p>
                </div>

                <p className="text-gray-600 text-sm mb-6 flex-grow italic">
                    "{ambassador.tagline}"
                </p>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => handleConnect('instagram')}
                        className="flex items-center justify-center gap-2 bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all hover:-translate-y-1 shadow-md hover:shadow-lg"
                    >
                        <Instagram size={18} />
                        <span>Instagram</span>
                    </button>

                    <button
                        onClick={() => handleConnect('linkedin')}
                        className="flex items-center justify-center gap-2 bg-[#0077b5] text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all hover:-translate-y-1 shadow-md hover:shadow-lg"
                    >
                        <Linkedin size={18} />
                        <span>LinkedIn</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AmbassadorCard;
