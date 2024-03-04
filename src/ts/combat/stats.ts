import {ArmorModifier} from "./index";

export type Stats = {
    xp: number,
    level: number,
    strength: number,
    health: number,
    dexterity: number,
}

export const empty = () => ({
    xp: 0,
    level: 0,
    health: 0,
    strength: 0,
    dexterity: 0,
});

export const from = (stats: Partial<Stats>) => ({
    ...empty(),
    ...stats
});

export const armorClass = ({dexterity}: Stats, acModifier: ArmorModifier) => dexterity + acModifier.base;

export const toHit = ({strength}: Stats, {accuracyMod}: {accuracyMod: number}) => strength + accuracyMod;