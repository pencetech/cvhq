"use client";
import { useState, useEffect, useCallback } from 'react';
import CvForm from '@/app/components/cvForm';
import {Modal, Typography } from 'antd';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import ProfileNameForm from '../components/profileNameForm';
import { ProfileName } from '@/models/cv';
import useMessage from 'antd/es/message/useMessage';

const SetupPage = () => {
  // popup to register new profile
  const [user, setUser] = useState('');
  const [profileId, setProfileId] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(true);
  const supabase = createClientComponentClient<Database>();
  const [messageApi, contextHolder] = useMessage();
  
  const getUser = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) { 
      setUser(session.user?.id);
    }
  }, [supabase])

  useEffect(() => {
      getUser()
      .catch(console.error)
  }, [getUser])

  const handleCreate = async (value: ProfileName) => {
    const error = await setProfile(value);
    if (!error) {
      setIsOpen(false);
    }
  }

  const setProfile = async (value: ProfileName) => {
    const { data, error } = await supabase.from('cv_profile')
    .insert({
        user_id: user,
        name: value.profileName
    }).select()

    if (error) {
      if (error.code === "23505") {
        messageApi.error("Profile name exists.");
      } else {
        messageApi.error("An error occured.");
      }
      
      return true;
    }

    setProfileId(data[0].id);
    return false;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px' }}>
      {contextHolder}
      <Typography.Title level={2}>Get started</Typography.Title>
      <CvForm profileId={profileId} userId={user} />
      <Modal 
        title="Get started"
        closable={false}
        open={isOpen}
        footer={null}
      >
        <ProfileNameForm message="To get started, let's pick a nickname for your job posting." onSubmit={handleCreate}/>
      </Modal>
    </div>
  )
}

export default SetupPage;
