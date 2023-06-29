"use client";
import React from 'react';
import { Formik, FieldArray } from "formik";
import { withFormikDevtools } from "formik-devtools-extension";
import { Button, Row, Space, Typography } from 'antd';
import ExperienceCard from '@/app/components/experienceCard';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import { useFormContext } from "./cvForm";
import * as Yup from 'yup';

interface OtherProps {
    message: string;
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
        endDate: Yup.string().required('Required'),
        achievements: Yup.string()
            .min(5, 'Too short!')
            .required('Required')
        })
    )
    .min(1, 'Need at least one experience')
    .required('Required')
});

const ExperiencesForm = (props: OtherProps) => {
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
                experiences: formData.experiences
            }}
            validationSchema={experienceValidationSchema}
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
                                            <ExperienceCard props={props} index={index} onClick={() => arrayHelpers.remove(index)} />
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
                                            <Space>
                                                <Button onClick={e => handleBack(e)}>Back</Button>
                                                <Button type='primary' htmlType='submit'>Save & Next</Button>
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

export default ExperiencesForm;