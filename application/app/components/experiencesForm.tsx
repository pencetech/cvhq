"use client";
import React from 'react';
import { Formik, FieldArray, FormikProps, FormikErrors, FormikTouched } from "formik";
import { withFormikDevtools } from "formik-devtools-extension";
import { Button, Row, Space, Typography, Collapse, theme, Tag, Card } from 'antd';
import type { CollapseProps } from 'antd';
import ExperiencePlusCard from './experiencePlusCard';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import * as Yup from 'yup';
import { Experience, Experiences, FormData, JobPosting, UserBio } from '@/models/cv';
import { CaretRightOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import ColumnLayout from './columnLayout';
import RightDashboard from './rightDashboard';

interface OtherProps {
    title: string;
    description?: string;
    profile: FormData;
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
    const { title, description, onSubmit, profileId, profile, actions } = props;
    const { token } = theme.useToken();

    const panelStyle: React.CSSProperties = {
        marginBottom: 24,
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: 'none',
    };

    const countErrors = (error: [string, string][]) => {
        return error.reduce((a, item) => a + (item[1] ? 1 : 0), 0)
    }

    const getItems: (
        panelStyle: React.CSSProperties, 
        formProps: FormikProps<Experiences>,
        values: Experience[],
        remover: (i: number) => void
        ) => CollapseProps['items'] = (panelStyle, formProps, values, remover) => {

            const errCount = (index: number) => {
                if (formProps.errors.experiences && formProps.errors.experiences[index]) {
                    const touchedExperience =  formProps.touched.experiences ? 
                        formProps.touched.experiences[index] : null

                    const erroredExperience  = formProps.errors.experiences ?
                        formProps.errors.experiences[index] as FormikErrors<Experience> : null
                    console.log("aggregate touched: ", formProps.touched.experiences)
                    console.log("aggregate errors: ", formProps.errors.experiences)
                    const filteredError = Object.entries(formProps.errors.experiences[index])
                    .filter(field => {
                        if (touchedExperience &&
                            erroredExperience && 
                            touchedExperience[field[0] as keyof FormikTouched<Experience>] &&
                            erroredExperience[field[0] as keyof FormikErrors<Experience>]
                            ) {
                            return true;
                        }
                        return false;
                    })
                    return countErrors(filteredError);
                } else {
                    return 0;
                }
            }

            return values.map((value, index) => {
                const errs = errCount(index)
                return {
                key: index + 1,
                label: (<Space>
                            <Typography.Text>{formProps.values.experiences[index].company ? 
                            formProps.values.experiences[index].company : `Experience ${index + 1}`}</Typography.Text>
                            {errs ?
                                <Tag icon={<CloseCircleOutlined />} color="error">
                                  {`${errs} ${errs > 1 ? "errors" : "error"}`}
                                </Tag>
                            : null}   
                        </Space>),
                children: (<ExperiencePlusCard
                    formProps={formProps}
                    value={value}
                    userBio={profile.userBio}
                    jobPosting={profile.jobPosting}
                    profileId={profileId}
                    index={index}
                />),
                extra: (<DeleteOutlined onClick={() => remover(index)}/>),
                style: panelStyle
            };
        });
        }
            

    const formItemLayout = {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
    };

    return (
        <Formik
            initialValues={{
                experiences: profile.experiences
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
                         <ColumnLayout left={
                            <>
                            <div style={{ marginBottom: "12px"}}>
                                    <Typography.Title level={3} style={{ margin: '0 0 12px 0' }}>{title}</Typography.Title>    
                                    {description ? <Card>
                                        <Typography.Title level={5} style={{ margin: '0 0 12px 0', color: '#a1a1a1' }}>{description}</Typography.Title>
                                        <Space direction="vertical">
                                            <Typography.Text style={{ color: '#a1a1a1' }}>Employers scan your resume to see if you&apos;re a match.</Typography.Text>
                                            <Typography.Text style={{ color: '#a1a1a1' }}>We&apos;ll suggest bullet points that make a great impression.</Typography.Text>
                                        </Space>
                                    </Card> : null}
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
                                                    title: '',
                                                    company: '',
                                                    sector: '',
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
                            </>
                         }
                         right={
                            <RightDashboard profile={{...profile, ...props.values }} />
                         }
                         />
                    </Form>
                )
            }}
            
        </Formik>);
}

export default ExperiencesForm;