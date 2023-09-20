"use client";
import { AchivementPlus } from "@/models/cv";
import { Button, Card, Col, List, Progress, Row, Space, Statistic, Typography } from "antd";

interface AchievementPlusProps {
    loading: boolean;
    achievements: AchivementPlus[];
    onAdd: (value: string, index: number) => void;
}

const MATCH = {
    matchFactor: 7,
    reason: "This is a reason. Reason is something that people want to see because it helps them realise their mistakes."

}

const AchievementPlus = (props: AchievementPlusProps) => {
    const { loading, achievements, onAdd } = props;

    const handleAdd = (value: string, index: number) => {
        onAdd(value, index);
    }

    const matchFormatter = (value: any) => (
    <Progress 
        percent={value * 10} 
        size="small" 
        type="dashboard"
        strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
    />);
        // if click enhance, change into redo button.
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Card>
                <Row gutter={12}>
                    <Col span={4}>
                    <Statistic
                            title="Match Factor"
                            value={MATCH.matchFactor}
                            formatter={matchFormatter}
                            precision={0}
                        />
                    </Col>
                    <Col span={20}>
                        <p style={{ margin: 0 }}>{MATCH.reason}</p>
                    </Col>
                </Row>
            </Card>
            <List
                itemLayout="horizontal"
                size="small"
                loading={loading}
                dataSource={achievements}
                header={<Typography.Title level={5} style={{ margin: 0 }}>Suggested achievements</Typography.Title>}
                renderItem={(item, i) => (
                    <List.Item
                    actions={[
                        <Button
                            key="add"
                            disabled={item.isAdded}
                            onClick={() => handleAdd(item.description, i)}
                        >{item.isAdded ? "Added!" : "Add"}</Button>
                    ]}>
                        {item.description}
                    </List.Item>
                )}
            />
        </div>
        
    )
}

export default AchievementPlus;