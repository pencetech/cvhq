"use client";
import { Button, Col, Modal, Result, Row, Space } from "antd";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { gql, useMutation } from "@apollo/client";
import { FormData } from "@/models/cv";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";

const BASE_CV = "BASE"
const PRIME_CV = "PRIME"

const GENERATE_CV = gql`
mutation generateCV($input: CvInput!) {
    generateCV(input: $input) {
      filename
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
    const [generateCV, { data, loading, error }] = useMutation(GENERATE_CV, {
        variables: {
            input: {
                id: 1,
                cvContent: {
                    userBio: formData.userBio,
                    experiences: formData.experiences,
                    education: formData.education,
                    skillsets: formData.skillset
                },
                jobPosting: formData.jobPosting,
                cvType: format
            }
        },
        onCompleted: async (data: any) => await handleCompleteGenerate(data.generateCV.filename)
    })
    const router = useRouter();
    const pathName = usePathname();
    const supabase = createClientComponentClient<Database>();

    const handleGenerate = () => {
        generateCV();
        onCancel();
    }

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
                    onClick={() => generateCV()}
                    loading={loading}
                >{loading ? "Downloading" : "Download and proceed"}</Button>
            ]}
            onCancel={onCancel}
            >   
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
        </Modal>
    )
}

export default CvDownloadModal;