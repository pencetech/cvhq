"use client";
import { Formik } from "formik";
import Input from 'formik-antd/es/input';
import 'formik-antd/es/input/style';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import { withFormikDevtools } from "formik-devtools-extension";
import { Typography, Row } from 'antd';
import * as Yup from 'yup';
import { JobPosting } from "@/models/cv";

interface OtherProps {
    message: string;
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
        .max(50, 'Too long!')
        .required('Required'),
    requirements: Yup.string()
        .min(5, 'Too short!')
        .required('Required'),
    addOn: Yup.string()
        .min(5, 'Too short!')
})

const JobPostingForm = (props: OtherProps) => {
    const { message, onSubmit, value, actions } = props;

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
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
                    <Form {...formItemLayout}>
                        <Typography.Title level={5} style={{ margin: '0 0 12px 0' }}>{message}</Typography.Title>
                        <Form.Item required={true} name='title' label='Job title'>
                            <Input name='title' suffix />
                        </Form.Item>
                        <Form.Item required={true} name='company' label='Company name'>
                            <Input name='company' suffix />
                        </Form.Item>
                        <Form.Item required={true} name='sector' label='Company sector'>
                            <Input name='sector' suffix />
                        </Form.Item>
                        <Form.Item required={true} name='requirements' label='Requirements'>
                            <Input.TextArea showCount maxLength={1000} name='requirements' autoSize={{ minRows: 3, maxRows: 15 }} />
                        </Form.Item>
                        <Form.Item name='addOn' label='Nice-to-haves'>
                            <Input.TextArea name='addOn' showCount maxLength={1000} autoSize={{ minRows: 3, maxRows: 15 }} />
                        </Form.Item>
                        <Row justify='end'>
                            {actions}
                        </Row>
                    </Form>
                )
            }}
        </Formik>);
}

export default JobPostingForm;