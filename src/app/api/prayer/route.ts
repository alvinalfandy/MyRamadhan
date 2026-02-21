import { getPrayerTimes, getPrayerTimesByCoords, Mazhab } from '@/lib/prayerApi';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const mazhab = (searchParams.get('mazhab') || 'NU') as Mazhab;
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const city = searchParams.get('city') || 'Jakarta';

    try {
        let data;
        if (lat && lon) {
            data = await getPrayerTimesByCoords(parseFloat(lat), parseFloat(lon), mazhab);
        } else {
            data = await getPrayerTimes(city, 'ID', mazhab);
        }
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch prayer times' }, { status: 500 });
    }
}
