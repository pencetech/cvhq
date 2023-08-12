export interface UserBio {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
}
export interface JobPosting {
    title: string;
    company: string;
    sector: string;
    requirements: string;
    addOn?: string;
}
export interface Experience {
    id: number;
    title: string;
    company: string;
    sector: string;
    isCurrent: boolean;
    startDate: string;
    endDate: string | null;
    achievements: string;
}

export interface Education {
    id: number,
    subject: string,
    institution: string,
    degree: string,
    startDate: string,
    endDate: string
}

export interface Skillset {
    skillsets: string
}
export interface Summary {
    summary: string
}

export interface Experiences {
    experiences: Experience[]
}

export interface ProfileName {
    profileName: string
}

export interface BioSkillset {
    userBio: UserBio,
    skillsets: Skillset
}

export interface CvFile {
    filename: string,
    createdAt: string
}

export interface FormData {
    id?: number,
    userBio: UserBio,
    jobPosting: JobPosting,
    experiences: Experience[],
    education: Education[],
    skillset: Skillset,
    summary?: Summary
};

export interface AchivementPlus {
    description: string,
    isAdded: boolean
}

export interface ProfileMeta {
    id: number,
    description: string,
    createdAt: string
}

export type ProfilesData = FormData[];
export type Profiles = ProfileMeta[];