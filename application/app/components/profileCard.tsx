"use client";
import { useState } from 'react';
import { User, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Education, Experience, FormData, JobPosting, UserBio, Skillset } from '@/models/cv';
import { Button, Card, message, theme } from 'antd';
import BioForm from './bioForm';
import JobPostingForm from './jobPostingForm';
import ExperiencesForm from './experiencesForm';
import EducationForm from './educationForm';
import SkillsetForm from './skillsetForm';
import { Database } from '@/types/supabase';

const ProfileCard = ({ profileId, profile }: { profileId: number, profile: FormData }) => {
    const [activeTab, setActiveTab] = useState("bio");
    const [messageApi, contextHolder] = message.useMessage();
    const { token } = theme.useToken();
    const supabase = createClientComponentClient<Database>();
    
    const setUserBio = async (user: UserBio) => {
        await supabase.from('user_bio')
        .update({
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address
        }).eq("profile_id", profileId)
        messageApi.success("User bio saved!");
    }

    const setJobPosting = async (job: JobPosting) => {
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
            end_date: exp.endDate,
            achievements: exp.achievements
        }).eq("profile_id", profileId);
    }

    const setEducationArray = async (exp: Education[])  => {
        await Promise.all(exp.map(async e => await setEducation(e)))
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
            content: <BioForm message="Your Bio" value={profile.userBio} onSubmit={setUserBio} actions={saveButton}/>
        },
        {
            key: 'job',
            label: 'Job Posting',
            content: <JobPostingForm message="Job Posting" value={profile.jobPosting} onSubmit={setJobPosting} actions={saveButton} />
        },
        {
            key: 'experiences',
            label: 'Experiences',
            content: <ExperiencesForm 
                message="Experiences" 
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
            content: <EducationForm message="Education" value={profile.education} onSubmit={setEducationArray} actions={saveButton} />
        },
        {
            key: 'skillsets',
            label: 'Skillsets',
            content: <SkillsetForm message="Skillsets" value={profile.skillsets} onSubmit={setSkillset} actions={saveButton}  />
        }
    ]

    const contentStyle = {
        lineHeight: '260px',
        color: token.colorTextTertiary,
        padding: 36,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px ${token.colorBorder}`,
        marginTop: 16,
    };

    return (
        <Card 
            title="Profile info" 
            style={{ width: '100%' }}
            tabList={rawItems}
            activeTabKey={activeTab}
            onTabChange={handleTabChange}
        >
            {contextHolder}
            <div style={contentStyle}>{getTabContent(activeTab)?.content}</div>
        </Card>
    )
}

export default ProfileCard;