'use client';

import CountdownTimer from '@/components/CountdownTimer';
import DashboardLayout from '@/components/DashboardLayout';
import LocationPicker from '@/components/LocationPicker';
import MazhabSelector from '@/components/MazhabSelector';
import PrayerCard from '@/components/PrayerCard';
import RamadanCounter from '@/components/RamadanCounter';
import { useAuth } from '@/context/AuthContext';
import { Mazhab, PrayerData } from '@/lib/prayerApi';
import { useCallback, useEffect, useState } from 'react';

export default function Home() {
  const { user } = useAuth();
  const [mazhab, setMazhab] = useState<Mazhab>('NU');
  const [city, setCity] = useState('Jakarta');
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchPrayer = useCallback(async (c: string, m: Mazhab) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/prayer?city=${encodeURIComponent(c)}&mazhab=${m}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setPrayerData(json);
    } catch {
      setError('Gagal memuat jadwal. Coba kota lain.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('ramadan-prefs');
    if (saved) {
      const prefs = JSON.parse(saved);
      setCity(prefs.city || 'Jakarta');
      setMazhab(prefs.mazhab || 'NU');
      fetchPrayer(prefs.city || 'Jakarta', prefs.mazhab || 'NU');
    } else {
      fetchPrayer('Jakarta', 'NU');
    }
  }, [fetchPrayer]);

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    localStorage.setItem('ramadan-prefs', JSON.stringify({ city: newCity, mazhab }));
    fetchPrayer(newCity, mazhab);
    showToast(`📍 Kota diganti ke ${newCity}`);
  };

  const handleMazhabChange = (newMazhab: Mazhab) => {
    setMazhab(newMazhab);
    localStorage.setItem('ramadan-prefs', JSON.stringify({ city, mazhab: newMazhab }));
    fetchPrayer(city, newMazhab);
    showToast(`✅ Mazhab ${newMazhab} dipilih`);
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) { showToast('❌ GPS tidak didukung'); return; }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const geo = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`);
          const geoData = await geo.json();
          const detectedCity = geoData.city || geoData.locality || 'Jakarta';
          setCity(detectedCity);
          localStorage.setItem('ramadan-prefs', JSON.stringify({ city: detectedCity, mazhab }));
          const res = await fetch(`/api/prayer?lat=${latitude}&lon=${longitude}&mazhab=${mazhab}`);
          setPrayerData(await res.json());
          showToast(`📍 Lokasi: ${detectedCity}`);
        } catch { showToast('❌ Gagal mendapat lokasi'); }
        finally { setGpsLoading(false); }
      },
      () => { showToast('❌ Akses GPS ditolak'); setGpsLoading(false); }
    );
  };

  const handleToggleNotif = async () => {
    if (!('Notification' in window)) { showToast('❌ Notifikasi tidak didukung'); return; }
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      setNotifEnabled(true);
      showToast('🔔 Notifikasi waktu sholat aktif!');
      new Notification('MyRamadhan 🌙', { body: `Notifikasi sholat ${city} (${mazhab}) aktif` });
    }
  };

  const hijriDate = prayerData
    ? `${prayerData.date.hijri.day} ${prayerData.date.hijri.month.en} ${prayerData.date.hijri.year} H`
    : undefined;

  return (
    <DashboardLayout>
      {/* Greeting */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{ fontFamily: "'Amiri', serif", fontSize: '1.4rem', color: 'var(--gold)', direction: 'rtl', marginBottom: '4px' }}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Selamat datang, {user?.nama} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          🌙 Ramadan 1447 H — Semoga ibadahmu diterima Allah SWT
        </p>
      </div>

      {/* Controls */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <LocationPicker city={city} onCityChange={handleCityChange} onUseGPS={handleUseGPS} gpsLoading={gpsLoading} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <MazhabSelector mazhab={mazhab} onChange={handleMazhabChange} />
            <button
              onClick={handleToggleNotif}
              style={{
                padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                background: notifEnabled ? 'rgba(46,204,113,0.15)' : 'rgba(212,175,55,0.1)',
                border: `1px solid ${notifEnabled ? 'rgba(46,204,113,0.3)' : 'rgba(212,175,55,0.2)'}`,
                color: notifEnabled ? 'var(--green)' : 'var(--gold)', cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {notifEnabled ? '🔔 Notifikasi Aktif' : '🔕 Aktifkan Notifikasi'}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gap: '16px' }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '160px', borderRadius: '16px' }} />)}
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '32px', background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)', borderRadius: '16px', color: '#ff6b6b' }}>
          ⚠️ {error}
          <br /><button className="btn-outline" style={{ marginTop: '12px' }} onClick={() => fetchPrayer(city, mazhab)}>Coba Lagi</button>
        </div>
      ) : prayerData ? (
        <div style={{ display: 'grid', gap: '16px', minWidth: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '16px', minWidth: 0 }}>
            <RamadanCounter mazhab={mazhab} hijriDate={hijriDate} />
            <CountdownTimer timings={prayerData.timings} isRamadan={true} />
          </div>
          <PrayerCard timings={prayerData.timings} />

          {/* Info bar */}
          <div className="glass-card" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                📅 <strong style={{ color: 'var(--text-primary)' }}>{prayerData.date.readable}</strong>
                {' • '}
                <span style={{ color: 'var(--gold)' }}>{hijriDate}</span>
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>
                📍 <strong style={{ color: 'var(--text-primary)' }}>{city}</strong>
                {' • '}
                <span style={{ color: mazhab === 'NU' ? 'var(--green)' : 'var(--gold)' }}>
                  {mazhab === 'NU' ? '🕌 NU' : '☪️ Muhammadiyah'}
                </span>
              </span>
            </div>
          </div>

          {/* Quick links — 2-col grid, 8 features */}
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '10px', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Fitur & Menu
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', minWidth: 0 }}>
              {[
                { href: '/quran', icon: '📖', label: "Al-Qur'an", sub: '114 Surah', color: '#D4AF37' },
                { href: '/catatan-puasa', icon: '🌙', label: 'Catatan Puasa', sub: 'Tracker harian', color: '#2ecc71' },
                { href: '/catatan-sholat', icon: '🙏', label: 'Catatan Sholat', sub: '5 Waktu', color: '#a29bfe' },
                { href: '/zakat', icon: '💰', label: 'Kalkulator Zakat', sub: 'Fitrah & Maal', color: '#fdcb6e' },
                { href: '/tasbih', icon: '📿', label: 'Tasbih Digital', sub: 'Dzikir & Tasbih', color: '#fd79a8' },
                { href: '/doa', icon: '🤲', label: 'Doa Harian', sub: 'Doa & Bacaan', color: '#00cec9' },
                { href: '/hadis', icon: '📚', label: 'Hadis Harian', sub: 'Sabda Nabi SAW', color: '#55efc4' },
                { href: '/khatam', icon: '✅', label: 'Target Khatam', sub: 'Tracker 30 Juz', color: '#74b9ff' },
                { href: '/statistik', icon: '📊', label: 'Statistik', sub: 'Progress Ramadan', color: '#e17055' },
                { href: '/masjid', icon: '🕌', label: 'Masjid Terdekat', sub: 'GPS & Pencarian', color: '#b2bec3' },
              ].map(item => (
                <a key={item.href} href={item.href} style={{ textDecoration: 'none', minWidth: 0 }}>
                  <div className="glass-card" style={{
                    padding: '12px 10px', textAlign: 'center', cursor: 'pointer', height: '100%',
                    borderColor: `${item.color}25`,
                    transition: 'border-color 0.2s',
                  }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{item.icon}</div>
                    <div style={{ fontWeight: 600, fontSize: '11px', color: 'var(--text-primary)', lineHeight: 1.3 }}>{item.label}</div>
                    <div style={{ fontSize: '10px', color: item.color, marginTop: '2px', opacity: 0.8 }}>{item.sub}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      ) : null}

      {toast && <div className="toast">{toast}</div>}
    </DashboardLayout>
  );
}
