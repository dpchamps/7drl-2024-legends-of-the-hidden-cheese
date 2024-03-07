import Random from "../Random";
import {weaponStats} from "../combat";
import ItemTypesData from "../data/ItemTypes.data";
import {ConsumableCategories} from "../data/Items.data";
import {Buff} from "../combat/combat-state";
import {names} from "unique-names-generator";

const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

export type ItemRarity =
    "Common" |
    "Uncommon" |
    "Rare" |
    "Legendary" |
    "Unique"

const RarityTable = [20, 10, 5, 2, 1];
const RarityModel: {type: ItemRarity, items: number}[] = (["Common", "Uncommon", "Rare", "Legendary", "Unique"] as const).map((type, i) => ({type, items: RarityTable[i]}))

export type WeaponType = "Sword" | "Axe" | "Dagger" | "Great Sword";

const weaponRange = (weaponType: WeaponType) => {
    switch (weaponType) {
        case "Sword": return {damageRange: [1, 10],threatRange: [19, 20]} as const
        case "Axe": return { damageRange: [2, 20], threatRange: [20, 20]} as const
        case "Dagger": return { damageRange: [2, 8], threatRange: [18, 20]} as const
        case "Great Sword": return { damageRange: [1, 12], threatRange: [20, 20]} as const
    }
};

const weaponTiles = (weaponType: WeaponType) => {
    switch(weaponType){
        case "Sword": return '32-7'
        case "Axe": return `38-8`
        case "Dagger": return `33-6`
        case "Great Sword": return `34-8`
    }
}

const generateWeaponStats = (weaponType: WeaponType, rarity: ItemRarity, name: string) => {
    const {damageRange, threatRange} = weaponRange(weaponType);
    const baseStats = weaponStats({name, damageRange, threatRange});

    switch (weaponType){
        case "Sword":
        case "Dagger":{
            baseStats.accuracyMod += 1;
        }
    }

    switch (rarity){
        case "Uncommon":
            baseStats.accuracyMod += Random.n(2, 3)
            break;
        case "Rare":
            baseStats.accuracyMod += 1
            baseStats.damageMod += 1
            break;
        case "Legendary":
            baseStats.accuracyMod += 2;
            baseStats.damageMod += 2
            break;
        case "Unique":
            baseStats.accuracyMod += 4;
            baseStats.damageMod += 4
            baseStats.threatRange = [baseStats.threatRange[0] -1, baseStats.threatRange[1]]
            break;
    }

    return baseStats
}

const generateWeapons = () => {
    const weapons = [];
    const weaponTypes: WeaponType[] = ["Sword", "Great Sword", "Axe", "Dagger"];
    for(const {type, items} of RarityModel){
        for(let i = 0; i < items; i += 1){
            const weaponType = weaponTypes[Random.n(0, weaponTypes.length-1)];
            const weaponTile = weaponTiles(weaponType);
            const weaponMaterial = uniqueNamesGenerator({dictionaries: [adjectives], style: "capital", length: 1})
            const name = `${type !== 'Common' ? `${type} ` : ''}${weaponMaterial} ${weaponType}`;
            const stats = generateWeaponStats(weaponType, type, name);
            weapons.push({
                rarity: type,
                type: ItemTypesData.WEAPON,
                name,
                tilesetData: weaponTile,
                weaponStats: stats
            })
        }
    }

    return weapons;
}

const ArmorTiles = ["31-1", "32-1", '33-1', '34-1', '35-1'];

const generateArmorStats = (rarity: ItemRarity) => {
    const baseArmorStats = {
        base: 0
    }

    switch (rarity) {
        case "Common":
            baseArmorStats.base = Random.n(1, 2);
            break;
        case "Uncommon":
            baseArmorStats.base = Random.n(2, 5);
            break;
        case "Rare":
            baseArmorStats.base = Random.n(5, 15);
            break;
        case "Legendary":
            baseArmorStats.base = Random.n(20, 35);
            break;
        case "Unique":
            baseArmorStats.base = 50
            break;

    }

    return baseArmorStats;
}

const generateArmor = () => {
    const armors = [];
    for(const {type, items} of RarityModel){
        for(let i = 0; i < items; i += 1){
            const armorTile = ArmorTiles[Random.n(0, ArmorTiles.length-1)];
            const armorFamily = uniqueNamesGenerator({dictionaries: [names], style: "capital", length: 1});
            const name = `${type !== 'Common' ? `${type} ` : ''}Armor of the ${armorFamily} clan`;
            const stats = generateArmorStats(type);
            armors.push({
                rarity: type,
                type: ItemTypesData.ARMOR,
                name,
                tilesetData: armorTile,
                armorModifier: {...stats, name}
            })
        }
    }

    return armors;
}


