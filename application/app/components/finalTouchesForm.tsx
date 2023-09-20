"use client";
import { FieldArray, Formik, FormikErrors, FormikProps } from "formik";
import Input from 'formik-antd/es/input';
import 'formik-antd/es/input/style';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import { withFormikDevtools } from "formik-devtools-extension";
import { Typography, Row, Col, Card, Space, Collapse, Button, CollapseProps, Tag, theme, Divider } from 'antd';
import { SecondaryInput, Education, EducationArray } from '@/models/cv';
import { CaretRightOutlined, CloseCircleOutlined, DeleteOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import * as Yup from 'yup';
import EducationCard from "./educationCard";

const { useToken } = theme;

interface OtherProps {
    title: string;
    description?: string;
    value: SecondaryInput;
    onSubmit: (value: SecondaryInput) => Promise<void>;
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
    education: Yup.array().of(
        Yup.object().shape({
            subject: Yup.string()
                .min(3, 'Too short!')
                .max(50, 'Too long!')
                .required('Required'),
            institution: Yup.string()
                .min(3, 'Too short!')
                .max(50, 'Too long!')
                .required('Required'),
            degree: Yup.string().required('Required'),
            startDate: Yup.string().required('Required'),
            endDate: Yup.string().required('Required'),
        })
    )
        .min(1, 'Need at least one education')
        .required('Required'),
    skillsets: Yup.object().shape({
        skillsets: Yup.string().required("Required")
    })
})

const FinalTouchesForm = (props: OtherProps) => {
    const { title, description, onSubmit, value, actions } = props;
    const { token } = useToken();

    const panelStyle: React.CSSProperties = {
        marginBottom: 24,
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: 'none',
    };

    const countErrors = (error: [string, string][]) => {
        return Object.values(error).reduce((a, item) => a + (item ? 1 : 0), 0)
    }

    const getItems: (
        panelStyle: React.CSSProperties,
        formProps: FormikProps<SecondaryInput>,
        values: Education[],
        remover: (i: number) => void) => CollapseProps['items'] = (panelStyle, formProps, values, remover) => {
            const errCount = (index: number) => {
                if (formProps.errors.education && formProps.errors.education[index]) {
                    const touched = formProps.touched.education ?
                        formProps.touched.education[index] : null

                    const errored = formProps.errors.education ?
                        formProps.errors.education[index] as FormikErrors<Education> : null
                    console.log("aggregate touched: ", formProps.touched.education)
                    console.log("aggregate errors: ", formProps.errors.education)
                    const filteredError = Object.entries(formProps.errors.education[index])
                        .filter(field => {
                            if (touched &&
                                errored &&
                                touched[field[0] as keyof FormikErrors<Education>] &&
                                errored[field[0] as keyof FormikErrors<Education>]
                            ) {
                                return true;
                            }
                            return false;
                        })
                    return countErrors(filteredError);
                } else {
                    return 0;
                }
            }

            return values.map((value, index) => {
                const errs = errCount(index)
                return {
                    key: index + 1,
                    label: (<Space>
                        <Typography.Text>{formProps.values.education[index].institution ?
                            formProps.values.education[index].institution : `Education ${index + 1}`}</Typography.Text>
                        {errs ?
                            <Tag icon={<CloseCircleOutlined />} color="error">
                                {`${errs} ${errs > 1 ? "errors" : "error"}`}
                            </Tag>
                            : null}
                    </Space>),
                    children: (<EducationCard
                        formProps={formProps}
                        index={index}
                    />),
                    extra: (<DeleteOutlined onClick={() => remover(index)} />),
                    style: panelStyle
                }
            }
            );
        }


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
            {props => {
                withFormikDevtools(props);
                return (
                    <>
                        <div style={{ marginBottom: "12px" }}>
                            <Typography.Title level={3} style={{ margin: '0 0 12px 0' }}>{title}</Typography.Title>
                            <Typography.Title level={5} style={{ margin: '0 0 12px 0', color: '#a1a1a1' }}>{description}</Typography.Title>
                        </div>
                        <Form {...formItemLayout} layout="vertical">
                            <Row gutter={[24, 24]}>
                                <Col span={24}>
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
                                <Col span={24}>
                                    <Card type="inner" title="Education" style={{ margin: "12px 0" }}>
                                        {description ? <div style={{ marginLeft: "12px" }}>
                                            <Space direction="vertical">
                                                <Typography.Text style={{ color: '#a1a1a1' }}>Include formal education, sorted from the most recent one. </Typography.Text>
                                                <Typography.Text style={{ color: '#a1a1a1' }}>If you&apos;ve taken at least a GED or a Bachelor, we recommend not adding your high school diploma details.</Typography.Text>
                                            </Space>
                                            <Divider />
                                        </div> : null}
                                        <FieldArray
                                            name='education'
                                            render={(arrayHelpers: any) => (
                                                <Space direction='vertical' className='w-full'>
                                                    <Collapse
                                                        bordered={false}
                                                        defaultActiveKey={['1']}
                                                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                                        style={{ background: token.colorBgContainer }}
                                                        items={getItems(
                                                            panelStyle,
                                                            props,
                                                            props.values.education,
                                                            (index: number) => arrayHelpers.remove(index)
                                                        )}
                                                    />
                                                    <Button
                                                        type='dashed'
                                                        block
                                                        onClick={() => arrayHelpers.push({
                                                            title: '',
                                                            isCurrent: false,
                                                            startDate: '',
                                                            endDate: '',
                                                            achievements: ''
                                                        })}
                                                    >+ Add education</Button>
                                                </Space>
                                            )}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                            <Row gutter={[24, 24]}>
                                <Col span={24}>
                                    <Card type="inner" title="Skillsets" style={{ margin: "12px 0" }}>
                                        <Row style={{ marginTop: 16 }} gutter={24} justify="start">
                                            <Col span={24} key={1}>
                                                <Form.Item required={true} name='skillsets.skillsets' label='Skillsets'>
                                                    <Input.TextArea name='skillsets.skillsets' showCount autoSize={{ minRows: 3, maxRows: 15 }} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                            <Row gutter={[24, 24]}>
                                <Col span={24}>
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