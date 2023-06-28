"use client";
import { useState } from 'react';
import { Formik } from "formik";
import Input from 'formik-antd/es/input';
import 'formik-antd/es/input/style';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import { withFormikDevtools } from "formik-devtools-extension";
import { Button, Typography, Space, Row, Modal } from 'antd';
import { useFormContext } from "./cvForm";
import * as Yup from 'yup';


interface OtherProps {
    message: string;
}

const skillsetsValidationSchema = Yup.object().shape({
    skillsets: Yup.object().shape({
        skillsets: Yup.string().required("Required")
    })
})

const SkillsetForm = (props: OtherProps) => {
    const { message } = props;
    const { activeStepIndex, setActiveStepIndex, formData, setFormData, generateCV, loading, error, cvBlobUrl } = useFormContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    };

    const showModal = () => {
        setIsModalOpen(true);
      };
    
    const handleOk = () => {
    setIsModalOpen(false);
    };

    const handleCancel = () => {
    setIsModalOpen(false);
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
            validationSchema={skillsetsValidationSchema}
            onSubmit={(values, actions) => {
                const reqData = { ...formData, ...values };
                setFormData(reqData);
                generateCV();
                showModal();
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
                                <Button type='primary' htmlType="submit" loading={loading}>{loading ? "Generating..." : "Generate CV"}</Button>
                            </Space>
                        </Row> 
                        {!loading ? <Modal
                            title="You are one step closer to your dream job!"
                            open={isModalOpen}
                            onOk={handleOk}
                            onCancel={handleCancel}
                            footer={[
                                <Button key="cancel" onClick={handleCancel}>Return</Button>,
                                <Button 
                                    key="download"
                                    type="primary"
                                    onClick={handleOk}
                                    download
                                    href={cvBlobUrl}
                                >Download</Button>
                            ]}
                            >
                                Please download here!
                        </Modal> : null}
                    </Form>
                )
            }}
        </Formik>);
}

export default SkillsetForm;