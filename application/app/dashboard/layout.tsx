"use client";
import { useState, useEffect } from 'react';
import { RightOutlined, FileTextOutlined, LoadingOutlined, HomeOutlined } from '@ant-design/icons';
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

const DashboardLayout = ({
    children
  }: {
    children: React.ReactNode
  }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const getProfileList = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      try {
        setLoading(true)
        if (session) {
          setUser(session.user?.id)

          let { data, error, status } = await supabase
            .from('cv_profile')
            .select('id, name')
            .eq('user_id', session.user?.id)
          if (error && status !== 406) {
            throw error
          }
          if (data) {
            const parsedData = data.map(obj => {
              return {
                id: obj.id,
                description: obj.name
            }})
            setProfiles(parsedData);
          }
        }
      } catch (error) {
        alert('Error loading user data!')
      } finally {
        setLoading(false)
      }
      console.log("getProfile!");
    }

    getProfileList()
    .catch(console.error);
  }, [supabase])

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

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const loadingProfileIcon = loading ? <Spin indicator={antIcon} /> : <FileTextOutlined />

  const items: MenuItem[] = [
      getItem("Home", "home", <HomeOutlined />), 
      getItem("Profiles", "profile", loadingProfileIcon, profiles.map(p => {
        return getItem(p.description, p.id)
      }))
  ]

  const handleClick: MenuProps['onClick'] = (menu: any) => {
    console.log(menu);
    const reversed = menu.keyPath.reverse();
    const basePath = "/dashboard/"
    const suffixPath = reversed.join('/');
    const completePath = basePath + suffixPath;
    router.push(completePath);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
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
        <Sider width={200} style={{ background: colorBgContainer }}>
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

export default DashboardLayout;