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
        subuh: item.subuh,
        dzuhur: item.dzuhur,
        ashar: item.ashar,
        maghrib: item.maghrib,
        isya: item.isya
    }));

    return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { userId, tanggal, subuh, dzuhur, ashar, maghrib, isya } = body;
    if (!userId || !tanggal) return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });

    const { data: item, error } = await supabaseAdmin
        .from('catatan_sholat')
        .upsert(
            {
                user_id: userId,
                tanggal,
                subuh: subuh || 'belum',
                dzuhur: dzuhur || 'belum',
                ashar: ashar || 'belum',
                maghrib: maghrib || 'belum',
                isya: isya || 'belum',
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
        subuh: item.subuh,
        dzuhur: item.dzuhur,
        ashar: item.ashar,
        maghrib: item.maghrib,
        isya: item.isya
    };

    return NextResponse.json(mapped);
}
