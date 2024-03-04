export type Vitals = {
    xp: number,
    health: number
}


export const empty = () => ({
    xp: 0,
    health: 0
});

export const from = (input: Partial<Vitals>) => ({
    ...empty(),
    ...input
})