type ConsumableItemType = "Food" | "Potion" | "Infusion";

const CONSUMABLE_ITEM_TYPES = ['Food', 'Potion', "Infusion"] as const;
const FOOD_TILES = ["34-18", '33-18', '33-16', '34-19'];
const POTION_TILES = ['42-11','34-14', '33-14', '32-14'];
const INFUSION_TILES = ['34-10', '33-10', '32-10'];

const getConsumableTile = (consumableItemType: ConsumableItemType) => {
    switch(consumableItemType){
        case "Food": return FOOD_TILES[Random.n(0, FOOD_TILES.length-1)]
        case "Potion": return POTION_TILES[Random.n(0, POTION_TILES.length-1)]
        case "Infusion": return INFUSION_TILES[Random.n(0, INFUSION_TILES.length-1)]
    }
}

const getHealingAffectFromRarity = (rarity: ItemRarity) => {
    switch (rarity){
        case "Common": return Random.n(10, 20)
        case "Uncommon": return Random.n(20, 50)
        case "Rare": return Random.n(30, 70)
        case "Legendary": return Random.n(50, 100)
        case "Unique": return 10000
    }
}

const BUFF_TABLE = [`strength`, `dexterity`] as const;
const getBuffAffectFromRarity = (rarity: ItemRarity, name: string) => {
    const baseBuff: Buff = {
        stats: {
            strength: 0,
            health: 0,
            dexterity: 0
        },
        turns: 0,
        name
    }
    const randomBuff = BUFF_TABLE[Random.n(0, BUFF_TABLE.length-1)];

    switch (rarity){
        case "Common":
            baseBuff.stats[randomBuff] = Random.n(1, 2);
            baseBuff.turns = Random.n(2, 3);
            break;
        case "Uncommon":
            baseBuff.stats[randomBuff] = Random.n(1, 3);
            baseBuff.turns = Random.n(3, 6);
            break;
        case "Rare":
            baseBuff.stats[randomBuff] = Random.n(3, 6);
            baseBuff.turns = Random.n(4, 5);
            break;
        case "Legendary":
            baseBuff.stats[randomBuff] = Random.n(5, 10);
            baseBuff.turns = Random.n(5, 10);
            break;
        case "Unique":
            baseBuff.stats = {
                ...baseBuff.stats,
                strength: Random.n(10, 15),
                dexterity: Random.n(10, 15)
            }
            baseBuff.turns = 35;
            break;

    }

    return baseBuff;
}

const getConsumableAffects = (category: keyof typeof ConsumableCategories, rarity: ItemRarity, name: string) => {
    switch (category) {
        case "Healing":return {health: getHealingAffectFromRarity(rarity)};
        case "Buff":
        case "SpecialBuff": return getBuffAffectFromRarity(rarity, name)
    }
}

const generateConsumables = () => {
    const consumables = [];
    for(const {type, items} of RarityModel) {
        for (let i = 0; i < items; i += 1) {
            const consumableItemType = CONSUMABLE_ITEM_TYPES[Random.n(0, CONSUMABLE_ITEM_TYPES.length-1)]
            const consumableCategory: keyof typeof ConsumableCategories = i % 2 === 0 ? ConsumableCategories.Buff : ConsumableCategories.Healing
            const consumableTile = getConsumableTile(consumableItemType);
            const consumableModifier = uniqueNamesGenerator({dictionaries: [adjectives], style: "capital", length: 1})
            const consumableAnimal = uniqueNamesGenerator({dictionaries: [animals], style: "capital", length: 1})
            const name = `${consumableModifier} ${consumableItemType} of the ${consumableAnimal}`;
            const affect = getConsumableAffects(consumableCategory, type, name);

            consumables.push({
                rarity: type,
                type: ItemTypesData.CONSUMABLE,
                name,
                tilesetData: consumableTile,
                consumableData: {
                    category: consumableCategory,
                    affect
                }
            })
        }
    }

    return consumables;
}

export const generateItems = () => {
   const weapons = generateWeapons();
   const consumables = generateConsumables();
   const armor = generateArmor();

   return {
       weapons,
       consumables,
       armor
   }
}