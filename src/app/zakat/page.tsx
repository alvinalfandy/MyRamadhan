'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';

// Harga beras / makanan pokok per kg (Rp)
const HARGA_BERAS = 12000; // default estimate
const NISHAB_EMAS_GRAM = 85; // gram emas
const HARGA_EMAS_PER_GRAM = 1400000; // Rp/gram estimate

type TabZakat = 'fitrah' | 'maal';

export default function ZakatPage() {
    const [tab, setTab] = useState<TabZakat>('fitrah');

    // Zakat Fitrah
    const [jiwaTanggungan, setJiwaTanggungan] = useState(1);
    const [hargaBeras, setHargaBeras] = useState(HARGA_BERAS);
    const [berasPerJiwa] = useState(2.5); // kg per jiwa

    // Zakat Maal
    const [tabungan, setTabungan] = useState('');
    const [emas, setEmas] = useState('');
    const [perak, setPerak] = useState('');
    const [penghasilan, setPenghasilan] = useState('');
    const [hargaEmas, setHargaEmas] = useState(HARGA_EMAS_PER_GRAM);

    const zakatFitrahBeras = jiwaTanggungan * berasPerJiwa;
    const zakatFitrahRupiah = jiwaTanggungan * berasPerJiwa * hargaBeras;

    const totalHartaMaal =
        (parseFloat(tabungan) || 0) +
        (parseFloat(emas) || 0) * hargaEmas +
        (parseFloat(perak) || 0) * 90000 + // harga perak estimasi
        (parseFloat(penghasilan) || 0) * 12;

    const nishabMaal = NISHAB_EMAS_GRAM * hargaEmas;
    const zakatMaal = totalHartaMaal >= nishabMaal ? totalHartaMaal * 0.025 : 0;
    const wajibZakatMaal = totalHartaMaal >= nishabMaal;

    const fmt = (n: number) => n.toLocaleString('id-ID');

    return (
        <DashboardLayout title="💰 Kalkulator Zakat">
            {/* Tab */}
            <div className="mazhab-toggle" style={{ marginBottom: '20px', maxWidth: '360px' }}>
                <button className={`mazhab-btn ${tab === 'fitrah' ? 'active' : ''}`} onClick={() => setTab('fitrah')}>
                    🌙 Zakat Fitrah
                </button>
                <button className={`mazhab-btn ${tab === 'maal' ? 'active' : ''}`} onClick={() => setTab('maal')}>
                    💰 Zakat Maal
                </button>
            </div>

            {tab === 'fitrah' && (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {/* Info */}
                    <div className="glass-card" style={{ padding: '16px', borderLeft: '3px solid var(--gold)' }}>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            📌 <strong style={{ color: 'var(--gold)' }}>Zakat Fitrah</strong> wajib dikeluarkan setiap jiwa yang mampu,
                            sebesar <strong style={{ color: 'var(--text-primary)' }}>2,5 kg beras atau makanan pokok</strong> per orang,
                            atau setara nilainya dalam rupiah.
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                Jumlah Jiwa yang Ditanggung
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <button className="btn-outline" onClick={() => setJiwaTanggungan(Math.max(1, jiwaTanggungan - 1))} style={{ padding: '8px 14px', fontSize: '18px' }}>−</button>
                                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold)', fontFamily: "'Playfair Display', serif", minWidth: '50px', textAlign: 'center' }}>
                                    {jiwaTanggungan}
                                </div>
                                <button className="btn-outline" onClick={() => setJiwaTanggungan(jiwaTanggungan + 1)} style={{ padding: '8px 14px', fontSize: '18px' }}>+</button>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                Harga Beras per Kg (Rp)
                            </label>
                            <input
                                className="search-input"
                                type="number"
                                value={hargaBeras}
                                onChange={e => setHargaBeras(Number(e.target.value))}
                                placeholder="Harga beras per kg"
                                style={{ maxWidth: '220px' }}
                            />
                        </div>
                    </div>

                    {/* Hasil */}
                    <div className="glass-card glow-gold" style={{ padding: '24px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', letterSpacing: '2px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Zakat Fitrah Yang Harus Dibayar
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--gold)', fontFamily: "'Playfair Display', serif", marginBottom: '4px' }}>
                            {zakatFitrahBeras.toFixed(1)} kg
                        </div>
                        <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '8px' }}>
                            atau setara <span style={{ color: 'var(--gold)' }}>Rp {fmt(zakatFitrahRupiah)}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {jiwaTanggungan} jiwa × {berasPerJiwa} kg × Rp {fmt(hargaBeras)}
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '16px', borderLeft: '3px solid #2ecc71' }}>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            ⏰ <strong style={{ color: '#2ecc71' }}>Waktu Pembayaran:</strong> Sejak awal Ramadan hingga sebelum sholat Ied.
                            Terbaik dibayarkan pada malam atau pagi sebelum sholat Ied.
                        </div>
                    </div>
                </div>
            )}

            {tab === 'maal' && (
                <div style={{ display: 'grid', gap: '16px' }}>
                    <div className="glass-card" style={{ padding: '16px', borderLeft: '3px solid var(--gold)' }}>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            📌 <strong style={{ color: 'var(--gold)' }}>Zakat Maal</strong> dikeluarkan sebesar <strong style={{ color: 'var(--text-primary)' }}>2,5%</strong> dari
                            total harta yang mencapai <strong style={{ color: 'var(--text-primary)' }}>nishab (85 gram emas)</strong> dan
                            telah dimiliki selama 1 tahun (haul).
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {[
                            { label: 'Tabungan / Uang Tunai (Rp)', val: tabungan, set: setTabungan, placeholder: 'Contoh: 10000000' },
                            { label: 'Emas yang dimiliki (gram)', val: emas, set: setEmas, placeholder: 'Contoh: 50' },
                            { label: 'Perak yang dimiliki (gram)', val: perak, set: setPerak, placeholder: 'Contoh: 100' },
                            { label: 'Penghasilan Bulanan (Rp)', val: penghasilan, set: setPenghasilan, placeholder: 'Disetahunkan otomatis' },
                        ].map(({ label, val, set, placeholder }) => (
                            <div key={label}>
                                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>{label}</label>
                                <input
                                    className="search-input" type="number"
                                    value={val} onChange={e => set(e.target.value)}
                                    placeholder={placeholder}
                                />
                            </div>
                        ))}
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                Harga Emas per Gram (Rp)
                            </label>
                            <input
                                className="search-input" type="number"
                                value={hargaEmas} onChange={e => setHargaEmas(Number(e.target.value))}
                                placeholder="Harga emas hari ini"
                                style={{ maxWidth: '220px' }}
                            />
                        </div>
                    </div>

                    {/* Hasil */}
                    <div className={`glass-card ${wajibZakatMaal ? 'glow-gold' : ''}`} style={{ padding: '24px', textAlign: 'center', borderColor: wajibZakatMaal ? 'rgba(212,175,55,0.4)' : undefined }}>
                        <div style={{ fontSize: '12px', letterSpacing: '2px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px' }}>
                            Nishab: Rp {fmt(nishabMaal)} ({NISHAB_EMAS_GRAM}g emas)
                        </div>
                        <div style={{
                            fontSize: '14px', fontWeight: 600, marginBottom: '12px',
                            color: wajibZakatMaal ? '#2ecc71' : '#ff9f43',
                        }}>
                            {wajibZakatMaal ? '✅ Wajib Zakat' : '⏳ Belum Mencapai Nishab'}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            Total Harta: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Rp {fmt(totalHartaMaal)}</span>
                        </div>
                        {wajibZakatMaal && (
                            <>
                                <div style={{ height: '1px', background: 'var(--border-color)', margin: '12px 0' }} />
                                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold)', fontFamily: "'Playfair Display', serif", marginBottom: '4px' }}>
                                    Rp {fmt(zakatMaal)}
                                </div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    2,5% × Rp {fmt(totalHartaMaal)}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
