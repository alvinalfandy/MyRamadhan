'use client';

import { useAuth } from '@/context/AuthContext';
import MyRamadhanLogo from '@/components/MyRamadhanLogo';
import {
    BookOpen,
    Calculator,
    Home,
    LogOut,
    MapPin,
    Moon,
    StickyNote,
    BarChart2,
    BookMarked,
    Scroll,
    Gem,
    Settings,
    LayoutDashboard, // Added
    ClipboardCheck, // Added
    CalendarCheck, // Added
    ShieldAlert, // Added
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MENU = [
    { href: '/dashboard', label: 'Beranda', shortLabel: 'Beranda', icon: Home },
    { href: '/quran', label: "Al-Qur'an", shortLabel: "Qur'an", icon: BookOpen },
    { href: '/catatan-puasa', label: 'Catatan Puasa', shortLabel: 'Puasa', icon: Moon },
    { href: '/catatan-sholat', label: 'Catatan Sholat', shortLabel: 'Sholat', icon: StickyNote },
    { href: '/zakat', label: 'Kalkulator Zakat', shortLabel: 'Zakat', icon: Calculator },
];

const EXTRA_MENU = [
    { href: '/tasbih', label: 'Tasbih Digital', icon: Gem },
    { href: '/doa', label: 'Doa Harian', icon: BookMarked },
    { href: '/hadis', label: 'Hadis Harian', icon: Scroll },
    { href: '/khatam', label: 'Target Khatam', icon: BookOpen },
    { href: '/statistik', label: 'Statistik', icon: BarChart2 },
    { href: '/masjid', label: 'Masjid Terdekat', icon: MapPin },
    { href: '/settings', label: 'Pengaturan', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    // Define MOBILE_LINKS here, inside the component to access `user`
    const MOBILE_LINKS = [
        { href: '/dashboard', label: 'Home', shortLabel: 'Beranda', icon: LayoutDashboard },
        { href: '/catatan-puasa', label: 'Puasa', shortLabel: 'Puasa', icon: ClipboardCheck },
        { href: '/catatan-sholat', label: 'Sholat', shortLabel: 'Sholat', icon: CalendarCheck },
        // If admin, show admin link as 4th icon on mobile, otherwise show masjid
        user?.role === 'admin'
            ? { href: '/admin', label: 'Admin', shortLabel: 'Admin', icon: ShieldAlert }
            : { href: '/masjid', label: 'Masjid', shortLabel: 'Masjid', icon: MapPin },
        { href: '/statistik', label: 'Stats', shortLabel: 'Statistik', icon: BarChart2 },
    ];

    return (
        <>
            {/* ─── DESKTOP SIDEBAR ─── */}
            <aside style={{
                width: '240px',
                minHeight: '100vh',
                background: 'rgba(10,14,26,0.95)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(212,175,55,0.12)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 50,
            }}
                className="sidebar-desktop"
            >
                <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <MyRamadhanLogo size={44} />
                        <div>
                            <div style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '16px', fontWeight: 700,
                                background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            }}>MyRamadhan</div>
                            <div style={{ fontSize: '10px', color: 'rgba(168,157,138,0.7)', letterSpacing: '1px' }}>1447 H</div>
                        </div>
                    </div>
                </div>

                {/* Nav Menu */}
                <nav style={{ padding: '12px 10px', flex: 1, overflowY: 'auto' }}>
                    <div style={{ marginBottom: '8px', padding: '0 10px', fontSize: '10px', letterSpacing: '2px', color: 'rgba(168,157,138,0.5)', textTransform: 'uppercase' }}>
                        Menu Utama
                    </div>
                    {MENU.map(({ href, label, icon: Icon }) => {
                        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
                        return (
                            <Link key={href} href={href} style={{ textDecoration: 'none', display: 'block', marginBottom: '2px' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '10px 12px', borderRadius: '10px',
                                    background: isActive ? 'rgba(212,175,55,0.15)' : 'transparent',
                                    border: isActive ? '1px solid rgba(212,175,55,0.25)' : '1px solid transparent',
                                    color: isActive ? '#D4AF37' : 'rgba(240,236,224,0.65)',
                                    fontSize: '14px', fontWeight: isActive ? 600 : 400,
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer',
                                }}
                                    onMouseEnter={e => {
                                        if (!isActive) {
                                            (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)';
                                            (e.currentTarget as HTMLDivElement).style.color = '#f0ece0';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!isActive) {
                                            (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                                            (e.currentTarget as HTMLDivElement).style.color = 'rgba(240,236,224,0.65)';
                                        }
                                    }}
                                >
                                    <Icon size={17} />
                                    <span>{label}</span>
                                    {isActive && (
                                        <div style={{
                                            marginLeft: 'auto', width: '5px', height: '5px',
                                            borderRadius: '50%', background: '#D4AF37',
                                        }} />
                                    )}
                                </div>
                            </Link>
                        );
                    })}

                    {/* Fitur Lainnya */}
                    <div style={{ margin: '14px 0 8px', padding: '0 10px', fontSize: '10px', letterSpacing: '2px', color: 'rgba(168,157,138,0.5)', textTransform: 'uppercase' }}>
                        Fitur Lainnya
                    </div>
                    {EXTRA_MENU.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname.startsWith(href);
                        return (
                            <Link key={href} href={href} style={{ textDecoration: 'none', display: 'block', marginBottom: '2px' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '9px 12px', borderRadius: '10px',
                                    background: isActive ? 'rgba(46,204,113,0.12)' : 'transparent',
                                    border: isActive ? '1px solid rgba(46,204,113,0.25)' : '1px solid transparent',
                                    color: isActive ? '#2ecc71' : 'rgba(240,236,224,0.55)',
                                    fontSize: '13px', fontWeight: isActive ? 600 : 400,
                                    transition: 'all 0.2s ease', cursor: 'pointer',
                                }}
                                    onMouseEnter={e => {
                                        if (!isActive) {
                                            (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)';
                                            (e.currentTarget as HTMLDivElement).style.color = '#f0ece0';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!isActive) {
                                            (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                                            (e.currentTarget as HTMLDivElement).style.color = 'rgba(240,236,224,0.55)';
                                        }
                                    }}
                                >
                                    <Icon size={15} />
                                    <span>{label}</span>
                                </div>
                            </Link>
                        );
                    })}

                    {/* Admin Menu */}
                    {user?.role === 'admin' && (
                        <>
                            <div style={{ margin: '20px 0 8px', padding: '0 10px', fontSize: '10px', letterSpacing: '2px', color: '#ff6b6b', textTransform: 'uppercase', opacity: 0.7 }}>
                                Admin Only
                            </div>
                            <Link href="/admin" style={{ textDecoration: 'none', display: 'block', marginBottom: '2px' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '9px 12px', borderRadius: '10px',
                                    background: pathname === '/admin' ? 'rgba(255,107,107,0.12)' : 'transparent',
                                    border: pathname === '/admin' ? '1px solid rgba(255,107,107,0.25)' : '1px solid transparent',
                                    color: pathname === '/admin' ? '#ff6b6b' : 'rgba(255,107,107,0.7)',
                                    fontSize: '13px', fontWeight: pathname === '/admin' ? 600 : 400,
                                    transition: 'all 0.2s ease', cursor: 'pointer',
                                }}>
                                    <ShieldAlert size={15} />
                                    <span>Dashboard Admin</span>
                                </div>
                            </Link>
                        </>
                    )}
                </nav>

                {/* User profile + logout */}
                <div style={{
                    padding: '12px 10px',
                    borderTop: '1px solid rgba(212,175,55,0.1)',
                }}>
                    {user && (
                        <>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '10px 12px', borderRadius: '10px',
                                background: 'rgba(255,255,255,0.03)',
                                marginBottom: '6px',
                            }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #D4AF37, #2ecc71)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '13px', fontWeight: 700, color: '#0a0e1a', flexShrink: 0,
                                }}>
                                    {user.nama.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#f0ece0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {user.nama}
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'rgba(168,157,138,0.7)' }}>@{user.username}</div>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    width: '100%', padding: '8px 12px', borderRadius: '8px',
                                    background: 'transparent', border: '1px solid rgba(255,107,107,0.2)',
                                    color: 'rgba(255,107,107,0.8)', fontSize: '13px',
                                    cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,107,107,0.1)';
                                    (e.currentTarget as HTMLButtonElement).style.color = '#ff6b6b';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,107,107,0.8)';
                                }}
                            >
                                <LogOut size={14} />
                                Keluar
                            </button>
                        </>
                    )}
                </div>
            </aside>

            {/* ─── MOBILE BOTTOM NAV ─── */}
            <nav style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: 'rgba(8,12,22,0.98)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderTop: '1px solid rgba(212,175,55,0.2)',
                display: 'flex', zIndex: 100,
            }}
                className="bottom-nav-mobile"
            >
                {MENU.map(({ href, label, shortLabel, icon: Icon }) => {
                    const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
                    return (
                        <Link key={href} href={href} style={{ textDecoration: 'none', flex: 1 }}>
                            <div style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                gap: '3px',
                                paddingTop: '10px',
                                paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
                                color: isActive ? '#D4AF37' : 'rgba(168,157,138,0.55)',
                                fontSize: '9px', fontWeight: isActive ? 700 : 400,
                                letterSpacing: '0.2px',
                                transition: 'color 0.2s',
                                position: 'relative',
                            }}>
                                {isActive && (
                                    <div style={{
                                        position: 'absolute', top: 0, left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '24px', height: '2px',
                                        background: '#D4AF37',
                                        borderRadius: '0 0 2px 2px',
                                    }} />
                                )}
                                <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                                <span style={{ fontSize: '9px' }}>{shortLabel}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <style>{`
        @media (min-width: 768px) {
          .bottom-nav-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .sidebar-desktop { display: none !important; }
        }
      `}</style>
        </>
    );
}
