"use client";
import { Formik } from "formik";
import Input from 'formik-antd/es/input';
import 'formik-antd/es/input/style';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import { withFormikDevtools } from "formik-devtools-extension";
import { Typography, Row, Col, Card } from 'antd';
import { BioSkillset } from '@/models/cv';
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import * as Yup from 'yup';

interface OtherProps {
    title: string;
    description?: string;
    isIntro: boolean;
    value: BioSkillset;
    onSubmit: (value: BioSkillset) => Promise<void>;
    actions: React.ReactNode;
}

const finalTouchesValidationSchema = Yup.object().shape({
    userBio: Yup.object().shape({
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
    }),
    skillsets: Yup.object().shape({
        skillsets: Yup.string().required("Required")
    })
})

const FinalTouchesForm = (props: OtherProps) => {
    const { title, description, isIntro, onSubmit, value, actions } = props;

    const formItemLayout = {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
    };

    return (
        <Formik
            initialValues={value}
            validationSchema={finalTouchesValidationSchema}
            onSubmit={async (values, actions) => {
                await onSubmit(values);
            }}
        >
            { props => {
                withFormikDevtools(props);
                return (
                    <>
                        <div style={{ marginBottom: "12px"}}>
                            <Typography.Title level={3} style={{ margin: '0 0 12px 0' }}>{title}</Typography.Title>
                            <Typography.Title level={5} style={{ margin: '0 0 12px 0', color: '#a1a1a1' }}>{description}</Typography.Title>
                        </div>
                        <Form {...formItemLayout} layout="vertical">
                            <Row gutter={[24, 24]}>
                                <Col span={isIntro ? 12 : 24}>
                                    <Card type="inner" title="Your Bio" style={{ margin: "12px 0" }}>
                                        <Row style={{ marginTop: 16 }} gutter={24} justify="start">
                                            <Col span={12} key={1}>
                                                <Form.Item required={true} name='userBio.firstName' label='First name'>
                                                    <Input name='userBio.firstName' placeholder='Jane' suffix />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} key={2}>
                                                <Form.Item required={true} name='userBio.lastName' label='Last name'>
                                                    <Input name='userBio.lastName' placeholder='Doe' suffix />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} key={3}>
                                                <Form.Item required={true} name='userBio.email' label='Email address'>
                                                    <Input prefix={<MailOutlined className="site-form-item-icon" />} name='userBio.email' placeholder='jane.doe@example.com' suffix />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} key={4}>
                                                <Form.Item required={true} label='Telephone no.' name='userBio.phone'>
                                                    <Input prefix={<PhoneOutlined className="site-form-item-icon" />} name='userBio.phone' />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} key={5}>
                                                <Form.Item required={true} label='Home address' name='userBio.address'>
                                                    <Input.TextArea showCount maxLength={100} name='userBio.address' />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                            <Row gutter={[24, 24]}>
                                <Col span={isIntro ? 12 : 24}>
                                    <Card type="inner" title="Skillsets" style={{ margin: "12px 0" }}>
                                        <Row style={{ marginTop: 16 }} gutter={24} justify="start">
                                            <Col span={24} key={1}>
                                                <Form.Item required={true} name='skillsets.skillsets' label='Skillsets'>
                                                    <Input.TextArea name='skillsets.skillsets' showCount autoSize={{ minRows: 3, maxRows: 15 }}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                            <Row gutter={[24, 24]}>
                                <Col span={isIntro ? 12 : 24}>
                                    <Row justify='end'>
                                        {actions}
                                    </Row>
                                </Col>
                            </Row>        
                        </Form>
                    </>
                )
            }}
        </Formik>);
}

export default FinalTouchesForm;