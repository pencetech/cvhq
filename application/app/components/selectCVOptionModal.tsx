"use client";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, List, Modal, Spin, Typography } from "antd";

const SelectCvOptionModal = ({ onSelect, onCancel, loading, open, title }: { 
    onSelect: ((value: "pre-filled" | "empty") => void),
    onCancel: (() => void),
    loading: boolean,
    open: boolean,
    title: string
}) => {
    
    const dataSource = [
        {   
            key: "pre-filled" as "pre-filled",
            label: "Start with a pre-filled CV",
            description: "See what a perfectly-matched CV looks like."
        },
        {
            key: "empty" as "empty",
            label: "Start with an empty CV",
            description: "Build your own profile from scratch."
        }
    ]

    const CvOption = () => (<List
        itemLayout="horizontal"
        dataSource={dataSource}
        renderItem={(item, _) => (
            <List.Item
            actions={[
                <Button 
                key="download" 
                type="primary" 
                icon={<ArrowRightOutlined />} 
                onClick={() => onSelect(item.key)}>
                    Create    
                </Button>
            ]}
            >
            <List.Item.Meta
                title={<Typography.Title level={5}>{item.label}</Typography.Title>}
                description={item.description}
            />
            </List.Item>
        )}
    />)

    return (
        <Modal
            title={title}
            open={open}
            closeIcon={false}
            footer={null}
            onCancel={onCancel}
        >
            {loading ? 
            <Spin tip="Loading... Take a deep breath..." size="large">
                <CvOption /> 
            </Spin> :
            <CvOption />
            }
        </Modal>
    )
}

export default SelectCvOptionModal;