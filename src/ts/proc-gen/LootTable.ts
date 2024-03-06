import ItemsData from "../data/Items.data";
import {ItemRarity} from "./item-generator";
const shuffleArray = require('shuffle-array');
type T_ItemType = typeof ItemsData[keyof typeof ItemsData] & {rarity: ItemRarity};
type RawTables = {
    weapons: T_ItemType[],
    consumables: T_ItemType[],
    armor: T_ItemType[]
}
export class LootTable {
    rawLootTable: RawTables;
    droppedItems: Set<string>;

    constructor(rawTables: RawTables) {
        this.rawLootTable =rawTables;
    }

    getItemsByType(type: keyof RawTables){
        return this.rawLootTable[type]
    }

    getItemsByTypeByRarity(type: keyof RawTables, rarityNeedle: ItemRarity) {
        return this.rawLootTable[type].filter(({rarity}) => rarity === rarityNeedle)
    }

    getItemsByRarity(needle: ItemRarity){
        const items = [];
        for(const table of Object.keys(this.rawLootTable)){
            items.push(...this.getItemsByTypeByRarity(table as any, needle))
        }

        return items;
    }

    getLootDropIterator(){
        const pivot: Record<ItemRarity, T_ItemType[]> = {
            Common: shuffleArray(this.getItemsByRarity("Common")),
            Uncommon: this.getItemsByRarity("Uncommon"),
            Rare: this.getItemsByRarity("Rare"),
            Legendary: this.getItemsByRarity("Legendary"),
            Unique: this.getItemsByRarity("Unique")
        }

        const precedence: Record<ItemRarity, ItemRarity|undefined> = {
            Common: "Uncommon",
            Uncommon: "Rare",
            Rare: "Legendary",
            Legendary: "Unique",
            Unique: undefined
        }

        return function*(initial: ItemRarity){
            while(true){
                let next = pivot[initial].pop();
                while(typeof next === 'undefined'){
                    initial = precedence[initial];
                    next = pivot[initial].pop();
                }

                initial = yield next
            }
        }
    }
}