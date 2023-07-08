'use client';
import React from 'react';
import Image from 'next/image';
import Logo from '@/public/CVHQ.png';
import { Layout, Button, MenuProps } from 'antd';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { useRouter } from 'next/navigation';

const { Header, Content, Footer } = Layout;

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

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header style={{
                display: 'flex', 
                alignItems: 'center',
                backgroundColor: '#111111'
            }}>
                <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Image 
                        src={Logo}
                        alt="CVHQ logo"
                        height={18}
                        fill={false}
                        priority 
                    />
                    <Button type="text" style={{ color: "#FFFFFF" }} onClick={handleSignOut}>Sign out</Button>
                </div>
            </Header>
            <Content style={{ padding: 0 }}>
                <div style={{ padding: 24, height: '100%', background: '#FFFFFF' }}>{children}</div>
            </Content>
      </Layout>
    )
}

export default SetupLayout;