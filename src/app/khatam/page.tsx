'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';

const TOTAL_JUZ = 30;
const STORAGE_KEY = 'khatam-progress';

function getJuzName(i: number) {
    return `Juz ${i + 1}`;
}

export default function KhatamPage() {
    const [checked, setChecked] = useState<boolean[]>(Array(TOTAL_JUZ).fill(false));
    const [targetDate, setTargetDate] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const { c, t } = JSON.parse(saved);
            setChecked(c || Array(TOTAL_JUZ).fill(false));
            setTargetDate(t || '');
        }
    }, []);

    const save = (c: boolean[], t: string) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ c, t }));
    };

    const toggle = (i: number) => {
        const next = [...checked];
        next[i] = !next[i];
        setChecked(next);
        save(next, targetDate);
    };

    const reset = () => {
        const empty = Array(TOTAL_JUZ).fill(false);
        setChecked(empty);
        save(empty, targetDate);
    };

    const done = checked.filter(Boolean).length;
    const remaining = TOTAL_JUZ - done;
    const progress = Math.round((done / TOTAL_JUZ) * 100);

    // Days until target
    let daysLeft: number | null = null;
    if (targetDate) {
        const diff = new Date(targetDate).getTime() - new Date().getTime();
        daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    const juzPerDay = daysLeft && daysLeft > 0 ? (remaining / daysLeft).toFixed(1) : null;

    return (
        <DashboardLayout title="📚 Target Khatam Quran">
            {/* Progress bar */}
            <div className="glass-card" style={{ padding: '20px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Progress Khatam
                    </span>
                    <span style={{
                        fontSize: '1.4rem', fontWeight: 800, fontFamily: "'Playfair Display', serif",
                        color: progress === 100 ? '#2ecc71' : '#D4AF37',
                    }}>
                        {progress}%
                    </span>
                </div>

                {/* Bar */}
                <div style={{ height: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', overflow: 'hidden', marginBottom: '14px' }}>
                    <div style={{
                        height: '100%', width: `${progress}%`,
                        background: progress === 100
                            ? 'linear-gradient(90deg, #2ecc71, #55efc4)'
                            : 'linear-gradient(90deg, #D4AF37, #F0D060)',
                        borderRadius: '6px',
                        transition: 'width 0.5s ease',
                        boxShadow: `0 0 12px ${progress === 100 ? '#2ecc7166' : '#D4AF3766'}`,
                    }} />
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    {[
                        { label: 'Selesai', val: done, color: '#2ecc71', icon: '✅' },
                        { label: 'Sisa', val: remaining, color: '#D4AF37', icon: '📖' },
                        { label: 'Juz/Hari', val: juzPerDay ?? '-', color: '#a29bfe', icon: '📅' },
                    ].map(s => (
                        <div key={s.label} style={{ textAlign: 'center', padding: '10px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.1)' }}>
                            <div style={{ fontSize: '14px' }}>{s.icon}</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: s.color, fontFamily: "'Playfair Display', serif" }}>{s.val}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Target date */}
            <div className="glass-card" style={{ padding: '16px', marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                    🎯 Target Selesai Khatam
                </label>
                <input
                    type="date"
                    value={targetDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => { setTargetDate(e.target.value); save(checked, e.target.value); }}
                    className="search-input"
                    style={{ colorScheme: 'dark' }}
                />
                {daysLeft !== null && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: daysLeft < 5 ? '#ff6b6b' : '#2ecc71', fontWeight: 600 }}>
                        {daysLeft > 0 ? `⏳ ${daysLeft} hari lagi — butuh ${juzPerDay} juz/hari` : daysLeft === 0 ? '📅 Hari ini targetnya!' : '⚠️ Target sudah lewat'}
                    </div>
                )}
            </div>

            {/* Juz grid */}
            <div className="glass-card" style={{ padding: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: 'var(--text-primary)' }}>
                        Checklist 30 Juz
                    </h3>
                    <button onClick={reset} style={{
                        padding: '5px 12px', fontSize: '11px', borderRadius: '8px',
                        background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
                        color: '#ff6b6b', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
                    }}>🔄 Reset</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                    {Array.from({ length: TOTAL_JUZ }, (_, i) => (
                        <button key={i} onClick={() => toggle(i)} style={{
                            padding: '10px 4px', borderRadius: '10px', cursor: 'pointer',
                            background: checked[i] ? 'rgba(46,204,113,0.15)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${checked[i] ? 'rgba(46,204,113,0.4)' : 'rgba(212,175,55,0.12)'}`,
                            color: checked[i] ? '#2ecc71' : 'var(--text-secondary)',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                            transition: 'all 0.2s',
                        }}>
                            <span style={{ fontSize: '14px' }}>{checked[i] ? '✅' : '📖'}</span>
                            <span style={{ fontSize: '10px', fontWeight: 700 }}>{i + 1}</span>
                        </button>
                    ))}
                </div>
            </div>

            {progress === 100 && (
                <div style={{
                    textAlign: 'center', padding: '20px',
                    background: 'linear-gradient(135deg, rgba(46,204,113,0.15), rgba(46,204,113,0.05))',
                    border: '1px solid rgba(46,204,113,0.3)', borderRadius: '16px',
                    animation: 'slideUp 0.5s ease',
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🎉</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#2ecc71', fontWeight: 700 }}>
                        Alhamdulillah, Khatam!
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Semoga ibadahmu diterima Allah SWT 🌙
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
