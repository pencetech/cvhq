"use client";
import { useState } from 'react';
import { FilePdfTwoTone, DownloadOutlined } from '@ant-design/icons';
import { List, Button, Row, Divider, Card } from 'antd';
import { CvFile } from '@/models/cv';

const FileListComponent = ({ files, onFileClick, onGenerateClick, loading }: { 
  files: CvFile[], 
  onFileClick: (name: string) => Promise<void>,
  onGenerateClick: any
  loading: boolean
}) => {
  
  return (
  <Card>
    <Row justify='end'>
      <Button type='primary' loading={loading} onClick={() => onGenerateClick()}>Generate CV</Button>
    </Row> 
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
            description={`Created at ${item.createdAt}`}
          />
        </List.Item>
      )}
    />
  </Card>
  );
};

export default FileListComponent;