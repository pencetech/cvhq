"use client";
import { Formik } from "formik";
import Input from 'formik-antd/es/input';
import 'formik-antd/es/input/style';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import { withFormikDevtools } from "formik-devtools-extension";
import { Typography, Row, Button } from 'antd';
import { ProfileName } from '@/models/cv';
import * as Yup from 'yup';
import { useState } from "react";

interface OtherProps {
    message: string;
    onSubmit: (value: ProfileName) => Promise<void>;
}

const profileNameValidationSchema = Yup.object().shape({
    profileName: Yup.string().required("Required")
})

const ProfileNameForm = (props: OtherProps) => {
    const { message, onSubmit } = props;
    const [loading, setLoading] = useState(false);

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    };

    return (
        <Formik
            initialValues={{
                profileName: ''
            }}
            validationSchema={profileNameValidationSchema}
            onSubmit={async (values, actions) => {
                setLoading(true);
                await onSubmit(values);
                setLoading(false);
            }}
        >
            { props => {
                withFormikDevtools(props);
                return (
                    <Form {...formItemLayout}>
                        <p style={{ margin: '0 0 12px 0' }}>{message}</p>
                        <Form.Item required={true} name='profileName' label='Profile name'>
                            <Input name='profileName' suffix />
                        </Form.Item>
                        <Row justify='end'>
                            <Button loading={loading} type='primary' htmlType='submit'>
                                {loading ? "Creating" : "Create"}
                            </Button>
                        </Row> 
                    </Form>
                )
            }}
        </Formik>);
}

export default ProfileNameForm;