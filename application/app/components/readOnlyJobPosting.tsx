import { Affix, Descriptions, type DescriptionsProps } from "antd";
import { JobPosting } from "../__generated__/graphql";

const ReadOnlyJobPosting = ({ jobPosting }: { jobPosting: JobPosting }) => {
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Title',
            children: jobPosting.title
        },
        {
            key: '2',
            label: 'Company',
            children: jobPosting.company
        },
        {
            key: '3',
            label: 'Vertical',
            children: jobPosting.sector
        },
        {
            key: '4',
            label: 'Requirements',
            children: jobPosting.requirements
        }
    ]

    return (
        <Affix offsetTop={120}>
            <Descriptions title="Job Posting" column={1} items={items} size="small" bordered />
        </Affix>
    )
}

export default ReadOnlyJobPosting;