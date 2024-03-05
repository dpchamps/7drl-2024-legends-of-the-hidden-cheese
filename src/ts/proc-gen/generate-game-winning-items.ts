import Level from "../model/Level.class";
import Items from "../data/Items.data";
import Random from "../Random";
import Item from "../model/Item.class";

export const generateGameWinningItems = (levelMap: Record<string, Level>) => {
    const levels = Object.values(levelMap);
    [Items.MAGIC_CHEESE_OF_NEYPH,Items.MAGIC_CHEESE_OF_CINDARIUM, Items.MAGIC_CHEESE_OF_ROE].forEach((item) => {
        const randomLevel = levels[Random.n(0, levels.length-1)];
        debugger
        const unoccupiedSpaces = randomLevel.getUnoccupiedSpaces();
        const {x, y} = unoccupiedSpaces[Random.n(0, unoccupiedSpaces.length-1)];
        console.log(`Placing ${item.name} on world tile ${randomLevel.id}`);
        randomLevel.addItem(new Item(item), x, y);
    });
}