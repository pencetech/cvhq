import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import HomePageComponent from './homePageComponent';
import { Profiles } from '@/models/cv';

export const revalidate = 0;

const HomePage = async () => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user.id;

  const getProfiles = async () => {
    let { data, error, status } = await supabase
    .from('cv_profile')
    .select('id, name, inserted_at')
    .eq('user_id', userId)
    .order('inserted_at', { ascending: false })

    if (error && status !== 406) {
      throw error
    }

    return data?.map(obj => {
      return {
        id: obj.id,
        description: obj.name,
        createdAt: obj.inserted_at
      }}) as Profiles
  };

  const parsedData = await getProfiles();
  
  return (
    <HomePageComponent profiles={parsedData} />
  );
};

export default HomePage;