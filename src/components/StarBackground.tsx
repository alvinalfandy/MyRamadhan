'use client';

import { useEffect, useRef } from 'react';

export default function StarBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const count = 120;
        container.innerHTML = '';

        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 2.5 + 0.5;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const dur = (Math.random() * 3 + 2).toFixed(1);
            const delay = (Math.random() * 4).toFixed(1);

            star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        --dur: ${dur}s;
        animation-delay: ${delay}s;
        opacity: ${Math.random() * 0.5 + 0.1};
      `;
            container.appendChild(star);
        }

        // Bigger glowing stars
        for (let i = 0; i < 15; i++) {
            const star = document.createElement('div');
            const size = Math.random() * 3 + 2;
            star.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        border-radius: 50%;
        background: #D4AF37;
        box-shadow: 0 0 ${size * 3}px rgba(212,175,55,0.6);
        animation: twinkle ${(Math.random() * 2 + 2).toFixed(1)}s ease-in-out infinite alternate;
        animation-delay: ${(Math.random() * 3).toFixed(1)}s;
        opacity: 0.6;
      `;
            container.appendChild(star);
        }
    }, []);

    return <div ref={containerRef} className="star-bg" />;
}
