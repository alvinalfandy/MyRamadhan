'use client';

import { useEffect, useRef } from 'react';

interface StarConfig {
    x: number;
    y: number;
    size: number;
    isGold: boolean;
    opacity: number;
    dur: number;
    delay: number;
}

export default function AuthStars() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const stars: StarConfig[] = Array.from({ length: 70 }, (_, i) => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 0.8,
            isGold: i % 8 === 0,
            opacity: Math.random() * 0.5 + 0.15,
            dur: Math.random() * 3 + 2,
            delay: Math.random() * 4,
        }));

        el.innerHTML = stars.map(s => `
      <div style="
        position:absolute;
        width:${s.size}px;height:${s.size}px;
        border-radius:50%;
        background:${s.isGold ? '#D4AF37' : 'white'};
        left:${s.x}%;top:${s.y}%;
        opacity:${s.opacity};
        animation: twinkle ${s.dur}s ease-in-out ${s.delay}s infinite alternate;
        will-change:opacity,transform;
      "></div>
    `).join('');

        return () => { if (el) el.innerHTML = ''; };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}
        />
    );
}
