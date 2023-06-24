"use client";
import CvForm from '@/app/components/cvForm';
import { Typography } from 'antd';

const DashboardPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '24px' }}>
      <Typography.Title level={2}>Quick setup</Typography.Title>
      <CvForm />
    </div>
  )
}

export default DashboardPage;
