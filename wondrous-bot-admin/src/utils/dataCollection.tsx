import { INTERESTS } from "utils/constants";



export const getInterestsPerCategory = (category: string | null) => {
    // if no category or the category doesn't exist in INTERESTS then return all the interests
    if (!category || !INTERESTS[category]) {
        return Object.values(INTERESTS).flat();
    }
    return INTERESTS[category];
};
