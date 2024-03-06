import Items from './Items.data';
import Random from "../Random";
import Item from "../model/Item.class";
import {LootTable} from "../proc-gen/LootTable";
import {itemRarityFromLevel} from "../proc-gen/monster-generator";


const genericDropRate = 0.33;


export const rollDrop = (table: LootTable, level: number) => {
    const dropRate = genericDropRate * 100;
    const dropRoll = Random.n(0, 100);
    const itemRarity = itemRarityFromLevel(level);
    const lootTable = table.getItemsByRarity(itemRarity);
    const item = lootTable[Random.n(0, lootTable.length-1)]

    if(dropRoll <= dropRate){
        return new Item(item);
    }

    return undefined;
}