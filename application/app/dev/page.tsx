"use client"
import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile, RcFile, UploadProps } from 'antd/es/upload/interface';
import { Button, message, Upload, Input, Typography, Col, Row, Space, Select } from 'antd';
import type { SearchProps } from 'antd/lib/input';

const { Dragger } = Upload;
const { Search } = Input;
const { Paragraph, Title, Link } = Typography; 

const DevPage = () => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [input, setInput] = useState('');
    const [customerId, setCustomerId] = useState("1509141464");
    const [user, setUser] = useState('');
    const supabase = createClientComponentClient<Database>();

    const QUESTION_1 = "What is the status of the transaction with amount 73101?"
    const QUESTION_2 = "What is the total transaction amount for Sports category?"
    const QUESTION_3 = "Which is the top category for my transaction in terms of total amount?"

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
        setLoading(true);
        try {
            const askResponse = await fetch('https://llama-index.fly.dev/query?' + new URLSearchParams({
                text: value,
                customer_id: customerId
            }))
            const jsonResponse = await askResponse.json()
            setResponse(jsonResponse.message);
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

    const handleClick = (value: string) => {
        setInput(value);
    }

    const AskAway = () => (
        <Space
            direction="vertical"
        >   
            <Link href="https://docs.google.com/spreadsheets/d/1P_V0idry72hIEeIzkz1-PFj_UDwv40DRyA_ac02Q1OQ/edit?usp=sharing" target='_blank'>View data</Link>
            <Title level={5}>Customer</Title>
            <Select
                defaultValue="1509141464"
                style={{ width: "100%" }}
                value={customerId}
                onChange={value => setCustomerId(value)}
                options={[
                    { value: '1509141464', label: 'Staffard Dunkerk' },
                    { value: '2708700685', label: 'Slade Skeermor' },
                    { value: '24434892', label: 'Elysia Bichener' }
                ]}
            />
            <Title level={5}>Question</Title>
            <Button
                shape="round"
                type="primary"
                size="small"
                onClick={() => handleClick(QUESTION_1)}
            >
                {QUESTION_1}
            </Button>
            <Button
                shape="round"
                type="primary"
                size="small"
                onClick={() => handleClick(QUESTION_2)}
            >
                {QUESTION_2}
            </Button>
            <Button
                shape="round"
                type="primary"
                size="small"
                onClick={() => handleClick(QUESTION_3)}
            >
                {QUESTION_3}
            </Button>
            <Search
                placeholder="input search text"
                enterButton="Search"
                value={input}
                onChange={e => setInput(e.target.value)}
                loading={loading}
                onSearch={onSearch}
            />
        </Space>
    ) 

    const Response = () => (
        <Paragraph>
            <pre>{response}</pre>
        </Paragraph>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px' }}>
            <Row gutter={[12, 12]}>
                <Col span={10}>
                    <AskAway />
                </Col>
                <Col span={14}>
                    {response ? <Response /> : null}
                </Col>
            </Row>
        </div>
    )
}

export default DevPage;