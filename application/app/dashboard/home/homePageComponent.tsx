"use client";
import { EditFilled, ProfileTwoTone } from '@ant-design/icons';
import { List, Button, Row, Divider } from 'antd';
import Link from 'next/link';
import { Profiles } from '@/models/cv';

const HomePageComponent = ({ profiles }: { profiles: Profiles }) => {
  
  return (
  <div>
    <Row justify='end'>
      <Link href="/setup">
        <Button type='primary'>Create Profile</Button>
      </Link>
    </Row> 
    <Divider />
    <List
      itemLayout="horizontal"
      dataSource={profiles}
      renderItem={(item, _) => (
        <List.Item
          actions={[
          <Link key="profile" href={`profile/${item.id}`}>
            <Button type="primary" icon={<EditFilled />} />
        </Link>
        ]}
        >
          <List.Item.Meta
            avatar={<ProfileTwoTone twoToneColor="#eb2f96" />}
            title={<Link href={`profile/${item.id}`}>{item.description}</Link>}
            description={`Created at ${item.createdAt}`}
          />
        </List.Item>
      )}
    />
  </div>
  );
};

export default HomePageComponent;