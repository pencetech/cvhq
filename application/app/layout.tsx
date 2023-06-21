import './globals.css';
import type { PropsWithChildren } from 'react';
import { AntdProvider } from '@/scripts/root-style-registry';

export const metadata = {
  title: 'CVHQ - Job-specific CV builder',
  description: 'Build CVs that match job postings.',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <AntdProvider>{children}</AntdProvider>
      </body>
    </html>
  )
}
