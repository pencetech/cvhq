"use client";
import { RedoOutlined } from "@ant-design/icons";
import { Button, Card, Carousel, Divider, Image, Radio } from "antd";
import { useState } from "react";
import { CvType } from "../__generated__/graphql";
import { isEducationNotExist, isEducationNotFilled, isSkillsetNotFilled, isUserBioNotFilled } from "@/models/validations/userBioValidation";
import axios from "axios";
import { QueryFunctionContext, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormData } from "@/models/cv";
import { PngPageOutput } from "@/models/pngOutput";

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
    const queryClient = useQueryClient();
    const getCvPreview = async (queryFormData: FormData, cvType: CvType) => {

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

    const { data: cvPreviewData, isFetching } = useQuery({
        queryKey: ['cv-preview', { profile, cvType }],
        queryFn: () => getCvPreview(profile, cvType)
    })
    const handleRefresh = async () => {
        queryClient.invalidateQueries({ queryKey: ['cv-preview'] })
    }

    const typeOptions = [
        { label: 'Base', value: CvType.Base },
        { label: 'Prime', value: CvType.Prime }
    ]

    const images = cvPreviewData?.map((img, i) => (
        <div key={i}>
            <Image width={200} src={img.content.toString()} alt="cv-preview" />
        </div>
    ))

    return (
        <Card
            extra={<>
                <Radio.Group
                    options={typeOptions}
                    defaultValue={CvType.Base}
                    onChange={e => setCvType(e.target.value)}
                    optionType="button"
                    buttonStyle="solid"
                />
                <Divider type="vertical" />
                <Button 
                    shape="round" 
                    type="primary" 
                    loading={isFetching}
                    onClick={handleRefresh} 
                    icon={<RedoOutlined />} 
                />
            </>}
        >
            <Carousel>
                {images}
            </Carousel>
        </Card>
    )
}

export default CvPreview;