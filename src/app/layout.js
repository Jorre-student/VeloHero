import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  )
}

export const metadata = {
  title: 'Velo Hero',
  description: 'Verspreid fietsen over Antwerpen',
  icons: {
    icon: '/logo.png', // hoofdfavicon
    shortcut: '/logo.png', // legacy ondersteuning
    apple: '/logo.png', // iOS home-screen icon
  },
};
