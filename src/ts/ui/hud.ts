import {Container, Sprite, Texture, Graphics, RenderTexture} from "pixi.js";
import PixiUtils from "../display/pixiDisplay/PixiUtils";
import {createScrollableContainer} from "./scrollable-container";
import {CombatState} from "../combat/combat-state";
import PIXITextBox from "../display/pixiDisplay/PIXITextBox.class";

const HEART_DIVIDER = 20;
const HUD_PADDING = 5;
const HUD_COLOR = 0x343434;
const HUD_COLOR_INNER = 0x9A8F87;
const HUD_HEIGHT = 43;
const HUD_WIDTH = 180
type HudInput = {
    heartFilledTexture: Texture,
    heartEmptyTexture: Texture,
    messageLog: PIXITextBox
}
export const createHUD = ({heartFilledTexture, heartEmptyTexture, messageLog}: HudInput) => {
    const hudContainer = new Container();
    const updatable = new Container();
    hudContainer.addChild(
        new Graphics().beginFill(HUD_COLOR).drawRoundedRect(0, 0, HUD_WIDTH, HUD_HEIGHT, HUD_PADDING),
        new Graphics().beginFill(HUD_COLOR_INNER).drawRoundedRect(HUD_PADDING/2, HUD_PADDING/2, HUD_WIDTH-HUD_PADDING, HUD_HEIGHT-HUD_PADDING, HUD_PADDING),
        new Graphics().beginFill(HUD_COLOR).drawRoundedRect(HUD_WIDTH+2, 0, (27*16)-HUD_WIDTH-2, HUD_HEIGHT, HUD_PADDING),
        new Graphics().beginFill(HUD_COLOR_INNER).drawRoundedRect(2+HUD_WIDTH+HUD_PADDING/2, HUD_PADDING/2, (27*16) - (HUD_WIDTH)-HUD_PADDING-2, HUD_HEIGHT-HUD_PADDING, HUD_PADDING),
    );
    hudContainer.addChild(updatable)
    messageLog.PIXIText.position.x = HUD_WIDTH+HUD_PADDING+2;
    messageLog.PIXIText.style = {...messageLog.PIXIText.style, wordWrapWidth: 900}

    hudContainer.addChild(messageLog.PIXIText);


    return {
        container: hudContainer,
        render: (playerCombatState: CombatState, equippedItems: Texture[], currentMapId: string) => {
            updatable.removeChildren();

            const playerLevel = PixiUtils.createTextBox(HUD_PADDING, HUD_PADDING, 70, `Level: ${playerCombatState.stats.level}`, undefined, 0x0);
            const playerMapPosition = PixiUtils.createTextBox(HUD_PADDING+50, HUD_PADDING, 70, currentMapId, undefined, 0x0);
            updatable.addChild(playerLevel, playerMapPosition);
            const numberHearts = Math.floor(playerCombatState.stats.health / HEART_DIVIDER);
            Array(numberHearts).fill(0).forEach((_, i) => {
                const texture = playerCombatState.vitals.health >= i * HEART_DIVIDER ? heartFilledTexture : heartEmptyTexture;
                const sprite = new Sprite(texture);
                sprite.position.x = HUD_PADDING+ i * 16;
                sprite.position.y = HUD_PADDING + PixiUtils.getTextScaledHeight(70);
                updatable.addChild(sprite)
            });
            equippedItems.forEach((texture, i) => {
                const sprite = new Sprite(texture);
                sprite.tint = 0x0;
                sprite.position.x =(HUD_WIDTH - HUD_PADDING) - ((i+1) * 16);
                sprite.position.y = HUD_PADDING;
                updatable.addChild(sprite);
            })
            hudContainer.visible = true;

        },
        hide: () => {
            hudContainer.visible = false;
        }
    }
}