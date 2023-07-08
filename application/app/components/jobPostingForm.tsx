"use client";
import { Formik } from "formik";
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
        .required('Required'),
    addOn: Yup.string()
        .min(5, 'Too short!')
})

const JobPostingForm = (props: OtherProps) => {
    const { title, description, onSubmit, value, actions } = props;

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
                         <div style={{ width: "50%" }}>
                            <div style={{ marginBottom: "12px"}}>
                                <Typography.Title level={3} style={{ margin: '0 0 12px 0' }}>{title}</Typography.Title>
                                <Typography.Title level={5} style={{ margin: '0 0 12px 0', color: '#a1a1a1' }}>{description}</Typography.Title>
                            </div>
                            <Row gutter={24}>
                                <Col span={12} key={1}>
                                    <Form.Item required={true} name='title' label='Job title'>
                                        <Input name='title' suffix />
                                    </Form.Item>
                                </Col>
                                <Col span={12} key={1}>
                                    <Form.Item required={true} name='company' label='Company name'>
                                        <Input name='company' suffix />
                                    </Form.Item>
                                </Col>
                                <Col span={12} key={1}>
                                    <Form.Item required={true} name='sector' label='Company sector'>
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
                            <Form.Item name='addOn' label='Nice-to-haves'>
                                <Input.TextArea name='addOn' showCount maxLength={1000} autoSize={{ minRows: 2, maxRows: 15 }} />
                            </Form.Item>
                            <Row justify='end'>
                                {actions}
                            </Row>
                        </div>
                    </Form>
                )
            }}
        </Formik>);
}

export default JobPostingForm;