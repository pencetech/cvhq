"use client";
import CvForm from '@/app/components/cvForm';
import { Space, Typography } from 'antd';

const DashboardPage = () => {
  return (
    <div style={{ width: '100%' }}>
      <Typography.Title level={2}>Your CV</Typography.Title>
      <CvForm />
    </div>
  )
}

export default DashboardPage;
