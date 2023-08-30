"use client";
import { ReactNode, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SecondaryInput, Education, Experience, FormData, JobPosting, Skillset, UserBio } from '@/models/cv';
import { Button, Col, Row, Space, Steps, message, theme } from 'antd';
import Image from 'next/image';
import axios from 'axios';
import JobPostingForm from './jobPostingForm';
import ExperiencesForm from './experiencesForm';
import { Database } from '@/types/supabase';
import CvDownloadModal from './cvDownloadModal';
import { gql, useMutation } from '@apollo/client';
import { CvType, Mutation } from '../__generated__/graphql';
import FinalTouchesForm from './finalTouchesForm';
import SelectCvOptionModal from './selectCVOptionModal';
import RightDashboard from './rightDashboard';

const GENERATE_SUMMARY = gql`
mutation generateSummary($input: CvInput!) {
    generateSummary(input: $input) {
        summary
    }
}
`
const GENERATE_SAMPLE_CV = gql`
    mutation generateSampleCv($input: SampleCvInput!) {
        generateSampleCv(input: $input) {
            experiences {
                id
                title
                company
                sector
                isCurrent
                startDate
                endDate
                achievements
            }
        }
    }
`

const YEARS_OF_EXPERIENCE = 3;

const CvForm = ({ profileId, userId }: { profileId: number, userId: string }) => {
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const { token } = theme.useToken();
    const supabase = createClientComponentClient<Database>();
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [isCvModalOpen, setIsCvModalOpen] = useState(false);
    const [cvType, setCvType] = useState<CvType>(CvType.Base);
    const [isPreferenceChosen, setIsPreferenceChosen] = useState(false);
    const [loading, setLoading] = useState(false);
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
        skillset: {
            skillsets: '',
        },
        summary: {
            summary: ''
        }
    });

    const [generateSummary, { data: graphSummaryData, loading: generateSummaryLoading }] = useMutation<Mutation>(GENERATE_SUMMARY);
    const [generateSampleCv, { data: sampleCvData, loading: sampleCvLoading }] = useMutation<Mutation>(GENERATE_SAMPLE_CV);

    const handleRetrySummary = async () => {
        setLoading(true);
        const summary = await handleGenerateSummary();
        handleChangeSummary(summary ? summary : '');
        setLoading(false);
    }
    const handleGenerateSummary = async (sk?: Skillset) => {
        const { data } = await generateSummary({
            variables: {
                input: {
                    id: 1,
                    cvContent: {
                        userBio: formData.userBio,
                        experiences: formData.experiences,
                        summary: formData.summary,
                        education: formData.education,
                        skillsets: sk ? sk : formData.skillset
                    },
                    jobPosting: formData.jobPosting,
                    cvType: "BASE"
                }
            }
        });
        return data?.generateSummary.summary
    }

    const handleChangeSummary = (summary: string) => {
        const values = {
            summary: {
                summary: summary
            }
        }
        setFormData(oldData => ({ ...oldData, ...values }));
    }

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

        if (!isPreferenceChosen) {
            showCvModal();
        }
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
            .upsert(experiences.map((exp, i) => ({
                profile_id: profileId,
                title: exp.title,
                company: exp.company,
                sector: exp.sector,
                is_current: exp.isCurrent,
                start_date: exp.startDate,
                end_date: exp.isCurrent ? null : exp.endDate,
                achievements: exp.achievements,
                seq_id: i + 1,
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
            .upsert(education.map((ed, i) => ({
                profile_id: profileId,
                subject: ed.subject,
                institution: ed.institution,
                degree: ed.degree,
                start_date: ed.startDate,
                end_date: ed.endDate,
                seq_id: i + 1,
                is_deleted: false
            })
            ), { onConflict: 'profile_id, seq_id' })
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
    }

    const handleCvSelect = async (value: string) => {
        setIsPreferenceChosen(true);
        if (value == "pre-filled") {
            const { data } = await generateSampleCv({
                variables: {
                    input: {
                        title: formData.jobPosting.title,
                        yearsOfExperience: YEARS_OF_EXPERIENCE,
                        sector: formData.jobPosting.sector,
                        jobRequirements: formData.jobPosting.requirements
                    }
                }
            })
            if (data?.generateSampleCv.experiences) {
                const mockExperience = {
                    experiences: data?.generateSampleCv.experiences.map(exp => ({
                        id: Number(exp.id),
                        title: exp.title,
                        company: exp.company,
                        sector: exp.sector,
                        isCurrent: exp.isCurrent,
                        startDate: exp.startDate,
                        endDate: exp.endDate ? exp.endDate : '',
                        achievements: exp.achievements
                    }))
                }
                setFormData(oldData => ({ ...oldData, ...mockExperience }))
            }
        }
        handleCancelCvModal();
        // if pre-filled, query list of experiences from prompts
        // if empty, proceed to an empty experience field
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

    const showCvModal = () => {
        setIsCvModalOpen(true);
    }

    const handleCancelCvModal = () => {
        setIsCvModalOpen(false);
    }

    const showDownloadModal = () => {
        setIsDownloadModalOpen(true);
    };

    const handleCancelDownloadModal = () => {
        setIsDownloadModalOpen(false);
    };

    const handleSubmit = async (values: SecondaryInput) => {
        setLoading(true);
        await insertSkillset(values.skillsets);
        await insertEducation(values.education);
        await insertUserBio(values.userBio);
        const summary = await handleGenerateSummary(values.skillsets);
        const mergingValue = {
            skillset: values.skillsets,
            summary: { summary: summary ? summary : "" },
            education: values.education,
            userBio: values.userBio
        }
        setFormData(oldData => ({ ...oldData, ...mergingValue }));
        messageApi.success("Your final touches saved!");
        showDownloadModal();
        setLoading(false);
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
            <Button type='primary' htmlType="submit" loading={loading}>{loading ? "Generating" : "Generate CV"}</Button>
        </Space>
    )

    const jobPostingAnimation = (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Image
                fill
                style={{ objectFit: "contain", borderRadius: '15px', border: '1px solid #d9d9d9', }}
                src='/job_posting.gif'
                alt='animation of copying job requirements from Indeed or LinkedIn onto our page.'
            />
        </div>
    );

    const ColumnLayout = ({ left, right }: { left: ReactNode, right: ReactNode }) => (
        <Row gutter={24}>
            <Col span={16}>
                {left}
            </Col>
            <Col span={8}>
                {right}
            </Col>
        </Row>
    );
    // to handle async compatibility throughout the app, we're making this 
    const rawItems = [
        {
            key: 'job',
            label: 'Job Posting',
            content: <ColumnLayout left={(
                <JobPostingForm
                    title="Where are you applying to?"
                    description="We'll use this to create a CV specific to this job."
                    value={formData.jobPosting}
                    onSubmit={insertJobPosting}
                    actions={startNextAction} />
            )}
                right={jobPostingAnimation}
            />
        },
        {
            key: 'experiences',
            label: 'Experiences',
            content:
                <ExperiencesForm
                    title="Let's fill out your work history"
                    profileId={profileId}
                    description="Things to note:"
                    profile={formData}
                    onSubmit={insertExperience}
                    actions={midNextActions}
                />
        },
        {
            key: 'bio-skillsets',
            label: 'Final touches',
            content: <ColumnLayout left={(<FinalTouchesForm
                title="Final touches"
                description="Add your bio, education, and unique skills that make you stand out."
                value={{ skillsets: formData.skillset, userBio: formData.userBio, education: formData.education }}
                onSubmit={handleSubmit}
                actions={endActions}
            />)}
                right={<RightDashboard profile={formData} />}
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
            <CvDownloadModal
                userId={userId}
                profileId={profileId}
                formData={formData}
                open={isDownloadModalOpen}
                onCancel={handleCancelDownloadModal}
                onFetchSummary={handleRetrySummary}
                onChangeSummary={handleChangeSummary}
                loading={loading}
                nextLink="/dashboard/home"
            />
            <SelectCvOptionModal
                loading={sampleCvLoading}
                title="Pick your preference"
                onSelect={handleCvSelect}
                onCancel={handleCancelCvModal}
                open={isCvModalOpen}
            />
        </>
    )
}

export default CvForm;