'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useRef, useState } from 'react';

const DZIKIR_LIST = [
    { label: 'Subhanallah', arab: 'سُبْحَانَ اللَّهِ', arti: 'Maha Suci Allah', target: 33, color: '#D4AF37' },
    { label: 'Alhamdulillah', arab: 'الْحَمْدُ لِلَّهِ', arti: 'Segala puji bagi Allah', target: 33, color: '#2ecc71' },
    { label: 'Allahuakbar', arab: 'اللَّهُ أَكْبَرُ', arti: 'Allah Maha Besar', target: 33, color: '#a29bfe' },
    { label: 'Laa ilaaha illallah', arab: 'لَا إِلَهَ إِلَّا اللَّهُ', arti: 'Tiada Tuhan selain Allah', target: 100, color: '#fd79a8' },
    { label: 'Astaghfirullah', arab: 'أَسْتَغْفِرُ اللَّهَ', arti: 'Aku mohon ampun kepada Allah', target: 100, color: '#fdcb6e' },
    { label: 'Sholawat', arab: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّد', arti: 'Ya Allah, limpahkan sholawat atas Nabi Muhammad', target: 100, color: '#00cec9' },
];

export default function TasbihPage() {
    const [selected, setSelected] = useState(0);
    const [count, setCount] = useState(0);
    const [sesi, setSesi] = useState(0);
    const [vibrate, setVibrate] = useState(true);
    const tapRef = useRef<HTMLButtonElement>(null);

    const dzikir = DZIKIR_LIST[selected];
    const progress = Math.min((count / dzikir.target) * 100, 100);
    const rounds = Math.floor(count / dzikir.target);

    useEffect(() => {
        // load saved state
        const saved = localStorage.getItem(`tasbih-${selected}`);
        if (saved) {
            const { c, s } = JSON.parse(saved);
            setCount(c || 0);
            setSesi(s || 0);
        } else {
            setCount(0);
            setSesi(0);
        }
    }, [selected]);

    const save = (c: number, s: number) => {
        localStorage.setItem(`tasbih-${selected}`, JSON.stringify({ c, s }));
    };

    const handleTap = () => {
        if (vibrate && navigator.vibrate) navigator.vibrate(30);

        // Animate button
        tapRef.current?.animate([
            { transform: 'scale(0.94)', boxShadow: `0 0 30px ${dzikir.color}66` },
            { transform: 'scale(1)', boxShadow: `0 0 10px ${dzikir.color}33` },
        ], { duration: 120, easing: 'ease-out' });

        const newCount = count + 1;
        let newSesi = sesi;
        if (newCount % dzikir.target === 0) {
            newSesi = sesi + 1;
            if (vibrate && navigator.vibrate) navigator.vibrate([80, 40, 80]);
        }
        setCount(newCount);
        setSesi(newSesi);
        save(newCount, newSesi);
    };

    const handleReset = () => {
        setCount(0);
        setSesi(0);
        save(0, 0);
    };

    const handleChangeDzikir = (i: number) => {
        setSelected(i);
    };

    return (
        <DashboardLayout title="📿 Tasbih Digital">
            {/* Pilih Dzikir */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {DZIKIR_LIST.map((d, i) => (
                    <button key={i} onClick={() => handleChangeDzikir(i)} style={{
                        padding: '7px 14px', borderRadius: '50px', border: `1px solid ${i === selected ? d.color : 'rgba(212,175,55,0.2)'}`,
                        background: i === selected ? `${d.color}20` : 'transparent',
                        color: i === selected ? d.color : 'var(--text-secondary)',
                        fontSize: '12px', fontWeight: i === selected ? 700 : 400,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                        {d.label}
                    </button>
                ))}
            </div>

            {/* Main Card */}
            <div className="glass-card" style={{ padding: '28px 20px', marginBottom: '16px', textAlign: 'center' }}>
                {/* Arabic text */}
                <div style={{
                    fontFamily: "'Amiri', serif", fontSize: '2rem', lineHeight: 1.8,
                    color: dzikir.color, marginBottom: '4px', direction: 'rtl',
                    textShadow: `0 0 20px ${dzikir.color}44`,
                }}>
                    {dzikir.arab}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    {dzikir.arti}
                </div>

                {/* Progress ring */}
                <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                    <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="90" cy="90" r="80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                        <circle cx="90" cy="90" r="80" fill="none" stroke={dzikir.color} strokeWidth="10"
                            strokeDasharray={`${2 * Math.PI * 80}`}
                            strokeDashoffset={`${2 * Math.PI * 80 * (1 - progress / 100)}`}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                        />
                    </svg>
                    <div style={{ position: 'absolute', textAlign: 'center' }}>
                        <div style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '3.2rem', fontWeight: 800,
                            color: dzikir.color, lineHeight: 1,
                        }}>
                            {count % dzikir.target === 0 && count > 0 ? dzikir.target : count % dzikir.target}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            / {dzikir.target}
                        </div>
                        {rounds > 0 && (
                            <div style={{ fontSize: '10px', color: dzikir.color, marginTop: '2px', fontWeight: 600 }}>
                                Putaran ke-{rounds}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tap Button */}
                <div style={{ marginBottom: '20px' }}>
                    <button
                        ref={tapRef}
                        onClick={handleTap}
                        style={{
                            width: '110px', height: '110px', borderRadius: '50%',
                            background: `radial-gradient(circle, ${dzikir.color}22, ${dzikir.color}08)`,
                            border: `3px solid ${dzikir.color}`,
                            color: dzikir.color, fontSize: '2.2rem',
                            cursor: 'pointer',
                            boxShadow: `0 0 20px ${dzikir.color}33, inset 0 0 20px ${dzikir.color}0d`,
                            transition: 'box-shadow 0.1s',
                            userSelect: 'none',
                        }}
                    >
                        📿
                    </button>
                </div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    {[
                        { label: 'Total', val: count, color: dzikir.color },
                        { label: 'Sesi', val: sesi, color: '#2ecc71' },
                        { label: 'Target', val: dzikir.target, color: 'var(--text-secondary)' },
                    ].map(({ label, val, color }) => (
                        <div key={label} style={{ textAlign: 'center', padding: '10px 6px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.1)' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color, fontFamily: "'Playfair Display', serif" }}>{val}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={handleReset} style={{
                        padding: '9px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                        background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
                        color: '#ff6b6b', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>
                        🔄 Reset
                    </button>
                    <button onClick={() => setVibrate(!vibrate)} style={{
                        padding: '9px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                        background: vibrate ? 'rgba(46,204,113,0.1)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${vibrate ? 'rgba(46,204,113,0.3)' : 'rgba(212,175,55,0.15)'}`,
                        color: vibrate ? '#2ecc71' : 'var(--text-secondary)',
                        cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>
                        {vibrate ? '📳 Vibra ON' : '🔕 Vibra OFF'}
                    </button>
                </div>
            </div>

            {/* Tip */}
            <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', opacity: 0.6 }}>
                Ketuk tombol 📿 untuk bertasbih • Data tersimpan otomatis
            </div>
        </DashboardLayout>
    );
}
