"use client";
import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { FilePdfTwoTone, DownloadOutlined } from '@ant-design/icons';
import { List, Button, Row, Divider, Card, Typography } from 'antd';
import { CvFile } from '@/models/cv';

const FileListComponent = ({ files, onFileClick, onGenerateClick, loading }: { 
  files: CvFile[], 
  onFileClick: (name: string) => Promise<void>,
  onGenerateClick: any
  loading: boolean
}) => {

  const renderTime = (date: string) => {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    dayjs.extend(localizedFormat)
    const timeZone = dayjs.tz.guess()

    return dayjs
    .tz(date, timeZone)
    .format('MMMM D, YYYY h:mm A')
  } 
  
  return (
  <Card>
    <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography.Title level={4} style={{ margin: 0 }}>CVs</Typography.Title>
      <Button type='primary' loading={loading} onClick={() => onGenerateClick()}>Generate CV</Button>
    </div> 
    <Divider />
    <List
      itemLayout="horizontal"
      dataSource={files}
      renderItem={(item, _) => (
        <List.Item
          actions={[
            <Button 
              key="download" 
              type="primary" 
              icon={<DownloadOutlined />} 
              onClick={() => onFileClick(item.filename)} />
        ]}
        >
          <List.Item.Meta
            avatar={<FilePdfTwoTone twoToneColor="#eb2f96" />}
            title={<a download={item.filename} href={`https://cvhq-platform-production.fly.dev/cv/${item.filename}`}>{item.filename}</a>}
            description={`Created at ${renderTime(item.createdAt)}`}
          />
        </List.Item>
      )}
    />
  </Card>
  );
};

export default FileListComponent;