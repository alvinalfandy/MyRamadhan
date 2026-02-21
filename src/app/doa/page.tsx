'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';

const DOA_DATA = {
    'Ramadan': [
        {
            judul: 'Doa Berbuka Puasa',
            arab: 'اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
            latin: "Allahumma laka shumtu wa bika aamantu wa 'alaika tawakkaltu wa 'ala rizqika aftartu",
            arti: 'Ya Allah, untuk-Mu aku berpuasa, kepada-Mu aku beriman, kepada-Mu aku bertawakal, dan dengan rezeki-Mu aku berbuka.',
        },
        {
            judul: 'Doa Niat Puasa',
            arab: 'نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى',
            latin: "Nawaitu shauma ghadin 'an ada'i fardhi syahri Ramadhana hadzihis-sanati lillahi ta'ala",
            arti: 'Saya niat berpuasa esok hari untuk menunaikan fardhu di bulan Ramadan tahun ini karena Allah Ta\'ala.',
        },
        {
            judul: 'Doa Malam Lailatul Qadar',
            arab: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
            latin: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni",
            arti: 'Ya Allah, sesungguhnya Engkau Maha Pemaaf, suka memaafkan, maka maafkanlah aku.',
        },
    ],
    'Sholat & Ibadah': [
        {
            judul: 'Doa Setelah Adzan',
            arab: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلاَةِ الْقَائِمَةِ آتِ مُحَمَّداً الْوَسِيلَةَ وَالْفَضِيلَةَ',
            latin: "Allahumma rabba hadzihi ad-da'watit-tammati was-shalatil qa'imati, ati Muhammadanil wasilata wal fadilah",
            arti: 'Ya Allah, Tuhan yang memiliki seruan yang sempurna dan shalat yang didirikan, berilah Muhammad wasilah dan keutamaan.',
        },
        {
            judul: 'Doa Masuk Masjid',
            arab: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
            latin: "Allahummaftah li abwaba rahmatik",
            arti: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.',
        },
        {
            judul: 'Doa Keluar Masjid',
            arab: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
            latin: "Allahumma inni as'aluka min fadlik",
            arti: 'Ya Allah, sesungguhnya aku memohon kepada-Mu dari keutamaan-Mu.',
        },
    ],
    'Harian': [
        {
            judul: 'Doa Pagi Hari',
            arab: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
            latin: "Ashbahna wa ashbahal mulku lillah, walhamdu lillah",
            arti: 'Kami memasuki waktu pagi dan kerajaan hanya milik Allah, segala puji bagi Allah.',
        },
        {
            judul: 'Doa Sebelum Makan',
            arab: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
            latin: "Bismillah wa 'ala barakatillah",
            arti: 'Dengan menyebut nama Allah dan atas berkah Allah.',
        },
        {
            judul: 'Doa Setelah Makan',
            arab: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مِنَ الْمُسْلِمِينَ',
            latin: "Alhamdulillahil ladzi ath'amana wa saqana wa ja'alana minal muslimin",
            arti: 'Segala puji bagi Allah yang telah memberi kami makan dan minum, dan menjadikan kami sebagai orang-orang Muslim.',
        },
        {
            judul: 'Doa Masuk Rumah',
            arab: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلَجِ وَخَيْرَ الْمَخْرَجِ',
            latin: "Allahumma inni as'aluka khayral mawlaji wa khayral makhraj",
            arti: 'Ya Allah, aku memohon kepada-Mu kebaikan waktu masuk dan waktu keluar.',
        },
        {
            judul: 'Doa Sebelum Tidur',
            arab: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
            latin: "Bismika Allahumma amutu wa ahya",
            arti: 'Dengan nama-Mu ya Allah, aku mati dan aku hidup.',
        },
        {
            judul: 'Doa Setelah Bangun Tidur',
            arab: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
            latin: "Alhamdulillahil ladzi ahyana ba'da ma amatana wa ilaihin-nusyur",
            arti: 'Segala puji bagi Allah yang telah menghidupkan kami setelah Dia mematikan kami, dan kepada-Nya lah kami dikembalikan.',
        },
    ],
    'Perlindungan': [
        {
            judul: 'Ayat Kursi (perlindungan)',
            arab: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
            latin: "Allahu la ilaha illa huwal hayyul qayyum, la ta'khudhuhu sinatuw wa la nawm",
            arti: 'Allah, tidak ada Tuhan selain Dia. Yang Maha Hidup, yang terus-menerus mengurus (makhluk-Nya). Dia tidak mengantuk dan tidak tidur.',
        },
        {
            judul: 'Doa Ketika Tertimpa Musibah',
            arab: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
            latin: "Inna lillahi wa inna ilaihi raji'un",
            arti: 'Sesungguhnya kami adalah milik Allah dan kepada-Nya lah kami kembali.',
        },
    ],
};

