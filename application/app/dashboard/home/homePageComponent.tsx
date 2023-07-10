"use client";
import { useState, useEffect } from 'react';
import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { EditFilled, PlusCircleOutlined, ProfileTwoTone } from '@ant-design/icons';
import { List, Button, Divider, Modal, message, Typography } from 'antd';
import Link from 'next/link';
import { ProfileName, Profiles } from '@/models/cv';
import ProfileNameForm from '@/app/components/profileNameForm';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { useRouter } from 'next/navigation';

const HomePageComponent = ({ profiles }: { profiles: Profiles }) => {
  const supabase = createClientComponentClient<Database>();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<string>();

  useEffect(() => {
    const getUser = async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        setUser(session?.user.id);
    }

    getUser();
  }, [supabase.auth])

  const handleAddPosting = () => {
    setIsOpen(true);
  }

  const handleCreate = async (value: ProfileName) => {
    const prevId = await getPrevProfile();
    await setProfile(value);
    const currId = await getCurrProfile(value);
    console.log("prevId: ", prevId);
    console.log("currId: ", currId);
    if (prevId && currId) {
      await buildNewProfile(prevId, currId);
    }
    if (currId) {

      router.push(`/dashboard/job/${currId}`);
    }
  }

  const setProfile = async (value: ProfileName) => {
    if (user) {
      const { error } = await supabase.from('cv_profile')
      .insert({
          user_id: user,
          name: value.profileName
      })

      if (error) {
        if (error.code === "23505") {
          messageApi.error("Job posting nickname exists. Please use another nickname.");
        } else {
          messageApi.error("An error occured.");
        }
      }
    }
    
  }

  const getPrevProfile = async () => {
      const { data, error } = await supabase.from('cv_profile')
      .select('id').eq('user_id', user).order('inserted_at', { ascending: true })

      if (error) {
        messageApi.error('An error occured.')
      }
      if (data) {
        return data[0].id;
      }
    messageApi.error('An error occured.')
  }

  const getCurrProfile = async (profileName: ProfileName) => {
    const { data, error } = await supabase.from('cv_profile')
    .select('id').eq('user_id', user).eq('name', profileName.profileName)

    if (error) {
      messageApi.error('An error occured.')
    }
    if (data) {
      return data[0].id;
    }
    messageApi.error('An error occured.')
  }

  const buildNewProfile = async (prevId: number, currId: number) => {
    if (user) {
      const { data, error, status } = await supabase
      .rpc('migrate_new_profile_data', {
        user_id_input: user,
        prev_profile_id_input: prevId,
        curr_profile_id_input: currId
      })

      if (error && status !== 406) {
        throw error
      }
    }
  }

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
  <div>
    {contextHolder}
    <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Home</Typography.Title>
        <Button type='primary' icon={<PlusCircleOutlined />} onClick={handleAddPosting}>Add Job Posting</Button>
    </div>
    <Divider />
    <List
      itemLayout="horizontal"
      dataSource={profiles}
      renderItem={(item, _) => (
        <List.Item
          actions={[
          <Link key="profile" href={`/dashboard/job/${item.id}`}>
            <Button type="primary" icon={<EditFilled />} />
        </Link>
        ]}
        >
          <List.Item.Meta
            avatar={<ProfileTwoTone twoToneColor="#eb2f96" />}
            title={<Link href={`/dashboard/job/${item.id}`}>{item.description}</Link>}
            description={`Created at ${renderTime(item.createdAt)}`}
          />
        </List.Item>
      )}
    />
    <Modal 
        title="Create new job posting"
        open={isOpen}
        footer={null}
        onCancel={e => setIsOpen(false)}
        closable
      >
        <ProfileNameForm message="To get started, let's add a nickname to your job posting." onSubmit={handleCreate}/>
      </Modal>
  </div>
  );
};

export default HomePageComponent;