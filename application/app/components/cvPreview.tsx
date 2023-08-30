"use client";
import { RedoOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Image, Pagination, Segmented, Spin, Typography, theme } from "antd";
import { useState } from "react";
import { CvType } from "../__generated__/graphql";
import { isEducationNotExist, isEducationNotFilled, isSkillsetNotFilled, isUserBioNotFilled } from "@/models/validations/userBioValidation";
import axios from "axios";
import { FormData } from "@/models/cv";
import { PngPageOutput } from "@/models/pngOutput";

const { useToken } = theme;

const SAMPLE_BIO = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '012345678',
    address: 'This is an address',
}

const SAMPLE_SUMMARY = {
    summary: 'Maecenas dictum at ante ut imperdiet. Praesent velit purus, sagittis non vestibulum sed, aliquet sit amet nisl. Morbi maximus tincidunt sem et lacinia. Sed vel ante et ipsum placerat ultrices. Nam sed quam vestibulum, ultricies dolor sed, sagittis enim. Sed ac ex id diam pharetra sagittis et nec est. Pellentesque non pretium metus, ut aliquam arcu.'
}

const SAMPLE_EDUCATION = [{
    subject: 'Business Administration and Management',
    institution: 'Harvard Business School',
    degree: 'MBA',
    startDate: '2023-08-26T19:54:22+00:00',
    endDate: '2023-08-26T19:54:22+00:00',
},
{
    subject: 'Mathematics, English, Economics',
    institution: 'Raffles Institution',
    degree: 'A Levels',
    startDate: '2023-08-26T19:54:22+00:00',
    endDate: '2023-08-26T19:54:22+00:00',
}
]

const SAMPLE_SKILLSETS = {
    skillsets: "This is a skillset!"
}

const CvPreview = ({
    profile
}: {
    profile: FormData
}) => {
    const [cvType, setCvType] = useState<CvType>(CvType.Base);
    const [currPage, setCurrPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [pngOutput, setPngOutput] = useState<PngPageOutput[]>([]);
    const { token } = useToken();
    const getCvPreview = async (queryFormData: FormData, cvType: CvType | string) => {

        try {
            const res = await axios.put<PngPageOutput[]>(`${process.env.NEXT_PUBLIC_PDF_URL}/image`, {
                userBio: isUserBioNotFilled(queryFormData.userBio) ? SAMPLE_BIO : queryFormData.userBio,
                summary: !queryFormData.summary?.summary ? SAMPLE_SUMMARY : queryFormData.summary,
                experiences: queryFormData.experiences,
                education: isEducationNotExist(queryFormData.education) || isEducationNotFilled(queryFormData.education).includes(true) ?
                    SAMPLE_EDUCATION : queryFormData.education,
                skillset: isSkillsetNotFilled(queryFormData.skillset) ? SAMPLE_SKILLSETS : queryFormData.skillset,
                cvType: cvType
            })
            return res.data;
        } catch (err) {
            console.log(err);
        }

    }

    const handleChangeCvType = async (type: CvType) => {
        setCvType(type);
        await handleRefresh(profile, type);
    }

    const handleRefresh = async (content: FormData, type: CvType) => {
        setLoading(true);
        const newPngOutput = await getCvPreview(content, type);
        if (newPngOutput) {
            setPngOutput(newPngOutput);
        }
        setLoading(false);
    }

    const typeOptions = [
        { label: 'Base', value: CvType.Base },
        { label: 'Prime', value: CvType.Prime }
    ]

    const images = pngOutput.map((img, i) => (
        <div key={i}>
            <Image width={300} placeholder src={img.content} alt="cv-preview" />
        </div>
    ))

    return (
        <Card
            size="small"
            extra={<>
                <Segmented
                    options={typeOptions}
                    defaultValue={CvType.Base}
                    onChange={num => handleChangeCvType(num as CvType)}
                />
                <Divider type="vertical" />
                <Button
                    shape="circle"
                    type="primary"
                    size='small'
                    loading={loading}
                    onClick={() => handleRefresh(profile, cvType)}
                    icon={<RedoOutlined />}
                />
            </>}
        >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                {loading ? <Spin /> :
                    <>
                        {pngOutput.length > 0 ? images[currPage - 1] : <Typography.Text>Click  <RedoOutlined style={{ color: token.colorFill }}/>  to load.</Typography.Text>}
                    </>
                }
                <Pagination onChange={(page, pageSize) => setCurrPage(page)} current={currPage} total={pngOutput.length} simple />
            </div>
        </Card>
    )
}

export default CvPreview;