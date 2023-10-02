"use client";
import { useState, useEffect,useRef, FC } from 'react';
import dayjs from 'dayjs';
import { gql, useMutation } from '@apollo/client';
import { FormikProps } from 'formik';
import { Experience, JobPosting, UserBio } from '@/models/cv';
import { Row, DatePicker, Button, Card, Space, Statistic, Drawer, Spin, Typography, Modal, theme, Popover, Col, Cascader } from 'antd';
import { FireFilled, InfoCircleOutlined, InfoCircleTwoTone, LoadingOutlined } from '@ant-design/icons';
import Input from 'formik-antd/es/input';
import 'formik-antd/es/input/style';
import Form from 'formik-antd/es/form';
import 'formik-antd/es/form/style';
import Checkbox from 'formik-antd/es/checkbox';
import 'formik-antd/es/checkbox/style';
import { sectors } from '@/models/sector';
import { TextAreaRef } from 'antd/es/input/TextArea';
import { usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

const { Text } = Typography;

interface Experiences {
    experiences: Experience[]
}

interface ExperienceCardProps {
    formProps: FormikProps<Experiences>, 
    value: Experience,
    userBio: UserBio,
    jobPosting: JobPosting,
    profileId?: number,
    index: number,
    onClick: () => Promise<void>
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
    formProps, value, userBio, jobPosting, profileId, index, onClick
}: ExperienceCardProps) => {
    const [generateAchievements, { data, loading, error }] = useMutation(GENERATE_ACHIEVEMENTS, {
        variables: {
            input: {
                userBio: userBio,
                jobPosting: jobPosting,
                experience: value
                }
            }
        }
    );
    const pathName = usePathname();
    const { token } = theme.useToken();
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState('');
    const [newAchievements, setNewAchievements] = useState("");
    const inputRef = useRef<TextAreaRef>(null);
    const supabase = createClientComponentClient<Database>();
    const toggleEditing = () => {
        inputRef.current?.focus();
    };

    useEffect(() => {

        const getUser = async () => {
            const {
                data: { user },
              } = await supabase.auth.getUser();
            
              if (user) {
                setUser(user?.id);
            }
        }
        if (data && data.enhanceAchievement) {
            setNewAchievements(data.enhanceAchievement.achievements);
        }

        getUser();
      }, [data])

    const showDrawer = () => {
        const currPathNoQuery = pathName.split("?")[0];
        const currPath = currPathNoQuery
            .split("/")
            .filter(v => v.length > 0);
        const currPage = currPath[currPath.length-1];
        window.analytics?.track("Drawer opened", {
            title: `Opened drawer in ${currPage}`,
            userId: user,
            profileId: profileId,
            current_path: currPath
        })
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const applyNewAchievements = () => {
        const currPathNoQuery = pathName.split("?")[0];
        const currPath = currPathNoQuery
            .split("/")
            .filter(v => v.length > 0);
        const currPage = currPath[currPath.length-1];
        window.analytics?.track("Applied enhancement", {
            title: `Applied enhancement in ${currPage}`,
            userId: user,
            profileId: profileId,
            current_path: currPath
        })
        formProps.setFieldValue(`experiences[${index}].achievements`, newAchievements);
        onClose();
    }

    const enhanceAchievements = () => {
        if (!formProps.values.experiences[index].title ||
            !formProps.values.experiences[index].company ||
            !formProps.values.experiences[index].sector ||
            !formProps.values.experiences[index].achievements) {
            Modal.error({
                title: 'Experience incomplete',
                content: 'Please complete your experience.',
              });
            return;
        }

        if (!jobPosting.title ||
            !jobPosting.company ||
            !jobPosting.sector ||
            !jobPosting.requirements) {
            Modal.error({
                title: 'Job posting incomplete',
                content: 'Please complete your job posting, as it will be used to enhance your achievements.',
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
        marginTop: 16,
        backgroundColor: "#f5f5f5",
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
                <Input.TextArea 
                name="okay"
                value={newAchievements}
                style={{ width: '100%' }} 
                autoSize={{ minRows: 3, maxRows: 15 }}
                onChange={e => setNewAchievements(e.target.value)}
                bordered={false}
                ref={inputRef} />
            </Card>
            <Row justify='end'>
                <Space direction="horizontal">
                    <Button onClick={() => toggleEditing()}>Edit</Button>
                    <Button onClick={async () => await generateAchievements()}>Retry</Button>
                </Space>
            </Row>
            </div>
        )
    };

    const experiencePopoverContent = (
        <div>
            Write in your current/past achievements for this specific role from your existing CV.<br/>
            This will help CVHQ edit your real-world achievements to better match the job posting requirements.
        </div>
    );

    const popoverContent = (
        <div>
            We suggest content based on your job experience and the job posting.
        </div>
    );

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

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
            <Form.Item required={true} name={`experiences[${index}].achievements`} label={<div style={{ display: 'flex', gap: '8px' }}>
            Achievements
            <Popover content={experiencePopoverContent}>
                <InfoCircleOutlined />
            </Popover>
            </div>}>
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
                    <Button type="primary" size="large" icon={<FireFilled />} onClick={enhanceAchievements}>Enhance</Button>
                </div>
            </Form.Item>
            <Row justify='end'>
                <Button onClick={onClick}>Remove</Button>
            </Row>
            <Drawer
                title={
                    <div style={{ display: 'flex', gap: '8px' }}>
                    <Typography.Text>{`Achievements: ${formProps.values.experiences[index].title}, ${formProps.values.experiences[index].company}`}</Typography.Text>
                    <Popover content={popoverContent} title="How does it work?">
                        <InfoCircleTwoTone />
                    </Popover>
                    </div> 
                }
                placement="right"
                onClose={onClose}
                open={open}
                width={640}
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