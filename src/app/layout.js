import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Velo Hero',
  description: 'Verspreid fietsen over Antwerpen',
  icons: {
    icon: '/logo.png', // hoofdfavicon
    shortcut: '/logo.png', // legacy ondersteuning
    apple: '/logo.png', // iOS home-screen icon
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/stations">Alle stations</Link>
          <Link href="/about">About</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
