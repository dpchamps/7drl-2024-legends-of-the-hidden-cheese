import {Container, Sprite, Texture} from "pixi.js";
import PixiUtils from "../display/pixiDisplay/PixiUtils";
import {createScrollableContainer} from "./scrollable-container";

type InventoryOptions = {
    x: number,
    y: number
    width: number,
    height: number,
    backgroundTexture: Texture,
    cursorTexture: Texture,
    textFontSize: number,
}

type InstructionsOptions = {
    width: number,
    textFontSize: number,
}
const instructions = ({width, textFontSize}: InstructionsOptions) => {
    const instructions = PixiUtils.createTextBox(width / 3, 0, textFontSize, "", width*1.5 );
    instructions.text = `Instructions\nUse WASD to explore the world. You automatically pick up items you move over.\n\n'i' to open this menu. 'esc' to close it.\n\nFind the three magical cheeses. Careful, it's dangerous out there! Try finding a weapon.`;

    instructions.visible = false;

    return {
        name: 'instructions',
        container: instructions,
        render: () => {
            instructions.visible = true;
        },
        hide: () => {
            instructions.visible = false;
        }
    } as const
}

const statsMenu = ({width, textFontSize}: InstructionsOptions) => {
    const statsContainer = new Container();
    const statsText = PixiUtils.createTextBox(width / 3, 10, textFontSize, "");

    statsContainer.addChild(statsText);
    return {
        name: "stats",
        container: statsContainer,
        render: (playerStats, playerVitals) => {
            statsText.text = Object.entries(playerStats).map(([statName, statValue]) => `${statName}: ${typeof playerVitals[statName] !== 'undefined' ? `${playerVitals[statName]} / ` : ''}${statValue}`).join("\n\n")
            statsContainer.visible = true
        },
        hide: () => {
            statsContainer.visible = false
        }
    } as const
}

export const createInventoryScreen = ({x, y, height, width, backgroundTexture, cursorTexture, textFontSize}: InventoryOptions) => {
    const inventoryContainer = new Container();
    inventoryContainer.visible = false;

    inventoryContainer.position.x = x;
    inventoryContainer.position.y = y;

    const containerBackground = new Sprite(backgroundTexture);
    containerBackground.width = width;
    containerBackground.height = height;
    inventoryContainer.addChild(containerBackground);

    const cursor = new Sprite(cursorTexture);
    inventoryContainer.addChild(cursor);

    const title = PixiUtils.createTextBox(0, 0, textFontSize, "Main Menu");
    inventoryContainer.addChild(title);

    const scrollableMenu = createScrollableContainer({
        height: height,
        width: width / 2,
        x: width / 3,
        y: 0,
        backgroundTexture: backgroundTexture,
        cursorTexture: cursorTexture,
        textFontSize: textFontSize,
        containerTitle: "Inventory",
        padding: 18
    });

    inventoryContainer.addChild(scrollableMenu.container);

    const instructionsMenu = instructions({width, textFontSize});

    inventoryContainer.addChild(instructionsMenu.container);

    const statsContainer = statsMenu({width, textFontSize});
    inventoryContainer.addChild(statsContainer.container);

    const rightMenuMap = [
        scrollableMenu,
        scrollableMenu,
        statsContainer,
        instructionsMenu
    ] as const;

    let rightMenu: typeof rightMenuMap[number] = rightMenuMap[0];


    ["Inventory", "Equipment", "Stats", "Instructions"].forEach((name, i) => {
        const textBox = PixiUtils.createTextBox(20, 20+i* 20, textFontSize, name);
        inventoryContainer.addChild(textBox)
    });

    return {
        container: inventoryContainer,
        render: (game) => {
            const outerSelectionIdx = game.input.inventoryManager.outerSelectionIdx();
            const innerSelectionIdx = game.input.inventoryManager.selectionIdx();
            const items = game.input.inventoryManager.screenItems().map(({def: {name}}) => name);
            inventoryContainer.visible = true
            cursor.y = (20 * (outerSelectionIdx + 1)) - 3;
            rightMenu.hide();
            rightMenu = rightMenuMap[outerSelectionIdx];

            switch (rightMenu.name){
                case 'instructions': {
                    rightMenu.render();
                    break;
                }
                case 'stats': {
                    rightMenu.render(game.player.stats, game.player.vitals);
                    break
                }
                default : {
                    rightMenu.render(innerSelectionIdx, items, game.input.inventoryManager.selectionPane());
                }
            }



        },
        hide: () => {
            inventoryContainer.visible = false;
        }
    }
}