import './globals.css';
import type { PropsWithChildren } from 'react';
import { AntdProvider } from '@/scripts/root-style-registry';
import { ApolloWrapper } from "@/lib/apollo-wrapper";


export const metadata = {
  title: 'CVHQ - A better CV builder',
  description: 'Build CVs that match job postings.',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>
          <AntdProvider>{children}</AntdProvider>
        </ApolloWrapper>
      </body>
    </html>
  )
}
