'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';

type ToastType = 'error' | 'success' | 'info' | 'loading';

interface Toast {
    msg: string;
    type: ToastType;
}

const TOAST_CONFIG: Record<ToastType, { bg: string; border: string; color: string; icon: string }> = {
    success: { bg: 'rgba(46,204,113,0.15)', border: 'rgba(46,204,113,0.4)', color: '#2ecc71', icon: '✅' },
    error: { bg: 'rgba(255,107,107,0.15)', border: 'rgba(255,107,107,0.4)', color: '#ff6b6b', icon: '❌' },
    info: { bg: 'rgba(212,175,55,0.12)', border: 'rgba(212,175,55,0.35)', color: '#D4AF37', icon: '📍' },
    loading: { bg: 'rgba(162,155,254,0.12)', border: 'rgba(162,155,254,0.35)', color: '#a29bfe', icon: '⏳' },
};

export default function MasjidPage() {
    const [query, setQuery] = useState('');
    const [mapSrc, setMapSrc] = useState('');
    const [loading, setLoading] = useState(false);
    const [gpsUsed, setGpsUsed] = useState(false);
    const [cityLabel, setCityLabel] = useState('');
    const [toast, setToast] = useState<Toast | null>(null);
    const [toastVisible, setToastVisible] = useState(false);

    const showToast = (msg: string, type: ToastType = 'info', duration = 4000) => {
        setToast({ msg, type });
        setToastVisible(true);
        if (duration > 0) {
            setTimeout(() => setToastVisible(false), duration);
            setTimeout(() => setToast(null), duration + 400);
        }
    };

    const buildMapUrl = (q: string) =>
        `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed&z=15`;

    const handleGPS = () => {
        if (!navigator.geolocation) {
            showToast('GPS tidak didukung browser ini', 'error');
            return;
        }
        setLoading(true);
        showToast('Mendapatkan lokasi GPS kamu...', 'loading', 0);

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const geo = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`
                    );
                    const geoData = await geo.json();
                    const city = geoData.city || geoData.locality || geoData.principalSubdivision || 'area kamu';
                    setCityLabel(city);
                    setGpsUsed(true);
                    setMapSrc(buildMapUrl(`masjid terdekat near ${latitude},${longitude}`));
                    showToast(`Menampilkan masjid terdekat di ${city}`, 'success');
                } catch {
                    setGpsUsed(true);
                    setMapSrc(buildMapUrl(`masjid near ${latitude},${longitude}`));
                    showToast('Peta diperbarui ke lokasi kamu', 'success');
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setLoading(false);
                if (err.code === 1) {
                    showToast(
                        'Akses lokasi ditolak. Ketuk ikon 🔒 atau ℹ️ di address bar lalu izinkan "Lokasi".',
                        'error',
                        6000
                    );
                } else if (err.code === 3) {
                    showToast('Timeout — GPS terlalu lama. Coba lagi di tempat terbuka.', 'error');
                } else {
                    showToast('Tidak bisa mendapatkan lokasi. Coba lagi.', 'error');
                }
            },
            { timeout: 10000, maximumAge: 60000 }
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setGpsUsed(false);
        setCityLabel('');
        setMapSrc(buildMapUrl(`masjid ${query}`));
        showToast(`Mencari masjid di ${query}`, 'info');
    };

    useEffect(() => {
        setMapSrc(buildMapUrl('masjid Jakarta'));
    }, []);

    const cfg = toast ? TOAST_CONFIG[toast.type] : null;

    return (
        <DashboardLayout title="🕌 Masjid Terdekat">
            {/* ─── Custom Toast ─── */}
            {toast && cfg && (
                <div style={{
                    position: 'fixed',
                    bottom: '90px',
                    left: '50%',
                    transform: `translateX(-50%) translateY(${toastVisible ? '0' : '20px'})`,
                    opacity: toastVisible ? 1 : 0,
                    transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                    zIndex: 9999,
                    maxWidth: 'calc(100vw - 32px)',
                    width: 'max-content',
                    pointerEvents: 'none',
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '12px 18px',
                        background: cfg.bg,
                        border: `1px solid ${cfg.border}`,
                        borderRadius: '14px',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${cfg.border}`,
                        color: cfg.color,
                        fontSize: '13px',
                        fontWeight: 600,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        lineHeight: 1.5,
                        maxWidth: '340px',
                    }}>
                        <span style={{ fontSize: '18px', flexShrink: 0 }}>
                            {toast.type === 'loading' ? (
                                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                            ) : cfg.icon}
                        </span>
                        <span style={{ color: '#f0ece0' }}>{toast.msg}</span>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

            {/* Search card */}
            <div className="glass-card" style={{ padding: '16px', marginBottom: '16px' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    <input
                        className="search-input"
                        placeholder="Ketik nama kota / daerah..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <button type="submit" className="btn-gold" style={{ padding: '10px 16px', whiteSpace: 'nowrap', borderRadius: '10px' }}>
                        🔍 Cari
                    </button>
                </form>

                <button
                    onClick={handleGPS}
                    disabled={loading}
                    style={{
                        width: '100%', padding: '12px', borderRadius: '10px',
                        fontSize: '14px', fontWeight: 700,
                        background: gpsUsed ? 'rgba(46,204,113,0.2)' : 'rgba(46,204,113,0.12)',
                        border: `1px solid ${gpsUsed ? 'rgba(46,204,113,0.5)' : 'rgba(46,204,113,0.3)'}`,
                        color: '#2ecc71',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        transition: 'all 0.2s',
                        opacity: loading ? 0.7 : 1,
                    }}
                >
                    {loading
                        ? '⏳ Mendapatkan lokasi...'
                        : gpsUsed
                            ? `✅ Masjid di sekitar ${cityLabel}`
                            : '📍 Gunakan Lokasi Saya (GPS)'}
                </button>
            </div>

            {/* Map */}
            <div className="glass-card" style={{ overflow: 'hidden', borderRadius: '16px', marginBottom: '16px', padding: 0 }}>
                {mapSrc ? (
                    <iframe
                        key={mapSrc}
                        src={mapSrc}
                        width="100%"
                        height="420"
                        style={{ border: 'none', display: 'block' }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Masjid Terdekat"
                        allowFullScreen
                    />
                ) : (
                    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
                        ⏳ Memuat peta...
                    </div>
                )}
            </div>

            {/* Tips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                    { icon: '📍', color: '#2ecc71', text: 'Tekan tombol GPS → izinkan akses lokasi di browser → peta langsung cari masjid terdekat' },
                    { icon: '🔒', color: '#D4AF37', text: 'Jika ditolak: tap ikon 🔒/ℹ️ di address bar → Izin Situs → Lokasi → Izinkan' },
                    { icon: '🗺️', color: '#a29bfe', text: 'Tap "View larger map" atau pin di peta untuk petunjuk arah ke masjid' },
                ].map((tip, i) => (
                    <div key={i} style={{
                        display: 'flex', alignItems: 'flex-start', gap: '10px',
                        padding: '12px 14px', borderRadius: '10px',
                        background: 'rgba(255,255,255,0.03)',
                        border: `1px solid ${tip.color}18`,
                    }}>
                        <span style={{ fontSize: '16px', flexShrink: 0 }}>{tip.icon}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tip.text}</span>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}
