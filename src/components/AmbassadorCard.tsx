'use client';

import React from 'react';
import Image from 'next/image';
import { Instagram, Linkedin } from 'lucide-react';
import { Ambassador } from '@/data/mockAmbassadors';
import { getProxyImageUrl, getPlaceholderUrl } from '@/lib/image-utils';

interface AmbassadorCardProps {
    ambassador: Ambassador;
    isCompact?: boolean;
}

const AmbassadorCard: React.FC<AmbassadorCardProps> = ({ ambassador, isCompact = false }) => {
    const [imgSrc, setImgSrc] = React.useState(getProxyImageUrl(ambassador.photo_url) || getPlaceholderUrl(ambassador.name));

    // Sync imgSrc when ambassador data changes (crucial for admin dashboard)
    React.useEffect(() => {
        setImgSrc(getProxyImageUrl(ambassador.photo_url) || getPlaceholderUrl(ambassador.name));
    }, [ambassador.photo_url, ambassador.name]);

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
        <div className="group relative h-full">
            {/* Animated Border Glow on Hover */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-itm-red to-itm-gold rounded-[1.5rem] md:rounded-[2.5rem] blur opacity-0 group-hover:opacity-30 transition duration-1000 group-hover:duration-200 ${isCompact ? 'block md:hidden' : 'block'}`} />

            <div className={`relative bg-itm-red rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/10 flex flex-col h-full ${!isCompact ? 'group-hover:-translate-y-2' : ''}`}>
                <div className={`relative w-full overflow-hidden ${isCompact ? 'h-48 sm:h-60 md:h-72' : 'h-72 md:h-80'}`}>
                    <Image
                        src={imgSrc}
                        alt={ambassador.name}
                        fill
                        referrerPolicy="no-referrer"
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={() => setImgSrc(getPlaceholderUrl(ambassador.name))}
                        unoptimized={true}
                    />
                    <div className={`absolute top-3 sm:top-4 md:top-5 right-3 sm:right-4 md:right-5 bg-white/20 backdrop-blur-md px-3 sm:px-3 md:px-4 py-1.5 rounded-full text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all`}>
                        {ambassador.year}
                    </div>
                </div>

                <div className={`${isCompact ? 'p-4 sm:p-6 md:p-8' : 'p-6 sm:p-8 md:p-10'} flex flex-col flex-grow relative text-center md:text-left transition-all`}>
                    <div className={`${isCompact ? 'mb-2 md:mb-6' : 'mb-6'}`}>
                        <div className="text-itm-gold font-black text-[8px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] mb-1 md:mb-2">{ambassador.specialization}</div>
                        <h3 className={`${isCompact ? 'text-lg sm:text-2xl md:text-3xl' : 'text-2xl sm:text-3xl md:text-4xl'} font-black text-white tracking-tighter leading-tight md:leading-none transition-all`}>{ambassador.name}</h3>
                    </div>

                    {isCompact && (
                        <div className="flex items-center justify-center md:justify-start gap-4 mt-auto pt-6 border-t border-white/10">
                            {ambassador.instagram_url && (
                                <Instagram size={14} className="text-white/60 hover:text-white transition-colors" />
                            )}
                            {ambassador.linkedin_url && (
                                <Linkedin size={14} className="text-white/60 hover:text-white transition-colors" />
                            )}
                        </div>
                    )}

                    {!isCompact && (
                        <>
                            <p className="text-white/80 font-medium text-sm mb-8 flex-grow leading-relaxed italic">
                                "{ambassador.tagline}"
                            </p>

                            <div className={`grid ${ambassador.instagram_url && ambassador.linkedin_url ? 'grid-cols-2' : 'grid-cols-1'} gap-4 mt-auto`}>
                                {ambassador.instagram_url && (
                                    <button
                                        onClick={() => handleConnect('instagram')}
                                        className="flex items-center justify-center gap-2 bg-white text-itm-red py-4 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-itm-gold hover:text-white transition-all duration-300 shadow-lg active:scale-95"
                                    >
                                        <Instagram size={16} />
                                        <span>Instagram</span>
                                    </button>
                                )}

                                {ambassador.linkedin_url && (
                                    <button
                                        onClick={() => handleConnect('linkedin')}
                                        className="flex items-center justify-center gap-2 bg-white text-itm-red py-4 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-itm-gold hover:text-white transition-all duration-300 shadow-lg active:scale-95"
                                    >
                                        <Linkedin size={16} />
                                        <span>LinkedIn</span>
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AmbassadorCard;
