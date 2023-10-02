"use client"
import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile, RcFile, UploadProps } from 'antd/es/upload/interface';
import { Button, message, Upload } from 'antd';

const { Dragger } = Upload;

const DevPage = () => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [user, setUser] = useState('');
    const supabase = createClientComponentClient<Database>();

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
        console.log(stringFile);
        const { data: uploadData, error: uploadError } = await supabase.functions.invoke('upload-dataset', {
            body: { filename: singleFile.fileName, data: stringFile }
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

    return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px' }}>
        <UploadComponent />
    </div>
    )
     
}

export default DevPage;