const CATEGORIES = Object.keys(DOA_DATA) as Array<keyof typeof DOA_DATA>;
const CATEGORY_ICONS: Record<string, string> = {
    'Ramadan': '🌙',
    'Sholat & Ibadah': '🕌',
    'Harian': '☀️',
    'Perlindungan': '🛡️',
};
const CATEGORY_COLORS: Record<string, string> = {
    'Ramadan': '#D4AF37',
    'Sholat & Ibadah': '#2ecc71',
    'Harian': '#fdcb6e',
    'Perlindungan': '#a29bfe',
};

export default function DoaPage() {
    const [activeCategory, setActiveCategory] = useState<keyof typeof DOA_DATA>('Ramadan');
    const [expanded, setExpanded] = useState<number | null>(0);
    const [copied, setCopied] = useState<number | null>(null);

    const doas = DOA_DATA[activeCategory];
    const color = CATEGORY_COLORS[activeCategory];

    const handleCopy = (text: string, i: number) => {
        navigator.clipboard.writeText(text);
        setCopied(i);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <DashboardLayout title="🤲 Doa Harian">
            {/* Category tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                {CATEGORIES.map(cat => {
                    const isActive = cat === activeCategory;
                    const c = CATEGORY_COLORS[cat];
                    return (
                        <button key={cat} onClick={() => { setActiveCategory(cat); setExpanded(0); }} style={{
                            padding: '12px 10px', borderRadius: '12px',
                            background: isActive ? `${c}20` : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${isActive ? c : 'rgba(212,175,55,0.12)'}`,
                            color: isActive ? c : 'var(--text-secondary)',
                            fontSize: '12px', fontWeight: isActive ? 700 : 400,
                            cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                            textAlign: 'center', transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        }}>
                            <span style={{ fontSize: '16px' }}>{CATEGORY_ICONS[cat]}</span>
                            <span>{cat}</span>
                        </button>
                    );
                })}
            </div>

            {/* Doa list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {doas.map((doa, i) => {
                    const isOpen = expanded === i;
                    return (
                        <div key={i} className="glass-card" style={{
                            overflow: 'hidden',
                            border: isOpen ? `1px solid ${color}40` : '1px solid rgba(212,175,55,0.12)',
                            transition: 'border-color 0.2s',
                        }}>
                            {/* Header (always visible) */}
                            <button onClick={() => setExpanded(isOpen ? null : i)} style={{
                                width: '100%', padding: '14px 16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: isOpen ? color : 'var(--text-primary)', textAlign: 'left' }}>
                                    {CATEGORY_ICONS[activeCategory]} {doa.judul}
                                </span>
                                <span style={{ color, fontSize: '18px', flexShrink: 0, marginLeft: '8px', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                                    ⌄
                                </span>
                            </button>

                            {/* Content */}
                            {isOpen && (
                                <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${color}20` }}>
                                    {/* Arabic */}
                                    <div style={{
                                        fontFamily: "'Amiri', serif",
                                        fontSize: '1.5rem', lineHeight: 2, textAlign: 'right', direction: 'rtl',
                                        color: color, padding: '12px 0 8px',
                                    }}>
                                        {doa.arab}
                                    </div>

                                    {/* Latin */}
                                    <div style={{
                                        fontSize: '13px', color: 'var(--text-secondary)',
                                        fontStyle: 'italic', marginBottom: '8px', lineHeight: 1.7,
                                    }}>
                                        {doa.latin}
                                    </div>

                                    {/* Arti */}
                                    <div style={{
                                        fontSize: '13px', color: 'var(--text-primary)',
                                        lineHeight: 1.7, marginBottom: '12px',
                                        padding: '10px 12px', background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px', borderLeft: `3px solid ${color}`,
                                    }}>
                                        {doa.arti}
                                    </div>

                                    {/* Copy button */}
                                    <button onClick={() => handleCopy(`${doa.arab}\n\n${doa.latin}\n\n${doa.arti}`, i)} style={{
                                        padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                                        background: copied === i ? 'rgba(46,204,113,0.15)' : `${color}15`,
                                        border: `1px solid ${copied === i ? 'rgba(46,204,113,0.3)' : color + '40'}`,
                                        color: copied === i ? '#2ecc71' : color,
                                        cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    }}>
                                        {copied === i ? '✅ Tersalin!' : '📋 Salin Doa'}
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </DashboardLayout>
    );
}
