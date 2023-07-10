"use client";
import { useState, useEffect } from 'react';
import { FileTextOutlined, LoadingOutlined, HomeOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Logo from '@/public/CVHQ.png';
import Breadcrumbs from '../components/breadcrumbs';
import type { MenuProps } from 'antd';
import { Layout, Menu, Button, theme, Spin } from 'antd';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { usePathname, useRouter } from 'next/navigation';

const { Header, Content, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

type ProfileData = {
  id: number,
  description: string
}

export const revalidate = 0;

const DashboardLayoutComponent = ({
    user, profiles, children
  }: {
    user: string,
    profiles: ProfileData[],
    children: React.ReactNode
  }) => {
  const supabase = createClientComponentClient<Database>();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const pathname = usePathname();
  const router = useRouter();

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  }

  const loadingProfileIcon = <FileTextOutlined />

  const items: MenuItem[] = [
      getItem("Home", "home", <HomeOutlined />), 
      getItem("CVs", "cv", loadingProfileIcon, profiles.map(p => {
        return getItem(p.description, p.id)
      }))
  ]

  const handleClick: MenuProps['onClick'] = (menu: any) => {
    const reversed = menu.keyPath.reverse();
    const basePath = "/dashboard/"
    const suffixPath = reversed.join('/');
    const completePath = basePath + suffixPath;
    router.push(completePath);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  }

  const selectedKeys = () => {
    const asPathNoQuery = pathname.split("?")[0];
    const asPathNestedRoutes = asPathNoQuery
        .split("/")
        .filter(v => v.length > 0);
    
    let crumbList = asPathNestedRoutes.map((subpath, idx) => {
        // We can get the partial nested route for the crumb
        // by joining together the path parts up to this point.
        const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
        // The title will just be the route string for now
        const title = subpath.charAt(0) + subpath.slice(1);
        return { href, title }; 
    });

    // TODO: delete this once routing is fixed
    crumbList = crumbList.slice(1);

    return crumbList.map(crumb => { return crumb.title; }).reverse()
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
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
      <Layout hasSider>
        <Sider width={256} style={{ background: colorBgContainer }}>
          <Menu
            onClick={handleClick}
            mode="inline"
            defaultSelectedKeys={['home']}
            selectedKeys={selectedKeys()}
            style={{ height: '100%', borderRight: 0 }}
            items={items}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumbs />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DashboardLayoutComponent;