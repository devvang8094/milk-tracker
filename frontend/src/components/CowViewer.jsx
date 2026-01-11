import React, { useState, useEffect } from 'react';

// --- CONFIGURATION ---
const ENABLE_LOGIN_VIDEO = true;
const VIDEO_PATH = '/models/cow-video.mp4';

// --- ATTRIBUTION ---
const Attribution = () => (
    <div className="absolute bottom-4 left-4 text-[10px] text-white/50 z-10 select-none pointer-events-none">
        Visual Enhancement
    </div>
);

export default function CowViewer() {
    const [isMobile, setIsMobile] = useState(false);

    // Responsive Check to prevent downloading video on mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!ENABLE_LOGIN_VIDEO) return null;

    // Mobile: Render nothing (Clean & Simple)
    if (isMobile) return null;

    // Desktop: Render Video
    return (
        <div className="relative w-full h-full bg-slate-900 overflow-hidden">
            <video
                className="w-full h-full object-cover opacity-90"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
            >
                <source src={VIDEO_PATH} type="video/mp4" />
                <source src={VIDEO_PATH.replace('.mp4', '.webm')} type="video/webm" />

                {/* Fallback */}
                <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                    <span className="text-4xl filter grayscale opacity-50">🐄</span>
                </div>
            </video>

            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            <Attribution />
        </div>
    );
}
