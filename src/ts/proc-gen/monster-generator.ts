import RacesData from "../data/Races.data";
import Random from "../Random";
import {LootTable} from "./LootTable";
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
import * as Stats from "../combat/stats";
import {ItemRarity} from "./item-generator";
import {StatGrowthTable} from "../data/experience-table.data";
const raceArray = Object.values(RacesData);

const FULL_STATS_TABLE = StatGrowthTable.reduce(([last, table], next, i) => {
    const nextStat = {
        level: i+1,
        health: last.health + (next.health),
        strength: last.strength + next.strength,
        dexterity: last.dexterity + next.dexterity
    }
    table[i+1] = nextStat
    return [nextStat, table] as const
}, [Stats.from({
    level: 0,
    health: 35,
    strength: 2,
    dexterity: 2
}), {} as Record<string, any>] as const)[1];

export const itemRarityFromLevel = (level: number): ItemRarity => {
    if(level < 4) return "Common";
    if(level >= 4 && level < 7) return "Uncommon";
    if(level >= 7 && level < 13) return "Rare"
    return "Legendary"
}

const MONSTER_WEAPON_NAME = ["Claw", "Fang", "Tongue", "Tooth", "Tail"]

export const spawnMonster = (levelRange: [number, number], lootTable: LootTable) => {
    const races = raceArray.filter(({baseLevel}) => baseLevel >= levelRange[0] && baseLevel <= levelRange[1]);
    const race = races[Random.n(0, races.length-1)];
    const monsterLevel =  Math.max(Random.n(levelRange[0], levelRange[1]), 1);
    const stats = FULL_STATS_TABLE[monsterLevel];

    const nameModifier = uniqueNamesGenerator({dictionaries: [adjectives], style: "capital", length: 1})
    const name = `${nameModifier} ${race.name}`;
    const weaponTable = lootTable.getItemsByTypeByRarity("weapons", itemRarityFromLevel(monsterLevel));
    const randomWeapon = weaponTable[Random.n(0, weaponTable.length-1)];
    const armorModifier = {
        base: monsterLevel+Random.n(-2, 2)
    }

    return {
        ...race,
        name,
        stats,
        weapon : {
            ...(randomWeapon as any).weaponStats,
            name: MONSTER_WEAPON_NAME[Random.n(0, MONSTER_WEAPON_NAME.length-1)]
        },
        armorModifier
    }
}