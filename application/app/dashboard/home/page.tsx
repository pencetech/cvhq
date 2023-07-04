import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import HomePageComponent from './homePageComponent';

type FileData = {
  filename: string,
  description: string
}

export const revalidate = 0;

const HomePage = async () => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user.id;

  let { data, error, status } = await supabase
    .rpc('get_profiles_of_user_time_name', {
      user_id_input: userId
  })

  if (error && status !== 406) {
    throw error
  }

  const parsedData = data.map((obj: any) => {
    return {
      id: obj.profile_id,
      description: obj.profile_name,
      createdAt: obj.created_at
    }})
  
  return (
    <HomePageComponent profiles={parsedData} />
  );
};

export default HomePage;