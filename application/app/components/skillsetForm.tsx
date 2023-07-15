"use client";
import { Formik } from "formik";
import Input from 'formik-antd/es/input';
import 'formik-antd/es/input/style';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import { withFormikDevtools } from "formik-devtools-extension";
import { Typography, Row, Col } from 'antd';
import { Skillset } from '@/models/cv';
import * as Yup from 'yup';

interface OtherProps {
    title: string;
    description?: string;
    isIntro: boolean;
    value: Skillset;
    onSubmit: (value: Skillset) => Promise<void>;
    actions: React.ReactNode;
}

const skillsetsValidationSchema = Yup.object().shape({
    skillsets: Yup.string().required("Required")
})

const SkillsetForm = (props: OtherProps) => {
    const { title, description, isIntro, onSubmit, value, actions } = props;

    const formItemLayout = {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
    };

    return (
        <Formik
            initialValues={value}
            validationSchema={skillsetsValidationSchema}
            onSubmit={async (values, actions) => {
                console.log("skillset values: ", values)
                await onSubmit(values);
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
                        <Row style={{ marginTop: 16 }} gutter={24} justify="start">
                            <Col span={24} key={1}>
                                <Form.Item required={true} name='skillsets' label='Skillsets'>
                                    <Input.TextArea name='skillsets' showCount autoSize={{ minRows: 3, maxRows: 15 }}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify='end'>
                            {actions}
                        </Row> 
                        </Col>
                        {isIntro ? <Col span={12}>
                            </Col> : null}
                        </Row>
                    </Form>
                )
            }}
        </Formik>);
}

export default SkillsetForm;