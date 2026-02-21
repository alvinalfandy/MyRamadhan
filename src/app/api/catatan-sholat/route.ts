import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId diperlukan' }, { status: 400 });

    const { data: rawData, error } = await supabaseAdmin
        .from('catatan_sholat')
        .select('*')
        .eq('user_id', userId)
        .order('tanggal', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const data = rawData?.map((item: any) => ({
        id: item.id,
        userId: item.user_id,
        tanggal: item.tanggal,
        subuh: item.subuh === 'true' || item.subuh === true,
        dzuhur: item.dzuhur === 'true' || item.dzuhur === true,
        ashar: item.ashar === 'true' || item.ashar === true,
        maghrib: item.maghrib === 'true' || item.maghrib === true,
        isya: item.isya === 'true' || item.isya === true,
        tarawih: item.tarawih === 'true' || item.tarawih === true,
        witir: item.witir === 'true' || item.witir === true
    }));

    return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { userId, tanggal, subuh, dzuhur, ashar, maghrib, isya, tarawih, witir } = body;
    if (!userId || !tanggal) return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });

    const { data: item, error } = await supabaseAdmin
        .from('catatan_sholat')
        .upsert(
            {
                user_id: userId,
                tanggal,
                subuh: subuh ? 'true' : 'belum',
                dzuhur: dzuhur ? 'true' : 'belum',
                ashar: ashar ? 'true' : 'belum',
                maghrib: maghrib ? 'true' : 'belum',
                isya: isya ? 'true' : 'belum',
                tarawih: tarawih ? 'true' : 'belum',
                witir: witir ? 'true' : 'belum',
            },
            { onConflict: 'user_id,tanggal' }
        )
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const mapped = {
        id: item.id,
        userId: item.user_id,
        tanggal: item.tanggal,
        subuh: item.subuh === 'true' || item.subuh === true,
        dzuhur: item.dzuhur === 'true' || item.dzuhur === true,
        ashar: item.ashar === 'true' || item.ashar === true,
        maghrib: item.maghrib === 'true' || item.maghrib === true,
        isya: item.isya === 'true' || item.isya === true,
        tarawih: item.tarawih === 'true' || item.tarawih === true,
        witir: item.witir === 'true' || item.witir === true
    };

    return NextResponse.json(mapped);
}
