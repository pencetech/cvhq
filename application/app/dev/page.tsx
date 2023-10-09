"use client"
import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile, RcFile, UploadProps } from 'antd/es/upload/interface';
import { Button, message, Upload, Input, Typography, Col, Row, Space } from 'antd';
import type { SearchProps } from 'antd/lib/input';

const { Dragger } = Upload;
const { Search } = Input;
const { Paragraph } = Typography; 

const DevPage = () => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [input, setInput] = useState('');
    const [user, setUser] = useState('');
    const supabase = createClientComponentClient<Database>();

    const QUESTION_1 = "What is the status of the latest transaction?"
    const QUESTION_2 = "What is the total transaction amount for Tools category?"
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
                text: value
            }))
            const askData = await askResponse.text()
            setResponse(askData);
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
        <>
        <Space
            wrap
        >
            <Button
                shape="round"
                onClick={() => handleClick(QUESTION_1)}
            >
                {QUESTION_1}
            </Button>
            <Button
                shape="round"
                onClick={() => handleClick(QUESTION_2)}
            >
                {QUESTION_2}
            </Button>
            <Button
                shape="round"
                onClick={() => handleClick(QUESTION_3)}
            >
                {QUESTION_3}
            </Button>
        </Space>
            
            <Search
                placeholder="input search text"
                allowClear
                enterButton="Search"
                size="large"
                value={input}
                onChange={e => setInput(e.target.value)}
                loading={loading}
                onSearch={onSearch}
            />
        </>
        
    ) 

    const Response = () => (
        <Paragraph>
            <pre>{response}</pre>
        </Paragraph>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px' }}>
            <Row>
                <Col span={12}>
                    <AskAway />
                </Col>
                <Col span={12}>
                    <Response />
                </Col>
            </Row>
        </div>
    )
}

export default DevPage;