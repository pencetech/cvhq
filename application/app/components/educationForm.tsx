"use client";
import React from 'react';
import { Formik, FieldArray } from "formik";
import { withFormikDevtools } from "formik-devtools-extension";
import { Button, Typography, Space, Row } from 'antd';
import EducationCard from '@/app/components/educationCard';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import { useFormContext } from "./cvForm";
import * as Yup from 'yup';

interface OtherProps {
    message: string;
}

const educationValidationSchema = Yup.object().shape({
    education: Yup.array().of(
        Yup.object().shape({
            subject: Yup.string()
                .min(3, 'Too short!')
                .max(50, 'Too long!')
                .required('Required'),
            institution: Yup.string()
                .min(3, 'Too short!')
                .max(50, 'Too long!')
                .required('Required'),
            degree: Yup.string()
                .min(5, 'Too short!')
                .required('Required'),
            startDate: Yup.date().required('Required'),
            endDate: Yup.date().required('Required'),
        })
    )
    .min(1, 'Need at least one education')
    .required('Required')
})

const JobPostingForm = (props: OtherProps) => {
    const { message } = props;
    const { activeStepIndex, setActiveStepIndex, formData, setFormData } = useFormContext();

    const handleBack = (e: any) => {
        e.preventDefault();
        setActiveStepIndex(activeStepIndex - 1);
    }

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    };

    return (
        <Formik
            initialValues={{
                experiences: [{
                    title: '',
                    isCurrent: false,
                    startDate: new Date(),
                    endDate: new Date(),
                    achievements: ''
                }]
            }}
            validationSchema={educationValidationSchema}
            onSubmit={(values, actions) => {
                const data = { ...formData, ...values };
                setFormData(data);
                setActiveStepIndex(activeStepIndex + 1);
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
                                            <EducationCard index={index} onClick={() => arrayHelpers.remove(index)} />
                                        </React.Fragment>
                                    ))}
                                        <Button 
                                            type='dashed' 
                                            block
                                            onClick={() => arrayHelpers.push({
                                                title: '',
                                                isCurrent: false,
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                achievements: ''
                                            })}
                                        >+ Add experience</Button>
                                        <Row justify='end'>
                                            <Space>
                                                <Button onClick={e => handleBack(e)}>Back</Button>
                                                <Button type='primary' htmlType='submit'>Save</Button>
                                            </Space>
                                        </Row>
                                </Space>
                            )}
                        />
                    </Form>
                )
            }}
            
        </Formik>);
}

export default JobPostingForm;