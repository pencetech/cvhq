"use client";
import { FC } from 'react';
import dayjs from 'dayjs';
import { Row, Button, Col, DatePicker, theme } from 'antd';
import { FormikProps } from 'formik';
import { Education } from '@/models/cv';
import Input from 'formik-antd/es/input';
import 'formik-antd/es/input/style';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';

interface EducationCard {
    education: Education[]
}
interface EducationCardProps {
    formProps: FormikProps<EducationCard>, 
    index: number,
    onClick: () => {}
}

const EducationCard: FC<EducationCardProps> = ({
    formProps, index, onClick
}: EducationCardProps) => {
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

    return (
        <div style={containerStyle}>
            <Row gutter={24} justify="start">
                <Col span={12} key={1}>
                    <Form.Item required={true} name={`education[${index}].subject`} label='Subject'>
                        <Input name={`education[${index}].subject`} suffix placeholder='Business administration, Computer Science, Sports Science, etc.'/>
                    </Form.Item>
                </Col>
                <Col span={12} key={2}>
                    <Form.Item required={true} name={`education[${index}].institution`} label='Institution'>
                        <Input name={`education[${index}].institution`} suffix placeholder='University of Oxford, ACBD Police Academy, St Peter High School, etc.' />
                    </Form.Item>
                </Col>
                <Col span={8} key={3}>
                    <Form.Item required={true} name={`education[${index}].degree`} label='Degree'>
                        <Input name={`education[${index}].degree`} suffix placeholder='GED, High School Diploma, Bachelor, Doctorate, O-level, etc.' />
                    </Form.Item>
                </Col>
                <Col span={6} key={4}>
                    <Form.Item required={true} name={`education[${index}].startDate`} label='Start date'>
                        <DatePicker 
                            name={`education[${index}].startDate`} 
                            value={formProps.values.education[index].startDate ? 
                                dayjs(formProps.values.education[index].startDate) : undefined}
                            picker='month'
                            onChange={(date, dateStr) => {
                                formProps.setFieldValue(`education[${index}].startDate`, date ? date.toISOString() : null)
                                formProps.setFieldTouched(`education[${index}].startDate`, true, false)
                            }} 
                        />
                    </Form.Item>
                </Col>
                <Col span={6} key={5}>
                    <Form.Item required={true} name={`education[${index}].endDate`} label='End date'>
                        <DatePicker 
                            name={`education[${index}].endDate`} 
                            value={formProps.values.education[index].endDate ? 
                                dayjs(formProps.values.education[index].endDate) : undefined}
                            picker='month'
                            onChange={(date, dateStr) => {
                                formProps.setFieldValue(`education[${index}].endDate`, date ? date.toISOString() : null)
                                formProps.setFieldTouched(`education[${index}].endDate`, true, false)
                            }} 
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row justify='end'>
                <Button onClick={onClick}>Remove</Button>
            </Row>
        </div>
    )
}

export default EducationCard;