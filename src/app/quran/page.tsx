'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { Surah, getAllSurah } from '@/lib/quranApi';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function QuranPage() {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [filtered, setFiltered] = useState<Surah[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllSurah().then(data => {
            setSurahs(data);
            setFiltered(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!query) {
            setFiltered(surahs);
        } else {
            setFiltered(surahs.filter(s =>
                s.englishName.toLowerCase().includes(query.toLowerCase()) ||
                s.name.includes(query) ||
                s.number.toString().includes(query) ||
                s.englishNameTranslation.toLowerCase().includes(query.toLowerCase())
            ));
        }
    }, [query, surahs]);

    const jenisWahyu: Record<string, string> = {
        Meccan: 'Makkiyah',
        Medinan: 'Madaniyah',
    };

    return (
        <DashboardLayout title="📖 Al-Qur'an Al-Karim">
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontFamily: "'Amiri', serif", fontSize: '1.8rem', color: 'var(--gold)', direction: 'rtl', marginBottom: '6px' }}>
                    ٱلْقُرْآنُ ٱلْكَرِيمُ
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    114 Surah · Teks Arab + Terjemahan Bahasa Indonesia
                </p>
            </div>

            {/* Cari */}
            <input
                className="search-input"
                placeholder="🔍 Cari surah (nama, nomor, terjemahan)..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{ maxWidth: '420px', marginBottom: '20px' }}
            />

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="skeleton" style={{ height: '72px', borderRadius: '12px' }} />
                    ))}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                    {filtered.map(surah => (
                        <Link key={surah.number} href={`/quran/${surah.number}`} style={{ textDecoration: 'none' }}>
                            <div className="surah-card">
                                <div className="surah-number">{surah.number}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>
                                        {surah.englishName}
                                        <span style={{ marginLeft: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                                            • {jenisWahyu[surah.revelationType] || surah.revelationType}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                        {surah.englishNameTranslation} · {surah.numberOfAyahs} ayat
                                    </div>
                                </div>
                                <div style={{ fontFamily: "'Amiri', serif", fontSize: '1.2rem', color: 'var(--gold)' }}>
                                    {surah.name}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {!loading && filtered.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                    Surah &quot;{query}&quot; tidak ditemukan
                </div>
            )}
        </DashboardLayout>
    );
}
