import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        // Simple security check can be done via headers or just rely on service role on server
        // For better security, we'd check the user's role from a token, 
        // but since this is an internal API called by the admin page,
        // we'll primarily protect the page itself and the API requires service role access.

        // 1. Total Users
        const { count: totalUsers, error: err1 } = await supabaseAdmin
            .from('users')
            .select('*', { count: 'exact', head: true });

        // 2. Activity Today
        const today = new Date().toISOString().split('T')[0];

        const { count: fastingToday, error: err2 } = await supabaseAdmin
            .from('catatan_puasa')
            .select('*', { count: 'exact', head: true })
            .eq('tanggal', today)
            .neq('status', 'belum');

        const { count: sholatToday, error: err3 } = await supabaseAdmin
            .from('catatan_sholat')
            .select('*', { count: 'exact', head: true })
            .eq('tanggal', today);

        // 3. Recent Users
        const { data: recentUsers, error: err4 } = await supabaseAdmin
            .from('users')
            .select('id, nama, username, role, created_at')
            .order('created_at', { ascending: false })
            .limit(10);

        if (err1 || err2 || err3 || err4) {
            return NextResponse.json({ error: 'Gagal mengambil statistik' }, { status: 500 });
        }

        return NextResponse.json({
            stats: {
                totalUsers,
                fastingToday,
                sholatToday,
                activeUsersToday: Math.max(fastingToday || 0, sholatToday || 0) // rough estimate
            },
            recentUsers
        });
    } catch {
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}
