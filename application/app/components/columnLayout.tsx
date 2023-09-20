'use client';
import { Col, Row } from "antd";
import { ReactNode } from "react";

const ColumnLayout = ({ left, right }: { left: ReactNode, right: ReactNode }) => (
    <Row gutter={24}>
        <Col span={16}>
            {left}
        </Col>
        <Col span={8}>
            {right}
        </Col>
    </Row>
);

export default ColumnLayout;