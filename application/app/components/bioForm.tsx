"use client";
import { Formik } from "formik";
import Input from 'formik-antd/es/input';
import 'formik-antd/es/input/style';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import Select from 'formik-antd/es/select';
import 'formik-antd/es/select/style';
import Image from 'next/image';
import { withFormikDevtools } from "formik-devtools-extension";
import { Col, Row, Typography } from 'antd';
import * as Yup from 'yup';
import { UserBio } from "@/models/cv";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";

const { Option } = Select;

interface OtherProps {
    title: string;
    description?: string;
    isIntro: boolean;
    value: UserBio;
    onSubmit: (value: UserBio) => Promise<void>;
    actions: React.ReactNode;
}

const bioValidationSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, 'Too short!')
        .max(50, 'Too long!')
        .required('Required'),
    lastName: Yup.string()
        .min(2, 'Too short!')
        .max(50, 'Too long!')
        .required('Required'),
    email: Yup.string()
        .email('Invalid email')
        .required('Required'),
    phone: Yup.string()
        .required('Required')
        .min(2, "Need complete phone number."),
    address: Yup.string()
        .min(3, 'Too short!')
        .required('Required')
})

const BioForm = (props: OtherProps) => {
    const { title, description, isIntro, value, onSubmit, actions } = props;

    const formItemLayout = {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
    };

    return (
        <Formik
            initialValues={value}
            validationSchema={bioValidationSchema}
            onSubmit={async (values, actions) => {
                await onSubmit(values);
            }}
        >
            { props => {
                withFormikDevtools(props);
                return (
                        <Form
                            {...formItemLayout}
                            layout="vertical"
                        >   
                        <Row gutter={24}>
                            <Col span={isIntro ? 12 : 24}>
                                    <div style={{ marginBottom: "12px"}}>
                                        <Typography.Title level={3} style={{ margin: '0 0 12px 0' }}>{title}</Typography.Title>
                                        <Typography.Title level={5} style={{ margin: '0 0 12px 0', color: '#a1a1a1' }}>{description}</Typography.Title>
                                    </div>
                                    <Row style={{ marginTop: 16 }} gutter={24} justify="start">
                                        <Col span={12} key={1}>
                                            <Form.Item required={true} name='firstName' label='First name'>
                                                <Input name='firstName' placeholder='Jane' suffix />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} key={2}>
                                            <Form.Item required={true} name='lastName' label='Last name'>
                                                <Input name='lastName' placeholder='Doe' suffix />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} key={3}>
                                            <Form.Item required={true} name='email' label='Email address'>
                                                <Input prefix={<MailOutlined className="site-form-item-icon" />} name='email' placeholder='jane.doe@example.com' suffix />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} key={4}>
                                            <Form.Item required={true} label='Telephone no.' name='phone'>
                                                <Input prefix={<PhoneOutlined className="site-form-item-icon" />} name='phone' />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} key={5}>
                                            <Form.Item required={true} label='Home address' name='address'>
                                                <Input.TextArea showCount maxLength={100} name='address' />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                <Row justify='end'>
                                    {actions}
                                </Row>
                            </Col>
                            {isIntro ? <Col span={12}>
                            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                <Image
                                fill 
                                style={{ objectFit: "contain", borderRadius: '15px', border: '1px solid #d9d9d9' }}
                                src='/your_bio.gif'
                                alt='animation of highlighting bio on CV.'
                                />
                            </div>
                            </Col> : null}
                        </Row>
                        </Form>
                )
            }}
        </Formik>
    );
}

export default BioForm;