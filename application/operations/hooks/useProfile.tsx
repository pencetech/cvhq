import { FormData, ProfilesData } from "../../models/cv";
import { ReactiveVar } from "@apollo/client";

export function useProfiles(profilesVar: ReactiveVar<ProfilesData>) {
    // TODO: idempotency check
    const insertProfile = (data: FormData) => {
        const allProfile = profilesVar();
        allProfile.push(data)
        profilesVar(allProfile)
    }

    return {
        operations: { insertProfile }
    }
}