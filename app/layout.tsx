import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Verba | Marketing Content Automation',
  description: 'Marketing sohasidagi aktual muammolarni toping va AI orqali ssenariylar yarating.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className={`${inter.variable} font-sans antialiased text-white bg-[#0a0a0a] min-h-screen flex flex-col`}>
        <header className="w-full border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E0C16C] to-[#A58B3C] flex items-center justify-center font-bold text-black text-xl">V</div>
              <span className="font-bold text-xl tracking-tight">Verba<span className="text-[#C9A84C]">.</span></span>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-8">
          {children}
        </main>

        <footer className="w-full border-t border-white/5 py-8 mt-auto text-center text-sm text-gray-500">
          <p>© 2024 Abdusattor Ergashev. Barcha huquqlar himoyalangan.</p>
        </footer>
      </body>
    </html>
  );
}
