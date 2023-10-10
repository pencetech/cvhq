'use client';
import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/pencewhiteblack.png';
import { Layout, Button, Space, Tag, Card } from 'antd';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { useRouter } from 'next/navigation';

const { Header, Content } = Layout;

const DevLayout = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
    const supabase = createClientComponentClient<Database>();
    const router = useRouter();
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    }

    const getUser = useCallback(async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) { 
            window.analytics?.identify(session.user?.id, {
                email: session.user?.email
              });
        }
      }, [supabase])

    useEffect(() => {
        getUser()
        .catch(console.error)
    })

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header style={{
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent'
            }}>
                <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', maxWidth: "1440px" }}>
                      <Image 
                          src={Logo}
                          alt="CVHQ logo"
                          height={36}
                          fill={false}
                          priority 
                      />
                    <Space>
                      <Link href="https://tally.so/r/3NDNxO" target="_blank">
                          <Button type="text" style={{ color: '#111111' }}>Feedback</Button>
                      </Link>
                      <Button type="text" style={{ color: "#111111" }} onClick={handleSignOut}>Sign out</Button>
                    </Space>
                </div>
            </Header>
            {/* <div style={{ display: 'flex', width: "100%", padding: 0, marginLeft: 'auto', marginRight: 'auto', maxWidth: "1440px" }}> */}
            <Content style={{ minHeight: 500, height: "100%", marginLeft: 'auto', marginRight: 'auto', width: "100%", maxWidth: "1440px" }}>
              {/* <Card style={{ background: '#FFFFFF', width: "100%", height: "100%", boxSizing:  'border-box' }}> */}
                {children}
                {/* </Card> */}
            </Content>
                
            {/* </div> */}
      </Layout>
    )
}

export default DevLayout;