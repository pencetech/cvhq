'use client'
import { Auth } from '@supabase/auth-ui-react';
import Image from 'next/image';
import Logo from '@/public/CVHQblack.png';
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { Card, Space } from 'antd'
import Login from './newAuthPage';

export default function AuthPage() {
  const supabase = createClientComponentClient<Database>()

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%'
    }}>
    <Space size="large" direction="vertical" align="center">
      <Image 
            src={Logo}
            alt="CVHQ logo"
            height={18}
            fill={false}
            priority 
        />
      <Card title="Register or Sign in">
        <Login />
      </Card>
    </Space>
    </div>
    
  )
}