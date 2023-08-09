"use client";
import { AchivementPlus } from "@/models/cv";
import { Button, Card, List, Typography } from "antd";

interface AchievementPlusProps {
    loading: boolean;
    achievements: AchivementPlus[];
    onAdd: (value: string) => void;
}

const AchievementPlus = (props: AchievementPlusProps) => {
    const { loading, achievements, onAdd } = props;

    const handleAdd = (value: string) => {
        onAdd(value);
    }

    return (
        <List
            itemLayout="horizontal"
            size="large"
            bordered
            dataSource={achievements}
            header={<Typography.Title level={4}>Suggested achievements</Typography.Title>}
            renderItem={(item, _) => (
                <List.Item
                actions={[
                    <Button
                        key="add"
                        onClick={() => handleAdd(item.description)}
                    >{item.isAdded ? "Added" : "Add"}</Button>
                ]}>
                    {item.description}
                </List.Item>
            )}
        />
    )
}

export default AchievementPlus;