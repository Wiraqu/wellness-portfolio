import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
  title: 'VitalSync — AI Health Intelligence',
  description: 'AI-powered health risk prediction and monitoring platform',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className={inter.className}>{children}</body></html>;
}
