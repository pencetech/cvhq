import { Affix, Descriptions, type DescriptionsProps } from "antd";
import CvPreview from "./cvPreview";
import { FormData } from "@/models/cv";

const RightDashboard = ({ profile }: { profile: FormData }) => {
    
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

    return (
        <Affix offsetTop={120}>
            <CvPreview profile={profile} />
            <Descriptions title="Job Posting" column={1} items={items} size="small" bordered />
        </Affix>
    )
}

export default RightDashboard;