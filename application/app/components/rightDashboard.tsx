'use client';
import { Affix, Descriptions, theme, type DescriptionsProps, Collapse, CollapseProps } from "antd";
import CvPreview from "./cvPreview";
import { FormData } from "@/models/cv";
import { CaretRightOutlined } from "@ant-design/icons";
import { CSSProperties } from "react";

const { useToken } = theme;

const RightDashboard = ({ profile }: { profile: FormData }) => {
    const { token } = useToken();
    
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Title',
            children: profile.jobPosting.title
        },
        {
            key: '2',
            label: 'Company',
            children: profile.jobPosting.company
        },
        {
            key: '3',
            label: 'Vertical',
            children: profile.jobPosting.sector
        },
        {
            key: '4',
            label: 'Requirements',
            children: profile.jobPosting.requirements
        }
    ]

    const panelItems: (panelStyle: CSSProperties) => CollapseProps['items'] = (panelStyle) => [
        {
            key: '1',
            label: 'Preview',
            children: <CvPreview profile={profile} />,
            style: panelStyle
        },
        {
            key: '2',
            label: 'Job Posting',
            children: <Descriptions column={1} items={items} size="small" layout='vertical' />,
            style: panelStyle
        }
    ]

    const panelStyle: React.CSSProperties = {
        marginBottom: 24,
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: 'none',
      };

    return (
        <Affix offsetTop={120}>
            <Collapse
                bordered={false}
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                style={{ background: token.colorBgContainer }}
                items={panelItems(panelStyle)}
            />
        </Affix>
    )
}

export default RightDashboard;