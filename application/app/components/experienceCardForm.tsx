'use client';
import { Experience } from "@/models/cv";
import dayjs from 'dayjs';
import { sectors } from '@/models/sector';
import { Button, Cascader, Col, DatePicker, Popover, Row, theme } from "antd";
import { FormikProps } from "formik";
import Checkbox from "formik-antd/es/checkbox";
import Form from "formik-antd/es/form";
import Input from "formik-antd/es/input";
import { FC } from "react";
import { FireFilled, InfoCircleOutlined } from "@ant-design/icons";

interface Experiences {
    experiences: Experience[]
}

interface ExperienceCardFormProps {
    formProps: FormikProps<Experiences>,
    index: number,
    onEnhance: () => Promise<void>,
    onRemove: () => Promise<void>
}

const ExperienceCardForm: FC<ExperienceCardFormProps> = ({
    formProps, index, onEnhance, onRemove
}: ExperienceCardFormProps) => {
    const { token } = theme.useToken();
    const containerStyle: React.CSSProperties = {
        position: 'relative',
        overflow: 'hidden',
        padding: 36,
        marginTop: 16,
        backgroundColor: "#f5f5f5",
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
    };

    const experiencePopoverContent = (
        <div>
            Write in your current/past achievements for this specific role from your existing CV.<br/>
            This will help CVHQ edit your real-world achievements to better match the job posting requirements.
        </div>
    );

    return (
        <div style={containerStyle}>
            <Row gutter={24} justify="start">
                <Col span={12} key={1}>
                    <Form.Item required={true} name={`experiences[${index}].title`} label='Job title'>
                        <Input name={`experiences[${index}].title`} suffix />
                    </Form.Item>
                </Col>
                <Col span={12} key={2}>
                    <Form.Item required={true} name={`experiences[${index}].company`} label='Company'>
                        <Input name={`experiences[${index}].company`} suffix />
                    </Form.Item>
                </Col>
                <Col span={12} key={3}>
                <Form.Item required={true} name={`experiences[${index}].sector`} label='Company sector / role type'>
                    <Cascader 
                        value={formProps.values.experiences[index].sector ? 
                            formProps.values.experiences[index].sector.split("/") : ['']}
                        options={sectors}
                        onChange={(value, options) => {
                            formProps.setFieldValue(`experiences[${index}].sector`, value ? value.join("/") : "")
                            formProps.setFieldTouched(`experiences[${index}].sector`, true, false)
                    }} />
                </Form.Item>
                </Col>
                <Col span={12} key={4}>
                    <Form.Item name={`experiences[${index}].isCurrent`} label='My current job'>
                        <Checkbox name={`experiences[${index}].isCurrent`} />
                    </Form.Item>
                </Col>
                <Col span={6} key={5}>
                    <Form.Item required={true} name={`experiences[${index}].startDate`} label='Start date'>
                        <DatePicker 
                            name={`experiences[${index}].startDate`} 
                            value={formProps.values.experiences[index].startDate ? 
                                dayjs(formProps.values.experiences[index].startDate) : undefined}
                            picker='month'
                            onChange={(date, dateStr) => {
                                formProps.setFieldValue(`experiences[${index}].startDate`, date ? date.toISOString() : null)
                                formProps.setFieldTouched(`experiences[${index}].startDate`, true, false)
                            }} />
                    </Form.Item>
                </Col>
                <Col span={6} key={6}>
                    <Form.Item name={`experiences[${index}].endDate`} label='End date'>
                        <DatePicker
                            name={`experiences[${index}].endDate`} 
                            value={formProps.values.experiences[index].endDate ? 
                                dayjs(formProps.values.experiences[index].endDate) : undefined}
                            picker='month'
                            onChange={(date, dateStr) => {
                                formProps.setFieldValue(`experiences[${index}].endDate`, date ? date.toISOString() : null)
                                formProps.setFieldTouched(`experiences[${index}].endDate`, true, false)
                            }}
                            disabled={formProps.values.experiences[index].isCurrent ? true : false}
                            />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item required={true} name={`experiences[${index}].achievements`} label={
            <div style={{ display: 'flex', gap: '8px' }}>
                Achievements
                <Popover content={experiencePopoverContent}>
                    <InfoCircleOutlined />
                </Popover>
            </div>
        }>
                <div style={{ display: "flex", gap: "12px" }}>
                    <Input.TextArea 
                        style={{ width: '100%' }} 
                        name={`experiences[${index}].achievements`} 
                        placeholder='- [SALES] Develop relationship with prospective customers
                        - [SOFTWARE DEV] Developed and debugged software in HTML, Python, and JS
                        - [CUST SERVICE]  Respond to live customer queries with average 95% satisfaction rate
                        '
                        autoSize={{ minRows: 3, maxRows: 15 }}
                        showCount
                        maxLength={1000} />
                    <Button type="primary" size="large" icon={<FireFilled />} onClick={onEnhance}>Enhance</Button>
                </div>
            </Form.Item>
            <Row justify='end'>
                <Button onClick={onRemove}>Remove</Button>
            </Row>
        </div>
    )
}

export default ExperienceCardForm;