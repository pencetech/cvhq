"use client"
import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile, RcFile, UploadProps } from 'antd/es/upload/interface';
import { Button, message, Upload, Input, Typography, Col, Row, Space, Select, Form, Layout, Card, List } from 'antd';
import type { SearchProps } from 'antd/lib/input';
import Chat, { ChatHistory } from '../components/chat';

const { Dragger } = Upload;
const { Search } = Input;
const { Paragraph, Title, Link } = Typography;
const { Header, Content, Footer, Sider } = Layout;


const DevPage = () => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [input, setInput] = useState("");
    const [customerId, setCustomerId] = useState("1509141464");
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
    const [user, setUser] = useState('');
    const supabase = createClientComponentClient<Database>();

    const QUESTION_1 = "What is the status of the transaction with {transaction_id}?"
    const QUESTION_2 = "What is the total transaction amount for Sports category?"
    const QUESTION_3 = "Which is the top category for my transaction in terms of total amount?"

    const names = [
        { value: '1509141464', label: 'Staffard Dunkerk' },
        { value: '2708700685', label: 'Slade Skeermor' },
        { value: '24434892', label: 'Elysia Bichener' }
    ]

    const messages = [
        { value: "1", label: QUESTION_1 },
        { value: "2", label: QUESTION_2 },
        { value: "3", label: QUESTION_3 }
    ]

    const popularData = [
        {
            title: 'Transaction status check',
        },
        {
            title: 'Resolve refund cases',
        },
        {
            title: 'Resolve dispute cases',
        }
    ];


    const futureData = [
        {
            title: 'Conversational',
        },
        {
            title: 'Connect your own database',
        },
        {
            title: 'Execute custom workflows',
        }
    ];

    const getUser = useCallback(async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        if (session) {
            setUser(session.user?.id);
        }
    }, [supabase])

    useEffect(() => {
        getUser()
            .catch(console.error)
    }, [getUser])

    const handleUpload = async () => {
        const singleFile = fileList[0];
        const file = singleFile as RcFile;
        const stringFile = await file.text();
        setUploading(true);
        console.log(singleFile);
        const { data: uploadData, error: uploadError } = await supabase.functions.invoke('upload-dataset', {
            body: { filename: singleFile.name, data: stringFile }
        })

        if (uploadError) {
            message.error('upload failed.');
        } else {
            setFileList([]);
            message.success('upload successfully.');
        }

        setUploading(false);
    }

    const props: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };

    const onSearch: SearchProps['onSearch'] = async (value: string, _e: any, info: any) => {
        setInput("");
        setLoading(true);
        handleAddChat("user", value)
        try {
            const askResponse = await fetch('https://llama-index.fly.dev/query?' + new URLSearchParams({
                text: value,
                customer_id: customerId
            }))
            const jsonResponse = await askResponse.json()
            handleAddChat("assistant", jsonResponse.message);
            setLoading(false);
        } catch (e) {
            message.error('ask failed.');
        }

    }

    const UploadComponent = () => (
        <>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single upload.
                </p>
            </Dragger>
            <Button
                type='primary'
                onClick={handleUpload}
                disabled={fileList.length == 0}
                loading={uploading}
                style={{ marginTop: 16 }}
            >
                {uploading ? 'Uploading' : 'Start Upload'}
            </Button>
        </>
    )
    const firstName = (id: string) => {
        const name = names.filter(name => name.value == id)
        return name[0].label.split(" ")[0]
    }

    const handleClick = (value: string) => {
        setInput(value);
    }

    const handleAddChat = (role: "assistant" | "user", content: string) => {
        setChatHistory(array => ([...array, { role, content }]));
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px', padding: '32px', height: "100%", minHeight: "300px"}}>
            <Row gutter={[12, 12]} style={{ height: '100%' }} justify="center">
                <Layout style={{ backgroundColor: "transparent", height: "100%", width: '100%' }}>
                    <Content style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: 'flex-start',
                        height: "100%"
                    }}>
                        <Form.Item name="Customer" label="Chatting as">
                            <Select
                                defaultValue="1509141464"
                                value={customerId}
                                onChange={(value) => {
                                    setChatHistory([])
                                    setCustomerId(value)
                                }}
                                options={names}
                            />
                        </Form.Item>
                        {chatHistory.length === 0 ?
                            <div style={{ display: "flex", alignSelf: "center" }}>
                                <Space direction="vertical" align="center" size="middle">
                                    <Title level={3}>{`Hi ${firstName(customerId)}, how can I help you?`}</Title>
                                    {messages.map((message, i) => (
                                        <Button
                                            shape="round"
                                            key={i}
                                            size="large"
                                            onClick={() => handleClick(message.label)}
                                            style={{ whiteSpace: "normal", height: 'auto', marginBottom: '10px' }}
                                        >
                                            {message.label}
                                        </Button>
                                    ))}
                                </Space>
                            </div>
                            :
                            <div style={{ display: 'flex', flexDirection: 'column', width: "100%" }}>
                                <Chat chatHistory={chatHistory} name={firstName(customerId)} />
                            </div>
                        }
                    </Content>
                    <Footer style={{ padding: '24px 24px', backgroundColor: 'transparent' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: "stretch", gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: "12px" }}>
                            {chatHistory.length > 0 ?
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                    {messages.map((message, i) => (
                                        <Button
                                            shape="round"
                                            key={i}
                                            size="small"
                                            style={{ whiteSpace: "normal", height: 'auto', marginBottom: '4px' }}
                                            onClick={() => handleClick(message.label)}
                                        >
                                            {message.label}
                                        </Button>
                                    ))}
                                </div> : null
                            }
                        </div>
                        <Search
                            placeholder="input search text"
                            enterButton="Send"
                            size="large"
                            onChange={e => setInput(e.target.value)}
                            value={input}
                            loading={loading}
                            onSearch={onSearch}
                        />
                        <Typography.Text type="secondary" style={{ alignSelf: "center" }}>This demo uses sample customer and transaction data. <Link href="https://docs.google.com/spreadsheets/d/1P_V0idry72hIEeIzkz1-PFj_UDwv40DRyA_ac02Q1OQ/edit?usp=sharing" target='_blank'>View data</Link></Typography.Text>
                        </div>
                        
                    </Footer>
                </Layout>
            </Row>
        </div>
    )
}

export default DevPage;