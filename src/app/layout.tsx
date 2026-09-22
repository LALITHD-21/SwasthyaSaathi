import './globals.css';
import { Inter, Noto_Sans_Devanagari } from 'next/font/google';
import { LanguageProvider } from '@/components/LanguageProvider';
import HeaderNav from '@/components/HeaderNav';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansDevanagari = Noto_Sans_Devanagari({ 
  subsets: ['devanagari'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-dev'
});

export const metadata = {
  title: 'SwasthyaSaathi — AI Health Symptom Companion',
  description: 'Voice & camera symptom triage and affordable clinic finder for rural & Tier-2 India',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
    apple: '/logo.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SwasthyaSaathi',
  },
};

export const viewport = {
  themeColor: '#0284c7',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansDevanagari.variable} antialiased`}>
      <body className="bg-slate-50 min-h-screen font-sans bg-mesh-radial antialiased">
        <LanguageProvider>
          <div className="flex flex-col min-h-screen">
            <HeaderNav />
            <div className="flex-1">
              {children}
            </div>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
