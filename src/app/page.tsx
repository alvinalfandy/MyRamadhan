'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  Moon,
  BookOpen,
  Gem,
  Activity,
  ArrowRight,
  CheckCircle2,
  Globe,
  Smartphone,
  Layout,
  ShieldCheck,
  Users
} from 'lucide-react';
import MyRamadhanLogo from '@/components/MyRamadhanLogo';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0e1a' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ background: '#0a0e1a', color: 'white', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 100,
        background: 'rgba(10, 14, 26, 0.7)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
        padding: '16px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MyRamadhanLogo size={40} />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: 'var(--gold)' }}>MyRamadhan</span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/login" style={{ textDecoration: 'none', color: 'white', fontSize: '14px', fontWeight: 600, padding: '10px 20px' }}>Masuk</Link>
            <Link href="/register" style={{
              textDecoration: 'none', background: 'var(--gold)', color: '#0a0e1a',
              fontSize: '14px', fontWeight: 700, padding: '10px 24px', borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
            }}>Daftar Sekarang</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{
        padding: '160px 24px 80px', textAlign: 'center',
        background: 'radial-gradient(circle at 50% -20%, rgba(212, 175, 55, 0.15), transparent 70%)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="animate-float" style={{ marginBottom: '24px', display: 'inline-block' }}>
            <div style={{
              padding: '8px 20px', borderRadius: '30px', background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.2)', color: 'var(--gold)', fontSize: '12px', fontWeight: 700, letterSpacing: '2px'
            }}>
              RAMADAN 1447 H • PREMIUM COMPANION
            </div>
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            lineHeight: 1.1, marginBottom: '24px'
          }} className="text-gradient-gold">
            Sempurnakan Ibadah Ramadan Anda
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(1rem, 3vw, 1.25rem)', lineHeight: 1.6, marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Satu aplikasi modern untuk memantau jadwal sholat, mencatat puasa, membaca Al-Quran, dan statistik ibadah harian Anda.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" style={{
              textDecoration: 'none', background: 'var(--gold)', color: '#0a0e1a',
              fontSize: '1rem', fontWeight: 700, padding: '16px 40px', borderRadius: '14px',
              display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 25px rgba(212, 175, 55, 0.4)'
            }}>
              Mulai Perjalanan <ArrowRight size={20} />
            </Link>
            <Link href="/login" style={{
              textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'white',
              fontSize: '1rem', fontWeight: 600, padding: '16px 40px', borderRadius: '14px',
              background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)'
            }}>
              Masuk Kembali
            </Link>
          </div>
        </div>
      </header>

      {/* Features Bento Grid */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', marginBottom: '16px' }}>Fitur Unggulan</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Didesain khusus untuk kemudahan dan kenyamanan ibadah Anda.</p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px', gridAutoRows: 'minmax(200px, auto)'
        }}>
          {/* Big Card */}
          <div className="glass-card" style={{
            gridColumn: 'span 2', padding: '40px', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', gap: '20px', background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(46,204,113,0.05))',
            border: '1px solid rgba(212, 175, 55, 0.2)'
          }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0e1a' }}>
              <Moon size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '12px', fontFamily: "'Playfair Display', serif" }}>Smart Imsakiyah & Sholat</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>Jadwal otomatis berdasarkan lokasi GPS Anda. Lengkap dengan hitung mundur waktu berbuka dan imsak yang akurat.</p>
            </div>
          </div>

          {/* Smaller Cards */}
          {[
            { icon: BookOpen, title: "Al-Qur'an Digital", desc: "Membaca Al-Quran 30 Juz lengkap dengan terjemahan Bahasa Indonesia yang nyaman di mata.", color: '#2ecc71' },
            { icon: Gem, title: "Tasbih & Dzikir", desc: "Counter tasbih digital dengan haptic feedback untuk menemani dzikir pagi dan petang.", color: '#d4af37' },
            { icon: Activity, title: "Statistik Ibadah", desc: "Pantau perkembangan puasa dan sholat Anda selama sebulan penuh dengan grafik menarik.", color: '#a29bfe' },
            { icon: Globe, title: "Cari Masjid", desc: "Temukan lokasi masjid terdekat di manapun Anda berada langsung dari aplikasi.", color: '#00cec9' },
          ].map((f, i) => (
            <div key={i} className="glass-card" style={{ padding: '30px', transition: 'transform 0.3s' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: `${f.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, marginBottom: '20px' }}>
                <f.icon size={24} />
              </div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>{f.title}</h4>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Comparison / Why Us */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', marginBottom: '8px' }}>Modern, Ringan,</h2>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', marginBottom: '24px' }}>& Tanpa Iklan.</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { icon: Smartphone, t: "Mobile First Design", d: "Tampilan sempurna di iPhone & Android." },
                { icon: Layout, t: "Antarmuka Premium", d: "Desain Dark Mode yang elegan dan fokus." },
                { icon: ShieldCheck, t: "Keamanan Data", d: "Data Anda tersimpan aman dan terenkripsi." },
                { icon: Activity, t: "Pantau Progress", d: "Statistik lengkap untuk memantau ibadah harian Anda." },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ color: 'var(--gold)' }}><item.icon size={24} /></div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: '4px' }}>{item.t}</div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>{item.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{
              padding: '40px', borderRadius: '24px', background: 'rgba(212, 175, 55, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.1)', position: 'relative', zIndex: 1
            }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: 'var(--gold)', marginBottom: '20px' }}>Join the community</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  "Gratis selamanya",
                  "Update berkala",
                  "Support komunitas",
                  "Bebas spam & iklan"
                ].map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                    <CheckCircle2 size={16} color="#2ecc71" /> {t}
                  </div>
                ))}
              </div>
            </div>
            <div style={{
              position: 'absolute', top: '20px', left: '20px', right: '-20px', bottom: '-20px',
              background: 'var(--gold)', borderRadius: '24px', opacity: 0.05, zIndex: 0
            }}></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '80px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <MyRamadhanLogo size={60} />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' }}>MyRamadhan</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Made with ❤️ by <a href="https://github.com/alvinalfandy/" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>Alvin Alfandy</a></p>
          <div style={{ display: 'flex', gap: '24px', marginTop: '20px' }}>
            <Link href="/login" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px' }}>Login</Link>
            <Link href="/register" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px' }}>Register</Link>
            <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px' }}>Privacy Policy</a>
          </div>
        </div>
      </footer>

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
    </div>
  );
}
