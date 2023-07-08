"use client";
import React from 'react';
import { Formik, FieldArray } from "formik";
import { withFormikDevtools } from "formik-devtools-extension";
import { Button, Typography, Space, Row, Col } from 'antd';
import EducationCard from '@/app/components/educationCard';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import * as Yup from 'yup';
import { Education } from '@/models/cv';


type EducationFormSchema = {
    education: Education[]
}
interface OtherProps {
    title: string;
    description?: string;
    isIntro: boolean;
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
    const { title, description, isIntro, onSubmit, value, actions } = props;

    const formItemLayout = {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
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
                    <Form {...formItemLayout} layout="vertical">
                        <Row gutter={24}>
                            <Col span={isIntro ? 12 : 24}>
                        <div style={{ marginBottom: "12px"}}>
                                <Typography.Title level={3} style={{ margin: '0 0 12px 0' }}>{title}</Typography.Title>   
                                {description ? <div style={{ marginLeft: "12px" }}>
                                    <Typography.Title level={5} style={{ margin: '0 0 12px 0', color: '#a1a1a1' }}>{description}</Typography.Title>
                                    <Space direction="vertical">
                                        <Typography.Text style={{ color: '#a1a1a1' }}>Include formal education, sorted from the most recent one. </Typography.Text>
                                        <Typography.Text style={{ color: '#a1a1a1' }}>If you&apos;ve taken at least a GED or a Bachelor, we recommend not adding your high school diploma details.</Typography.Text>
                                    </Space>
                                </div> : null} 
                            </div>
                        <FieldArray
                            name='education'
                            render={(arrayHelpers: any) => (
                                <Space direction='vertical' className='w-full'>
                                    {props.values.education.map((ed, index) => (
                                        <React.Fragment key={index}>
                                            <EducationCard formProps={props} index={index} onClick={() => arrayHelpers.remove(index)} />
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
                        </Col>
                        {isIntro ? <Col span={12}>
                            </Col> : null}
                        </Row>
                    </Form>
                )
            }}
            
        </Formik>);
}

export default EducationForm;