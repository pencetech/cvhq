"use client";
import { Formik } from "formik";
import Image from 'next/image';
import Input from 'formik-antd/es/input';
import 'formik-antd/es/input/style';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import { withFormikDevtools } from "formik-devtools-extension";
import { Typography, Row, Col, Cascader } from 'antd';
import * as Yup from 'yup';
import { JobPosting } from "@/models/cv";
import { sectors } from "@/models/sector";

interface OtherProps {
    title: string;
    description?: string;
    isIntro: boolean;
    value: JobPosting;
    onSubmit: (value: JobPosting) => Promise<void>;
    actions: React.ReactNode;
}

const jobPostingValidationSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, 'Too short!')
        .max(50, 'Too long!')
        .required('Required'),
    company: Yup.string()
        .min(3, 'Too short!')
        .max(50, 'Too long!')
        .required('Required'),
    sector: Yup.string()
        .required('Required'),
    requirements: Yup.string()
        .min(5, 'Too short!')
        .required('Required')
})

const JobPostingForm = (props: OtherProps) => {
    const { title, description, isIntro, onSubmit, value, actions } = props;

    const formItemLayout = {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
    };

    return (
        <Formik
            initialValues={value}
            validationSchema={jobPostingValidationSchema}
            onSubmit={(values, actions) => {
                onSubmit(values)
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
                                <Typography.Title level={5} style={{ margin: '0 0 12px 0', color: '#a1a1a1' }}>{description}</Typography.Title>
                            </div>
                            <Row style={{ marginTop: 16 }} gutter={24}>
                                <Col span={12} key={1}>
                                    <Form.Item required={true} name='title' label='Job title'>
                                        <Input name='title' suffix />
                                    </Form.Item>
                                </Col>
                                <Col span={12} key={2}>
                                    <Form.Item required={true} name='company' label='Company name'>
                                        <Input name='company' suffix />
                                    </Form.Item>
                                </Col>
                                <Col span={12} key={3}>
                                    <Form.Item required={true} name='sector' label='Company sector / role type'>
                                        <Cascader 
                                            value={props.values.sector ? 
                                               props.values.sector.split("/") : ['']}
                                            options={sectors}
                                            onChange={(value, options) => {
                                                props.setFieldValue(`sector`, value ? value.join("/") : "")
                                                props.setFieldTouched(`sector`, true, false)
                                            }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item required={true} name='requirements' label='Requirements'>
                                <Input.TextArea showCount maxLength={1000} name='requirements' autoSize={{ minRows: 4, maxRows: 15 }} />
                            </Form.Item>
                            <Row justify='end'>
                                {actions}
                            </Row>
                            
                        </Col>
                        {isIntro ? <Col span={12}>
                        <div style={{width: '100%', height: '100%', position: 'relative'}}>
                                <Image
                                fill 
                                style={{ objectFit: "contain", borderRadius: '15px', border: '1px solid #d9d9d9', }}
                                src='/job_posting.gif'
                                alt='animation of copying job requirements from Indeed or LinkedIn onto our page.'
                                />
                                </div>
                            </Col> : null}
                    </Row>
                    </Form>
                )
            }}
        </Formik>);
}

export default JobPostingForm;