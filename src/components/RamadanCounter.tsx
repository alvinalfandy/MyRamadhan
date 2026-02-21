'use client';

import { getRamadanDay, Mazhab } from '@/lib/prayerApi';

interface Props {
    mazhab: Mazhab;
    hijriDate?: string;
}

export default function RamadanCounter({ mazhab, hijriDate }: Props) {
    const day = getRamadanDay(mazhab);
    const isValid = day >= 1 && day <= 30;

    return (
        <div className="glass-card glow-gold" style={{ padding: '20px', textAlign: 'center' }}>
            {/* Moon icon */}
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🌙</div>

            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '13px', color: 'var(--text-secondary)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
                {isValid ? 'Hari ke' : 'Marhaban Ya'}
            </div>

            {isValid ? (
                <>
                    <div style={{
                        fontSize: '5rem',
                        fontWeight: 800,
                        fontFamily: "'Playfair Display', serif",
                        lineHeight: 1,
                        background: 'linear-gradient(135deg, #D4AF37, #F0D060, #D4AF37)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '8px',
                    }}>
                        {day}
                    </div>
                    <div className="text-gradient-gold" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 600 }}>
                        Ramadan 1447 H
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Mazhab: <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{mazhab}</span>
                    </div>
                    {hijriDate && (
                        <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {hijriDate}
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div style={{
                        fontSize: '2rem',
                        fontWeight: 800,
                        fontFamily: "'Playfair Display', serif",
                        color: 'var(--gold)',
                        marginBottom: '4px',
                    }}>
                        Ramadan 1447 H
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {day < 1
                            ? `${Math.abs(day - 1)} hari lagi menuju Ramadan`
                            : 'Alhamdulillah, Ramadan telah selesai 🤲'}
                    </div>
                </>
            )}
        </div>
    );
}
