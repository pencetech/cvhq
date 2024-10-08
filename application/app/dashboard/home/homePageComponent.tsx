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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Database } from '@/types/supabase';
import { useRouter } from 'next/navigation';

const HomePageComponent = ({ profiles }: { profiles: Profiles }) => {
  const supabase = createClientComponentClient<Database>();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
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
  
  const getProfiles = async () => {
    let { data, error, status } = await supabase
    .from('cv_profile')
    .select('id, name, inserted_at')
    .eq('user_id', user ? user : '')
    .order('inserted_at', { ascending: false })

    if (error && status !== 406) {
      throw error
    }

    return data?.map((obj: any) => {
      return {
        id: obj.profile_id,
        description: obj.profile_name,
        createdAt: obj.inserted_at
      }}) as Profiles
  }; 

  const { data: profileData } = useQuery({
    queryKey: ['profile-list', 'complete'],
    queryFn: getProfiles,
    initialData: profiles
  })

  const handleAddPosting = () => {
    setIsOpen(true);
  }

  const handleCreate = async (value: ProfileName) => {
    await setProfile(value);
    const currId = await getCurrProfile(value);
    if (currId) {
      await buildNewProfile(profileData[0].id, currId);
    }
    if (currId) {

      router.push(`/dashboard/cv/${currId}`);
    }
  }

  const setProfile = async (value: ProfileName) => {
    const conflicts = profileData.filter(p => p.description === value.profileName)
    if (conflicts.length > 0) {
      messageApi.error("Job posting nickname exists. Please use another nickname.");
      return;
    }
    
    if (user) {
      const { error } = await supabase.from('cv_profile')
      .insert({
          user_id: user,
          name: value.profileName
      })

      if (error) {
        if (error.code === "23505") {
          messageApi.error("Job posting nickname exists. Please use another nickname.");
          return;
        } else {
          messageApi.error("An error occured.");
          return;
        }
      }
    }
  }

  const getCurrProfile = async (profileName: ProfileName) => {
    const { data, error } = await supabase.from('cv_profile')
    .select('id').eq('user_id', user ? user : '').eq('name', profileName.profileName)

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
    queryClient.invalidateQueries({ queryKey: ['profile-list']})
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
        <Button type='primary' icon={<PlusCircleOutlined />} onClick={handleAddPosting}>Create new CV</Button>
    </div>
    <Divider />
    <List
      itemLayout="horizontal"
      dataSource={profileData}
      renderItem={(item, _) => (
        <List.Item
          actions={[
          <Link key="profile" href={`/dashboard/cv/${item.id}`}>
            <Button type="primary" icon={<EditFilled />} />
        </Link>
        ]}
        >
          <List.Item.Meta
            avatar={<ProfileTwoTone twoToneColor="#eb2f96" />}
            title={<Link href={`/dashboard/cv/${item.id}`}>{item.description}</Link>}
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
        <ProfileNameForm message={
          <p style={{ margin: '0 0 12px 0' }}>
            Let&apos;s create a unique name for this CV. It&apos;s best to use your target Job Role and Company for this.
          </p>} onSubmit={handleCreate}/>
      </Modal>
  </div>
  );
};

export default HomePageComponent;