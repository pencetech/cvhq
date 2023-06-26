"use client";
import { Formik } from "formik";
import Input from 'formik-antd/es/input';
import 'formik-antd/es/input/style';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import { withFormikDevtools } from "formik-devtools-extension";
import { Button, Typography, Space, Row } from 'antd';
import { useFormContext } from "./cvForm";
import * as Yup from 'yup';


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
        requirements: Yup.string()
            .min(5, 'Too short!')
            .required('Required'),
        addOn: Yup.string()
            .min(5, 'Too short!')
    })
})

const SkillsetForm = (props: OtherProps) => {
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
                skillsets: formData.skillsets
            }}
            validationSchema={jobPostingValidationSchema}
            onSubmit={(values, actions) => {
                const data = { ...formData, ...values };
                setFormData(data);
                // mutation here through formcontext
                setActiveStepIndex(activeStepIndex + 1);
            }}
        >
            { props => {
                withFormikDevtools(props);
                return (
                    <Form {...formItemLayout}>
                        <Typography.Title level={5} style={{ margin: '0 0 12px 0' }}>{message}</Typography.Title>
                        <Form.Item required={true} name='skillsets.skillsets' label='Skillsets'>
                            <Input.TextArea name='skillsets.skillsets' showCount autoSize={{ minRows: 3, maxRows: 15 }}/>
                        </Form.Item>
                        <Row justify='end'>
                            <Space>
                                <Button onClick={e => handleBack(e)}>Back</Button>
                                <Button type='primary' htmlType="submit">Generate CV</Button>
                            </Space>
                        </Row>
                    </Form>
                )
            }}
        </Formik>);
}

export default SkillsetForm;