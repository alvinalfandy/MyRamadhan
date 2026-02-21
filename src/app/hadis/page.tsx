'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';

const HADIS_DB = [
    {
        arab: 'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
        latin: "Man shama Ramadhana imanan wahtisaban ghufira lahu ma taqaddama min dzambih",
        arti: 'Barangsiapa berpuasa Ramadan dengan penuh keimanan dan mengharap pahala, maka diampuni dosanya yang telah lalu.',
        riwayat: 'HR. Bukhari & Muslim',
        tema: 'Puasa',
    },
    {
        arab: 'إِذَا دَخَلَ رَمَضَانُ فُتِّحَتْ أَبْوَابُ الْجَنَّةِ وَغُلِّقَتْ أَبْوَابُ النَّارِ وَسُلْسِلَتِ الشَّيَاطِينُ',
        latin: "Idza dakhaala Ramadhaanu futtihat abwabul jannah wa ghulliqat abwabun-nar wa suslalisyyaatin",
        arti: 'Apabila datang bulan Ramadan, pintu-pintu surga dibuka, pintu-pintu neraka ditutup, dan syetan-syetan dibelenggu.',
        riwayat: 'HR. Bukhari & Muslim',
        tema: 'Ramadan',
    },
    {
        arab: 'الصَّلَوَاتُ الْخَمْسُ وَالْجُمُعَةُ إِلَى الْجُمُعَةِ وَرَمَضَانُ إِلَى رَمَضَانَ مُكَفِّرَاتٌ لِمَا بَيْنَهُنَّ إِذَا اجْتُنِبَتِ الْكَبَائِرُ',
        latin: "Ash-shalawatul khamsu wal jum'atu ilal jum'ati wa Ramadhaanu ila Ramadhaana mukaffiratu limaa bainahunna idzajtunibatil kaba'ir",
        arti: 'Sholat lima waktu, Jumat ke Jumat, dan Ramadan ke Ramadan menghapus dosa-dosa di antara keduanya selagi dosa besar dijauhi.',
        riwayat: 'HR. Muslim',
        tema: 'Sholat',
    },
    {
        arab: 'الصِّيَامُ جُنَّةٌ فَإِذَا كَانَ يَوْمُ صَوْمِ أَحَدِكُمْ فَلَا يَرْفُثْ وَلَا يَصْخَبْ',
        latin: "Ash-shiyamu junnatun fa idza kaana yaumus shawmi ahadikum fala yarfuts wala yashkhab",
        arti: 'Puasa adalah perisai. Jika salah seorang dari kalian berpuasa, jangan berkata kotor dan jangan berbuat keji.',
        riwayat: 'HR. Bukhari',
        tema: 'Akhlak',
    },
    {
        arab: 'مَنْ قَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
        latin: "Man qaama Ramadhana imanan wahtisaban ghufira lahu ma taqaddama min dzambih",
        arti: 'Barangsiapa mendirikan (sholat malam) Ramadan karena iman dan mengharap pahala, maka diampuni dosanya yang telah lalu.',
        riwayat: 'HR. Bukhari & Muslim',
        tema: 'Tarawih',
    },
    {
        arab: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
        latin: "Khairun-naasi anfa'uhum lin-naas",
        arti: 'Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain.',
        riwayat: 'HR. Ahmad & Thabrani',
        tema: 'Muamalah',
    },
    {
        arab: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
        latin: "Innamal a'malu binniyyat",
        arti: 'Sesungguhnya setiap amalan tergantung pada niatnya.',
        riwayat: 'HR. Bukhari & Muslim',
        tema: 'Niat',
    },
    {
        arab: 'إِنَّ اللَّهَ لاَ يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ',
        latin: "Innallaha la yanzhuru ila shuwarikum wa amwalikum walaakin yanzhuru ila quluubikum wa a'malikum",
        arti: 'Sesungguhnya Allah tidak melihat pada rupa dan harta kalian, tetapi Dia melihat pada hati dan amal kalian.',
        riwayat: 'HR. Muslim',
        tema: 'Hati',
    },
    {
        arab: 'تَسَحَّرُوا فَإِنَّ فِي السُّحُورِ بَرَكَةً',
        latin: "Tasahharu fa inna fis-suhuri barakah",
        arti: 'Bersahurlah, karena pada sahur terdapat keberkahan.',
        riwayat: 'HR. Bukhari & Muslim',
        tema: 'Sahur',
    },
    {
        arab: 'لِلصَّائِمِ فَرْحَتَانِ فَرْحَةٌ عِنْدَ فِطْرِهِ وَفَرْحَةٌ عِنْدَ لِقَاءِ رَبِّهِ',
        latin: "Lish-shai'mi farhataan, farhatun 'inda fithrihi wa farhatun 'inda liqa'i rabbih",
        arti: 'Orang yang berpuasa mendapat dua kebahagiaan: kebahagiaan ketika berbuka dan kebahagiaan ketika bertemu Tuhannya.',
        riwayat: 'HR. Bukhari & Muslim',
        tema: 'Puasa',
    },
];

const TEMA_COLOR: Record<string, string> = {
    Puasa: '#D4AF37', Ramadan: '#2ecc71', Sholat: '#a29bfe',
    Akhlak: '#fd79a8', Tarawih: '#00cec9', Muamalah: '#fdcb6e',
    Niat: '#55efc4', Hati: '#e17055', Sahur: '#74b9ff',
};

