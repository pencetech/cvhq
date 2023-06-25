"use client";
import { useState, FC } from 'react';
import { gql, useMutation } from '@apollo/client';
import { FormikProps } from 'formik';
import { Experience } from '@/app/components/cvForm'
import { Row, Button, Space, Drawer, theme } from 'antd';
import { FireFilled } from '@ant-design/icons';
import Input from 'formik-antd/es/input';
import 'formik-antd/es/input/style';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import Checkbox from 'formik-antd/es/checkbox';
import 'formik-antd/es/checkbox/style';
import DatePicker from 'formik-antd/es/date-picker';
import 'formik-antd/es/date-picker/style';


interface Experiences {
    experiences: Experience[]
}

interface ExperienceCardProps {
    props: FormikProps<Experiences>, 
    index: number,
    onClick: () => {}
}

// const GENERATE_ACHIEVEMENTS = gql`
//     mutation GenerateAchievements {

//     }
// `

const ExperienceCard: FC<ExperienceCardProps> = ({
    props, index, onClick
}: ExperienceCardProps) => {
    // const [generateAchievements, { data, loading, error }] = useMutation(GENERATE_ACHIEVEMENTS);
    const { token } = theme.useToken();
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const enhanceAchievements = () => {
        // generateAchievements(
        //     {
        //         variables: {

        //         }
        //     }
        // )
        showDrawer();
    }

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
            <Form.Item required={true} name={`experiences[${index}].title`} label='Job title'>
                <Input name={`experiences[${index}].title`} suffix />
            </Form.Item>
            <Form.Item required={true} name={`experiences[${index}].company`} label='Company'>
                <Input name={`experiences[${index}].company`} suffix />
            </Form.Item>
            <Form.Item name={`experiences[${index}].isCurrent`} label='My current job'>
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
                <div style={{ display: "flex", gap: "12px" }}>
                    <Input.TextArea 
                        style={{ width: '100%' }} 
                        name={`experiences[${index}].achievements`} 
                        autoSize={{ minRows: 3, maxRows: 15 }}
                        showCount />
                    <Button type="primary" size="large" icon={<FireFilled />} onClick={enhanceAchievements}>Enhance</Button>
                </div>
            </Form.Item>
            <Row justify='end'>
                <Button onClick={onClick}>Remove</Button>
            </Row>
            <Drawer
                title="Enhance achievements"
                placement="right"
                width={720}
                onClose={onClose}
                open={open}
                getContainer={false}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={onClose} type="primary">
                        Apply
                    </Button>
                </Space>
                }
            >
            </Drawer>
        </div>
    )
}

export default ExperienceCard;