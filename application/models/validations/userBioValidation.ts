import { Education, Experience, JobPosting, Skillset, UserBio } from "../cv";

export const isUserBioNotFilled = (userBio: UserBio) => !userBio.firstName ||
    !userBio.lastName ||
    !userBio.email ||
    !userBio.phone ||
    !userBio.address;

export const isJobPostingNotFilled = (jobPosting: JobPosting) => !jobPosting.title ||
    !jobPosting.company ||
    !jobPosting.sector ||
    !jobPosting.requirements;

export const isExperiencesNotExist = (experiences: Experience[]) => !(experiences.length > 0);

export const isExperiencesNotFilled = (experiences: Experience[]) => experiences.map(exp => {
    return !exp.title ||
        !exp.company ||
        !exp.sector ||
        !exp.startDate ||
        !exp.achievements;
});

export const isEducationNotExist = (education: Education[]) => !(education.length > 0);

export const isEducationNotFilled = (education: Education[]) => education.map(ed => {
    return !ed.subject ||
        !ed.institution ||
        !ed.degree ||
        !ed.startDate ||
        !ed.endDate;
});

export const isSkillsetNotFilled = (skillset: Skillset) => !skillset.skillsets;