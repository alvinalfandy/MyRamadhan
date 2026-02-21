'use client';

import { PrayerTimes } from '@/lib/prayerApi';

interface Props {
    timings: PrayerTimes;
    currentPrayer?: string;
}

const PRAYERS = [
    { key: 'Fajr', label: 'Subuh', icon: '🌄' },
    { key: 'Sunrise', label: 'Syuruq', icon: '☀️' },
    { key: 'Dhuhr', label: 'Dzuhur', icon: '🌞' },
    { key: 'Asr', label: 'Ashar', icon: '🌤️' },
    { key: 'Maghrib', label: 'Maghrib', icon: '🌇' },
    { key: 'Isha', label: 'Isya', icon: '🌙' },
];

function getCurrentPrayer(timings: PrayerTimes): string {
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();

    const times = PRAYERS.map(p => {
        const t = timings[p.key as keyof PrayerTimes];
        const [h, m] = t.split(':').map(Number);
        return { key: p.key, mins: h * 60 + m };
    });

    let current = times[times.length - 1].key;
    for (let i = 0; i < times.length; i++) {
        if (nowMins < times[i].mins) {
            current = i === 0 ? times[times.length - 1].key : times[i - 1].key;
            break;
        }
    }
    return current;
}

export default function PrayerCard({ timings }: Props) {
    const currentPrayer = getCurrentPrayer(timings);

    return (
        <div className="glass-card" style={{ padding: '20px' }}>
            <h3 className="section-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🕌 <span>Jadwal Sholat</span>
            </h3>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
            }}>
                {PRAYERS.map(prayer => {
                    const time = timings[prayer.key as keyof PrayerTimes];
                    const isActive = currentPrayer === prayer.key;

                    return (
                        <div key={prayer.key} className={`prayer-badge ${isActive ? 'active' : ''}`}>
                            <div style={{ fontSize: '20px', marginBottom: '4px' }}>{prayer.icon}</div>
                            <div style={{
                                fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase',
                                color: isActive ? 'var(--gold)' : 'var(--text-secondary)',
                                fontWeight: 600, marginBottom: '4px',
                            }}>
                                {prayer.label}
                            </div>
                            <div style={{
                                fontSize: '16px', fontWeight: 700,
                                color: isActive ? 'var(--gold-light)' : 'var(--text-primary)',
                                fontFamily: "'Playfair Display', serif",
                            }}>
                                {time}
                            </div>
                            {isActive && (
                                <div style={{
                                    fontSize: '9px', color: 'var(--gold)', marginTop: '4px',
                                    letterSpacing: '1px', textTransform: 'uppercase',
                                }}>
                                    ● Sekarang
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Extra times */}
            <div style={{
                display: 'flex', gap: '12px', marginTop: '12px',
                padding: '12px', borderRadius: '10px',
                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)',
            }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '1px', textTransform: 'uppercase' }}>Imsak</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gold)' }}>{timings.Imsak}</div>
                </div>
                <div style={{ width: '1px', background: 'var(--border-color)' }} />
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '1px', textTransform: 'uppercase' }}>Tengah Malam</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{timings.Midnight}</div>
                </div>
            </div>
        </div>
    );
}
