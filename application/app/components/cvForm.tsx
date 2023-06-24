"use client";
import { useState, createContext, useContext } from 'react';
import { Steps, theme } from 'antd';
import BioForm from './bioForm';
import JobPostingForm from './jobPostingForm';
import ExperiencesForm from './experiencesForm';
import EducationForm from './educationForm';

interface FormContextValue {
    activeStepIndex: number,
    setActiveStepIndex: React.Dispatch<React.SetStateAction<number>>,
    formData: {},
    setFormData: React.Dispatch<React.SetStateAction<{}>>
}

export const FormContext = createContext<FormContextValue | undefined >(undefined);

export const useFormContext = () => {
    const context = useContext(FormContext);
    
    if (context == undefined) {
        throw new Error('FormContext must be used within a FormContext.Provider')
    }

    return context;
}

const CvForm = () => {
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [formData, setFormData] = useState({});
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
            content: <EducationForm message="Experiences" />
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