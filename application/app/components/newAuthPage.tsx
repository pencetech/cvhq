'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Form, Input, Space, Typography, message } from 'antd'
import { Database } from '@/types/supabase';
import { VerifyOtpParams } from '@supabase/supabase-js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [OTPSent, setOTPSent] = useState(false);
  const [OTP, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const supabase = createClientComponentClient<Database>()

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      })

    if (error) messageApi.error("error authenticating.")
    if (!error) {
        setOTPSent(true);
    }
    setLoading(false);
  }

  const checkNoProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let { data, error } = await supabase.from('cv_profile')
      .select('id').eq('user_id', user? user.id : '')

    if (error) {
      throw error;
    }

    if (!data || data.length == 0) {
      return true;
    } 

    return false;
  }

  const handleVerify = async () => {
    setLoading(true);
    let verifyOpts: VerifyOtpParams = {
        email: email,
        token: OTP,
        type: 'email',
      }
    let { error } = await supabase.auth.verifyOtp(verifyOpts);
    if (error) {
        messageApi.error("error authenticating.");
        setLoading(false);
    }

    const isNoProfile = await checkNoProfile();

    router.push("/dev")
  }

  return (
    <Space direction='vertical' align='center'>
    {contextHolder}
    <Form.Item label="Email address">
        <Input name="email" onChange={(e) => setEmail(e.target.value)} value={email} />
    </Form.Item>

    {OTPSent ? 
    <Form.Item label="One-time passcode">
    <Input
    type="text"
    name="otp"
    onChange={(e) => setOTP(e.target.value)}
    value={OTP}
    /></Form.Item> : null}
      {OTPSent ? <Button loading={loading} onClick={handleVerify}>Verify OTP</Button> 
      : <Button loading={loading} onClick={handleSignIn}>Send OTP</Button>}
      {OTPSent ? <Typography.Text type="success">A one-time passcode (OTP) has been sent to your email</Typography.Text> : null}
    </Space>
  )
}