import Items from './Items.data';
import Random from "../Random";
import Item from "../model/Item.class";
const GENERIC_DROP_TABLE = [
    Items.POTION_OF_HEALING,
    Items.HEARTY_POTION_OF_HEALING,
    Items.IRON_ARMOR,
    Items.IRON_SWORD
];

const genericDropRate = 0.33;

const DROP_TABLES = {
    GENERIC: {
        table: GENERIC_DROP_TABLE,
        dropRate: genericDropRate
    }
};

export type DROP_TABLE_TYPES = keyof typeof DROP_TABLES;

export const rollDrop = (table: DROP_TABLE_TYPES) => {
    const dropTable = DROP_TABLES[table];
    const dropRate = dropTable.dropRate * 100;
    const dropRoll = Random.n(0, 100);
    const item = dropTable.table[Random.n(0, dropTable.table.length-1)];

    if(dropRoll <= dropRate){
        return new Item(item);
    }

    return undefined;
}