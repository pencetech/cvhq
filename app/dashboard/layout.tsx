'use client';
import React from 'react';
import { UserOutlined, RightOutlined } from '@ant-design/icons';
import Image from 'next/image';
import formantLogo from '@/public/formantwhite.png';
import { Layout, Menu, Space, Button, Breadcrumb } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

const DashboardLayout = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
    return (
        <Layout style={{ minHeight: "100vh" }} hasSider>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
        <Space align="center" style={{ margin: '24px' }}>
            <Image 
                src={formantLogo}
                alt="Formant logo"
                height={18}
                fill={false}
                priority 
            />
        </Space>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[UserOutlined].map(
              (icon, index) => ({
                key: `${index + 1}`,
                icon: React.createElement(icon),
                label: `Dashboard`,
              }),
            )}
          />
        </Sider>
        <Layout>
            <Header style={{
                display: 'grid', 
                alignItems: 'center',
                justifyItems: 'end',
                backgroundColor: 'white'
            }}>
                <Button 
                    href="" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    type='primary'
                    size='large'
                    icon={<RightOutlined />}
                >
                    Did we land you an interview?
                </Button>
            </Header>
            <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            </Breadcrumb>
                <div style={{ padding: 24, minHeight: '100%', background: '#FFFFFF' }}>{children}</div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Formant ©2023</Footer>
        </Layout>
      </Layout>
    )
}

export default DashboardLayout;