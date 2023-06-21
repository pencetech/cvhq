"use client";
import { Formik } from "formik";
import { Form, Input, Select } from 'formik-antd';
import { withFormikDevtools } from "formik-devtools-extension";
import { Button, Typography, Space, Row } from 'antd';
import { useFormContext } from "./cvForm";
import * as Yup from 'yup';

const { Option } = Select;

interface OtherProps {
    message: string;
}

interface FormValues {
    jobPosting: JobPosting;
}

interface JobPosting {
    title: string;
    company: string;
    requirements: string;
    addOn: string;
}

const jobPostingValidationSchema = Yup.object().shape({
    jobPosting: Yup.object().shape({
        title: Yup.string()
            .min(3, 'Too short!')
            .max(50, 'Too long!')
            .required('Required'),
        company: Yup.string()
            .min(3, 'Too short!')
            .max(50, 'Too long!')
            .required('Required'),
        requirements: Yup.string()
            .min(5, 'Too short!')
            .required('Required'),
        addOn: Yup.string()
            .min(5, 'Too short!')
    })
})

const JobPostingForm = (props: OtherProps) => {
    const { message } = props;
    const { activeStepIndex, setActiveStepIndex, formData, setFormData } = useFormContext();

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    };

    const handleBack = (e: any) => {
        e.preventDefault();
        setActiveStepIndex(activeStepIndex - 1);
    }

    return (
        <Formik
            initialValues={{
                jobPosting: {
                    title: '',
                    company: '',
                    requirements: '',
                    addOn: '',
                }
            }}
            validationSchema={jobPostingValidationSchema}
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
                        <Form.Item required={true} name='jobPosting.title' label='Job title'>
                            <Input name='jobPosting.title' />
                        </Form.Item>
                        <Form.Item required={true} name='jobPosting.company' label='Company name'>
                            <Input name='jobPosting.company' />
                        </Form.Item>
                        <Form.Item required={true} name='jobPosting.requirements' label='Requirements'>
                            <Input.TextArea showCount maxLength={300} name='jobPosting.requirements' />
                        </Form.Item>
                        <Form.Item name='jobPosting.addOn' label='Nice-to-haves'>
                            <Input.TextArea name='jobPosting.addOn' showCount maxLength={300} />
                        </Form.Item>
                        <Row justify='end'>
                            <Space>
                                <Button onClick={e => handleBack(e)}>Back</Button>
                                <Button type='primary' htmlType="submit">Save & Next</Button>
                            </Space>
                        </Row>
                    </Form>
                )
            }}
        </Formik>);
}

export default JobPostingForm;