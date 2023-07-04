"use client";
import { Button, Modal } from "antd";
import { useRouter } from "next/navigation";

const CvDownloadModal = ({ open, onOk, onCancel, filename, blobUrl }: { 
    open: boolean, 
    onOk: (() => void) | undefined,
    onCancel: (() => void) | undefined,
    filename: string
    blobUrl: string
}) => {
    
    const router = useRouter();

    const handleClickWithLink = (event: any, link: string) => {
        event.preventDefault();
        router.push(link);
    }  

    return (
        <Modal
            title="You are one step closer to your dream job!"
            open={open}
            footer={[
                <Button key="cancel" onClick={onCancel}>Return</Button>,
                <Button 
                    key="download"
                    type="primary"
                    onClick={onOk}
                    download={filename}
                    href={blobUrl}
                >Download</Button>,
                <Button
                    key="dashboard"
                    onClick={e => handleClickWithLink(e, "/dashboard/home")}
                >
                    Go to dashboard
                </Button>
            ]}
            >
                Please download here!
        </Modal>
    )
}

export default CvDownloadModal;