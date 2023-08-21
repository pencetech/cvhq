'use client';
import { Experience, Experiences, JobPosting, UserBio } from "@/models/cv";
import { FormikProps } from "formik";
import { FC, useState } from "react";
import AchievementPlus from "./achievementPlus";
import ExperienceCardForm from "./experienceCardForm";
import { Button, Divider, Row, Typography } from "antd";

interface ExperiencePlusCardProps {
    formProps: FormikProps<Experiences>,
    value: Experience,
    userBio: UserBio,
    jobPosting: JobPosting,
    profileId: number,
    index: number
}

const ExperiencePlusCard: FC<ExperiencePlusCardProps> = ({
    formProps, value, userBio, jobPosting, profileId, index
}: ExperiencePlusCardProps) => {
    const [loading, setLoading] = useState(false);
    const [isPlusOpen, setIsPlusOpen] = useState(false);
    const [achievements, setAchievements] = useState([
        {
            description: "description1",
            isAdded: false
        },
        {
            description: "description2",
            isAdded: false
        },
        {
            description: "description3",
            isAdded: false
        },
        {
            description: "description4",
            isAdded: false
        },
        {
            description: "description5",
            isAdded: false
        }, 
        {
            description: "description6",
            isAdded: false
        }
    ]);

    const handleAdd = (value: string, achievementIndex: number) => {
        const currAchievements = formProps.values.experiences[index].achievements
        formProps.setFieldValue(`experiences[${index}].achievements`, currAchievements + "\n" + value)
        formProps.setFieldTouched(`experiences[${index}].achievements`, true, false)
        setAchievements(list => list.map((item, i) => // Array.protptype.map creates new array
            i === achievementIndex
            ? {                               // new object reference for updated item
                ...item,                        // shallow copy previous item state
                isAdded: true            // overwrite property being updated
            }
            : item
        ));
    }
    // How do you display the interface on first render up to the achievements added
    const handleEnhance = () => {
        console.log("Achievements enhancing...");
    }

    const enhancementTitle = () => {
        let baseTitle = "Enhancements"

        if (formProps.values.experiences[index].title) {
            baseTitle = baseTitle + ": " + formProps.values.experiences[index].title 
        } 
        
        if (formProps.values.experiences[index].company) {
            baseTitle = baseTitle + ", " + formProps.values.experiences[index].company
        }

        return baseTitle;
    }
    
    return (
        <>
            <ExperienceCardForm formProps={formProps} index={index} onEnhance={handleEnhance} />
            <Divider orientation="left" orientationMargin="0">
                <Typography.Title level={4} style={{ margin: 0 }}>{enhancementTitle()}</Typography.Title>
            </Divider>
            <AchievementPlus loading={loading} achievements={achievements} onAdd={handleAdd} />
        </>
    )
}

export default ExperiencePlusCard;