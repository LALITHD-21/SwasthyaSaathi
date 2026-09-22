import './globals.css';
import { Inter, Noto_Sans_Devanagari } from 'next/font/google';
import { LanguageProvider } from '@/components/LanguageProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansDevanagari = Noto_Sans_Devanagari({ 
  subsets: ['devanagari'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-dev'
});

export const metadata = {
  title: 'SwasthyaSaathi',
  description: 'Voice-first health symptom triage PWA for rural India',
  manifest: '/manifest.json',
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
      <body className="bg-gradient-to-b from-sky-50 to-white min-h-screen font-sans">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
