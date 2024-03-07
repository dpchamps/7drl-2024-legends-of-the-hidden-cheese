import Level from "../model/Level.class";
import Items from "../data/Items.data";
import Random from "../Random";
import Item from "../model/Item.class";
import {Biomes} from "./biomes";
import Being from "../model/Being.class";
import {spawnMonster} from "./monster-generator";
export const generateGameWinningItems = (levelMap: Record<string, Level>) => {
    const levels = Object.values(levelMap).filter((level) => level.biome.name === Biomes.Desert.name);
    [Items.MAGIC_CHEESE_OF_NEYPH,Items.MAGIC_CHEESE_OF_CINDARIUM, Items.MAGIC_CHEESE_OF_ROE].forEach((item) => {
        const levelIndex = Random.n(0, levels.length-1)
        const randomLevel = levels[Random.n(0, levels.length-1)];
        const unoccupiedSpaces = randomLevel.getUnoccupiedSpaces();
        const {x, y} = unoccupiedSpaces[Random.n(0, unoccupiedSpaces.length-1)];
        randomLevel.addItem(new Item(item), x, y);
        const baseRace = spawnMonster([14, 14], randomLevel.game.world.lootTable);
        baseRace.name = `Guardian of the Cheese`;
        randomLevel.addBeing(new Being(randomLevel.game, randomLevel, baseRace), x, y)

        levels.splice(levelIndex, 1);
    });
}