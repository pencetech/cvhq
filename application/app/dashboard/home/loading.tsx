"use client";
import { Skeleton } from "antd";

export default function HomeLoading() {
    return (
        <Skeleton active avatar paragraph={{ rows: 4 }} />
    );
}