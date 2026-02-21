export type Mazhab = 'NU' | 'Muhammadiyah';

// Aladhan method: 20 = ISNA, 2 = ISNA, for Indonesian: Kemenag = 20, MUI = 11
// For NU: method 20 (or custom), Muhammadiyah uses hisab (method 20 with slight diff)
// In practice we use: Muhammadiyah → method 8 (Muhammadiyah calculation)
// NU/Pemerintah → method 20 (Ministry of Religious Affairs, Indonesia)

const METHOD_MAP: Record<Mazhab, number> = {
    NU: 20,            // Kemenag RI / NU
    Muhammadiyah: 8,   // Muhammadiyah
};

export interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    Imsak: string;
    Midnight: string;
}

export interface PrayerData {
    timings: PrayerTimes;
    date: {
        readable: string;
        hijri: {
            date: string;
            month: { number: number; en: string; ar: string };
            year: string;
            day: string;
        };
        gregorian: {
            date: string;
            month: { number: number; en: string };
            year: string;
            day: string;
        };
    };
}

export async function getPrayerTimes(city: string, country: string = 'ID', mazhab: Mazhab = 'NU'): Promise<PrayerData> {
    const method = METHOD_MAP[mazhab];
    const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${country}&method=${method}`,
        { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error('Failed to fetch prayer times');
    const data = await res.json();
    return data.data;
}

export async function getPrayerTimesByCoords(lat: number, lon: number, mazhab: Mazhab = 'NU'): Promise<PrayerData> {
    const method = METHOD_MAP[mazhab];
    const res = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=${method}`,
        { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error('Failed to fetch prayer times');
    const data = await res.json();
    return data.data;
}

// Ramadan start dates 1447 H
export const RAMADAN_START: Record<Mazhab, Date> = {
    Muhammadiyah: new Date('2026-02-18'),
    NU: new Date('2026-02-19'),
};

export function getRamadanDay(mazhab: Mazhab): number {
    const start = RAMADAN_START[mazhab];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startClean = new Date(start);
    startClean.setHours(0, 0, 0, 0);
    const diff = Math.floor((today.getTime() - startClean.getTime()) / (1000 * 60 * 60 * 24));
    return diff + 1; // 1-indexed
}
