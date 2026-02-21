import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 });
        }

        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('id, nama, username, password')
            .eq('username', username.toLowerCase())
            .single();

        if (error || !user) {
            return NextResponse.json({ error: 'Username tidak ditemukan' }, { status: 401 });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return NextResponse.json({ error: 'Password salah' }, { status: 401 });
        }

        return NextResponse.json({ id: user.id, nama: user.nama, username: user.username });
    } catch {
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}
