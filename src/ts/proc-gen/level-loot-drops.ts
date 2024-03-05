import Level from "../model/Level.class";
import Random from "../Random";
import Being from "../model/Being.class";
import Item from "../model/Item.class";

export const spawnItemLootDrops = (level: Level) => {
    const itemsToSpawn = Random.n(0, 5);
    const unoccupiedSpaces = level.getUnoccupiedSpaces();
    Array(itemsToSpawn).fill(0).forEach(() => {

        const item = level.biome.items[Random.n(0, level.biome.items.length-1)];
        const being = new Item(item);
        const unoccupiedIndex = Random.n(0, unoccupiedSpaces.length-1);
        const {x, y} = unoccupiedSpaces[unoccupiedIndex];
        unoccupiedSpaces.splice(unoccupiedIndex, 1);


        level.addItem(being, x, y);
    })
}