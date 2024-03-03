import {Container, DisplayObject} from "pixi.js";
import PixiUtils from '../display/pixiDisplay/PixiUtils';



export const createGameOverScreen = (config) => {
    const gameoverContainer = new Container();
    gameoverContainer.addChild(
        PixiUtils.createTextBox(20, 20, config.textboxFontSize, "You Died.")
    );
    gameoverContainer.addChild(
        PixiUtils.createTextBox(20, 20, config.textboxFontSize, "Congrats, you found all the cheese!")
    );
    gameoverContainer.addChild(
        PixiUtils.createTextBox(20, 40, config.textboxFontSize, "Press space to start again.")
    )
    gameoverContainer.visible = false;

    return gameoverContainer
}

export type GameOverState = "WIN" | "LOSE";
export const showGameOverScreen = (gameOverState: GameOverState, container: Container<DisplayObject>) => {
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