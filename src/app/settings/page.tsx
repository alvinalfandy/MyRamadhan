'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { User, Lock, Save, ChevronRight, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
    const { user, loading, setUser } = useAuth();
    const router = useRouter();

    const [nama, setNama] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [updating, setUpdating] = useState(false);
    const [toast, setToast] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            setNama(user.nama);
        }
    }, [user, loading, router]);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword && newPassword !== confirmPassword) {
            setError('Password baru tidak cocok');
            return;
        }

        setUpdating(true);
        try {
            const res = await fetch('/api/auth/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id,
                    nama,
                    currentPassword: newPassword ? currentPassword : undefined,
                    newPassword: newPassword || undefined
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Gagal memperbarui profil');

            // Update local session
            if (data.user) {
                const newSession = { ...user!, ...data.user };
                setUser(newSession);
                localStorage.setItem('ramadan-user', JSON.stringify(newSession));
            }

            showToast('✅ Profil berhasil diperbarui');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading || !user) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0e1a' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <DashboardLayout title="⚙️ Pengaturan Akun">
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>

                <div style={{ marginBottom: '24px' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        Kelola informasi profil dan keamanan akun MyRamadhan Anda di sini.
                    </p>
                </div>

                {error && (
                    <div style={{
                        padding: '12px 16px', background: 'rgba(255,80,80,0.1)',
                        border: '1px solid rgba(255,80,80,0.2)', borderRadius: '12px',
                        color: '#ff6b6b', fontSize: '13px', marginBottom: '20px'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Profil Section */}
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={18} color="var(--gold)" />
                            </div>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem' }}>Informasi Profil</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>USERNAME (TIDAK DAPAT DIUBAH)</label>
                                <div style={{
                                    padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', fontSize: '14px'
                                }}>
                                    @{user.username}
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>NAMA LENGKAP / TAMPILAN</label>
                                <input
                                    type="text"
                                    value={nama}
                                    onChange={(e) => setNama(e.target.value)}
                                    placeholder="Masukkan nama Anda"
                                    style={{
                                        width: '100%', padding: '12px 16px', borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'white', fontSize: '14px', outline: 'none'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Keamanan Section */}
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(46,204,113,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Lock size={18} color="#2ecc71" />
                            </div>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem' }}>Keamanan & Password</h3>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                            Kosongkan jika tidak ingin mengubah password.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>PASSWORD SAAT INI</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                    style={{
                                        width: '100%', padding: '12px 16px', borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'white', fontSize: '14px', outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>PASSWORD BARU</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        style={{
                                            width: '100%', padding: '12px 16px', borderRadius: '12px',
                                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                            color: 'white', fontSize: '14px', outline: 'none'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>KONFIRMASI</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        style={{
                                            width: '100%', padding: '12px 16px', borderRadius: '12px',
                                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                            color: 'white', fontSize: '14px', outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={updating}
                        style={{
                            width: '100%', padding: '16px', borderRadius: '14px',
                            background: 'var(--gold)', color: '#0a0e1a',
                            fontWeight: 700, fontSize: '16px', border: 'none',
                            cursor: updating ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            boxShadow: '0 8px 25px rgba(212, 175, 55, 0.2)',
                            transition: 'all 0.2s',
                            opacity: updating ? 0.7 : 1
                        }}
                    >
                        {updating ? 'Memperbarui...' : (
                            <>
                                <Save size={20} /> Simpan Perubahan
                            </>
                        )}
                    </button>

                </form>

                {/* Footer Info */}
                <div style={{ marginTop: '32px', textAlign: 'center', padding: '20px', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--gold)', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                        <ShieldCheck size={16} /> Keamanan MyRamadhan
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        Password Anda dienkripsi menggunakan hashing Bcrypt standar industri.
                        Kami tidak pernah menyimpan password dalam bentuk teks biasa.
                    </p>
                </div>

            </div>

            {toast && <div className="toast">{toast}</div>}

            <style jsx>{`
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(212, 175, 55, 0.1);
                    border-radius: 50%;
                    border-top-color: var(--gold);
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                input:focus {
                    border-color: var(--gold) !important;
                    background: rgba(255,255,255,0.08) !important;
                }
            `}</style>
        </DashboardLayout>
    );
}