function getTodayHadis() {
    const day = new Date().getDate();
    return HADIS_DB[day % HADIS_DB.length];
}

export default function HadisPage() {
    const [hadis, setHadis] = useState(getTodayHadis());
    const [idx, setIdx] = useState(new Date().getDate() % HADIS_DB.length);
    const [showLatin, setShowLatin] = useState(true);
    const [copied, setCopied] = useState(false);

    const handleNext = () => {
        const next = (idx + 1) % HADIS_DB.length;
        setIdx(next);
        setHadis(HADIS_DB[next]);
        setCopied(false);
    };

    const handlePrev = () => {
        const prev = (idx - 1 + HADIS_DB.length) % HADIS_DB.length;
        setIdx(prev);
        setHadis(HADIS_DB[prev]);
        setCopied(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(`${hadis.arab}\n\n${hadis.latin}\n\n"${hadis.arti}" — ${hadis.riwayat}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const color = TEMA_COLOR[hadis.tema] || '#D4AF37';

    return (
        <DashboardLayout title="📖 Hadis Harian">
            {/* Hadis of the day badge */}
            <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '7px 14px', borderRadius: '50px', marginBottom: '20px',
                background: `${color}18`, border: `1px solid ${color}40`,
                fontSize: '12px', fontWeight: 600, color,
            }}>
                ✨ Hadis Hari Ini ({new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })})
            </div>

            {/* Main card */}
            <div className="glass-card" style={{ padding: '24px 20px', marginBottom: '16px' }}>
                {/* Tema badge */}
                <div style={{
                    display: 'inline-block', padding: '4px 12px', borderRadius: '50px',
                    background: `${color}18`, border: `1px solid ${color}40`,
                    fontSize: '11px', fontWeight: 700, color, marginBottom: '16px',
                    letterSpacing: '0.5px', textTransform: 'uppercase',
                }}>
                    {hadis.tema}
                </div>

                {/* Arabic */}
                <div style={{
                    fontFamily: "'Amiri', serif", fontSize: '1.6rem',
                    lineHeight: 2.2, textAlign: 'right', direction: 'rtl',
                    color, marginBottom: '16px',
                    padding: '16px', background: `${color}08`,
                    borderRadius: '12px', borderRight: `4px solid ${color}`,
                }}>
                    {hadis.arab}
                </div>

                {/* Latin (toggle) */}
                {showLatin && (
                    <div style={{
                        fontSize: '13px', color: 'var(--text-secondary)',
                        fontStyle: 'italic', lineHeight: 1.8, marginBottom: '12px',
                    }}>
                        {hadis.latin}
                    </div>
                )}

                {/* Arti */}
                <div style={{
                    fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.8,
                    padding: '14px', background: 'rgba(255,255,255,0.04)',
                    borderRadius: '10px', borderLeft: `3px solid ${color}`,
                    marginBottom: '16px',
                }}>
                    {hadis.arti}
                </div>

                {/* Riwayat */}
                <div style={{ fontSize: '12px', color, fontWeight: 600 }}>
                    📚 {hadis.riwayat}
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <button onClick={handlePrev} className="btn-outline" style={{ flex: 1, minWidth: '80px', fontSize: '13px' }}>
                    ← Sebelum
                </button>
                <button onClick={handleCopy} style={{
                    flex: 2, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                    background: copied ? 'rgba(46,204,113,0.15)' : `${color}18`,
                    border: `1px solid ${copied ? 'rgba(46,204,113,0.4)' : color + '40'}`,
                    color: copied ? '#2ecc71' : color,
                    cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                    {copied ? '✅ Tersalin!' : '📋 Salin Hadis'}
                </button>
                <button onClick={handleNext} className="btn-gold" style={{ flex: 1, minWidth: '80px', fontSize: '13px' }}>
                    Selanjut →
                </button>
            </div>

            <button onClick={() => setShowLatin(s => !s)} style={{
                width: '100%', padding: '10px', borderRadius: '10px', fontSize: '12px',
                background: 'transparent', border: '1px solid rgba(212,175,55,0.15)',
                color: 'var(--text-secondary)', cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
                {showLatin ? '🔡 Sembunyikan Latin' : '🔡 Tampilkan Latin'}
            </button>

            {/* All hadis list */}
            <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
                    📚 Semua Hadis ({HADIS_DB.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {HADIS_DB.map((h, i) => {
                        const c = TEMA_COLOR[h.tema] || '#D4AF37';
                        return (
                            <button key={i} onClick={() => { setIdx(i); setHadis(h); setCopied(false); }} style={{
                                padding: '12px 14px', borderRadius: '10px', textAlign: 'left', cursor: 'pointer',
                                background: idx === i ? `${c}15` : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${idx === i ? c + '50' : 'rgba(212,175,55,0.1)'}`,
                                fontFamily: "'Plus Jakarta Sans', sans-serif", width: '100%',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '12px', color: idx === i ? c : 'var(--text-secondary)', fontWeight: 600 }}>
                                        {i + 1}. {h.arti.substring(0, 50)}...
                                    </span>
                                    <span style={{
                                        fontSize: '10px', padding: '2px 8px', borderRadius: '50px',
                                        background: `${c}18`, color: c, marginLeft: '8px', flexShrink: 0,
                                    }}>{h.tema}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </DashboardLayout>
    );
}
