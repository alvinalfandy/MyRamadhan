import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId diperlukan' }, { status: 400 });

    const { data: rawData, error } = await supabaseAdmin
        .from('catatan_puasa')
        .select('*')
        .eq('user_id', userId)
        .order('tanggal', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const data = rawData?.map((item: any) => ({
        id: item.id,
        userId: item.user_id,
        tanggal: item.tanggal,
        hariKe: item.hari_ke,
        status: item.status,
        alasan: item.alasan,
        catatan: item.catatan
    }));

    return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { userId, tanggal, hariKe, status, alasan, catatan } = body;
    if (!userId || !tanggal) return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });

    // Upsert: update jika sudah ada, insert jika belum
    const { data: item, error } = await supabaseAdmin
        .from('catatan_puasa')
        .upsert(
            {
                user_id: userId,
                tanggal,
                hari_ke: hariKe,
                status: status || 'belum',
                alasan: alasan || '',
                catatan: catatan || '',
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
        hariKe: item.hari_ke,
        status: item.status,
        alasan: item.alasan,
        catatan: item.catatan
    };

    return NextResponse.json(mapped);
}
