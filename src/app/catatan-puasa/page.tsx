'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { getRamadanDay, RAMADAN_START } from '@/lib/prayerApi';
import { useEffect, useState } from 'react';

type StatusPuasa = 'puasa' | 'batal' | 'tidak_puasa' | 'uzur';

interface CatatanPuasaItem {
    tanggal: string;
    hariKe: number;
    status: StatusPuasa;
    alasan: string;
    catatan: string;
}

const STATUS_CONFIG: Record<StatusPuasa, { label: string; icon: string; color: string; bg: string }> = {
    puasa: { label: 'Puasa', icon: '🌙', color: '#D4AF37', bg: 'rgba(212,175,55,0.15)' },
    batal: { label: 'Batal', icon: '❌', color: '#ff6b6b', bg: 'rgba(255,107,107,0.15)' },
    tidak_puasa: { label: 'Tidak Puasa', icon: '⛔', color: '#ff9f43', bg: 'rgba(255,159,67,0.15)' },
    uzur: { label: 'Uzur / Sakit', icon: '🩺', color: '#a29bfe', bg: 'rgba(162,155,254,0.15)' },
};

function getTodayStr() {
    return new Date().toISOString().split('T')[0];
}

function generateRamadanDays(mazhab: 'NU' | 'Muhammadiyah'): { tanggal: string; hariKe: number }[] {
    const start = new Date(RAMADAN_START[mazhab]);
    const days = [];
    for (let i = 0; i < 30; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        days.push({
            tanggal: d.toISOString().split('T')[0],
            hariKe: i + 1,
        });
    }
    return days;
}

export default function CatatanPuasaPage() {
    const { user } = useAuth();
    const [catatan, setCatatan] = useState<Record<string, CatatanPuasaItem>>({});
    const [selected, setSelected] = useState<string | null>(null);
    const [formAlasan, setFormAlasan] = useState('');
    const [formStatus, setFormStatus] = useState<StatusPuasa>('puasa');
    const [saving, setSaving] = useState(false);
    const [mazhab] = useState<'NU' | 'Muhammadiyah'>(() => {
        if (typeof window !== 'undefined') {
            const prefs = localStorage.getItem('ramadan-prefs');
            return prefs ? JSON.parse(prefs).mazhab || 'NU' : 'NU';
        }
        return 'NU';
    });

    const days = generateRamadanDays(mazhab);
    const today = getTodayStr();
    const hariIni = getRamadanDay(mazhab);

    useEffect(() => {
        if (!user) return;
        fetch(`/api/catatan-puasa?userId=${user.id}`)
            .then(r => r.json())
            .then((data: CatatanPuasaItem[]) => {
                const map: Record<string, CatatanPuasaItem> = {};
                data.forEach(d => { map[d.tanggal] = d; });
                setCatatan(map);
            });
    }, [user]);

    const handleSave = async () => {
        if (!selected || !user) return;
        setSaving(true);
        const day = days.find(d => d.tanggal === selected);
        const res = await fetch('/api/catatan-puasa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id,
                tanggal: selected,
                hariKe: day?.hariKe ?? 0,
                status: formStatus,
                alasan: formAlasan,
            }),
        });
        const saved = await res.json();
        setCatatan(prev => ({ ...prev, [selected]: saved }));
        setSelected(null);
        setSaving(false);
    };

    const totalPuasa = Object.values(catatan).filter(c => c.status === 'puasa').length;
    const totalBatal = Object.values(catatan).filter(c => c.status === 'batal').length;
    const totalUzur = Object.values(catatan).filter(c => c.status === 'uzur').length;

    return (
        <DashboardLayout title="🌙 Catatan Puasa">
            {/* Rekap — 2x2 grid always, never overflow */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {[
                    { label: 'Puasa', val: totalPuasa, color: '#D4AF37', icon: '🌙' },
                    { label: 'Batal', val: totalBatal, color: '#ff6b6b', icon: '❌' },
                    { label: 'Uzur', val: totalUzur, color: '#a29bfe', icon: '🩺' },
                    { label: 'Hari ke', val: hariIni > 0 ? hariIni : '-', color: '#2ecc71', icon: '📅' },
                ].map(item => (
                    <div key={item.label} className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.4rem' }}>{item.icon}</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: item.color, fontFamily: "'Playfair Display', serif", margin: '4px 0' }}>
                            {item.val}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="glass-card" style={{ padding: '20px', marginBottom: '16px' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '14px' }}>
                    Kalender Puasa Ramadan 1447 H
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gap: '6px',
                }}>
                    {days.map(({ tanggal, hariKe }) => {
                        const c = catatan[tanggal];
                        const st = c?.status;
                        const cfg = st ? STATUS_CONFIG[st] : null;
                        const isToday = tanggal === today;
                        const isFuture = tanggal > today;

                        return (
                            <button
                                key={tanggal}
                                onClick={() => {
                                    if (isFuture) return;
                                    setSelected(tanggal);
                                    setFormStatus(c?.status || 'puasa');
                                    setFormAlasan(c?.alasan || '');
                                }}
                                style={{
                                    padding: '10px 6px', borderRadius: '10px',
                                    background: cfg ? cfg.bg : isToday ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)',
                                    border: isToday ? '2px solid rgba(212,175,55,0.5)' : `1px solid ${cfg ? cfg.color + '40' : 'rgba(212,175,55,0.1)'}`,
                                    cursor: isFuture ? 'not-allowed' : 'pointer',
                                    opacity: isFuture ? 0.4 : 1,
                                    transition: 'all 0.2s ease',
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                                }}
                            >
                                <div style={{ fontSize: '16px' }}>{cfg ? cfg.icon : isToday ? '🔆' : '○'}</div>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: cfg ? cfg.color : 'var(--text-secondary)' }}>
                                    {hariKe}
                                </div>
                                {isToday && <div style={{ fontSize: '8px', color: 'var(--gold)', letterSpacing: '0.5px' }}>HARI INI</div>}
                            </button>
                        );
                    })}
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '14px', flexWrap: 'wrap' }}>
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                            <span>{v.icon}</span> <span>{v.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit modal */}
            {selected && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: 'rgba(13,21,38,0.98)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '380px' }}>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '16px' }}>
                            📝 Catat Hari ke-{days.find(d => d.tanggal === selected)?.hariKe} ({selected})
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                            {(Object.entries(STATUS_CONFIG) as [StatusPuasa, typeof STATUS_CONFIG[StatusPuasa]][]).map(([k, v]) => (
                                <button key={k} onClick={() => setFormStatus(k)}
                                    style={{
                                        padding: '10px', borderRadius: '10px', cursor: 'pointer',
                                        background: formStatus === k ? v.bg : 'rgba(0,0,0,0.2)',
                                        border: `1px solid ${formStatus === k ? v.color : 'rgba(255,255,255,0.08)'}`,
                                        color: formStatus === k ? v.color : 'var(--text-secondary)',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '13px', fontWeight: 600,
                                    }}>
                                    {v.icon} {v.label}
                                </button>
                            ))}
                        </div>
                        <input
                            className="search-input" style={{ marginBottom: '14px' }}
                            placeholder="Catatan / alasan (opsional)"
                            value={formAlasan} onChange={e => setFormAlasan(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn-gold" style={{ flex: 1 }} onClick={handleSave} disabled={saving}>
                                {saving ? 'Menyimpan...' : '💾 Simpan'}
                            </button>
                            <button className="btn-outline" onClick={() => setSelected(null)}>Batal</button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
