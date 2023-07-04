'use client';
import React from 'react';
import { RightOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Logo from '@/public/CVHQ.png';
import { Layout, Button, MenuProps } from 'antd';

const { Header, Content, Footer } = Layout;

const SetupLayout = ({
    children,
  }: {
    children: React.ReactNode
  }) => {

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
                    <Button 
                        href="" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        shape='round'
                        icon={<RightOutlined />}
                    >
                        Did we land you an interview?
                    </Button>
                </div>
            </Header>
            <Content style={{ padding: 0 }}>
                <div style={{ padding: 24, minHeight: '100%', background: '#FFFFFF' }}>{children}</div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Formant ©2023</Footer>
      </Layout>
    )
}

export default SetupLayout;