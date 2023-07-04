"use client";
import ProfileCard from "@/app/components/profileCard"
import { Col, Row } from "antd"
import FileListComponent from "./fileListComponent"
import { CvFile, FormData } from "@/models/cv"
import { gql, useMutation } from "@apollo/client";


const GENERATE_CV = gql`
mutation generateCV($input: ProfileInput!) {
    generateCV(input: $input) {
      filename
    }
  }
`
const ProfilePageComponent = ({ id, profiles, files }: {
    id: number,
    profiles: FormData,
    files: CvFile[]
}) => {
    const [generateCV, { data, loading, error }] = useMutation(GENERATE_CV, {
        variables: {
            input: {
                id: 1,
                userBio: profiles.userBio,
                experiences: profiles.experiences,
                education: profiles.education,
                skillsets: profiles.skillsets
            }
        },
        onCompleted: async (data: any) => await handleCompleteGenerate(data.generateCV.filename)
    })

    const handleCompleteGenerate = async (filename: string) => {
        await fetchAndDownloadCV(filename);
    }

    const fetchAndDownloadCV = async (filename: string) => {
        const res = await fetch(`https://cvhq-platform-production.fly.dev/cv/${filename}`)
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
        }
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob)
        window.open(blobUrl, '_blank');
    }

    return (
        <Row gutter={16}>
            <Col flex={2}>
                {profiles ? <ProfileCard profileId={id} profile={profiles} /> : "profile empty"}  
            </Col>
            <Col flex={3}>
                {files ? <FileListComponent 
                    loading={loading} 
                    files={files} 
                    onFileClick={fetchAndDownloadCV}
                    onGenerateClick={generateCV}
                     /> : "no file"}
            </Col>
        </Row>
    )
}

export default ProfilePageComponent;