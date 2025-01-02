import data from "../../data.json";
import { ActivityFormData } from "../ActivityForm";

interface ResultData {
    timeOfDay: string;
    maxTravelDistance: number;
    crowdPreference: number;
    physicalDemand: number;
    socialIntent: number;
    budget: number;
    wantsFood: boolean;
    wantsAlcohol: boolean;
    transportModes: {
        publicTransport: boolean;
        driving: boolean;
    };
    description: string
}

export interface GeneratedResults {
    score: number;
    name: string;
    description: string;
}

const DIST_RATE = 30;
const SOCI_RATE = 10;
const PHYS_RATE = 20;
const PRIC_RATE = 10;
const HUNG_RATE = 10;
const PTRA_RATE = 10;
const PRKG_RATE = 10;
const ALCH_RATE = 30;
const TODA_RATE = 30;
const STRG_RATE = 10;
// const BOOK_RATE = 5;

const MAX_DIST = 4;
const MAX_SOCI = 3;
const MAX_PHYS = 4;
const MAX_PRIC = 4;
const MAX_PTRA = 4;
const MAX_TODA = 3;

export const generateResults = (formData: ActivityFormData) => {
    const activities = data.activities;

    const results: GeneratedResults[] = [];

    for (const activity of activities) {

        const similarityScore = getSimilarity(formData, {
            ...activity,
            transportModes: {
                publicTransport: activity.transportModes.publicTransport ?? false,
                driving: activity.transportModes.driving ?? false,
            }
        });
        results.push({
            score: similarityScore,
            name: activity.name,
            description: activity.description,
        });
    }

    results.sort((a, b) => b.score - a.score);

    return results;
}

const getSimilarity = (formData: ActivityFormData, input: ResultData) => {
    let total = 0;

    total += TODA_RATE * (MAX_TODA - Math.abs(dayToNum(formData.timeOfDay) - dayToNum(input.timeOfDay))) / MAX_TODA;
    total += DIST_RATE * (MAX_DIST - Math.abs(formData.maxTravelDistance - input.maxTravelDistance)) / MAX_DIST;
    total += SOCI_RATE * (MAX_SOCI - Math.abs(formData.socialIntent - input.socialIntent)) / MAX_SOCI;
    total += PHYS_RATE * (MAX_PHYS - Math.abs(formData.physicalDemand - input.physicalDemand)) / MAX_PHYS;
    total += PRIC_RATE * (MAX_PRIC - Math.abs(formData.budget - input.budget)) / MAX_PRIC;
    total += STRG_RATE * (MAX_PTRA - Math.abs(formData.crowdPreference - input.crowdPreference)) / MAX_PTRA;

    total += formData.wantsFood ? HUNG_RATE : 0;
    total += formData.wantsAlcohol ? ALCH_RATE : 0;
    total += formData.transportModes.driving ? PRKG_RATE : 0;
    total += formData.transportModes.driving ? PTRA_RATE : 0;


    return total / (DIST_RATE + SOCI_RATE + PHYS_RATE + PRIC_RATE + HUNG_RATE + PTRA_RATE + PRKG_RATE + ALCH_RATE + TODA_RATE + STRG_RATE);
}

const dayToNum = (day: string) => {
    switch (day) {
        case "morning": return 0;
        case "day": return 1;
        case "evening": return 2;
        case "night": return 3;
        default: return 0;
    }

    return 0;
}