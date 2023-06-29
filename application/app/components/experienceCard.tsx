"use client";
import { useState, useEffect, FC } from 'react';
import { gql, useMutation } from '@apollo/client';
import { FormikProps, useFormikContext } from 'formik';
import { Experience, useFormContext } from '@/app/components/cvForm'
import { Row, Button, Card, Space, Statistic, Drawer, Spin, Typography, Modal, theme, Popover } from 'antd';
import { FireFilled, InfoCircleOutlined, InfoCircleTwoTone, LoadingOutlined } from '@ant-design/icons';
import Input from 'formik-antd/es/input';
import 'formik-antd/es/input/style';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import Checkbox from 'formik-antd/es/checkbox';
import 'formik-antd/es/checkbox/style';
import DatePicker from 'formik-antd/es/date-picker';
import 'formik-antd/es/date-picker/style';

const { Text } = Typography;

interface Experiences {
    experiences: Experience[]
}

interface ExperienceCardProps {
    props: FormikProps<Experiences>, 
    index: number,
    onClick: () => {}
}

const GENERATE_ACHIEVEMENTS = gql`
mutation enhanceAchievement($input: AchievementInput!) {
    enhanceAchievement(input: $input) {
      match {
        matchFactor
        reason
      }
      achievements
    }
  }
`

const ExperienceCard: FC<ExperienceCardProps> = ({
    props, index, onClick
}: ExperienceCardProps) => {
    const { formData } = useFormContext();
    const [generateAchievements, { data, loading, error }] = useMutation(GENERATE_ACHIEVEMENTS, {
        variables: {
            input: {
                userBio: formData.userBio,
                jobPosting: formData.jobPosting,
                experience: formData.experiences[index]
                }
            }
        }
    );
    const { setFieldValue, values } = useFormikContext<Experiences>();
    const { token } = theme.useToken();
    const [open, setOpen] = useState(false);
    const [newAchievements, setNewAchievements] = useState("");

    useEffect(() => {
        if (data && data.enhanceAchievement) {
            setNewAchievements(data.enhanceAchievement.achievements);
        }
      }, [data])

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const applyNewAchievements = () => {
        setFieldValue(`experiences[${index}].achievements`, newAchievements);
        onClose();
    }

    const enhanceAchievements = () => {
        if (!values.experiences[index].achievements) {
            Modal.error({
                title: 'Achievements empty',
                content: 'Please fill in your achievements.',
              });
            return;
        }
        generateAchievements();
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

    const enhanceDrawerContent = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Card>
                <Statistic
                title="Match Factor"
                value={data.enhanceAchievement.match.matchFactor}
                precision={0}
                valueStyle={{ color: '#1677ff' }}
                suffix="/ 10"
                />
            </Card>
            <Card size="small" title="Assessment" style={{ width: '100%' }}>
                <p>{data.enhanceAchievement.match.reason}</p>
            </Card>
            <Card size="small" title="Enhanced achievements" style={{ width: '100%' }}>
                <Typography.Title editable={{ 
                    onChange: s => setNewAchievements(s),
                    text: newAchievements
                }} level={5} style={{ margin: 0 }}>
                    {newAchievements}
                </Typography.Title>
            </Card>
            <Row justify='end'>
                <Button onClick={generateAchievements}>Retry</Button>
            </Row>
            </div>
        )
    };

    const popoverContent = (
        <div>
          We suggest content based on your job experience and the job posting.
        </div>
      );

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    return (
        <div style={containerStyle}>
            <Form.Item required={true} name={`experiences[${index}].title`} label='Job title'>
                <Input name={`experiences[${index}].title`} suffix />
            </Form.Item>
            <Form.Item required={true} name={`experiences[${index}].company`} label='Company'>
                <Input name={`experiences[${index}].company`} suffix />
            </Form.Item>
            <Form.Item required={true} name={`experiences[${index}].sector`} label='Company sector'>
                <Input name={`experiences[${index}].sector`} suffix />
            </Form.Item>
            <Form.Item name={`experiences[${index}].isCurrent`} label='My current job'>
                <Checkbox name={`experiences[${index}].isCurrent`} />
            </Form.Item>
            <Form.Item required={true} name={`experiences[${index}].startDate`} label='Start date'>
                <DatePicker 
                    name={`experiences[${index}].startDate`} 
                    picker='month' />
            </Form.Item>
            <Form.Item name={`experiences[${index}].endDate`} label='End date'>
                <DatePicker
                    picker="month"
                    name={`experiences[${index}].endDate`} 
                    disabled={props.values.experiences[index].isCurrent ? true : false} />
            </Form.Item>
            <Form.Item required={true} name={`experiences[${index}].achievements`} label='Achievements'>
                <div style={{ display: "flex", gap: "12px" }}>
                    <Input.TextArea 
                        style={{ width: '100%' }} 
                        name={`experiences[${index}].achievements`} 
                        autoSize={{ minRows: 3, maxRows: 15 }}
                        showCount
                        maxLength={1000} />
                    <Button type="primary" size="large" icon={<FireFilled />} onClick={enhanceAchievements}>Enhance</Button>
                </div>
            </Form.Item>
            <Row justify='end'>
                <Button onClick={onClick}>Remove</Button>
            </Row>
            <Drawer
                title={
                    <div style={{ display: 'flex', gap: '8px' }}>
                    Enhance
                    <Popover content={popoverContent} title="How does it work?">
                        <InfoCircleTwoTone />
                    </Popover>
                    </div> 
                }
                placement="right"
                width={720}
                onClose={onClose}
                open={open}
                getContainer={false}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={applyNewAchievements} type="primary">
                        Apply
                    </Button>
                </Space>
                }
            >   
                {loading ? <Spin indicator={antIcon} /> : null}
                {error ? <Text type="danger">An error occured</Text> : null}
                {data && data.enhanceAchievement ? enhanceDrawerContent() : null}
            </Drawer>
        </div>
    )
}

export default ExperienceCard;