'use client';

import { MapPin, Navigation, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Popular Indonesian cities
const POPULAR_CITIES = [
    'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Makassar',
    'Semarang', 'Palembang', 'Tangerang', 'Depok', 'Yogyakarta',
    'Bogor', 'Bekasi', 'Malang', 'Balikpapan', 'Padang',
];

interface Props {
    city: string;
    onCityChange: (city: string) => void;
    onUseGPS: () => void;
    gpsLoading?: boolean;
}

export default function LocationPicker({ city, onCityChange, onUseGPS, gpsLoading }: Props) {
    const [query, setQuery] = useState(city);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filtered, setFiltered] = useState<string[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setQuery(city);
    }, [city]);

    useEffect(() => {
        if (query.length > 0) {
            setFiltered(
                POPULAR_CITIES.filter(c =>
                    c.toLowerCase().includes(query.toLowerCase())
                ).slice(0, 6)
            );
        } else {
            setFiltered(POPULAR_CITIES.slice(0, 6));
        }
    }, [query]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (c: string) => {
        setQuery(c);
        onCityChange(c);
        setShowSuggestions(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onCityChange(query.trim());
            setShowSuggestions(false);
        }
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <MapPin size={15} style={{
                        position: 'absolute', left: '12px', top: '50%',
                        transform: 'translateY(-50%)', color: 'var(--gold)', opacity: 0.7,
                    }} />
                    <input
                        className="search-input"
                        style={{ paddingLeft: '36px' }}
                        placeholder="Cari kota..."
                        value={query}
                        onChange={e => {
                            setQuery(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                    />
                </div>
                <button type="submit" className="btn-gold" style={{ padding: '10px 14px', borderRadius: '10px' }}>
                    <Search size={16} />
                </button>
                <button
                    type="button"
                    className="btn-outline"
                    style={{ padding: '10px 14px', borderRadius: '10px' }}
                    onClick={onUseGPS}
                    title="Gunakan lokasi saya"
                    disabled={gpsLoading}
                >
                    <Navigation size={16} style={{ color: gpsLoading ? 'var(--text-secondary)' : 'var(--green)' }} />
                </button>
            </form>

            {/* Suggestions dropdown */}
            {showSuggestions && filtered.length > 0 && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    marginTop: '4px', zIndex: 200,
                    background: 'rgba(13,21,38,0.98)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                }}>
                    {filtered.map(c => (
                        <div
                            key={c}
                            onClick={() => handleSelect(c)}
                            style={{
                                padding: '10px 14px',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                color: 'var(--text-primary)', fontSize: '14px',
                                transition: 'background 0.2s',
                                borderBottom: '1px solid rgba(212,175,55,0.08)',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.1)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                            <MapPin size={13} style={{ color: 'var(--gold)', opacity: 0.6 }} />
                            {c}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
