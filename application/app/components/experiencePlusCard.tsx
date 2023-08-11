import { Experience, JobPosting, UserBio } from "@/models/cv";
import { FormikProps } from "formik";
import { FC } from "react";

interface ExperiencePlusCardProps {
    formProps: FormikProps<Experience[]>,
    value: Experience,
    userBio: UserBio,
    jobPosting: JobPosting,
    profileId: number,
    index: number,
    onClick: () => Promise<void>
}

const ExperiencePlusCard: FC<ExperiencePlusCardProps> = ({
    formProps, value, userBio, jobPosting, profileId, index
}: ExperiencePlusCardProps) => {


    return (
        <></>
    )
}

export default ExperiencePlusCard;