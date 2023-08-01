"use client";
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { gql, useMutation } from '@apollo/client';
import { Education, Experience, FormData, JobPosting, Skillset, UserBio } from '@/models/cv';
import { Button, Space, Steps, message, theme } from 'antd';
import BioForm from './bioForm';
import JobPostingForm from './jobPostingForm';
import ExperiencesForm from './experiencesForm';
import EducationForm from './educationForm';
import SkillsetForm from './skillsetForm';
import { Database } from '@/types/supabase';
import CvDownloadModal from './cvDownloadModal';
import { usePathname } from 'next/navigation';

const GENERATE_CV = gql`
mutation generateCV($input: ProfileInput!) {
    generateCV(input: $input) {
      filename
    }
  }
`

const CvForm = ({ profileId, userId }: { profileId: number, userId: string }) => {
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const { token } = theme.useToken();
    const supabase = createClientComponentClient<Database>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [formData, setFormData] = useState<FormData>({
        userBio: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
        },
        jobPosting: {
            title: '',
            company: '',
            sector: '',
            requirements: ''
        },
        experiences: [{
            id: 1,
            title: '',
            company: '',
            sector: '',
            isCurrent: false,
            startDate: '',
            endDate: '',
            achievements: ''
        }],
        education: [{
            id: 1,
            subject: '',
            institution: '',
            degree: '',
            startDate: '',
            endDate: '',
        }],
        skillset: {
            skillsets: '',
        }
    });

    const insertUserBio = async (user: UserBio) => {
        await supabase.from('user_bio')
        .upsert({
            user_id: userId,
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address
        }, { onConflict: 'user_id' })
        messageApi.success("User bio saved!");
        handleProgress({
            userBio: user
        });
    }

    const insertJobPosting = async (job: JobPosting) => {
        await supabase.from('job_posting')
        .upsert({
            profile_id: profileId,
            title: job.title,
            company: job.company,
            sector: job.sector,
            requirements: job.requirements,
            add_on: job.addOn
        }, { onConflict: 'profile_id' })
        messageApi.success("Job posting saved!");
        handleProgress({
            jobPosting: job
        });
    }

    const insertExperience = async (experiences: Experience[]) => {
        const oldLength = formData.experiences.length;
        if (oldLength > experiences.length) {
            const diffCount = oldLength - experiences.length;

            for (let step = 0; step < diffCount; step++) {
                await deleteExperience(oldLength - step)
            }
        }
        await supabase.from('experience')
            .upsert(experiences.map(exp => ({
                profile_id: profileId,
                title: exp.title,
                company: exp.company,
                sector: exp.sector,
                is_current: exp.isCurrent,
                start_date: exp.startDate,
                end_date: exp.isCurrent ? null : exp.endDate,
                achievements: exp.achievements,
                seq_id: exp.id,
                is_deleted: false
            })
        ), { onConflict: 'profile_id, seq_id' })
        messageApi.success("Experience saved!");
        handleProgress({
            experiences: experiences
        });
    }

    const insertEducation = async (education: Education[]) => {
        const oldLength = formData.education.length;
        if (oldLength > education.length) {
            const diffCount = oldLength - education.length;

            for (let step = 0; step < diffCount; step++) {
                await deleteEducation(oldLength - step)
            }
        }
        await supabase.from('education')
            .upsert(education.map(ed => ({
                profile_id: profileId,
                subject: ed.subject,
                institution: ed.institution,
                degree: ed.degree,
                start_date: ed.startDate,
                end_date: ed.endDate,
                seq_id: ed.id,
                is_deleted: false
            })
        ), { onConflict: 'profile_id, seq_id' })
        messageApi.success("Education saved!");
        handleProgress({
            education: education
        });
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

    const insertSkillset = async (sk: Skillset) => {
        await supabase.from('skillset')
        .upsert({
            profile_id: profileId,
            skillsets: sk.skillsets
        }, { onConflict: 'profile_id' })
        messageApi.success("Skillset saved!");
        handleSubmit(sk);
    }

    const handleBack = (e: any) => {
        e.preventDefault();
        setActiveStepIndex(activeStepIndex - 1);
    }

    const handleProgress = (values: any) => {
        const data = { ...formData, ...values };
        setFormData(data);
        setActiveStepIndex(activeStepIndex + 1);
    }

    const showModal = () => {
        setIsModalOpen(true);
      };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = (values: Skillset) => {
        const mergingValue = { skillset: values }
        const data = { ...formData, ...mergingValue };
        setFormData(data);
        showModal();
    }

    const startNextAction = (
        <Button type='primary' htmlType='submit'>Save & Next</Button>
    )

    const midNextActions = (
        <Space>
            <Button onClick={e => handleBack(e)}>Back</Button>
            <Button type='primary' htmlType='submit'>Save & Next</Button>
        </Space>
    )

    const endActions = (
        <Space>
            <Button onClick={e => handleBack(e)}>Back</Button>
            <Button type='primary' htmlType="submit">Generate CV</Button>
        </Space>
    )
        // to handle async compatibility throughout the app, we're making this 
    const rawItems = [
        {   
            key: 'bio',
            label: 'Your Bio',
            content: <BioForm isIntro title="How best can employers contact you?" description="Email and phone number recommended." value={formData.userBio} onSubmit={insertUserBio} actions={startNextAction} />
        },
        {
            key: 'job',
            label: 'Job Posting',
            content: <JobPostingForm isIntro title="Where are you applying to?" description="We'll use this to create a CV specific to this job." value={formData.jobPosting} onSubmit={insertJobPosting} actions={midNextActions} />
        },
        {
            key: 'experiences',
            label: 'Experiences',
            content: <ExperiencesForm 
                isIntro 
                title="Let's fill out your work history"
                profileId={profileId} 
                description="Things to note:" 
                userBio={formData.userBio} 
                jobPosting={formData.jobPosting} 
                value={formData.experiences} 
                onSubmit={insertExperience} 
                actions={midNextActions} 
            />
        },
        {
            key: 'education',
            label: 'Education',
            content: <EducationForm 
                isIntro 
                title="Showcase your academic qualifications" 
                description="Things to note:" 
                value={formData.education} 
                onSubmit={insertEducation} 
                actions={midNextActions} 
                />
        },
        {
            key: 'skillsets',
            label: 'Skillsets',
            content: <SkillsetForm 
                isIntro 
                title="Time to show your skills" 
                description="Add unique skills that make you stand out." 
                value={formData.skillset} 
                onSubmit={insertSkillset} 
                actions={endActions} 
            />
        }
    ]

    const items = rawItems.map((item) => ({
        key: item.key,
        title: item.label,
      }));

    const contentStyle = {
        lineHeight: '260px',
        color: token.colorTextTertiary,
        padding: "0 0 0 36px",
        marginTop: 16,
    };

    return (
        <>
        <Steps
            items={items}
            current={activeStepIndex}
            size="small"
            style={{ margin: '16px 0', minHeight: '100%' }}
        />
        {contextHolder}
        <div style={contentStyle}>{rawItems[activeStepIndex].content}</div>
          <CvDownloadModal userId={userId} profileId={profileId} formData={formData} open={isModalOpen} onCancel={handleCancel} nextLink="/dashboard/home" />
        </>
    )
}

export default CvForm;