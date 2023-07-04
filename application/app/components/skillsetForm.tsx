"use client";
import { Formik } from "formik";
import Input from 'formik-antd/es/input';
import 'formik-antd/es/input/style';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import { withFormikDevtools } from "formik-devtools-extension";
import { Typography, Row } from 'antd';
import { Skillset } from '@/models/cv';
import * as Yup from 'yup';

interface OtherProps {
    message: string;
    value: Skillset;
    onSubmit: (value: Skillset) => Promise<void>;
    actions: React.ReactNode;
}

const skillsetsValidationSchema = Yup.object().shape({
    skillsets: Yup.string().required("Required")
})

const SkillsetForm = (props: OtherProps) => {
    const { message, onSubmit, value, actions } = props;

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    };

    return (
        <Formik
            initialValues={value}
            validationSchema={skillsetsValidationSchema}
            onSubmit={(values, actions) => {
                onSubmit(values);
            }}
        >
            { props => {
                withFormikDevtools(props);
                return (
                    <Form {...formItemLayout}>
                        <Typography.Title level={5} style={{ margin: '0 0 12px 0' }}>{message}</Typography.Title>
                        <Form.Item required={true} name='skillsets' label='Skillsets'>
                            <Input.TextArea name='skillsets' showCount autoSize={{ minRows: 3, maxRows: 15 }}/>
                        </Form.Item>
                        <Row justify='end'>
                            {actions}
                        </Row> 
                    </Form>
                )
            }}
        </Formik>);
}

export default SkillsetForm;