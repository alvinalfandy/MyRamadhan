'use client';

import AuthStars from '@/components/AuthStars';
import MyRamadhanLogo from '@/components/MyRamadhanLogo';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(form.username, form.password);
        setLoading(false);
        if (result.ok) {
            router.push('/');
        } else {
            setError(result.error || 'Login gagal');
        }
    };

    return (
        <div style={{
            minHeight: '100dvh',
            background: 'radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(46,204,113,0.06) 0%, transparent 60%), #0a0e1a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px', fontFamily: "'Plus Jakarta Sans', sans-serif",
            WebkitTapHighlightColor: 'transparent',
        }}>
            <AuthStars />

            <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                        <MyRamadhanLogo size={72} style={{ filter: 'drop-shadow(0 8px 24px rgba(212,175,55,0.4))' }} />
                    </div>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700,
                        background: 'linear-gradient(135deg, #D4AF37, #F0D060, #D4AF37)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '4px',
                        letterSpacing: '-0.5px',
                    }}>
                        MyRamadhan
                    </h1>
                    <p style={{ color: 'rgba(168,157,138,0.8)', fontSize: '13px', letterSpacing: '0.5px' }}>
                        ✨ Ramadan 1447 H — Selamat Datang
                    </p>
                </div>

                {/* Card */}
                <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(212,175,55,0.2)',
                    borderRadius: '20px',
                    padding: '32px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: 'rgba(168,157,138,0.9)', marginBottom: '6px', fontWeight: 500 }}>
                                Username
                            </label>
                            <input
                                className="search-input"
                                placeholder="Masukkan username"
                                value={form.username}
                                autoCapitalize="none"
                                autoCorrect="off"
                                autoComplete="username"
                                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: 'rgba(168,157,138,0.9)', marginBottom: '6px', fontWeight: 500 }}>
                                Password
                            </label>
                            <input
                                type="password"
                                className="search-input"
                                placeholder="Masukkan password"
                                value={form.password}
                                autoComplete="current-password"
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                required
                            />
                        </div>

                        {error && (
                            <div style={{
                                padding: '10px 14px', borderRadius: '8px',
                                background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
                                color: '#ff6b6b', fontSize: '13px',
                            }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-gold"
                            style={{
                                padding: '13px',
                                opacity: loading ? 0.6 : 1,
                                fontSize: '15px', width: '100%',
                            }}
                        >
                            {loading ? 'Memproses...' : '🌙 Masuk'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'rgba(168,157,138,0.7)' }}>
                        Belum punya akun?{' '}
                        <Link href="/register" style={{ color: '#D4AF37', fontWeight: 600, textDecoration: 'none' }}>
                            Daftar sekarang
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
