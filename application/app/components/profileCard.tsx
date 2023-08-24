"use client";
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Education, Experience, FormData, JobPosting, UserBio, Skillset, SecondaryInput } from '@/models/cv';
import { Button, Modal, Tabs, message, theme, Typography } from 'antd';
import BioForm from './bioForm';
import JobPostingForm from './jobPostingForm';
import ExperiencesForm from './experiencesForm';
import EducationForm from './educationForm';
import SkillsetForm from './skillsetForm';
import { Database } from '@/types/supabase';
import FileListComponent from '../dashboard/cv/[id]/fileListComponent';
import { useQuery } from '@tanstack/react-query';
import { gql, useMutation } from '@apollo/client';
import { Mutation } from '../__generated__/graphql';
import { usePathname } from 'next/navigation';
import CvDownloadModal from './cvDownloadModal';
import FinalTouchesForm from './finalTouchesForm';

const GENERATE_SUMMARY = gql`
mutation generateSummary($input: CvInput!) {
    generateSummary(input: $input) {
        summary
    }
}
`

const ProfileCard = ({ title, profileId, profile, onUpdate }: { 
    title: string, 
    profileId: number,
    profile: FormData, 
    onUpdate: (values: FormData) => void 
}) => {
    const [activeTab, setActiveTab] = useState("job");
    const [user, setUser] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const pathName = usePathname();
    const supabase = createClientComponentClient<Database>();
    const cvInput = {
        id: 1,
        cvContent: {
            userBio: profile.userBio,
            experiences: profile.experiences,
            summary: profile.summary,
            education: profile.education,
            skillsets: profile.skillset
        },
        jobPosting: profile.jobPosting,
        cvType: "BASE"
    }
    const [generateSummary, { data: graphSummaryData, loading: generateSummaryLoading }] = useMutation<Mutation>(GENERATE_SUMMARY, {
        variables: {
            input: cvInput
        }
    })

    useEffect(() => {
        const getUser = async () => {
            const {
              data: { user },
            } = await supabase.auth.getUser()
            if (user) {
              setUser(user?.id)
            }
          }
      
          getUser();
    }, [supabase.auth])

    const getFileList = async () => {
        let { data, error, status } = await supabase
            .from('cv_file')
            .select('filename, inserted_at')
            .eq('profile_id', profileId)
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
    
    const { data: fileData } = useQuery({
        queryKey: ['file-list'],
        queryFn: getFileList
    })

    const isAllFieldsFilled = () => {
        const userBioNotFilled = !profile.userBio.firstName ||
            !profile.userBio.lastName ||
            !profile.userBio.email ||
            !profile.userBio.phone ||
            !profile.userBio.address;

        const jobPostingNotFilled = !profile.jobPosting.title ||
            !profile.jobPosting.company ||
            !profile.jobPosting.sector ||
            !profile.jobPosting.requirements;

        const experiencesNotExist = !(profile.experiences.length > 0);

        const experiencesNotFilled = profile.experiences.map(exp => {
            return !exp.title ||
                !exp.company ||
                !exp.sector ||
                !exp.startDate ||
                !exp.achievements;
        });

        const educationNotExist = !(profile.education.length > 0);

        const educationNotFilled = profile.education.map(ed => {
            return !ed.subject ||
                !ed.institution ||
                !ed.degree ||
                !ed.startDate ||
                !ed.endDate;
        })
        const skillsetNotFilled = !profile.skillset.skillsets

        const validationSchema = {
            userBio: userBioNotFilled,
            jobPosting: jobPostingNotFilled,
            experiences: experiencesNotExist || experiencesNotFilled.includes(true),
            education: educationNotExist || educationNotFilled.includes(true),
            skillset: skillsetNotFilled
        }

        const failedFields = Object.entries(validationSchema).filter((elem => elem[1] === true ))

        if (failedFields.length > 0) {
            Modal.error({
                title: 'Fields incomplete',
                content: `Please complete the following fields: ${failedFields.map(elem => elem[0]).join(", ")}`,
              });

            return false;
        }

        return true;
    }
    
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
    }

    const setJobPosting = async (job: JobPosting) => {
        const values = { jobPosting: job }
        const data = { ...profile, ...values };
        onUpdate(data);
        await supabase.from('job_posting')
        .upsert({
            title: job.title,
            company: job.company,
            sector: job.sector,
            requirements: job.requirements,
            profile_id: profileId
        }, { onConflict: 'profile_id' });
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
        .upsert(experience.map((exp, i) => ({
            title: exp.title,
            company: exp.company,
            sector: exp.sector,
            is_current: exp.isCurrent,
            start_date: exp.startDate,
            end_date: exp.isCurrent ? null : exp.endDate,
            achievements: exp.achievements,
            profile_id: profileId,
            seq_id: i + 1,
            is_deleted: false
        })), { onConflict: 'profile_id, seq_id' })
    }

    const deleteEducationArray = async (ed: Education[])  => {
        const oldLength = profile.education.length;
        if (oldLength > ed.length) {
            const diffCount = oldLength - ed.length;

            for (let step = 0; step < diffCount; step++) {
                await deleteEducation(oldLength - step)
            }
        }
    }
        
    const setEducation = async (education: Education[]) => {
        await supabase.from('education')
        .upsert(education.map((ed, i) => ({
            subject: ed.subject,
            institution: ed.institution,
            degree: ed.degree,
            start_date: ed.startDate,
            end_date: ed.endDate,
            profile_id: profileId,
            seq_id: i + 1,
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
        await supabase.from('skillset')
        .upsert({
            skillsets: sk.skillsets,
            profile_id: profileId
        }, { onConflict: 'profile_id' });
    }

    const setOtherInput = async (values: SecondaryInput) => {
        await deleteEducationArray(values.education);
        const newData = { ...profile, ...values };
        await setEducation(values.education);
        await setUserBio(values.userBio);
        await setSkillset(values.skillsets);
        onUpdate(newData);
        messageApi.success("Bio, education, and skillsets saved!");
    }
    
    const handleGenerateSummary = async () => {
        const { data } = await generateSummary();
        handleChangeSummary(data ? data.generateSummary.summary : '');
    }
    
    const handleChangeSummary = (summary: string) => {
        const values = { 
            summary: {
                summary: summary
            }
        }
        const data = { ...profile, ...values };
        onUpdate(data);
    }
    
      const handleGenerateClick = async () => {
        const isValidationPassed = isAllFieldsFilled();
        if (isValidationPassed) {
            showModal();
            await handleGenerateSummary();
        }
    }
    
    const saveButton = (
        <Button type="primary" htmlType='submit'>Save</Button>
    )

    const handleTabChange = (key: string) => {
        setActiveTab(key);
    };

    const fetchAndDownloadCV = async (filename: string) => {
        const currPathNoQuery = pathName.split("?")[0];
        const currPath = currPathNoQuery
            .split("/")
            .filter(v => v.length > 0);
        const currPage = currPath[currPath.length-1];
        window.analytics?.track("Download CV", {
            title: `Downloaded CV in ${currPage}`,
            userId: user,
            profileId: profileId,
            current_path: currPath
        })
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/cv/${filename}`)
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
        }
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob)
        window.open(blobUrl, '_blank');
    }   

    const showModal = () => {
        setIsModalOpen(true);
      };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const rawItems = [
        {
            key: 'job',
            label: 'Job Posting',
            children: <JobPostingForm isIntro={false} title="Job Posting" value={profile.jobPosting} onSubmit={setJobPosting} actions={saveButton} />
        },
        {
            key: 'experiences',
            label: 'Experiences',
            children: <ExperiencesForm 
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
            key: 'others',
            label: 'Bio, Education & Skillsets',
            children: <FinalTouchesForm 
            isIntro={false}
            title="Bio, Education & Skillsets" 
            value={{ skillsets: profile.skillset, userBio: profile.userBio, education: profile.education }} 
            onSubmit={setOtherInput} 
            actions={saveButton} 
        />
        },
        {
            key: 'files',
            label: 'CV files',
            children: <FileListComponent 
                profileName={title}
                profileId={profileId}
                files={fileData ? fileData : []} 
                onFileClick={fetchAndDownloadCV}
             /> 
        }
    ]

    const generateButton = (<Button type='primary' onClick={handleGenerateClick}>Generate CV</Button>)

    return (
        <>
            {contextHolder}
            <Typography.Title level={2}>{title}</Typography.Title>
            <Tabs
                title={title}
                size="large"
                items={rawItems}
                tabBarExtraContent={generateButton}
                activeKey={activeTab}
                onChange={handleTabChange}
        />
        <CvDownloadModal 
            userId={user} 
            profileId={profileId} 
            formData={profile} 
            open={isModalOpen} 
            onCancel={handleCancel} 
            onFetchSummary={handleGenerateSummary}
            onChangeSummary={handleChangeSummary}
            loading={generateSummaryLoading}
            nextLink={pathName} 
        />
        </>
        
    )
}

export default ProfileCard;