'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { getSurahArabic, getSurahTranslation } from '@/lib/quranApi';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AyahPair {
    number: number;
    arabic: string;
    translation: string;
}

export default function SurahPage() {
    const params = useParams();
    const id = Number(params.id);

    const [ayahs, setAyahs] = useState<AyahPair[]>([]);
    const [surahName, setSurahName] = useState('');
    const [surahEnglish, setSurahEnglish] = useState('');
    const [surahTranslation, setSurahTranslation] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        Promise.all([getSurahArabic(id), getSurahTranslation(id)])
            .then(([arabic, trans]) => {
                setSurahName(arabic.name);
                setSurahEnglish(arabic.englishName);
                setSurahTranslation(arabic.englishNameTranslation);
                const pairs: AyahPair[] = arabic.ayahs.map((a, i) => ({
                    number: a.numberInSurah,
                    arabic: a.text,
                    translation: trans.ayahs[i]?.text || '',
                }));
                setAyahs(pairs);
                setLoading(false);
            })
            .catch(() => {
                setError('Gagal memuat surah. Coba lagi.');
                setLoading(false);
            });
    }, [id]);

    return (
        <DashboardLayout>
            <Link href="/quran" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
                ← Kembali ke Daftar Surah
            </Link>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '12px' }} />
                    ))}
                </div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#ff6b6b' }}>⚠️ {error}</div>
            ) : (
                <>
                    {/* Header Surah */}
                    <div className="glass-card glow-gold" style={{ padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', letterSpacing: '2px', marginBottom: '6px' }}>
                            SURAH KE-{id}
                        </div>
                        <div style={{ fontFamily: "'Amiri', serif", fontSize: '2.2rem', color: 'var(--gold)', direction: 'rtl', marginBottom: '4px' }}>
                            {surahName}
                        </div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                            {surahEnglish}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {surahTranslation} · {ayahs.length} ayat
                        </div>
                        {id !== 1 && id !== 9 && (
                            <div style={{ fontFamily: "'Amiri', serif", fontSize: '1.5rem', color: 'var(--text-primary)', marginTop: '14px', direction: 'rtl', lineHeight: 2 }}>
                                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                            </div>
                        )}
                    </div>

                    {/* Daftar ayat */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '740px' }}>
                        {ayahs.map(ayah => (
                            <div key={ayah.number} className="glass-card" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                                    <div style={{
                                        width: '30px', height: '30px', borderRadius: '50%',
                                        background: 'var(--gold-dim)', border: '1px solid var(--border-color)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '12px', fontWeight: 700, color: 'var(--gold)',
                                    }}>
                                        {ayah.number}
                                    </div>
                                </div>
                                <div className="arabic-text" style={{ marginBottom: '12px' }}>{ayah.arabic}</div>
                                <div style={{ height: '1px', background: 'var(--border-color)', margin: '10px 0' }} />
                                <div className="translation-text">{ayah.translation}</div>
                            </div>
                        ))}
                    </div>

                    {/* Navigasi */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
                        {id > 1 && (
                            <Link href={`/quran/${id - 1}`} style={{ textDecoration: 'none' }}>
                                <button className="btn-outline">← Surah Sebelumnya</button>
                            </Link>
                        )}
                        {id < 114 && (
                            <Link href={`/quran/${id + 1}`} style={{ textDecoration: 'none', marginLeft: 'auto' }}>
                                <button className="btn-gold">Surah Berikutnya →</button>
                            </Link>
                        )}
                    </div>
                </>
            )}
        </DashboardLayout>
    );
}
