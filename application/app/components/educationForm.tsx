"use client";
import React from 'react';
import { Formik, FieldArray } from "formik";
import { withFormikDevtools } from "formik-devtools-extension";
import { Button, Typography, Space, Row } from 'antd';
import EducationCard from '@/app/components/educationCard';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import * as Yup from 'yup';
import { Education } from '@/models/cv';


type EducationFormSchema = {
    education: Education[]
}
interface OtherProps {
    message: string;
    value: Education[];
    onSubmit: (value: Education[]) => Promise<void>;
    actions: React.ReactNode;
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
            degree: Yup.string().required('Required'),
            startDate: Yup.string().required('Required'),
            endDate: Yup.string().required('Required'),
        })
    )
    .min(1, 'Need at least one education')
    .required('Required')
})

const EducationForm = (props: OtherProps) => {
    const { message, onSubmit, value, actions } = props;

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    };

    return (
        <Formik
            initialValues={{
                education: value
            }}
            validationSchema={educationValidationSchema}
            onSubmit={async (values, actions) => {
                await onSubmit(values.education)
            }}
        >   
            { props => {
                withFormikDevtools(props);
                return (
                    <Form {...formItemLayout}>
                        <Typography.Title level={5} style={{ margin: '0 0 12px 0' }}>{message}</Typography.Title>
                        <FieldArray
                            name='education'
                            render={(arrayHelpers: any) => (
                                <Space direction='vertical' className='w-full'>
                                    {props.values.education.map((ed, index) => (
                                        <React.Fragment key={index}>
                                            <EducationCard index={index} onClick={() => arrayHelpers.remove(index)} />
                                        </React.Fragment>
                                    ))}
                                       <Button 
                                            type='dashed' 
                                            block
                                            onClick={() => arrayHelpers.push({
                                                id: props.values.education.length + 1,
                                                title: '',
                                                isCurrent: false,
                                                startDate: '',
                                                endDate: '',
                                                achievements: ''
                                            })}
                                        >+ Add education</Button>
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

export default EducationForm;