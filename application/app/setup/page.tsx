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
    const currId = await getCurrProfile(value);

    if (currId) {
      setProfileId(currId);
    }

    if (!error) {
      setIsOpen(false);
    }
  }

  const setProfile = async (value: ProfileName) => {
    const { data, error } = await supabase.from('cv_profile')
    .insert({
        user_id: user,
        name: value.profileName
    })

    if (error) {
      if (error.code === "23505") {
        messageApi.error("Profile name exists.");
      } else {
        messageApi.error("An error occured.");
      }
      
      return true;
    }
    return false;
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
        <ProfileNameForm message={
          <p style={{ margin: '0 0 12px 0' }}>
            Let&apos;s create a unique name for this CV. It&apos;s best to use your target Job Role and Company for this.
          </p>} onSubmit={handleCreate}/>
      </Modal>
    </div>
  )
}

export default SetupPage;
