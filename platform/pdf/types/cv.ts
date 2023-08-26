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
    id?: number;
    title: string;
    company: string;
    sector: string;
    isCurrent: boolean;
    startDate: string;
    endDate: string | null;
    achievements: string;
}

export interface Education {
    id?: number,
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

export interface CvInput {
    userBio: UserBio,
    summary: Summary,
    experiences: Experience[],
    education: Education[],
    skillsets: Skillset,
    cvType: "BASE" | "PRIME"
}