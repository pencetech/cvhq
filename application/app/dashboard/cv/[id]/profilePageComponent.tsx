"use client";
import ProfileCard from "@/app/components/profileCard"
import { Col, Row } from "antd"
import FileListComponent from "./fileListComponent"
import { CvFile, FormData } from "@/models/cv"
import { gql, useMutation } from "@apollo/client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const GENERATE_CV = gql`
mutation generateCV($input: ProfileInput!) {
    generateCV(input: $input) {
      filename
    }
  }
`
const ProfilePageComponent = ({ id, profile, files, profileName }: {
    id: number,
    profile: FormData,
    files: CvFile[],
    profileName: string
}) => {
    const router = useRouter();
    const pathName = usePathname();
    const supabase = createClientComponentClient<Database>();
    const [user, setUser] = useState('');
    const [formData, setFormData] = useState<FormData>({
        userBio: profile.userBio,
        jobPosting: profile.jobPosting,
        experiences: profile.experiences,
        education: profile.education,
        skillsets: profile.skillsets
    });
    const [generateCV, { data, loading, error }] = useMutation(GENERATE_CV, {
        variables: {
            input: {
                id: 1,
                userBio: profile.userBio,
                jobPosting: profile.jobPosting,
                experiences: profile.experiences,
                education: profile.education,
                skillsets: profile.skillsets
            }
        },
        onCompleted: async (data: any) => await handleCompleteGenerate(data.generateCV.filename)
    })

    useEffect(() => {
        const getUser = async () => {
          const {
            data: { user },
          } = await supabase.auth.getUser()
          if (user) {
            setUser(user?.id)
          }
        }
    
        getUser();
      }, [])

    const handleCompleteGenerate = async (filename: string) => {
        await supabase
            .from("cv_file")
            .insert({
                filename: filename,
                profile_id: id
            });
        await fetchAndDownloadCV(filename);
        router.refresh()
    }

    const fetchAndDownloadCV = async (filename: string) => {
        const currPathNoQuery = pathName.split("?")[0];
        const currPath = currPathNoQuery
            .split("/")
            .filter(v => v.length > 0);
        const currPage = currPath[currPath.length-1];
        window.analytics?.track("Applied enhancement", {
            title: `Applied enhancement in ${currPage}`,
            userId: user,
            profileId: id,
            current_path: currPath
        })
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
            <Col span={14}>
                {profile ? <ProfileCard title={profileName} profileId={id} profile={formData} onUpdate={setFormData}/> : "profile empty"}  
            </Col>
            <Col span={10}>
                {files ? <FileListComponent 
                    loading={loading} 
                    profileId={id}
                    files={files} 
                    onFileClick={fetchAndDownloadCV}
                    onGenerateClick={generateCV}
                     /> : "no file"}
            </Col>
        </Row>
    )
}

export default ProfilePageComponent;