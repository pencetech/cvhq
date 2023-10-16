'use client'
import Image from 'next/image';
import Logo from '@/public/CVHQblack.png';
import { Card, Space } from 'antd'
import Login from './newAuthPage';

export default function AuthPage() {

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
            height={36}
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