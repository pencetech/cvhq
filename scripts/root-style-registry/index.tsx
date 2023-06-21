// located at src/modules/shared/components/root-style-registry/index.tsx in my case

'use client'
import { useState, type PropsWithChildren } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { ConfigProvider } from 'antd';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';

const font = Plus_Jakarta_Sans({ subsets: ["cyrillic-ext"] });

export const RootStyleRegistry = ({ children }: PropsWithChildren) => {
  const [cache] = useState(() => createCache())

  useServerInsertedHTML(() => {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `</script>${extractStyle(cache)}<script>`,
        }}
      />
    )
  })

  return <StyleProvider hashPriority='high' cache={cache}>{children}</StyleProvider>
}

export const AntdProvider = ({ children }: PropsWithChildren) => {
    return (
        <ConfigProvider
          theme={{
            token: {
                fontFamily: font.style.fontFamily,
            },
          }}
        >
          <RootStyleRegistry>{children}</RootStyleRegistry>
        </ConfigProvider>
    )
}