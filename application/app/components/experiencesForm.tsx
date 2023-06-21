"use client";
import { Formik, FieldArray } from "formik";
import Input from 'formik-antd/es/input';
import 'formik-antd/es/input/style';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import Select from 'formik-antd/es/select';
import 'formik-antd/es/select/style';
import Checkbox from 'formik-antd/es/checkbox';
import 'formik-antd/es/checkbox/style';
import DatePicker from 'formik-antd/es/date-picker';
import 'formik-antd/es/date-picker/style';
import { withFormikDevtools } from "formik-devtools-extension";
import { Button, Row, Space, Card, Typography } from 'antd';
import { useFormContext } from "./cvForm";
import * as Yup from 'yup';

const { Option } = Select;

interface OtherProps {
    message: string;
}

interface FormValues {
    experiences: Experience[];
}

interface Experience {
    title: string;
    isCurrent: boolean;
    startDate: Date;
    endDate: Date;
    achievements: string;
}

const experienceValidationSchema = Yup.object().shape({
    experiences: Yup.array().of(
        Yup.object().shape({
        title: Yup.string()
            .min(3, 'Too short!')
            .max(50, 'Too long!')
            .required('Required'),
        isCurrent: Yup.boolean().required('Required'),
        startDate: Yup.date().required('Required'),
        endDate: Yup.date().required('Required'),
        achievements: Yup.string()
            .min(5, 'Too short!')
            .required('Required')
        })
    )
    .min(1, 'Need at least one experience')
    .required('Required')
});

const ExperiencesForm = (props: OtherProps) => {
    const { message } = props;
    const { activeStepIndex, setActiveStepIndex, formData, setFormData } = useFormContext();

    const experienceForm = (props: any, index: number) => (
        <>
            <Form.Item required={true} name={`experiences[${index}].title`} label='Job title'>
                <Input name={`experiences[${index}].title`} />
            </Form.Item>
            <Form.Item required={true} name={`experiences[${index}].isCurrent`} label='My current job'>
                <Checkbox name={`experiences[${index}].isCurrent`} />
            </Form.Item>
            <Form.Item required={true} name={`experiences[${index}].startDate`} label='Start date'>
                <DatePicker name={`experiences[${index}].startDate`} picker='month' />
            </Form.Item>
            <Form.Item name={`experiences[${index}].endDate`} label='endDate'>
                <DatePicker 
                    name={`experiences[${index}].endDate`} 
                    picker='month'
                    disabled={props.values.experiences[index].isCurrent ? true : false} />
            </Form.Item>
            <Form.Item required={true} name={`experiences[${index}].achievements`} label='Achievements'>
                <Input.TextArea name={`experiences[${index}].achievements`} />
            </Form.Item>
        </>
    );

    const handleBack = (e: any) => {
        e.preventDefault();
        setActiveStepIndex(activeStepIndex - 1);
    }

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    };

    return (
        <Formik
            initialValues={{
                experiences: [{
                    title: '',
                    isCurrent: false,
                    startDate: new Date(),
                    endDate: new Date(),
                    achievements: ''
                }]
            }}
            validationSchema={experienceValidationSchema}
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
                        <FieldArray
                            name='experiences'
                            render={(arrayHelpers: any) => (
                                <Space direction='vertical' className='w-full'>
                                    {props.values.experiences.map((experience, index) => (
                                        <Card key={index}>
                                            {experienceForm(props, index)}
                                            <Row justify='end'>
                                                <Button onClick={() => arrayHelpers.remove(index)}>Remove</Button>
                                            </Row>
                                        </Card>
                                    ))}
                                        <Button 
                                            type='dashed' 
                                            block
                                            onClick={() => arrayHelpers.push({
                                                title: '',
                                                isCurrent: false,
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                achievements: ''
                                            })}
                                        >+ Add experience</Button>
                                        <Row justify='end'>
                                            <Space>
                                                <Button onClick={e => handleBack(e)}>Back</Button>
                                                <Button type='primary' htmlType='submit'>Save</Button>
                                            </Space>
                                        </Row>
                                </Space>
                            )}
                        />
                    </Form>
                )
            }}
            
        </Formik>);
}

export default ExperiencesForm;