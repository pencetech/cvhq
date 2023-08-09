'use client';
import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/CVHQ.png';
import { Layout, Button, Space, Tag, Card } from 'antd';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { useRouter } from 'next/navigation';

const { Header, Content } = Layout;

const SetupLayout = ({
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
                backgroundColor: '#111111'
            }}>
                <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Space align="center">
                      <Image 
                          src={Logo}
                          alt="CVHQ logo"
                          height={18}
                          fill={false}
                          priority 
                      />
                      <Tag color="#2db7f5" style={{ color: "#111111", fontSize: "12px" }}>BETA</Tag>
                    </Space>
                    <Space>
                      <Link href="https://tally.so/r/3NDNxO" target="_blank">
                          <Button type="text" style={{ color: '#FFFFFF' }}>Feedback</Button>
                      </Link>
                      <Button type="text" style={{ color: "#FFFFFF" }} onClick={handleSignOut}>Sign out</Button>
                    </Space>
                </div>
            </Header>
            <Content style={{ padding: 0 }}>
                <Card style={{ margin: 16, background: '#FFFFFF' }}>{children}</Card>
            </Content>
      </Layout>
    )
}

export default SetupLayout;