import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyRamadhan 🌙 - Dashboard Ramadan 1447 H",
  description: "Jadwal sholat, Al-Quran, catatan puasa, catatan sholat, dan kalkulator zakat untuk Ramadan 1447 H.",
  keywords: "ramadan, jadwal sholat, al quran, imsak, buka puasa, NU, Muhammadiyah, zakat",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
