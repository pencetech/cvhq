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
            requirements: job.requirements,
            add_on: job.addOn
        }).eq("profile_id", profileId)
        messageApi.success("Job posting saved!");
    }

    const setExperienceArray = async (exp: Experience[])  => {
        const values = { experiences: exp }
        const data = { ...profile, ...values };
        onUpdate(data);
        await Promise.all(exp.map(async e => await setExperience(e)))
        messageApi.success("Experiences saved!");
    }

    const setExperience = async (exp: Experience) => {
        await supabase.from('experience')
        .update({
            title: exp.title,
            company: exp.company,
            sector: exp.sector,
            is_current: exp.isCurrent,
            start_date: exp.startDate,
            end_date: exp.isCurrent ? null : exp.endDate,
            achievements: exp.achievements
        }).eq("profile_id", profileId);
    }

    const setEducationArray = async (ed: Education[])  => {
        const values = { education: ed }
        const data = { ...profile, ...values };
        onUpdate(data);
        await Promise.all(ed.map(async e => await setEducation(e)))
        messageApi.success("Education saved!");
    }

    const setEducation = async (ed: Education) => {
        await supabase.from('education')
        .update({
            subject: ed.subject,
            institution: ed.institution,
            degree: ed.degree,
            start_date: ed.startDate,
            end_date: ed.endDate,
        }).eq("profile_id", profileId);
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
            content: <EducationForm isIntro={false} title="Education" value={profile.education} onSubmit={setEducationArray} actions={saveButton} />
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