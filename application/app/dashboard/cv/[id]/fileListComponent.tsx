"use client";
import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { FilePdfTwoTone, DownloadOutlined } from '@ant-design/icons';
import { List, Button, Divider, Card, Typography, theme, Space } from 'antd';
import { CvFile } from '@/models/cv';
import { usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { useState, useEffect } from 'react';

const { useToken } = theme;

const FileListComponent = ({ files, onFileClick, profileName, profileId }: { 
  files: CvFile[], 
  onFileClick: (name: string) => Promise<void>,
  profileName: string,
  profileId: number
}) => {
  const pathName = usePathname();
  const { token } = useToken();
  const [user, setUser] = useState('');
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user?.id)
      }
    }

    getUser();
  }, [])

  const renderTime = (date: string) => {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    dayjs.extend(localizedFormat)
    const timeZone = dayjs.tz.guess()

    return dayjs
    .tz(date, timeZone)
    .format('MMMM D, YYYY h:mm A')
  } 

  const handleMetricClick = () => {
    const currPathNoQuery = pathName.split("?")[0];
        const currPath = currPathNoQuery
            .split("/")
            .filter(v => v.length > 0);
        const currPage = currPath[currPath.length-1];
        window.analytics?.track("Download CV", {
            title: `Downloaded CV in ${currPage}`,
            userId: user,
            profileId: profileId,
            current_path: currPath
        })
  }
  
  return (
    <div style={{ width: '100%' }}>
      <Typography.Paragraph style={{ marginTop: "12px", color: token.colorTextSecondary }}>Make sure you&apos;ve saved all tabs before generating new CV file.</Typography.Paragraph>
        <Divider />
      <List
        itemLayout="horizontal"
        dataSource={files}
        renderItem={(item, _) => (
          <List.Item
            actions={[
              <DownloadOutlined key="download" style={{color: token.colorInfo }} onClick={() => onFileClick(item.filename)} />
          ]}
          >
            <List.Item.Meta
              avatar={<FilePdfTwoTone twoToneColor="#eb2f96" />}
              title={<a onClick={() => handleMetricClick()} download={item.filename} href={`${process.env.NEXT_PUBLIC_SERVER}/cv/${item.filename}`}>{item.filename}</a>}
              description={`Created at ${renderTime(item.createdAt)}`}
            />
          </List.Item>
        )}
      />
    </div>
    
  );
};

export default FileListComponent;