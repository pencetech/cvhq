"use client";
import ProfileCard from "@/app/components/profileCard"
import { Col, Modal, Row } from "antd"
import FileListComponent from "./fileListComponent"
import { CvFile, FormData } from "@/models/cv"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CvDownloadModal from "@/app/components/cvDownloadModal";
import { gql, useMutation } from "@apollo/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Mutation } from "@/app/__generated__/graphql";

const GENERATE_SUMMARY = gql`
mutation generateSummary($input: CvInput!) {
    generateSummary(input: $input) {
        summary
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState('');
    const [formData, setFormData] = useState<FormData>({
        userBio: profile.userBio,
        jobPosting: profile.jobPosting,
        experiences: profile.experiences,
        education: profile.education,
        skillset: profile.skillset,
        summary: {
            summary: ''
        }
    });

    const getFileList = async () => {
        let { data, error, status } = await supabase
            .from('cv_file')
            .select('filename, inserted_at')
            .eq('profile_id', id)
            .order('inserted_at', { ascending: false });

        if (error && status !== 406) {
            throw error;
        }

        const files = data?.map(file => ({
            filename: file.filename,
            createdAt: file.inserted_at
        }))
        return files;
    }
    
    const { data: fileData } = useQuery({
        queryKey: ['file-list'],
        queryFn: getFileList,
        initialData: files
    })

    const cvInput = {
        id: 1,
        cvContent: {
            userBio: formData.userBio,
            experiences: formData.experiences,
            summary: formData.summary,
            education: formData.education,
            skillsets: formData.skillset
        },
        jobPosting: formData.jobPosting,
        cvType: "BASE"
    }

    const [generateSummary, { data: graphSummaryData, loading: generateSummaryLoading }] = useMutation<Mutation>(GENERATE_SUMMARY, {
        variables: {
            input: cvInput
        }
    })

    const handleGenerateSummary = async () => {
        const { data } = await generateSummary();
        handleChangeSummary(data ? data.generateSummary.summary : '');
    }

    const handleChangeSummary = (summary: string) => {
        const values = { 
            summary: {
                summary: summary
            }
        }
        const data = { ...formData, ...values };
        setFormData(data);
    }

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
    }, [supabase.auth])

    const handleGenerateClick = async () => {
        const isValidationPassed = isAllFieldsFilled();
        if (isValidationPassed) {
            showModal();
            await handleGenerateSummary();
        }
    }

    const showModal = () => {
        setIsModalOpen(true);
      };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const isAllFieldsFilled = () => {
        const userBioNotFilled = !formData.userBio.firstName ||
            !formData.userBio.lastName ||
            !formData.userBio.email ||
            !formData.userBio.phone ||
            !formData.userBio.address;

        const jobPostingNotFilled = !formData.jobPosting.title ||
            !formData.jobPosting.company ||
            !formData.jobPosting.sector ||
            !formData.jobPosting.requirements;

        const experiencesNotExist = !(formData.experiences.length > 0);

        const experiencesNotFilled = formData.experiences.map(exp => {
            return !exp.title ||
                !exp.company ||
                !exp.sector ||
                !exp.startDate ||
                !exp.achievements;
        });

        const educationNotExist = !(formData.education.length > 0);

        const educationNotFilled = formData.education.map(ed => {
            return !ed.subject ||
                !ed.institution ||
                !ed.degree ||
                !ed.startDate ||
                !ed.endDate;
        })
        const skillsetNotFilled = !formData.skillset.skillsets

        const validationSchema = {
            userBio: userBioNotFilled,
            jobPosting: jobPostingNotFilled,
            experiences: experiencesNotExist || experiencesNotFilled.includes(true),
            education: educationNotExist || educationNotFilled.includes(true),
            skillset: skillsetNotFilled
        }

        const failedFields = Object.entries(validationSchema).filter((elem => elem[1] === true ))

        if (failedFields.length > 0) {
            Modal.error({
                title: 'Fields incomplete',
                content: `Please complete the following fields: ${failedFields.map(elem => elem[0]).join(", ")}`,
              });

            return false;
        }

        return true;
    }

    const fetchAndDownloadCV = async (filename: string) => {
        const currPathNoQuery = pathName.split("?")[0];
        const currPath = currPathNoQuery
            .split("/")
            .filter(v => v.length > 0);
        const currPage = currPath[currPath.length-1];
        window.analytics?.track("Download CV", {
            title: `Downloaded CV in ${currPage}`,
            userId: user,
            profileId: id,
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
        <Row gutter={16}>
            <Col span={16}>
                {profile ? <ProfileCard title={profileName} profileId={id} profile={formData} onUpdate={(value) => setFormData(value)}/> : "profile empty"}  
            </Col>
            <Col span={8}>
                {fileData ? <FileListComponent 
                    profileName={profileName}
                    profileId={id}
                    files={fileData} 
                    onFileClick={fetchAndDownloadCV}
                    onGenerateClick={handleGenerateClick}
                     /> : "no file"}
            </Col>
            <CvDownloadModal 
                userId={user} 
                profileId={id} 
                formData={formData} 
                open={isModalOpen} 
                onCancel={handleCancel} 
                onFetchSummary={handleGenerateSummary}
                onChangeSummary={handleChangeSummary}
                loading={generateSummaryLoading}
                nextLink={pathName} 
            />
        </Row>
    )
}

export default ProfilePageComponent;