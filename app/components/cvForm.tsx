"use client";
import { useState, createContext, useContext } from 'react';
import { Space, Tabs, Typography } from 'antd';
import BioForm from './bioForm';
import JobPostingForm from './jobPostingForm';
import ExperiencesForm from './experiencesForm';


interface FormContextValue {
    activeStepIndex: number,
    setActiveStepIndex: React.Dispatch<React.SetStateAction<number>>,
    formData: {},
    setFormData: React.Dispatch<React.SetStateAction<{}>>
}

interface UserBio {
    firstName: string;
    lastName: string;
    email: string;
    phone: string[];
    address: string;
}

interface JobPosting {
    title: string;
    company: string;
    requirements: string;
    addOn: string;
}

interface Experience {
    title: string;
    isCurrent: boolean;
    startDate: Date;
    endDate: Date;
    achievements: string;
}

interface FormData {
    userBio: UserBio,
    jobPosting: JobPosting,
    experiences: Experience[]
};

export const FormContext = createContext<FormContextValue | undefined >(undefined);

export const useFormContext = () => {
    const context = useContext(FormContext);
    
    if (context == undefined) {
        throw new Error('FormContext must be used within a FormContext.Provider')
    }

    return context;
}

const CvForm = () => {
    const [activeStepIndex, setActiveStepIndex] = useState(1);
    const [formData, setFormData] = useState({});

    const tabItems = [
        {
            label: 'Your Bio',
            key: '1',
            children: <BioForm message="Your Bio" />
        },
        {
            label: 'Job Posting',
            key: '2',
            children: <JobPostingForm message="Job Posting" />
        },
        {
            label: 'Your Experiences',
            key: '3',
            children: <ExperiencesForm message="Experiences" />
        }
    ]

    return (
        <FormContext.Provider value={{activeStepIndex, setActiveStepIndex, formData, setFormData }}>
            <Tabs
                items={tabItems}
                activeKey={activeStepIndex.toString()}
                style={{ margin: '16px 0'}}
            />
        </FormContext.Provider>
    )
}

export default CvForm;