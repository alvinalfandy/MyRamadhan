'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { RAMADAN_START } from '@/lib/prayerApi';
import { useEffect, useState } from 'react';

const SHOLAT_KEYS = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];

interface SholatRecord {
    [key: string]: boolean;
}

interface PuasaRecord {
    status: string;
}

function getDates(mazhab: 'NU' | 'Muhammadiyah'): string[] {
    const start = new Date(RAMADAN_START[mazhab]);
    return Array.from({ length: 30 }, (_, i) => {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        return d.toISOString().split('T')[0];
    });
}

export default function StatistikPage() {
    const { user } = useAuth();
    const [puasaData, setPuasaData] = useState<Record<string, PuasaRecord>>({});
    const [sholatData, setSholatData] = useState<Record<string, SholatRecord>>({});
    const [mazhab] = useState<'NU' | 'Muhammadiyah'>(() => {
        if (typeof window !== 'undefined') {
            const prefs = localStorage.getItem('ramadan-prefs');
            return prefs ? JSON.parse(prefs).mazhab || 'NU' : 'NU';
        }
        return 'NU';
    });

    const dates = getDates(mazhab);
    const today = new Date().toISOString().split('T')[0];
    const passedDates = dates.filter(d => d <= today);

    useEffect(() => {
        if (!user) return;
        fetch(`/api/catatan-puasa?userId=${user.id}`)
            .then(r => r.json())
            .then((data: { tanggal: string; status: string }[]) => {
                const map: Record<string, PuasaRecord> = {};
                data.forEach(d => { map[d.tanggal] = { status: d.status }; });
                setPuasaData(map);
            });
        fetch(`/api/catatan-sholat?userId=${user.id}`)
            .then(r => r.json())
            .then((data: { tanggal: string;[k: string]: boolean | string }[]) => {
                const map: Record<string, SholatRecord> = {};
                data.forEach(d => { map[d.tanggal] = d as SholatRecord; });
                setSholatData(map);
            });
    }, [user]);

    // Puasa stats
    const puasaCount = passedDates.filter(d => puasaData[d]?.status === 'puasa').length;
    const batalCount = passedDates.filter(d => puasaData[d]?.status === 'batal').length;
    const uzurCount = passedDates.filter(d => puasaData[d]?.status === 'uzur').length;
    const tidakCount = passedDates.filter(d => puasaData[d]?.status === 'tidak_puasa').length;
    const puasaPct = passedDates.length > 0 ? Math.round((puasaCount / passedDates.length) * 100) : 0;

    // Sholat stats
    const sholatCompletion = passedDates.map(d => {
        const r = sholatData[d];
        if (!r) return 0;
        return SHOLAT_KEYS.filter(k => r[k]).length;
    });
    const avgSholat = sholatCompletion.length > 0
        ? (sholatCompletion.reduce((a, b) => a + b, 0) / sholatCompletion.length).toFixed(1)
        : '0';
    const fullSholatDays = sholatCompletion.filter(c => c === 5).length;

    // Per-sholat completion
    const perSholatStats = SHOLAT_KEYS.map(key => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        count: passedDates.filter(d => sholatData[d]?.[key]).length,
        pct: passedDates.length > 0
            ? Math.round((passedDates.filter(d => sholatData[d]?.[key]).length / passedDates.length) * 100)
            : 0,
    }));

    const SHOLAT_COLORS = ['#D4AF37', '#2ecc71', '#a29bfe', '#fd79a8', '#00cec9'];

    return (
        <DashboardLayout title="📊 Statistik Ramadan">
            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {[
                    { label: 'Hari Berlalu', val: passedDates.length, unit: 'hari', color: '#D4AF37', icon: '📅' },
                    { label: 'Puasa Penuh', val: puasaCount, unit: `/ ${passedDates.length}`, color: '#2ecc71', icon: '🌙' },
                    { label: 'Sholat Penuh', val: fullSholatDays, unit: 'hari', color: '#a29bfe', icon: '🕌' },
                    { label: 'Rata Sholat', val: avgSholat, unit: '/ 5', color: '#fdcb6e', icon: '✅' },
                ].map(s => (
                    <div key={s.label} className="glass-card" style={{ padding: '14px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.4rem' }}>{s.icon}</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, fontFamily: "'Playfair Display', serif", margin: '4px 0' }}>
                            {s.val}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                        <div style={{ fontSize: '9px', color: s.color, opacity: 0.7 }}>{s.unit}</div>
                    </div>
                ))}
            </div>

            {/* Puasa chart */}
            <div className="glass-card" style={{ padding: '20px', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '16px' }}>
                    🌙 Rekap Puasa Harian
                </h3>

                {/* Bar chart */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '80px', marginBottom: '8px' }}>
                    {dates.map((d, i) => {
                        const st = puasaData[d]?.status;
                        const isFuture = d > today;
                        const color = st === 'puasa' ? '#D4AF37' : st === 'batal' ? '#ff6b6b' : st === 'uzur' ? '#a29bfe' : st === 'tidak_puasa' ? '#ff9f43' : 'rgba(255,255,255,0.08)';
                        const h = st === 'puasa' ? '100%' : st ? '70%' : isFuture ? '30%' : '40%';
                        return (
                            <div key={d} style={{ flex: 1, height: h, background: color, borderRadius: '3px 3px 0 0', opacity: isFuture ? 0.3 : 1, transition: 'height 0.3s' }} title={`Hari ${i + 1}: ${st || '-'}`} />
                        );
                    })}
                </div>
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-secondary)' }}>
                    <span>H1</span><span>H15</span><span>H30</span>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px' }}>
                    {[
                        { label: `Puasa (${puasaCount})`, color: '#D4AF37' },
                        { label: `Batal (${batalCount})`, color: '#ff6b6b' },
                        { label: `Uzur (${uzurCount})`, color: '#a29bfe' },
                        { label: `Tidak (${tidakCount})`, color: '#ff9f43' },
                    ].map(l => (
                        <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: l.color }} />
                            {l.label}
                        </div>
                    ))}
                </div>

                {/* Percentage */}
                <div style={{ marginTop: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Konsistensi Puasa</span>
                        <span style={{ color: '#D4AF37', fontWeight: 700 }}>{puasaPct}%</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${puasaPct}%`, background: 'linear-gradient(90deg, #D4AF37, #F0D060)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                    </div>
                </div>
            </div>

            {/* Per-sholat stats */}
            <div className="glass-card" style={{ padding: '20px', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '16px' }}>
                    🕌 Konsistensi per Sholat
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {perSholatStats.map((s, i) => (
                        <div key={s.key}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px' }}>
                                <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{s.label}</span>
                                <span style={{ color: SHOLAT_COLORS[i], fontWeight: 700 }}>{s.count}/{passedDates.length} hari ({s.pct}%)</span>
                            </div>
                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${s.pct}%`, background: SHOLAT_COLORS[i], borderRadius: '4px', transition: 'width 0.5s ease' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tip */}
            <div style={{
                padding: '14px', borderRadius: '12px', fontSize: '13px',
                background: 'rgba(46,204,113,0.08)', border: '1px solid rgba(46,204,113,0.2)',
                color: 'var(--text-secondary)', lineHeight: 1.7,
            }}>
                💡 Statistik diambil dari data Catatan Puasa & Catatan Sholat yang sudah kamu isi.
            </div>
        </DashboardLayout>
    );
}
