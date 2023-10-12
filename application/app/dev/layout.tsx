'use client';
import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/pencewhiteblack.png';
import { Layout, Button, Space, Typography, Card, List } from 'antd';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { useRouter } from 'next/navigation';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const popularData = [
  {
    title: 'Transaction status check',
  },
  {
    title: 'Resolve refund cases',
  },
  {
    title: 'Resolve dispute cases',
  }
];


const futureData = [
  {
    title: 'Conversational',
  },
  {
    title: 'Connect your own database',
  },
  {
    title: 'Execute custom workflows',
  }
];

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
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{ backgroundColor: "#FFFFFF", zIndex: '99999999', maxHeight: '100vh' }}
        width={256}
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <Image
              src={Logo}
              alt="CVHQ logo"
              height={36}
              style={{ margin: '16px' }}
              fill={false}
              priority
            />
          <Title level={5} style={{ margin: '16px' }}>{`Upcoming Features`}</Title>
          <List
            itemLayout="horizontal"
            dataSource={futureData}
            style={{ margin: '16px' }}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  description={item.title}
                  style={{ color: "#FFFFFF" }}
                />
              </List.Item>
            )}
          />
          <Title level={5} style={{ margin: '16px' }}>{`Popular Use Cases`}</Title>
          <List
            itemLayout="horizontal"
            dataSource={popularData}
            style={{ margin: '16px' }}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  description={item.title}
                />
              </List.Item>
            )}
          />
      </Sider>
      <Layout>
        <Header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent'
        }}>
          <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'end', maxWidth: "1440px" }}>
            <Space>
              <Link href="https://tally.so/r/3NDNxO" target="_blank">
                <Button type="text" style={{ color: '#111111' }}>Feedback</Button>
              </Link>
              <Button type="text" style={{ color: "#111111" }} onClick={handleSignOut}>Sign out</Button>
            </Space>
          </div>
        </Header>
        <Content style={{ minHeight: 500, height: "100%", marginLeft: 'auto', marginRight: 'auto', width: "100%", maxWidth: "1440px" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default DevLayout;