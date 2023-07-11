"use client";
import { Skeleton } from "antd";

export default function JobLoading() {
    return (
        <Skeleton active paragraph={{ rows: 4 }} />
    );
}