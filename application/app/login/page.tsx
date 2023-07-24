'use client'
import { Col, Row, Space, Typography } from 'antd';
import AuthPage from '../components/authPage';
import { CheckCircleTwoTone } from '@ant-design/icons';

const LoginPage = () => {
    return (
        <Row gutter={16} style={{
            height: '100%'
        }}>
            <Col span={12}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    backgroundColor: '#111111',
                    height: '100%'
                }}>
                    <Space direction='vertical'>
                        <Typography.Title level={1} style={{ color: '#ffffff' }}>Welcome</Typography.Title>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            backgroundColor: '#4a4a4a',
                            borderRadius: '20px',
                            padding: '24px',
                        }}>
                            <Typography.Paragraph>
                                <Typography.Text
                                strong
                                style={{
                                    fontSize: 16,
                                    color: '#ffffff'
                                }}
                                >
                                What CVHQ does for you:
                                </Typography.Text>
                            </Typography.Paragraph>
                            <Typography.Paragraph
                            style={{
                                color: '#ffffff'
                            }}
                            >
                                <Space>
                                    <CheckCircleTwoTone twoToneColor="#52c41a" /> Provides a catchy CV summary
                                </Space>
                            </Typography.Paragraph>
                            <Typography.Paragraph
                            style={{
                                color: '#ffffff'
                            }}
                            >
                                <Space>
                                    <CheckCircleTwoTone twoToneColor="#52c41a" /> Enhances the wording of your experiences, powered by OpenAI&apos;s GPT-4
                                </Space>
                            </Typography.Paragraph>
                            <Typography.Paragraph
                            style={{
                                color: '#ffffff'
                            }}
                            >
                                <Space>
                                    <CheckCircleTwoTone twoToneColor="#52c41a" /> Puts all content into nicely formatted sections
                                </Space>
                            </Typography.Paragraph>
                        </div>
                    </Space>
                </div>
            </Col>
            <Col span={12}>
            <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%'
                }}> 
                <AuthPage />
            </div>
            </Col>
        </Row>
    )
}

export default LoginPage