'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Users, Activity, BarChart2, ShieldCheck, User as UserIcon, Calendar } from 'lucide-react';

interface AdminStats {
    totalUsers: number;
    fastingToday: number;
    sholatToday: number;
    activeUsersToday: number;
}

interface UserData {
    id: string;
    nama: string;
    username: string;
    role: string;
    created_at: string;
}

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [recentUsers, setRecentUsers] = useState<UserData[]>([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                const data = await res.json();
                if (res.ok) {
                    setStats(data.stats);
                    setRecentUsers(data.recentUsers);
                }
            } catch (err) {
                console.error('Failed to fetch stats', err);
            } finally {
                setFetching(false);
            }
        };

        if (user?.role === 'admin') {
            fetchStats();
        }
    }, [user]);

    if (loading || user?.role !== 'admin') {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0e1a' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <DashboardLayout title="🔒 Admin Control Center">
            <div style={{ marginBottom: '24px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Selamat datang kembali, Super Admin <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{user.nama}</span>.
                    Berikut adalah ringkasan performa MyRamadhan hari ini.
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                {[
                    { label: 'Total User', val: stats?.totalUsers || 0, icon: Users, color: '#D4AF37' },
                    { label: 'Puasa Hari Ini', val: stats?.fastingToday || 0, icon: Activity, color: '#2ecc71' },
                    { label: 'Log Sholat', val: stats?.sholatToday || 0, icon: Calendar, color: '#a29bfe' },
                    { label: 'Aktif Hari Ini', val: stats?.activeUsersToday || 0, icon: BarChart2, color: '#ff9f43' },
                ].map((s, i) => (
                    <div key={i} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', border: `1px solid ${s.color}22` }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <s.icon size={20} color={s.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
                            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Playfair Display', serif" }}>
                                {fetching ? '...' : s.val}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>

                {/* User List */}
                <div className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <ShieldCheck size={20} color="var(--gold)" />
                            User Terdaftar Terbaru
                        </h3>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <th style={{ padding: '12px 8px', color: 'var(--text-secondary)', fontWeight: 500 }}>User</th>
                                    <th style={{ padding: '12px 8px', color: 'var(--text-secondary)', fontWeight: 500 }}>ID / Username</th>
                                    <th style={{ padding: '12px 8px', color: 'var(--text-secondary)', fontWeight: 500 }}>Role</th>
                                    <th style={{ padding: '12px 8px', color: 'var(--text-secondary)', fontWeight: 500 }}>Terdaftar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.map(u => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                        <td style={{ padding: '12px 8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--gold)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <UserIcon size={14} color="var(--gold)" />
                                                </div>
                                                <span style={{ fontWeight: 600 }}>{u.nama}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 8px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                                            @{u.username}
                                        </td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <span style={{
                                                padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 600,
                                                background: u.role === 'admin' ? '#D4AF3722' : 'rgba(255,255,255,0.05)',
                                                color: u.role === 'admin' ? 'var(--gold)' : 'var(--text-secondary)',
                                                border: `1px solid ${u.role === 'admin' ? 'var(--gold)44' : 'rgba(255,255,255,0.1)'}`
                                            }}>
                                                {u.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 8px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                                            {new Date(u.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                                        </td>
                                    </tr>
                                ))}
                                {recentUsers.length === 0 && !fetching && (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                                            Belum ada user terdaftar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', marginBottom: '16px' }}>Status Sistem</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { label: 'Database (Supabase)', status: 'Operational', color: '#2ecc71' },
                                { label: 'API Services', status: 'Healthy', color: '#2ecc71' },
                                { label: 'Vercel Deployment', status: 'Live', color: '#2ecc71' },
                                { label: 'Security (RLS)', status: 'Enabled', color: '#D4AF37' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
                                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{item.label}</span>
                                    <span style={{ fontSize: '12px', fontWeight: 700, color: item.color }}>● {item.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(212,175,55,0.05), transparent)' }}>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', marginBottom: '8px' }}>Pengingat Admin</h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            Gunakan dashboard ini dengan bijak. Pastikan untuk selalu memantau pertumbuhan user dan validasi konten harian.
                            Jangan lupa untuk menyapa user baru di komunitas! ✨
                        </p>
                    </div>
                </div>

            </div>

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
            `}</style>
        </DashboardLayout>
    );
}
