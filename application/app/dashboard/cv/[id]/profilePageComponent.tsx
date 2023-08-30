"use client";
import ProfileCard from "@/app/components/profileCard"
import { Col, Row } from "antd"
import { FormData } from "@/models/cv"
import { useState } from "react";
import RightDashboard from "@/app/components/rightDashboard";

const ProfilePageComponent = ({ id, profile, profileName }: {
    id: number,
    profile: FormData,
    profileName: string
}) => {
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

    return (
        <Row gutter={32}>
            <Col span={16}>
                {profile ? <ProfileCard title={profileName} profileId={id} profile={formData} onUpdate={(value) => setFormData(value)}/> : "profile empty"}  
            </Col>
            <Col span={8}>
                <RightDashboard profile={formData} />
            </Col>
        </Row>
    )
}

export default ProfilePageComponent;