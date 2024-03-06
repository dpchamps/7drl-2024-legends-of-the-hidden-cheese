import {Container, DisplayObject} from "pixi.js";
import PixiUtils from '../display/pixiDisplay/PixiUtils';
import TextBox from "../display/unicodeTilesDisplay/TextBox.class";
import PIXITextBox from "../display/pixiDisplay/PIXITextBox.class";



export const createGameOverScreen = (config) => {
    const gameoverContainer = new Container();
    const gameOverLog = PixiUtils.createTextBox(20, 60, config.textboxFontSize, "Event Log");
    gameoverContainer.addChild(
        PixiUtils.createTextBox(20, 20, config.textboxFontSize, "You Died.")
    );
    gameoverContainer.addChild(
        PixiUtils.createTextBox(20, 20, config.textboxFontSize, "Congrats, you found all the cheese!")
    );
    gameoverContainer.addChild(
        PixiUtils.createTextBox(20, 40, config.textboxFontSize, "Press space to start again.")
    )
    gameoverContainer.addChild(gameOverLog)
    gameoverContainer.visible = false;

    return gameoverContainer
}

export type GameOverState = "WIN" | "LOSE";
export const showGameOverScreen = (gameOverState: GameOverState, container: Container<DisplayObject>, messageLog: PIXITextBox) => {
    (container.getChildAt(3) as any).text = `Event Log:\n${messageLog.getLog()}`
    switch(gameOverState) {
        case "WIN": {
            container.getChildAt(0).visible = false;
            container.getChildAt(1).visible = true;
            break;
        }
        case "LOSE": {
            container.getChildAt(0).visible = true;
            container.getChildAt(1).visible = false;
            break;
        }
        default: throw new Error("Reached an unexpected state.")
    }
    container.visible = true;
}