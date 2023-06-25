"use client";
import { useState, createContext, useContext } from 'react';
import { Steps, theme } from 'antd';
import BioForm from './bioForm';
import JobPostingForm from './jobPostingForm';
import ExperiencesForm from './experiencesForm';
import EducationForm from './educationForm';
import SkillsetForm from './skillsetForm';

interface FormContextValue {
    activeStepIndex: number,
    setActiveStepIndex: React.Dispatch<React.SetStateAction<number>>,
    formData: FormData,
    setFormData: React.Dispatch<React.SetStateAction<FormData>>
}

export const FormContext = createContext<FormContextValue | undefined >(undefined);

export const useFormContext = () => {
    const context = useContext(FormContext);
    
    if (context == undefined) {
        throw new Error('FormContext must be used within a FormContext.Provider')
    }

    return context;
}

export interface UserBio {
    firstName: string;
    lastName: string;
    email: string;
    phone: string[];
    address: string;
}
export interface JobPosting {
    title: string;
    company: string;
    sector: string;
    requirements: string;
    addOn: string;
}
export interface Experience {
    title: string;
    company: string;
    isCurrent: boolean;
    startDate: Date;
    endDate: Date;
    achievements: string;
}
export interface Education {
    subject: string,
    institution: string,
    degree: string,
    startDate: Date,
    endDate: Date
}

export interface Skillset {
    skillsets: string
}
interface FormData {
    userBio: UserBio,
    jobPosting: JobPosting,
    experiences: Experience[],
    education: Education[],
    skillsets: Skillset
};

const CvForm = () => {
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [formData, setFormData] = useState<FormData>({
        userBio: {
            firstName: '',
            lastName: '',
            email: '',
            phone: ['', ''],
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
            isCurrent: false,
            startDate: new Date(),
            endDate: new Date(),
            achievements: ''
        }],
        education: [{
            subject: '',
            institution: '',
            degree: '',
            startDate: new Date(),
            endDate: new Date(),
        }],
        skillsets: {
            skillsets: '',
        }
    });
    const { token } = theme.useToken();

    const rawItems = [
        {   
            key: 'bio',
            label: 'Your Bio',
            content: <BioForm message="Your Bio" />
        },
        {
            key: 'job',
            label: 'Job Posting',
            content: <JobPostingForm message="Job Posting" />
        },
        {
            key: 'experiences',
            label: 'Experiences',
            content: <ExperiencesForm message="Experiences" />
        },
        {
            key: 'education',
            label: 'Education',
            content: <EducationForm message="Education" />
        },
        {
            key: 'skillsets',
            label: 'Skillsets',
            content: <SkillsetForm message="Skillsets" />
        }
    ]

    const items = rawItems.map((item) => ({
        key: item.key,
        title: item.label,
      }));

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
        <FormContext.Provider value={{activeStepIndex, setActiveStepIndex, formData, setFormData }}>
                <Steps
                    items={items}
                    current={activeStepIndex}
                    style={{ margin: '16px 0', minHeight: '100%' }}
                />
                <div style={contentStyle}>{rawItems[activeStepIndex].content}</div>
        </FormContext.Provider>
    )
}

export default CvForm;