"use client";
import { Formik } from "formik";
import Input from 'formik-antd/es/input';
import 'formik-antd/es/input/style';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import Select from 'formik-antd/es/select';
import 'formik-antd/es/select/style';
import { withFormikDevtools } from "formik-devtools-extension";
import { Button, Typography, Space, Row } from 'antd';
import { useFormContext } from "./cvForm";
import * as Yup from 'yup';

const { Option } = Select;

interface OtherProps {
    message: string;
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
        sector: Yup.string()
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
                jobPosting: formData.jobPosting
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
                            <Input name='jobPosting.title' suffix />
                        </Form.Item>
                        <Form.Item required={true} name='jobPosting.company' label='Company name'>
                            <Input name='jobPosting.company' suffix />
                        </Form.Item>
                        <Form.Item required={true} name='jobPosting.sector' label='Company sector'>
                            <Input name='jobPosting.sector' suffix />
                        </Form.Item>
                        <Form.Item required={true} name='jobPosting.requirements' label='Requirements'>
                            <Input.TextArea showCount maxLength={1000} name='jobPosting.requirements' autoSize={{ minRows: 3, maxRows: 15 }} />
                        </Form.Item>
                        <Form.Item name='jobPosting.addOn' label='Nice-to-haves'>
                            <Input.TextArea name='jobPosting.addOn' showCount maxLength={1000} autoSize={{ minRows: 3, maxRows: 15 }} />
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