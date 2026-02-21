'use client';

import { Mazhab } from '@/lib/prayerApi';

interface Props {
    mazhab: Mazhab;
    onChange: (mazhab: Mazhab) => void;
}

export default function MazhabSelector({ mazhab, onChange }: Props) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Pilih Mazhab
            </span>
            <div className="mazhab-toggle">
                <button
                    className={`mazhab-btn ${mazhab === 'NU' ? 'active' : ''}`}
                    onClick={() => onChange('NU')}
                >
                    🕌 NU / Kemenag
                </button>
                <button
                    className={`mazhab-btn ${mazhab === 'Muhammadiyah' ? 'active' : ''}`}
                    onClick={() => onChange('Muhammadiyah')}
                >
                    ☪️ Muhammadiyah
                </button>
            </div>
        </div>
    );
}
