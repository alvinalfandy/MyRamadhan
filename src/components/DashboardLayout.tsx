'use client';

import MyRamadhanLogo from '@/components/MyRamadhanLogo';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import StarBackground from './StarBackground';

interface Props {
    children: React.ReactNode;
    title?: string;
}

export default function DashboardLayout({ children, title }: Props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh', background: 'var(--bg-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: '16px',
            }}>
                <div style={{ fontSize: '2.5rem' }}>🌙</div>
                <div style={{ color: 'var(--gold)', fontFamily: "'Playfair Display', serif", fontSize: '1.1rem' }}>
                    Memuat...
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <>
            <StarBackground />
            <Sidebar />

            {/* Content area — hard overflow barrier */}
            <div
                className="dashboard-content"
                style={{
                    marginLeft: '240px',
                    minHeight: '100vh',
                    position: 'relative',
                    zIndex: 1,
                    overflowX: 'hidden',
                    width: 'calc(100% - 240px)',
                    maxWidth: '100vw',
                }}
            >
                {/* Top bar on mobile only */}
                <div className="mobile-topbar" style={{
                    padding: '14px 16px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(212,175,55,0.08)',
                    paddingBottom: '10px',
                    marginBottom: '4px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MyRamadhanLogo size={28} />
                        <span style={{
                            fontFamily: "'Playfair Display', serif", fontSize: '14px', fontWeight: 700,
                            background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        }}>MyRamadhan</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        Halo, <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{user.nama}</span> 👋
                    </div>
                </div>

                <main className="dashboard-main" style={{ padding: '20px 16px 100px', overflowX: 'hidden' }}>
                    {title && (
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '1.4rem', fontWeight: 700,
                            color: 'var(--text-primary)', marginBottom: '16px',
                        }}>
                            {title}
                        </h1>
                    )}
                    {children}

                    {/* Footer Credits */}
                    <footer style={{
                        marginTop: '48px',
                        padding: '24px 0',
                        textAlign: 'center',
                        borderTop: '1px solid rgba(212,175,55,0.08)',
                    }}>
                        <div style={{
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <span>© 1447 H • MyRamadhan</span>
                            <a
                                href="https://github.com/alvinalfandy/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: 'var(--gold)',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    fontSize: '12px',
                                    transition: 'opacity 0.2s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                            >
                                Made with ❤️ by Alvin Alfandy
                            </a>
                        </div>
                    </footer>
                </main>
            </div>

            <style>{`
        @media (max-width: 767px) {
          .dashboard-content {
            margin-left: 0 !important;
            width: 100% !important;
          }
          .mobile-topbar { display: flex !important; }
          .dashboard-main {
            padding: 14px 14px calc(80px + env(safe-area-inset-bottom, 0px)) 14px !important;
          }
        }
        @media (min-width: 768px) {
          .mobile-topbar { display: none !important; }
          .dashboard-main { padding: 28px 28px 40px !important; }
        }
      `}</style>

        </>
    );
}
