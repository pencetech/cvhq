import './globals.css';
import type { PropsWithChildren } from 'react';
import Script from 'next/script';
import { AntdProvider } from '@/scripts/root-style-registry';
import { ApolloWrapper } from "@/lib/apollo-wrapper";


export const metadata = {
  title: 'CVHQ - A better CV builder',
  description: 'Build CVs that match job postings.',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <Script id="1">
          {`!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){if(window.analytics.initialized)return window.analytics[e].apply(window.analytics,arguments);var i=Array.prototype.slice.call(arguments);i.unshift(e);analytics.push(i);return analytics}};for(var i=0;i<analytics.methods.length;i++){var key=analytics.methods[i];analytics[key]=analytics.factory(key)}analytics.load=function(key,i){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=i};analytics._writeKey="rDEUKY755na8dUEQS69MtfxF3XBfhXVm";;analytics.SNIPPET_VERSION="4.16.1";
  analytics.load("rDEUKY755na8dUEQS69MtfxF3XBfhXVm");
  analytics.page();
  }}();`}
        </Script>
        <link
          rel="icon"
          href="/icon.png"
          type="image/png"
          sizes="128"
        />
      </head>
      <body>
        <ApolloWrapper>
          <AntdProvider>{children}</AntdProvider>
        </ApolloWrapper>
      </body>
    </html>
  )
}
