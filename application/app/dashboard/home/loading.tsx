"use client";
import { Skeleton } from "antd";

export default function HomeLoading() {
    return (
        <Skeleton active paragraph={{ rows: 4 }} />
    );
}