import './globals.css';
import { Inter } from 'next/font/google';
import { RootStyleRegistry } from '@/scripts/root-style-registry';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Formant - Job-specific CV builder',
  description: 'Build CVs that match job postings.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootStyleRegistry>{children}</RootStyleRegistry>
      </body>
    </html>
  )
}
