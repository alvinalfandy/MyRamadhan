import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { nama, username, password } = await req.json();

        if (!nama || !username || !password) {
            return NextResponse.json({ error: 'Semua kolom wajib diisi' }, { status: 400 });
        }
        if (password.length < 6) {
            return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 });
        }

        // Check username already taken
        const { data: existing } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('username', username.toLowerCase())
            .maybeSingle();

        if (existing) {
            return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 400 });
        }

        const hashed = await bcrypt.hash(password, 10);

        const { data: user, error } = await supabaseAdmin
            .from('users')
            .insert({ nama, username: username.toLowerCase(), password: hashed })
            .select('id, nama, username')
            .single();

        if (error || !user) {
            return NextResponse.json({ error: 'Gagal membuat akun' }, { status: 500 });
        }

        return NextResponse.json({ id: user.id, nama: user.nama, username: user.username });
    } catch {
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}
