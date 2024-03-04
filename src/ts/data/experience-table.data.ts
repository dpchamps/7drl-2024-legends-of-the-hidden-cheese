const LEVEL_CAP = 20;
export const ExperienceThresholds = Array(LEVEL_CAP).fill(0).map(
    (_, i) => Math.pow(2, i)
);

export const StatGrowthTable = Array(LEVEL_CAP).fill(0).map(
    (_, i) => ({
        health: 1+i,
        strength: 1+i,
        dexterity: 1+i
    })
)



export const getExperienceForLevel = (level: number) => {
    const currentXp = ExperienceThresholds[level];
    const nextLevelXp = ExperienceThresholds[level+1] || ExperienceThresholds[ExperienceThresholds.length-1];

    return {currentXp, nextLevelXp};
}

export const calculateXpGained = (gaineeLevel: number, defeatedLevel: number) => {
    return defeatedLevel * defeatedLevel;
}