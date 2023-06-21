"use client";
import { Formik } from "formik";
import Input from 'formik-antd/es/input';
import 'formik-antd/es/input/style';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import Select from 'formik-antd/es/select';
import 'formik-antd/es/select/style';
import { withFormikDevtools } from "formik-devtools-extension";
import { Button, Row, Typography } from 'antd';
import * as Yup from 'yup';
import { useFormContext } from './cvForm';

const { Option } = Select;

interface OtherProps {
    message: string;
}

interface FormValues {
    userBio: UserBio
}

interface UserBio {
    firstName: string;
    lastName: string;
    email: string;
    phone: string[];
    address: string;
}

const bioValidationSchema = Yup.object().shape({
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
        phone: Yup.array().of(Yup.string()
            .required('Required'))
            .min(2, "Need complete phone number."),
        address: Yup.string()
            .min(3, 'Too short!')
            .required('Required')
    })
})

const BioForm = (props: OtherProps) => {
    const { message } = props;
    const { activeStepIndex, setActiveStepIndex, formData, setFormData } = useFormContext();

    const prefixSelector = (
        <Form.Item name="userBio.phone[0]" noStyle>
            <Select name="userBio.phone[0]" style={{ width: 70 }}>
            <Option value="44">+44</Option>
            <Option value="91">+91</Option>
            <Option value="62">+62</Option>
            <Option value="65">+65</Option>
            <Option value="852">+852</Option>
            <Option value="1">+1</Option>
            </Select>
        </Form.Item>
    );

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    };

    return (
        <Formik
            initialValues={{
                userBio: {
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: ['',''],
                    address: '',
            }}}
            validationSchema={bioValidationSchema}
            onSubmit={(values, actions) => {
                const data = { ...formData, ...values };
                setFormData(data);
                setActiveStepIndex(activeStepIndex + 1);
            }}
        >
            { props => {
                withFormikDevtools(props);
                return (
                        <Form
                            {...formItemLayout}
                        >   
                            <Typography.Title level={5} style={{ margin: '0 0 12px 0' }}>{message}</Typography.Title>
                            <Form.Item required={true} name='userBio.firstName' label='First name'>
                                <Input name='userBio.firstName' placeholder='Jane' />
                            </Form.Item>
                            <Form.Item required={true} name='userBio.lastName' label='Last name'>
                                <Input name='userBio.lastName' placeholder='Doe' />
                            </Form.Item>
                            <Form.Item required={true} name='userBio.email' label='Email address'>
                                <Input name='userBio.email' placeholder='jane.doe@example.com' />
                            </Form.Item>
                            <Form.Item required={true} label='Telephone no.' name='userBio.phone[1]'>
                                <Input addonBefore={prefixSelector} name='userBio.phone[1]' />
                            </Form.Item>
                            <Form.Item required={true} label='Home address' name='userBio.address'>
                                <Input.TextArea showCount maxLength={100} name='userBio.address' />
                            </Form.Item>
                            <Row justify='end'>
                                <Button type='primary' htmlType='submit'>Save & Next</Button>
                            </Row>
                        </Form>
                )
            }}
        </Formik>
    );
}

export default BioForm;