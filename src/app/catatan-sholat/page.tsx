'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

const SHOLAT_LIST = [
    { key: 'subuh', label: 'Subuh', icon: '🌄', wajib: true },
    { key: 'dzuhur', label: 'Dzuhur', icon: '🌞', wajib: true },
    { key: 'ashar', label: 'Ashar', icon: '🌤️', wajib: true },
    { key: 'maghrib', label: 'Maghrib', icon: '🌇', wajib: true },
    { key: 'isya', label: 'Isya', icon: '🌙', wajib: true },
    { key: 'tarawih', label: 'Tarawih', icon: '✨', wajib: false },
    { key: 'witir', label: 'Witir', icon: '⭐', wajib: false },
];

type SholatRecord = Record<string, boolean>;

function getTodayStr() {
    return new Date().toISOString().split('T')[0];
}

function formatTanggal(t: string) {
    return new Date(t).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function CatatanSholatPage() {
    const { user } = useAuth();
    const today = getTodayStr();
    const [catatan, setCatatan] = useState<Record<string, SholatRecord>>({});
    const [selectedDate, setSelectedDate] = useState(today);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => {
        if (!user) return;
        fetch(`/api/catatan-sholat?userId=${user.id}`)
            .then(r => r.json())
            .then((data: (SholatRecord & { tanggal: string })[]) => {
                const map: Record<string, SholatRecord> = {};
                data.forEach(d => {
                    const { tanggal, ...rest } = d;
                    map[tanggal] = rest;
                });
                setCatatan(map);
            });
    }, [user]);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 2500);
    };

    const toggleSholat = async (key: string) => {
        if (!user) return;
        const current = catatan[selectedDate] || {};
        const updated = { ...current, [key]: !current[key] };
        setCatatan(prev => ({ ...prev, [selectedDate]: updated }));

        setSaving(true);
        const res = await fetch('/api/catatan-sholat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, tanggal: selectedDate, ...updated }),
        });
        setSaving(false);
        if (res.ok) showToast('✅ Tersimpan');
    };

    const countForDate = (date: string) => {
        const c = catatan[date];
        if (!c) return 0;
        return SHOLAT_LIST.filter(s => s.wajib && c[s.key]).length;
    };

    const totalComplete = Object.values(catatan).filter(c =>
        SHOLAT_LIST.filter(s => s.wajib).every(s => c[s.key])
    ).length;

    const streak = (() => {
        let s = 0;
        const d = new Date(today);
        while (true) {
            const ds = d.toISOString().split('T')[0];
            const c = catatan[ds];
            if (!c || !SHOLAT_LIST.filter(s => s.wajib).every(sh => c[sh.key])) break;
            s++;
            d.setDate(d.getDate() - 1);
        }
        return s;
    })();

    // Last 7 days for mini calendar
    const last7 = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });

    const currentRecord = catatan[selectedDate] || {};

    return (
        <DashboardLayout title="🙏 Catatan Sholat">
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {[
                    { label: 'Hari Lengkap', val: totalComplete, icon: '✅', color: '#2ecc71' },
                    { label: 'Streak', val: `${streak} hari`, icon: '🔥', color: '#ff9f43' },
                    { label: 'Sholat Hari Ini', val: `${countForDate(today)}/5`, icon: '🕌', color: '#D4AF37' },
                ].map(item => (
                    <div key={item.label} className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem' }}>{item.icon}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: item.color, fontFamily: "'Playfair Display', serif", margin: '4px 0' }}>
                            {item.val}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>{item.label}</div>
                    </div>
                ))}
            </div>

            {/* 7-day mini calendar */}
            <div className="glass-card" style={{ padding: '16px', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '13px', color: 'var(--text-secondary)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
                    7 Hari Terakhir
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                    {last7.map(date => {
                        const count = countForDate(date);
                        const isSelected = date === selectedDate;
                        const isToday = date === today;
                        return (
                            <button
                                key={date}
                                onClick={() => setSelectedDate(date)}
                                style={{
                                    padding: '8px 4px', borderRadius: '10px', cursor: 'pointer',
                                    background: isSelected ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.02)',
                                    border: isSelected ? '1px solid rgba(212,175,55,0.5)' : '1px solid rgba(255,255,255,0.06)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                }}
                            >
                                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                                    {formatTanggal(date).split(',')[0]}
                                </div>
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    background: count === 5 ? '#2ecc71' : count > 0 ? '#D4AF37' : 'rgba(255,255,255,0.05)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '11px', fontWeight: 700, color: count > 0 ? '#0a0e1a' : 'var(--text-secondary)',
                                }}>
                                    {count}
                                </div>
                                {isToday && <div style={{ fontSize: '8px', color: 'var(--gold)' }}>Hari ini</div>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Sholat checklist */}
            <div className="glass-card" style={{ padding: '20px' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Sholat — {formatTanggal(selectedDate)}
                    {selectedDate === today && <span style={{ marginLeft: '8px', fontSize: '11px', color: 'var(--gold)', background: 'rgba(212,175,55,0.15)', padding: '2px 8px', borderRadius: '20px' }}>Hari Ini</span>}
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    {saving ? '💾 Menyimpan...' : 'Ketuk untuk mencentang'}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {SHOLAT_LIST.map(({ key, label, icon, wajib }) => {
                        const done = !!currentRecord[key];
                        return (
                            <button
                                key={key}
                                onClick={() => toggleSholat(key)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '14px',
                                    padding: '14px 16px', borderRadius: '12px',
                                    background: done ? (wajib ? 'rgba(212,175,55,0.12)' : 'rgba(46,204,113,0.1)') : 'rgba(255,255,255,0.02)',
                                    border: `1px solid ${done ? (wajib ? 'rgba(212,175,55,0.3)' : 'rgba(46,204,113,0.3)') : 'rgba(255,255,255,0.06)'}`,
                                    cursor: 'pointer', transition: 'all 0.2s ease',
                                    fontFamily: "'Plus Jakarta Sans', sans-serif", textAlign: 'left', width: '100%',
                                }}
                            >
                                <div style={{ fontSize: '1.3rem' }}>{icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: done ? (wajib ? '#D4AF37' : '#2ecc71') : 'var(--text-primary)' }}>
                                        {label}
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                        {wajib ? 'Wajib' : 'Sunnah'}
                                    </div>
                                </div>
                                <div style={{
                                    width: '26px', height: '26px', borderRadius: '50%',
                                    border: `2px solid ${done ? (wajib ? '#D4AF37' : '#2ecc71') : 'rgba(255,255,255,0.15)'}`,
                                    background: done ? (wajib ? '#D4AF37' : '#2ecc71') : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '13px', flexShrink: 0,
                                }}>
                                    {done && '✓'}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {toast && <div className="toast">{toast}</div>}
        </DashboardLayout>
    );
}
