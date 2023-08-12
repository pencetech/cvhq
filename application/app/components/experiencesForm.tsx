"use client";
import React from 'react';
import { Formik, FieldArray, FormikProps } from "formik";
import { withFormikDevtools } from "formik-devtools-extension";
import { Button, Row, Col, Space, Typography, Collapse, theme } from 'antd';
import type { CollapseProps } from 'antd';
import ExperienceCard from '@/app/components/experienceCard';
import ExperiencePlusCard from './experiencePlusCard';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import * as Yup from 'yup';
import { Experience, Experiences, JobPosting, UserBio } from '@/models/cv';
import { CaretRightOutlined } from '@ant-design/icons';

interface OtherProps {
    title: string;
    description?: string;
    isIntro: boolean;
    value: Experience[];
    userBio: UserBio;
    jobPosting: JobPosting;
    onSubmit: (value: Experience[]) => Promise<void>;
    profileId: number;
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
    const { title, description, isIntro, onSubmit, profileId, value, userBio, jobPosting, actions } = props;
    const { token } = theme.useToken();

    const panelStyle: React.CSSProperties = {
        marginBottom: 24,
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: 'none',
    };

    const getItems: (
        panelStyle: React.CSSProperties, 
        formProps: FormikProps<Experiences>,
        values: Experience[],
        remover: (i: number) => void) => CollapseProps['items'] = (panelStyle, formProps, values, remover) => 
        values.map((value, index) => (
        {
            key: index + 1,
            label: `Experience ${index + 1}`,
            children: <ExperiencePlusCard
                formProps={formProps}
                value={value}
                userBio={userBio}
                jobPosting={jobPosting}
                profileId={profileId}
                index={index}
                onRemove={remover}
            />,
            style: panelStyle
        }));

    const formItemLayout = {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
    };

    return (
        <Formik
            initialValues={{
                experiences: value
            }}
            validationSchema={experienceValidationSchema}
            enableReinitialize
            onSubmit={(values, actions) => {
                onSubmit(values.experiences)
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
                                        <Typography.Text style={{ color: '#a1a1a1' }}>Employers scan your resume to see if you&apos;re a match.</Typography.Text>
                                        <Typography.Text style={{ color: '#a1a1a1' }}>We&apos;ll suggest bullet points that make a great impression.</Typography.Text>
                                    </Space>
                                </div> : null}
                            </div>
                        <FieldArray
                            name='experiences'
                            render={(arrayHelpers: any) => (
                                <Space direction='vertical' className='w-full'>
                                    <Collapse
                                        bordered={false}
                                        defaultActiveKey={['1']}
                                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                        style={{ background: token.colorBgContainer }}
                                        items={getItems(
                                            panelStyle,
                                            props,
                                            props.values.experiences,
                                            (index: number) => arrayHelpers.remove(index)
                                        )}
                                    />
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
                        </Col>
                        {isIntro ? <Col span={12}>
                            </Col> : null}
                        </Row>
                    </Form>
                )
            }}
            
        </Formik>);
}

export default ExperiencesForm;