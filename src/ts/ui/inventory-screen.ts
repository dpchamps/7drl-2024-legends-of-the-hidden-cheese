import {Container, Graphics, Sprite, Texture} from "pixi.js";
import PixiUtils from "../display/pixiDisplay/PixiUtils";
import {createScrollableContainer} from "./scrollable-container";
import {getItemInventoryDescription} from "./item-description";
import PIXITextBox from "../display/pixiDisplay/PIXITextBox.class";

const INVENTORY_COLOR = 0x343434;
const INVENTORY_COLOR_INNER = 0x4F4E4E;
const INVENTORY_PADDING = 5;
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
    const instructions = PixiUtils.createTextBox(width / 2, INVENTORY_PADDING/2, textFontSize, "", width*1.5 );
    instructions.text = `Instructions\n\nUse WASD to explore the world. You automatically pick up items you move over.\n\n'i' to open this menu. 'esc' to close it.\n\nFind the three magical cheeses. Careful, it's dangerous out there! Try finding a weapon.`;

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
    const statsText = PixiUtils.createTextBox(width / 2, INVENTORY_PADDING/2, textFontSize, "");

    statsContainer.addChild(statsText);
    return {
        name: "stats",
        container: statsContainer,
        render: (playerStats, playerVitals) => {
            statsText.text = "Stats\n\n";
            statsText.text += Object.entries(playerStats).map(([statName, statValue]) => `${statName}: ${typeof playerVitals[statName] !== 'undefined' ? `${playerVitals[statName]} / ` : ''}${statValue}`).join("\n\n")
            statsContainer.visible = true
        },
        hide: () => {
            statsContainer.visible = false
        }
    } as const
}

export const createEventLog = ({width, textFontSize}: InstructionsOptions) => {
    const eventLogContainer = new Container();
    const eventLog = PixiUtils.createTextBox(width / 2, INVENTORY_PADDING/2, textFontSize, "", 600);
    eventLogContainer.addChild(eventLog);
    return {
        name: "event log",
        container: eventLogContainer,
        render(messageLog: PIXITextBox){
            eventLog.text = messageLog.getLog();
            eventLogContainer.visible = true;
        },
        hide(){
            eventLogContainer.visible = false;
        }
    } as const
}

export const createInventoryScreen = ({x, y, height, width, backgroundTexture, cursorTexture, textFontSize}: InventoryOptions) => {
    const inventoryContainer = new Container();
    inventoryContainer.visible = false;

    inventoryContainer.position.x = x;
    inventoryContainer.position.y = y;

    inventoryContainer.addChild(
        new Graphics().beginFill(INVENTORY_COLOR).drawRoundedRect(0, 0, width, height, 5),
        new Graphics().beginFill(INVENTORY_COLOR_INNER).drawRoundedRect(INVENTORY_PADDING, INVENTORY_PADDING*3, width-INVENTORY_PADDING*2, height-INVENTORY_PADDING*4, INVENTORY_PADDING),
    );


    const cursor = new Sprite(cursorTexture);
    inventoryContainer.addChild(cursor);

    const title = PixiUtils.createTextBox(INVENTORY_PADDING*2, INVENTORY_PADDING/2, textFontSize, "Main Menu");
    inventoryContainer.addChild(title);

    const scrollableMenu = createScrollableContainer({
        height: height,
        width: width / 2,
        x: width / 2,
        y: INVENTORY_PADDING/2,
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

    const descriptionContainer = PixiUtils.createTextBox(INVENTORY_PADDING*2, 130, textFontSize, "", width*2);
    inventoryContainer.addChild(descriptionContainer);

    // const eventLogContainer = createEventLog({width, textFontSize});
    // inventoryContainer.addChild(eventLogContainer.container);
    //
    const eventLogContainer = createScrollableContainer({
        height: height,
        width: width / 2,
        x: width / 3,
        y: INVENTORY_PADDING/2,
        backgroundTexture: backgroundTexture,
        cursorTexture: cursorTexture,
        textFontSize: textFontSize,
        containerTitle: "Event Log (descending)",
        containerName: "event-log",
        padding: 18,
        lineHeight: 2.5
    })
    inventoryContainer.addChild(eventLogContainer.container);

    const rightMenuMap = [
        scrollableMenu,
        scrollableMenu,
        statsContainer,
        instructionsMenu,
        eventLogContainer
    ] as const;

    let rightMenu: typeof rightMenuMap[number] = rightMenuMap[0];


    ["Inventory", "Equipment", "Stats", "Instructions", "Event Log"].forEach((name, i) => {
        const textBox = PixiUtils.createTextBox(20, 20+i* 20, textFontSize, name);
        inventoryContainer.addChild(textBox)
    });

    return {
        container: inventoryContainer,
        render: (game) => {
            const outerSelectionIdx = game.input.inventoryManager.outerSelectionIdx();
            const innerSelectionIdx = game.input.inventoryManager.selectionIdx();
            const textBox = game.display.textBox;
            const items = game.input.inventoryManager.screenItems();
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
                    rightMenu.render(game.player.combatState.getStatsWithBuffs(), game.player.combatState.vitals);
                    break
                }
                case 'event-log':{
                    const items = textBox.getLastMessages(20).map((x, i) => `${i+1}. ${x}`).reverse();
                    rightMenu.render(innerSelectionIdx, items, game.input.inventoryManager.selectionPane())
                    // rightMenu.render(textBox);
                    break
                }
                default : {
                    const screenItems = items.map(item => {
                        return `${game.input.inventoryManager.isEquipped(item) ? "*" : ""}${item.def.name}`
                    });
                    const selectedItem = game.input.inventoryManager.selectedItem();
                    if(selectedItem && game.input.inventoryManager.selectionPane()){
                        descriptionContainer.text = getItemInventoryDescription(selectedItem);
                    } else {
                        descriptionContainer.text = "";
                    }
                    rightMenu.render(innerSelectionIdx, screenItems, game.input.inventoryManager.selectionPane());
                }
            }



        },
        hide: () => {
            inventoryContainer.visible = false;
        }
    }
}