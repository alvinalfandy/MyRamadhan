'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface UserSession {
    id: string;
    nama: string;
    username: string;
}

interface AuthContextType {
    user: UserSession | null;
    login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
    register: (nama: string, username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => ({ ok: false }),
    register: async () => ({ ok: false }),
    logout: () => { },
    loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserSession | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('ramadan-user');
        if (saved) {
            try {
                setUser(JSON.parse(saved));
            } catch { }
        }
        setLoading(false);
    }, []);

    const login = useCallback(async (username: string, password: string) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (!res.ok) return { ok: false, error: data.error || 'Login gagal' };
            const session: UserSession = { id: data.id, nama: data.nama, username: data.username };
            setUser(session);
            localStorage.setItem('ramadan-user', JSON.stringify(session));
            return { ok: true };
        } catch {
            return { ok: false, error: 'Terjadi kesalahan jaringan' };
        }
    }, []);

    const register = useCallback(async (nama: string, username: string, password: string) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nama, username, password }),
            });
            const data = await res.json();
            if (!res.ok) return { ok: false, error: data.error || 'Registrasi gagal' };
            const session: UserSession = { id: data.id, nama: data.nama, username: data.username };
            setUser(session);
            localStorage.setItem('ramadan-user', JSON.stringify(session));
            return { ok: true };
        } catch {
            return { ok: false, error: 'Terjadi kesalahan jaringan' };
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('ramadan-user');
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
