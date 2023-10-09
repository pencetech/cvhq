import { FormData, Skillset } from '@/models/cv';
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

    const getUserBio = async (user: string) => {
        let { data, error, status } = await supabase
        .from('user_bio')
        .select('first_name, last_name, phone, email, address')
        .eq('user_id', user ? user : '')

        if (error && status !== 406) {
            throw error
        }
        if (data && data.length > 0) {
            return {
                firstName: data[0].first_name,
                lastName: data[0].last_name,
                email: data[0].email,
                phone: data[0].phone,
                address: data[0].address
            };
        }

        return {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: ''
        }
    }

    const getJobPosting = async (profileId: number) => {
        let { data, error, status } = await supabase
        .from('job_posting')
        .select('title, company, sector, requirements, add_on')
        .eq('profile_id', params.id)

        if (error && status !== 406) {
            throw error
        }

        if (data && data.length > 0) {
            return {
                title: data[0].title,
                company: data[0].company,
                sector: data[0].sector,
                requirements: data[0].requirements,
                addOn: data[0].add_on,
            }
        }

        return {
            title: '',
            company: '',
            sector: '',
            requirements: '',
            addOn: '',
        }
    }

    const getExperience = async (user: string) => {
        let { data, error, status } = await supabase
            .from('experience')
            .select('seq_id, title, company, sector, is_current, start_date, end_date, achievements')
            .eq('profile_id', params.id)
            .eq('is_deleted', false)
    
        if (error && status !== 406) {
            throw error
        }

        if (data && data.length > 0) {
            return data
            .map((ex) => ({
                title: ex.title,
                company: ex.company,
                sector: ex.sector,
                isCurrent: ex.is_current,
                startDate: ex.start_date,
                endDate: ex.is_current ? '' : ex.end_date,
                achievements: ex.achievements
            }));
        }

        return [{
            title: '',
            company: '',
            sector: '',
            isCurrent: '',
            startDate: '',
            endDate: '',
            achievements: '',
        }]
    }

    const getEducation = async (user: string) => {
        let { data, error, status } = await supabase
            .from('education')
            .select('seq_id, subject, institution, degree, start_date, end_date')
            .eq('profile_id', params.id)
            .eq('is_deleted', false)
    
        if (error && status !== 406) {
            throw error
        }

        if (data && data.length > 0) {
            return data.map((e) => ({
                subject: e.subject,
                institution: e.institution,
                degree: e.degree,
                startDate: e.start_date,
                endDate: e.end_date
            }))
        }

        return [{
            subject: '',
            institution: '',
            degree: '',
            startDate: '',
            endDate: ''
        }]
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

        if (data && data.length > 0) {
            return {
                skillsets: data[0].skillset
            } as Skillset
        }

        return {
            skillsets: ''
        }
    }

    const getFiles = async () => {
        if (session) {
            let { data, error, status } = await supabase
                .from('cv_file')
                .select('filename, inserted_at')
                .eq('profile_id', params.id)
                .order('inserted_at', { ascending: false });

            if (error && status !== 406) {
                throw error;
            }

            const files = data?.map(file => ({
                filename: file.filename,
                createdAt: file.inserted_at
            }))
            return files;
        }
    }

    const getProfile = async () => {
        try {
            if (session) {
                const bio = await getUserBio(session.user?.id)
                const post = await getJobPosting(params.id);
                const exp = await getExperience(session.user?.id);
                const ed = await getEducation(session.user?.id);
                const skill = await getSkillset(session.user?.id);
            
                const data = {
                    userBio: bio,
                    jobPosting: post,
                    experiences: exp,
                    education: ed,
                    skillset: skill
                } as FormData
                return data;
                }
            } catch (error) {
            console.log(error);
        }
    }

    const getProfileName = async () => {
        const { data, error } = await supabase.from('cv_profile')
        .select('name').eq('id', params.id)

        if (error) {
            throw error;
        }
        if (data && data.length > 0) {
            return data[0].name
        }
    }

    const profile = await getProfile();
    const files = await getFiles();
    const profileName = await getProfileName();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            { profile && files ? <ProfilePageComponent profileName={profileName ? profileName : "Info"} id={params.id} profile={profile} files={files} /> : "empty data"}
        </div>
    )
}

export default ProfilePage;