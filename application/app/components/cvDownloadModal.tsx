"use client";
import { Button, Card, Col, Input, Modal, Result, Row, Space } from "antd";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { gql, useMutation } from "@apollo/client";
import { FormData } from "@/models/cv";
import { useEffect, useRef, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { CvFile, Summary } from "../__generated__/graphql";
import { TextAreaRef } from "antd/es/input/TextArea";

const BASE_CV = "BASE"
const PRIME_CV = "PRIME"


const GENERATE_CV = gql`
mutation generateCV($input: CvInput!) {
    generateCV(input: $input) {
      filename
    }
  }
`
const GENERATE_SUMMARY = gql`
mutation generateSummary($input: CvInput!) {
    generateSummary(input: $input) {
        summary
    }
}
`

const CvDownloadModal = ({ profileId, userId, open, onCancel, formData, nextLink }: { 
    open: boolean, 
    profileId: number,
    userId: string,
    onCancel: (() => void),
    formData: FormData,
    nextLink: string
}) => {
    
    const [format, setFormat] = useState("");
    const [summary, setSummary] = useState("");
    const inputRef = useRef<TextAreaRef>(null);
    const cvInput = {
        id: 1,
        cvContent: {
            userBio: formData.userBio,
            experiences: formData.experiences,
            summary: summary,
            education: formData.education,
            skillsets: formData.skillset
        },
        jobPosting: formData.jobPosting,
        cvType: format
    }
    const [generateCV, { data: graphCvData, loading: generateCVLoading }] = useMutation<CvFile>(GENERATE_CV, {
        variables: {
            input: cvInput
        },
        onCompleted: async (data: any) => {
            if (graphCvData)  { await handleCompleteGenerate(graphCvData?.filename) }
            else { return }
        }
    })
    const [generateSummary, { data: graphSummaryData, loading: generateSummaryLoading }] = useMutation<Summary>(GENERATE_SUMMARY, {
        variables: {
            input: cvInput
        }
    })
    const router = useRouter();
    const pathName = usePathname();
    const supabase = createClientComponentClient<Database>();

    useEffect(() => {
        const getSummary = async () => {
            await generateSummary();
            if (graphSummaryData) {
                setSummary(graphSummaryData.summary);
            }
        }

        getSummary();
    }, [])

    const handleGenerateCV = () => {
        generateCV();
        onCancel();
    }

    const handleGenerateSummary = async () => {
        await generateSummary();
        if (graphSummaryData) {
            setSummary(graphSummaryData.summary)
        }
    }

    const toggleEditing = () => {
        inputRef.current?.focus();
    };

    const handleCompleteGenerate = async (filename: string) => {
        await supabase
            .from("cv_file")
            .insert({
                filename: filename,
                profile_id: profileId
            });
        await fetchAndDownloadCV(filename);
        router.push(nextLink);
    }

    const fetchAndDownloadCV = async (filename: string) => {
        const currPathNoQuery = pathName.split("?")[0];
        const currPath = currPathNoQuery
            .split("/")
            .filter(v => v.length > 0);
        const currPage = currPath[currPath.length-1];
        window.analytics?.track("Download CV", {
            title: `Downloaded CV in ${currPage}`,
            userId: userId,
            profileId: profileId,
            current_path: currPath
        })
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/cv/${filename}`)
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
        }
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob)
        window.open(blobUrl, '_blank');
    }


    return (
        <Modal
            title="Select CV format"
            maskClosable={true}
            open={open}
            width={800}
            footer={[
                <Button 
                    key="download"
                    type="primary"
                    onClick={handleGenerateCV}
                    loading={generateCVLoading}
                >{generateCVLoading ? "Downloading" : "Download and proceed"}</Button>
            ]}
            onCancel={onCancel}
            >
            <div style={{ display: 'flex', flexDirection: 'column', gap: "8px" }}>
                <Card size="small" title="Summary" style={{ width: '100%' }}>
                    <Input.TextArea 
                    name="okay"
                    value={summary}
                    style={{ width: '100%' }} 
                    autoSize={{ minRows: 3, maxRows: 15 }}
                    onChange={e => setSummary(e.target.value)}
                    bordered={false}
                    ref={inputRef}
                    />
                </Card>
                <Row justify='end'>
                    <Space direction="horizontal">
                        <Button onClick={() => toggleEditing()}>Edit</Button>
                        <Button onClick={async () => await handleGenerateSummary()} loading={generateSummaryLoading}>Retry</Button>
                    </Space>
                </Row>
                <Row justify="start">
                    <Col span={12}>
                        <Result
                            style={{ borderRadius: "15px", border: format === BASE_CV ? '1px solid #1677ff' : "1px solid #fff" }}
                            icon={
                                <Image
                                    width={200}
                                    height={282}
                                    style={{ objectFit: "scale-down", border: '1px solid #d9d9d9' }}
                                    src='/base_cv.png'
                                    alt='base CV image'
                                />
                            }
                            title="Base"
                            subTitle="Simple template for early hires"
                            extra={<Button onClick={() => setFormat(BASE_CV)}>{format === BASE_CV ? "Selected" : "Select"}</Button>}
                        />
                    </Col>
                    <Col span={12}>
                        <Result
                            style={{ borderRadius: "15px", border: format === PRIME_CV ? '1px solid #1677ff' : "1px solid #fff" }}
                            icon={
                                <Image
                                    width={200}
                                    height={282}
                                    style={{ objectFit: "scale-down", border: '1px solid #d9d9d9' }}
                                    src='/prime_cv.png'
                                    alt='prime CV image'
                                />
                            }
                            title="Prime"
                            subTitle="Refined template for experienced hires"
                            extra={<Button onClick={() => setFormat(PRIME_CV)}>{format === PRIME_CV ? "Selected" : "Select"}</Button>}
                        />
                    </Col>
                </Row>
            </div>
        </Modal>
    )
}

export default CvDownloadModal;