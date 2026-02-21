import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, nama, currentPassword, newPassword } = body;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Fetch current user data
        const { data: user, error: fetchError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (fetchError || !user) {
            return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
        }

        const updates: any = {};

        // 2. Handle Name Update
        if (nama && nama !== user.nama) {
            updates.nama = nama;
        }

        // 3. Handle Password Update
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json({ error: 'Password saat ini diperlukan' }, { status: 400 });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return NextResponse.json({ error: 'Password saat ini salah' }, { status: 401 });
            }

            const hashed = await bcrypt.hash(newPassword, 10);
            updates.password = hashed;
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ message: 'Tidak ada perubahan' });
        }

        // 4. Update Database
        const { data: updatedUser, error: updateError } = await supabaseAdmin
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select('id, nama, username, role')
            .single();

        if (updateError) {
            return NextResponse.json({ error: 'Gagal memperbarui profil' }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Profil diperbarui',
            user: updatedUser
        });

    } catch (err) {
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}
