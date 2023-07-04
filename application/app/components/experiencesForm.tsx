"use client";
import React from 'react';
import { Formik, FieldArray } from "formik";
import { withFormikDevtools } from "formik-devtools-extension";
import { Button, Row, Space, Typography } from 'antd';
import ExperienceCard from '@/app/components/experienceCard';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import * as Yup from 'yup';
import { Experience, JobPosting, UserBio } from '@/models/cv';

type ExperienceFormSchema = {
    experiences: Experience[]
}
interface OtherProps {
    message: string;
    value: Experience[];
    userBio: UserBio;
    jobPosting: JobPosting;
    onSubmit: (value: Experience[]) => void;
    actions: React.ReactNode;
}

const experienceValidationSchema = Yup.object().shape({
    experiences: Yup.array().of(
        Yup.object().shape({
        title: Yup.string()
            .min(3, 'Too short!')
            .max(50, 'Too long!')
            .required('Required'),
        company: Yup.string()
            .required('Required'),
        sector: Yup.string()
            .required('Required'),
        isCurrent: Yup.boolean().required('Required'),
        startDate: Yup.string().required('Required'),
        endDate: Yup.string(),
        achievements: Yup.string()
            .min(5, 'Too short!')
            .required('Required')
        })
    )
    .min(1, 'Need at least one experience')
    .required('Required')
});

const ExperiencesForm = (props: OtherProps) => {
    const { message, onSubmit, value, userBio, jobPosting, actions } = props;

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    };

    return (
        <Formik
            initialValues={{
                experiences: value
            }}
            validationSchema={experienceValidationSchema}
            onSubmit={(values, actions) => {
                onSubmit(values.experiences)
            }}
        >   
            { props => {
                withFormikDevtools(props);
                return (
                    <Form {...formItemLayout}>
                        <Typography.Title level={5} style={{ margin: '0 0 12px 0' }}>{message}</Typography.Title>
                        <FieldArray
                            name='experiences'
                            render={(arrayHelpers: any) => (
                                <Space direction='vertical' className='w-full'>
                                    {props.values.experiences.map((experience, index) => (
                                        <React.Fragment key={index}>
                                            <ExperienceCard 
                                                formProps={props} 
                                                index={index} 
                                                onClick={() => arrayHelpers.remove(index)}
                                                userBio={userBio}
                                                jobPosting={jobPosting}
                                                value={props.values.experiences[index]}
                                            />
                                        </React.Fragment>
                                    ))}
                                        <Button 
                                            type='dashed' 
                                            block
                                            onClick={() => arrayHelpers.push({
                                                id: props.values.experiences.length + 1,
                                                title: '',
                                                isCurrent: false,
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                achievements: ''
                                            })}
                                        >+ Add experience</Button>
                                        <Row justify='end'>
                                            {actions}
                                        </Row>
                                </Space>
                            )}
                        />
                    </Form>
                )
            }}
            
        </Formik>);
}

export default ExperiencesForm;