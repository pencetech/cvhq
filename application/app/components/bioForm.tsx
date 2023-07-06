"use client";
import { Formik } from "formik";
import Input from 'formik-antd/es/input';
import 'formik-antd/es/input/style';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import Select from 'formik-antd/es/select';
import 'formik-antd/es/select/style';
import { withFormikDevtools } from "formik-devtools-extension";
import { Row, Typography } from 'antd';
import * as Yup from 'yup';
import { UserBio } from "@/models/cv";
import { PhoneOutlined } from "@ant-design/icons";

const { Option } = Select;

interface OtherProps {
    message: string;
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
    const { message, value, onSubmit, actions } = props;

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
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
                        >   
                            <Typography.Title level={5} style={{ margin: '0 0 12px 0' }}>{message}</Typography.Title>
                            <Form.Item required={true} name='firstName' label='First name'>
                                <Input name='firstName' placeholder='Jane' suffix />
                            </Form.Item>
                            <Form.Item required={true} name='lastName' label='Last name'>
                                <Input name='lastName' placeholder='Doe' suffix />
                            </Form.Item>
                            <Form.Item required={true} name='email' label='Email address'>
                                <Input prefix="@" name='email' placeholder='jane.doe@example.com' suffix />
                            </Form.Item>
                            <Form.Item required={true} label='Telephone no.' name='phone'>
                                <Input prefix={<PhoneOutlined className="site-form-item-icon" />} name='phone' />
                            </Form.Item>
                            <Form.Item required={true} label='Home address' name='address'>
                                <Input.TextArea showCount maxLength={100} name='address' />
                            </Form.Item>
                            <Row justify='end'>
                                {actions}
                            </Row>
                        </Form>
                )
            }}
        </Formik>
    );
}

export default BioForm;