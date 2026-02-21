export interface Surah {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
}

export interface Ayah {
    number: number;
    text: string;
    numberInSurah: number;
}

export interface SurahDetail {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    ayahs: Ayah[];
}

export async function getAllSurah(): Promise<Surah[]> {
    const res = await fetch('https://api.alquran.cloud/v1/surah', {
        next: { revalidate: 86400 }
    });
    if (!res.ok) throw new Error('Failed to fetch surah list');
    const data = await res.json();
    return data.data;
}

export async function getSurahArabic(surahNumber: number): Promise<SurahDetail> {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`, {
        next: { revalidate: 86400 }
    });
    if (!res.ok) throw new Error('Failed to fetch surah');
    const data = await res.json();
    return data.data;
}

export async function getSurahTranslation(surahNumber: number): Promise<SurahDetail> {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/id.indonesian`, {
        next: { revalidate: 86400 }
    });
    if (!res.ok) throw new Error('Failed to fetch translation');
    const data = await res.json();
    return data.data;
}
