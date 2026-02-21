'use client';

import { Bell, BookOpen, Home, Moon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
    notifEnabled: boolean;
    onToggleNotif: () => void;
}

export default function Navbar({ notifEnabled, onToggleNotif }: NavbarProps) {
    const pathname = usePathname();

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backdropFilter: 'blur(20px)',
            background: 'rgba(10,14,26,0.85)',
            borderBottom: '1px solid rgba(212,175,55,0.15)',
            padding: '0 16px',
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '64px',
            }}>
                {/* Logo */}
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '36px', height: '36px',
                        background: 'linear-gradient(135deg, #D4AF37, #8B7520)',
                        borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px',
                    }}>🌙</div>
                    <div>
                        <div style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '17px', fontWeight: 700,
                            background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>RamadhanKu</div>
                        <div style={{ fontSize: '10px', color: 'rgba(168,157,138,0.8)', marginTop: '-2px', letterSpacing: '1px' }}>1447 H</div>
                    </div>
                </Link>

                {/* Nav links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '8px 14px', borderRadius: '8px',
                            background: pathname === '/' ? 'rgba(212,175,55,0.15)' : 'transparent',
                            border: pathname === '/' ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent',
                            color: pathname === '/' ? '#D4AF37' : 'rgba(240,236,224,0.7)',
                            fontSize: '14px', fontWeight: 500,
                            transition: 'all 0.2s ease',
                        }}>
                            <Home size={15} />
                            <span className="hidden-mobile">Beranda</span>
                        </div>
                    </Link>

                    <Link href="/quran" style={{ textDecoration: 'none' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '8px 14px', borderRadius: '8px',
                            background: pathname.startsWith('/quran') ? 'rgba(212,175,55,0.15)' : 'transparent',
                            border: pathname.startsWith('/quran') ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent',
                            color: pathname.startsWith('/quran') ? '#D4AF37' : 'rgba(240,236,224,0.7)',
                            fontSize: '14px', fontWeight: 500,
                            transition: 'all 0.2s ease',
                        }}>
                            <BookOpen size={15} />
                            <span className="hidden-mobile">Al-Quran</span>
                        </div>
                    </Link>

                    {/* Notification toggle */}
                    <button
                        className="notif-btn"
                        onClick={onToggleNotif}
                        title={notifEnabled ? 'Matikan notifikasi' : 'Aktifkan notifikasi'}
                    >
                        <Bell size={18} />
                        {notifEnabled && <div className="notif-dot" />}
                    </button>
                </div>
            </div>

            <style>{`
        @media (max-width: 480px) {
          .hidden-mobile { display: none; }
        }
      `}</style>
        </nav>
    );
}
