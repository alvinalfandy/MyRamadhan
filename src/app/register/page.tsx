'use client';

import AuthStars from '@/components/AuthStars';
import MyRamadhanLogo from '@/components/MyRamadhanLogo';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
    const { register } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({ nama: '', username: '', password: '', konfirmasi: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.konfirmasi) {
            setError('Password dan konfirmasi password tidak cocok');
            return;
        }
        if (form.password.length < 6) {
            setError('Password minimal 6 karakter');
            return;
        }
        setLoading(true);
        const result = await register(form.nama, form.username, form.password);
        setLoading(false);
        if (result.ok) {
            router.push('/');
        } else {
            setError(result.error || 'Registrasi gagal');
        }
    };

    return (
        <div style={{
            minHeight: '100dvh',
            background: 'radial-gradient(ellipse at 80% 50%, rgba(46,204,113,0.06) 0%, transparent 60%), radial-gradient(ellipse at 20% 20%, rgba(212,175,55,0.08) 0%, transparent 60%), #0a0e1a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px', fontFamily: "'Plus Jakarta Sans', sans-serif",
            WebkitTapHighlightColor: 'transparent',
        }}>
            <AuthStars />

            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                        <MyRamadhanLogo size={72} style={{ filter: 'drop-shadow(0 8px 24px rgba(212,175,55,0.4))' }} />
                    </div>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700,
                        background: 'linear-gradient(135deg, #D4AF37, #F0D060, #D4AF37)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text', marginBottom: '4px', letterSpacing: '-0.5px',
                    }}>MyRamadhan</h1>
                    <p style={{ color: 'rgba(168,157,138,0.8)', fontSize: '13px', letterSpacing: '0.5px' }}>
                        ✨ Daftar & mulai perjalanan Ramadanmu
                    </p>
                </div>

                <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(46,204,113,0.2)',
                    borderRadius: '20px', padding: '32px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {[
                            { label: 'Nama Lengkap', key: 'nama', placeholder: 'Nama kamu', type: 'text', ac: 'name' },
                            { label: 'Username', key: 'username', placeholder: 'username (tanpa spasi)', type: 'text', ac: 'username' },
                            { label: 'Password', key: 'password', placeholder: 'Minimal 6 karakter', type: 'password', ac: 'new-password' },
                            { label: 'Konfirmasi Password', key: 'konfirmasi', placeholder: 'Ulangi password', type: 'password', ac: 'new-password' },
                        ].map(({ label, key, placeholder, type, ac }) => (
                            <div key={key}>
                                <label style={{ display: 'block', fontSize: '13px', color: 'rgba(168,157,138,0.9)', marginBottom: '6px', fontWeight: 500 }}>
                                    {label}
                                </label>
                                <input
                                    type={type}
                                    className="search-input"
                                    placeholder={placeholder}
                                    autoComplete={ac}
                                    autoCapitalize={key === 'username' ? 'none' : undefined}
                                    autoCorrect={key === 'username' ? 'off' : undefined}
                                    value={form[key as keyof typeof form]}
                                    onChange={e => {
                                        const val = key === 'username' ? e.target.value.replace(/\s/g, '') : e.target.value;
                                        setForm(f => ({ ...f, [key]: val }));
                                    }}
                                    required
                                />
                            </div>
                        ))}

                        {error && (
                            <div style={{
                                padding: '10px 14px', borderRadius: '8px',
                                background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
                                color: '#ff6b6b', fontSize: '13px',
                            }}>⚠️ {error}</div>
                        )}

                        <button
                            type="submit" disabled={loading}
                            style={{
                                padding: '13px', marginTop: '4px',
                                background: loading ? 'rgba(46,204,113,0.3)' : 'linear-gradient(135deg, #2ecc71, #27ae60)',
                                color: '#0a0e1a', fontWeight: 700, fontSize: '15px',
                                border: 'none', borderRadius: '10px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                boxShadow: loading ? 'none' : '0 4px 20px rgba(46,204,113,0.3)',
                                width: '100%',
                            }}
                        >
                            {loading ? 'Mendaftar...' : '✨ Daftar Sekarang'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'rgba(168,157,138,0.7)' }}>
                        Sudah punya akun?{' '}
                        <Link href="/login" style={{ color: '#D4AF37', fontWeight: 600, textDecoration: 'none' }}>
                            Masuk di sini
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
