"use client";
import { FC } from 'react';
import { Row, Button, theme } from 'antd';
import Input from 'formik-antd/es/input';
import 'formik-antd/es/input/style';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import DatePicker from 'formik-antd/es/date-picker';
import 'formik-antd/es/date-picker/style';

interface EducationCardProps {
    index: number,
    onClick: () => {}
}

const EducationCard: FC<EducationCardProps> = ({
    index, onClick
}: EducationCardProps) => {
    const { token } = theme.useToken();

    const containerStyle: React.CSSProperties = {
        position: 'relative',
        overflow: 'hidden',
        padding: 36,
        background: token.colorFillAlter,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
      };

    return (
        <div style={containerStyle}>
            <Form.Item required={true} name={`education[${index}].subject`} label='Subject'>
                <Input name={`education[${index}].subject`} suffix />
            </Form.Item>
            <Form.Item required={true} name={`education[${index}].institution`} label='Institution'>
                <Input name={`education[${index}].institution`} suffix />
            </Form.Item>
            <Form.Item required={true} name={`education[${index}].degree`} label='Degree'>
                <Input name={`education[${index}].degree`} suffix />
            </Form.Item>
            <Form.Item required={true} name={`education[${index}].startDate`} label='Start date'>
                <DatePicker name={`education[${index}].startDate`} picker='month' />
            </Form.Item>
            <Form.Item name={`education[${index}].endDate`} label='endDate'>
                <DatePicker 
                    name={`education[${index}].endDate`} 
                    picker='month'
                />
            </Form.Item>
            <Row justify='end'>
                <Button onClick={onClick}>Remove</Button>
            </Row>
        </div>
    )
}

export default EducationCard;