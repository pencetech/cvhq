"use client";
import { FileTextOutlined, HomeOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/CVHQ.png';
import Breadcrumbs from '../components/breadcrumbs';
import type { MenuProps } from 'antd';
import { Layout, Menu, Button, theme, Tag, Space, Alert } from 'antd';
import { User, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const { Header, Content, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

type ProfileData = {
  id: number,
  description: string
}

const DISCLAIMER_TEXT = "CVHQ is currently in beta. If you experience any usability issues, please leave some feedback. Thanks for visiting!";

export const revalidate = 0;

const DashboardLayoutComponent = ({
    user, profiles, children
  }: {
    user: User | null
    profiles: ProfileData[],
    children: React.ReactNode
  }) => {
  const supabase = createClientComponentClient<Database>();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      window.analytics?.identify(user?.id, {
        email: user?.email
      });
    }
  }, [user])

  const getProfiles = async () => {
    let { data, error, status } = await supabase
    .from('cv_profile')
    .select('id, name')
    .eq('user_id', user?.id)
    .order('inserted_at', { ascending: false })
    if (error && status !== 406) {
        throw error
    }
        
    return data?.map(obj => {
        return {
        id: obj.id,
        description: obj.name
    }})
  };

  const { data: profileData } = useQuery({
    queryKey: ['profile-list'],
    queryFn: getProfiles,
    initialData: profiles
  })

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
      getItem("CVs", "cv", loadingProfileIcon, profileData?.map(p => {
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
      <Alert message={DISCLAIMER_TEXT} banner action={
        <Link href="https://tally.so/r/3NDNxO" target="_blank">
          <Button type="text">Give feedback</Button>
        </Link>
      }/>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
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