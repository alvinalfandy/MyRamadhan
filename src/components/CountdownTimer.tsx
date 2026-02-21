'use client';

import { useEffect, useState } from 'react';
import { PrayerTimes } from '@/lib/prayerApi';

interface Props {
    timings: PrayerTimes;
    isRamadan: boolean;
}

interface TimeLeft {
    hours: number;
    minutes: number;
    seconds: number;
    target: 'Imsak' | 'Maghrib' | 'Fajr';
    label: string;
}

function parseTime(t: string): Date {
    const [h, m] = t.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
}

export default function CountdownTimer({ timings, isRamadan }: Props) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

    useEffect(() => {
        const calculate = () => {
            const now = new Date();
            const imsak = parseTime(timings.Imsak);
            const fajr = parseTime(timings.Fajr);
            const maghrib = parseTime(timings.Maghrib);

            let target: Date;
            let label: string;
            let targetName: 'Imsak' | 'Maghrib' | 'Fajr';

            if (now < imsak) {
                target = imsak;
                label = '⛔ Imsak';
                targetName = 'Imsak';
            } else if (now < maghrib) {
                target = maghrib;
                label = '🌅 Buka Puasa';
                targetName = 'Maghrib';
            } else {
                // After maghrib - countdown to imsak tomorrow
                const tomorrow = new Date(imsak);
                tomorrow.setDate(tomorrow.getDate() + 1);
                target = tomorrow;
                label = '⛔ Imsak Besok';
                targetName = 'Imsak';
            }

            const diff = target.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ hours, minutes, seconds, target: targetName, label });
        };

        calculate();
        const interval = setInterval(calculate, 1000);
        return () => clearInterval(interval);
    }, [timings]);

    const pad = (n: number) => String(n).padStart(2, '0');

    if (!timeLeft) {
        return (
            <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                <div className="skeleton" style={{ height: '60px', width: '200px', margin: '0 auto' }} />
            </div>
        );
    }

    const isIminent = timeLeft.hours === 0 && timeLeft.minutes < 10;

    return (
        <div className={`glass-card ${timeLeft.target === 'Maghrib' ? 'glow-green' : 'glow-gold'}`}
            style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{
                fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase',
                color: 'var(--text-secondary)', marginBottom: '12px'
            }}>
                Menuju
            </div>
            <div style={{
                fontSize: '18px', fontWeight: 700, marginBottom: '16px',
                color: timeLeft.target === 'Maghrib' ? 'var(--green)' : 'var(--gold)',
                fontFamily: "'Playfair Display', serif",
            }}>
                {timeLeft.label}
            </div>

            {/* Countdown digits */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <div className="countdown-unit">
                    <div className="countdown-number" style={isIminent ? { color: '#ff6b6b', WebkitTextFillColor: '#ff6b6b' } : {}}>
                        {pad(timeLeft.hours)}
                    </div>
                    <div className="countdown-label">jam</div>
                </div>

                <div className="countdown-separator">:</div>

                <div className="countdown-unit">
                    <div className="countdown-number" style={isIminent ? { color: '#ff6b6b', WebkitTextFillColor: '#ff6b6b' } : {}}>
                        {pad(timeLeft.minutes)}
                    </div>
                    <div className="countdown-label">menit</div>
                </div>

                <div className="countdown-separator">:</div>

                <div className="countdown-unit">
                    <div className="countdown-number" style={isIminent ? { color: '#ff6b6b', WebkitTextFillColor: '#ff6b6b' } : {}}>
                        {pad(timeLeft.seconds)}
                    </div>
                    <div className="countdown-label">detik</div>
                </div>
            </div>

            {isIminent && (
                <div style={{
                    marginTop: '12px', fontSize: '13px', color: '#ff6b6b',
                    animation: 'pulse-dot 1s ease-in-out infinite',
                }}>
                    ⚠️ Waktu hampir habis!
                </div>
            )}

            {/* Imsak & Maghrib times */}
            <div style={{
                display: 'flex', justifyContent: 'center', gap: '24px',
                marginTop: '20px', paddingTop: '16px',
                borderTop: '1px solid var(--border-color)',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '1px' }}>IMSAK</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gold)' }}>{timings.Imsak}</div>
                </div>
                <div style={{ width: '1px', background: 'var(--border-color)' }} />
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '1px' }}>BUKA PUASA</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--green)' }}>{timings.Maghrib}</div>
                </div>
            </div>
        </div>
    );
}
