import { FormData } from '@/models/cv';
import { Database } from '@/types/supabase';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import ProfilePageComponent from './profilePageComponent';

export const revalidate = 0;

const ProfilePage = async ({ params }: { params: { id: number } }) => {
    const supabase = createServerComponentClient<Database>({ cookies });
    const {
        data: { session },
    } = await supabase.auth.getSession();

    const getUserBioJobPosting = async (user: string) => {
        let { data, error, status } = await supabase
            .rpc('get_bio_posting', {
                user_id_input: user,
                profile_id_input: params.id
            })
    
        if (error && status !== 406) {
            throw error
        }

        return data;
    }

    const getExperience = async (user: string) => {
        let { data, error, status } = await supabase
            .rpc('get_experience', {
                user_id_input: user,
                profile_id_input: params.id
            })
    
        if (error && status !== 406) {
            throw error
        }

        return data;
    }

    const getEducation = async (user: string) => {
        let { data, error, status } = await supabase
            .rpc('get_education', {
                user_id_input: user,
                profile_id_input: params.id
            })
    
        if (error && status !== 406) {
            throw error
        }

        return data;
    }

    const getSkillset = async (user: string) => {
        let { data, error, status } = await supabase
            .rpc('get_skillset', {
                user_id_input: user,
                profile_id_input: params.id
            })
    
        if (error && status !== 406) {
            throw error
        }

        return data;
    }

    const getFiles = async () => {
        if (session) {
            let { data, error, status } = await supabase
                .from('cv_file')
                .select('filename, inserted_at')
                .eq('profile_id', params.id);

            if (error && status !== 406) {
                throw error;
            }

            const files = data?.map(file => ({
                filename: file.filename,
                createdAt: file.inserted_at
            }))
            console.log(files)
            return files;
        }
    }

    const getProfile = async () => {
        try {
            if (session) {
                const bioPost = await getUserBioJobPosting(session.user?.id);
                const exp = await getExperience(session.user?.id);
                const ed = await getEducation(session.user?.id);
                const skill = await getSkillset(session.user?.id);
            
                if (
                    bioPost && exp && ed && skill
                ) {
                    const data = {
                        userBio: {
                            firstName: bioPost[0].user_first_name,
                            lastName: bioPost[0].user_last_name,
                            email: bioPost[0].user_email,
                            phone: bioPost[0].user_phone,
                            address: bioPost[0].user_address
                        },
                        jobPosting: {
                            title: bioPost[0].job_title,
                            company: bioPost[0].job_company,
                            sector: bioPost[0].job_sector,
                            requirements: bioPost[0].job_requirements,
                            addOn: bioPost[0].job_add_on
                        },
                        experiences: exp.map(ex => ({
                            title: ex.exp_title,
                            company: ex.exp_company,
                            sector: ex.exp_sector,
                            isCurrent: ex.exp_is_current,
                            startDate: ex.exp_start_date,
                            endDate: ex.exp_end_date,
                            achievements: ex.exp_achievements
                        })),
                        education: ed.map(e => ({
                            subject: e.ed_subject,
                            institution: e.ed_institution,
                            degree: e.ed_degree,
                            startDate: e.ed_start_date,
                            endDate: e.ed_end_date
                        })),
                        skillsets: {
                            skillsets: skill[0].skillset
                        }
                    } as FormData
                    return data;
                }
            }
        } catch (error) {
            alert('Error loading profile data!')
        }
    }

    const profile = await getProfile();
    const files = await getFiles();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            { profile && files ? <ProfilePageComponent id={params.id} profiles={profile} files={files} /> : "empty data"}
        </div>
    )
}

export default ProfilePage;