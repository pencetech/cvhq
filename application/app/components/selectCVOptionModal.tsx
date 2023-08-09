"use client";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, List, Modal, Typography } from "antd";

const SelectCvOptionModal = ({ onSelect, onCancel, open, title }: { 
    onSelect: ((value: string) => void),
    onCancel: (() => void)
    open: boolean,
    title: string
}) => {
    
    const dataSource = [
        {   
            key: "pre-filled",
            label: "Start with a pre-filled CV",
            description: "See what a perfectly-matched CV looks like."
        },
        {
            key: "empty",
            label: "Start with an empty CV",
            description: "Build your own profile from scratch."
        }
    ]

    return (
        <Modal
            title={title}
            open={open}
            onCancel={onCancel}
        >
            <List
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
            />
        </Modal>
    )
}

export default SelectCvOptionModal;