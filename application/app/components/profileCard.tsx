"use client";
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Education, Experience, FormData, JobPosting, UserBio, Skillset } from '@/models/cv';
import { Button, Card, message, theme } from 'antd';
import BioForm from './bioForm';
import JobPostingForm from './jobPostingForm';
import ExperiencesForm from './experiencesForm';
import EducationForm from './educationForm';
import SkillsetForm from './skillsetForm';
import { Database } from '@/types/supabase';

const ProfileCard = ({ title, profileId, profile, onUpdate }: { title: string, profileId: number, profile: FormData, onUpdate: any }) => {
    const [activeTab, setActiveTab] = useState("job");
    const [user, setUser] = useState<string>();
    const [messageApi, contextHolder] = message.useMessage();
    const { token } = theme.useToken();
    const supabase = createClientComponentClient<Database>();

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            setUser(session?.user.id);
        }

        getUser();
    }, [supabase.auth])
    
    const setUserBio = async (userBio: UserBio) => {
        const values = { userBio: userBio }
        const data = { ...profile, ...values };
        onUpdate(data);
        await supabase.from('user_bio')
        .update({
            first_name: userBio.firstName,
            last_name: userBio.lastName,
            email: userBio.email,
            phone: userBio.phone,
            address: userBio.address
        }).eq("user_id", user)
        messageApi.success("User bio saved!");
    }

    const setJobPosting = async (job: JobPosting) => {
        const values = { jobPosting: job }
        const data = { ...profile, ...values };
        onUpdate(data);
        await supabase.from('job_posting')
        .update({
            title: job.title,
            company: job.company,
            sector: job.sector,
            requirements: job.requirements
        }).eq("profile_id", profileId)
        messageApi.success("Job posting saved!");
    }

    const setExperienceArray = async (exp: Experience[])  => {
        const values = { experiences: exp }
        const data = { ...profile, ...values };
        const oldLength = profile.experiences.length;
        if (oldLength > exp.length) {
            const diffCount = oldLength - exp.length;

            for (let step = 0; step < diffCount; step++) {
                await deleteExperience(oldLength - step)
            }
        }
        onUpdate(data);
        await setExperience(exp);
        messageApi.success("Experiences saved!");
    }

    const setExperience = async (experience: Experience[]) => {
        await supabase.from('experience')
        .upsert(experience.map(exp => ({
            title: exp.title,
            company: exp.company,
            sector: exp.sector,
            is_current: exp.isCurrent,
            start_date: exp.startDate,
            end_date: exp.isCurrent ? null : exp.endDate,
            achievements: exp.achievements,
            profile_id: profileId,
            seq_id: exp.id,
            is_deleted: false
        })), { onConflict: 'profile_id, seq_id' })
    }

    const setEducationArray = async (ed: Education[])  => {
        const values = { education: ed }
        const data = { ...profile, ...values };
        const oldLength = profile.education.length;
        if (oldLength > ed.length) {
            const diffCount = oldLength - ed.length;

            for (let step = 0; step < diffCount; step++) {
                await deleteEducation(oldLength - step)
            }
        }
        onUpdate(data);
        await setEducation(ed);
        messageApi.success("Education saved!");
    }

    const setEducation = async (education: Education[]) => {
        await supabase.from('education')
        .upsert(education.map(ed => ({
            subject: ed.subject,
            institution: ed.institution,
            degree: ed.degree,
            start_date: ed.startDate,
            end_date: ed.endDate,
            profile_id: profileId,
            seq_id: ed.id,
            is_deleted: false
        })), { onConflict: 'profile_id, seq_id' });
    }

    const deleteExperience = async (index: number) => {
        await supabase.from('experience')
            .update({
                is_deleted: true,
            })
            .eq('profile_id', profileId)
            .eq('seq_id', index)
    }

    const deleteEducation = async (index: number) => {
        await supabase.from('education')
            .update({
                is_deleted: true,
            })
            .eq('profile_id', profileId)
            .eq('seq_id', index)
    }

    const setSkillset = async (sk: Skillset) => {
        const values = { skillset: sk }
        const data = { ...profile, ...values };
        onUpdate(data);
        await supabase.from('skillset')
        .update({
            skillsets: sk.skillsets
        }).eq("profile_id", profileId)
        messageApi.success("Skillset saved!");
    }
    
    const saveButton = (
        <Button type="primary" htmlType='submit'>Save</Button>
    )

    const handleTabChange = (key: string) => {
        setActiveTab(key);
    };

    const getTabContent = (key: string) => {
        return rawItems.find(o => o.key === key)
    }

    const rawItems = [
        {   
            key: 'bio',
            label: 'Your Bio',
            content: <BioForm isIntro={false} title="Your Bio" value={profile.userBio} onSubmit={setUserBio} actions={saveButton}/>
        },
        {
            key: 'job',
            label: 'Job Posting',
            content: <JobPostingForm isIntro={false} title="Job Posting" value={profile.jobPosting} onSubmit={setJobPosting} actions={saveButton} />
        },
        {
            key: 'experiences',
            label: 'Experiences',
            content: <ExperiencesForm 
                profileId={profileId}
                isIntro={false}
                title="Experiences" 
                value={profile.experiences} 
                onSubmit={setExperienceArray} 
                actions={saveButton} 
                userBio={profile.userBio}
                jobPosting={profile.jobPosting}
            />
        },
        {
            key: 'education',
            label: 'Education',
            content: <EducationForm 
                isIntro={false} 
                title="Education" 
                value={profile.education} 
                onSubmit={setEducationArray} 
                actions={saveButton} />
        },
        {
            key: 'skillsets',
            label: 'Skillsets',
            content: <SkillsetForm isIntro={false} title="Skillsets" value={profile.skillsets} onSubmit={setSkillset} actions={saveButton}  />
        }
    ]

    return (
        <Card 
            title={title}
            style={{ width: '100%' }}
            tabList={rawItems}
            activeTabKey={activeTab}
            onTabChange={handleTabChange}
        >
            {contextHolder}
            <div>{getTabContent(activeTab)?.content}</div>
        </Card>
    )
}

export default ProfileCard;