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

const GENERATE_CV = gql`
mutation generateCV($input: ProfileInput!) {
    generateCV(input: $input) {
      filename
    }
  }
`

const CvForm = ({ profileId }: { profileId: number }) => {
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [filename, setFilename] = useState("default.pdf");
    const [cvBlobUrl, setCvBlobUrl] = useState("");
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
            requirements: '',
            addOn: ''
        },
        experiences: [{
            title: '',
            company: '',
            sector: '',
            isCurrent: false,
            startDate: '',
            endDate: '',
            achievements: ''
        }],
        education: [{
            subject: '',
            institution: '',
            degree: '',
            startDate: '',
            endDate: '',
        }],
        skillsets: {
            skillsets: '',
        }
    });
    const [generateCV, { data, loading, error }] = useMutation(GENERATE_CV, {
        variables: {
            input: {
                id: 1,
                userBio: formData.userBio,
                jobPosting: formData.jobPosting,
                experiences: formData.experiences,
                education: formData.education,
                skillsets: formData.skillsets
            }
        },
        onCompleted: async (data: any) => await handleCompleteGenerate(data.generateCV.filename)
    })

    const insertUserBio = async (user: UserBio) => {
        await supabase.from('user_bio')
        .upsert({
            profile_id: profileId,
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address
        })
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
        })
        messageApi.success("Job posting saved!");
        handleProgress({
            jobPosting: job
        });
    }

    const insertExperience = async (experiences: Experience[]) => {
        await supabase.from('experience')
            .upsert(experiences.map(exp => ({
                profile_id: profileId,
                title: exp.title,
                company: exp.company,
                sector: exp.sector,
                is_current: exp.isCurrent,
                start_date: exp.startDate,
                end_date: exp.isCurrent ? null : exp.endDate,
                achievements: exp.achievements
            })
        ))
        messageApi.success("Experience saved!");
        handleProgress({
            experiences: experiences
        });
    }

    const insertEducation = async (education: Education[]) => {
        await supabase.from('education')
            .upsert(education.map(ed => ({
                profile_id: profileId,
                subject: ed.subject,
                institution: ed.institution,
                degree: ed.degree,
                start_date: ed.startDate,
                end_date: ed.endDate,
            })
        )).eq("profile_id", profileId);
        messageApi.success("Education saved!");
        handleProgress({
            education: education
        });
    }

    const insertSkillset = async (sk: Skillset) => {
        await supabase.from('skillset')
        .upsert({
            profile_id: profileId,
            skillsets: sk.skillsets
        })
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
    
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    
    const handleCompleteGenerate = async (filename: string) => {
        await supabase
            .from("cv_file")
            .insert({
                filename: filename,
                profile_id: profileId
            });
        setFilename(filename)
        await fetchCV(filename);
    }

    const handleSubmit = (values: Skillset) => {
        const data = { ...formData, values };
        setFormData(data);
        generateCV();
        showModal();
    }

    const fetchCV = async (filename: string) => {
        const res = await fetch(`https://cvhq-platform-production.fly.dev/cv/${filename}`)
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
        }
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob)
        setCvBlobUrl(blobUrl);
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
            <Button type='primary' htmlType="submit" loading={loading}>{loading ? "Generating..." : "Generate CV"}</Button>
        </Space>
    )
        // to handle async compatibility throughout the app, we're making this 
    const rawItems = [
        {   
            key: 'bio',
            label: 'Your Bio',
            content: <BioForm title="How best can employers contact you?" description="Email and phone number recommended." value={formData.userBio} onSubmit={insertUserBio} actions={startNextAction} />
        },
        {
            key: 'job',
            label: 'Job Posting',
            content: <JobPostingForm title="Where are you applying to?" description="We'll use this to create a CV specific to this job." value={formData.jobPosting} onSubmit={insertJobPosting} actions={midNextActions} />
        },
        {
            key: 'experiences',
            label: 'Experiences',
            content: <ExperiencesForm title="Let's fill out your work history" description="Things to note:" userBio={formData.userBio} jobPosting={formData.jobPosting} value={formData.experiences} onSubmit={insertExperience} actions={midNextActions} />
        },
        {
            key: 'education',
            label: 'Education',
            content: <EducationForm message="Education" value={formData.education} onSubmit={insertEducation} actions={midNextActions} />
        },
        {
            key: 'skillsets',
            label: 'Skillsets',
            content: <SkillsetForm message="Skillsets" value={formData.skillsets} onSubmit={insertSkillset} actions={endActions} />
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
        {!loading ? <CvDownloadModal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} filename={filename} blobUrl={cvBlobUrl} /> : null}
        </>
    )
}

export default CvForm;