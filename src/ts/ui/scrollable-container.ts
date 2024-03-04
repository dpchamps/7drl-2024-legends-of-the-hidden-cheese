import {Container, Sprite, Texture} from "pixi.js";
import PixiUtils from "../display/pixiDisplay/PixiUtils";

type ScrollableContainerInput = {
    x: number,
    y: number
    width: number,
    height: number,
    backgroundTexture: Texture,
    cursorTexture: Texture,
    textFontSize: number,
    containerTitle: string,
    padding: number
}
export const createScrollableContainer = ({x, y, height, width, backgroundTexture, cursorTexture, textFontSize, containerTitle, padding}: ScrollableContainerInput) => {
    const spacing = PixiUtils.getTextScaledHeight(textFontSize);
    const maxRenderItems = Math.floor((height-(spacing*2)) / 10);
    const scrollOffset = Math.floor(maxRenderItems/2);

    const title = PixiUtils.createTextBox(0, 0, textFontSize, containerTitle);
    const topLevelContainer = new Container();
    topLevelContainer.position.x = x;
    topLevelContainer.position.y = y;

    // const containerBackground = new Sprite(backgroundTexture);
    // containerBackground.width = width;
    // containerBackground.height = height;

    // topLevelContainer.addChild(containerBackground);

    const cursor = new Sprite(cursorTexture);
    topLevelContainer.addChild(cursor);

    const scrollableContent = new Container();
    topLevelContainer.addChild(scrollableContent);
    topLevelContainer.visible = false;

    return {
        name: 'scrollableContainer',
        container: topLevelContainer,
        render: (selectedIndex: number, items: string[], isSelected: boolean) => {
            cursor.visible = isSelected;
            scrollableContent.removeChildren();
            scrollableContent.addChild(title);
            const startIndex = items.length > selectedIndex && selectedIndex > scrollOffset ? selectedIndex - scrollOffset : 0;
            const offsetItems = items.slice(startIndex);

            for(let i = 0; i < items.length; i += 1) {
                if(i > maxRenderItems) continue;
                const item = offsetItems[i];
                if(!item) continue;

                const text = PixiUtils.createTextBox(padding, spacing + i * 10, textFontSize, item);
                scrollableContent.addChild(text);
            }
            cursor.position.y = (spacing - 3) + (selectedIndex - startIndex) * 10;
            topLevelContainer.visible = true;

        },
        hide: () => {
            scrollableContent.removeChildren();
            topLevelContainer.visible = false;
        }
    } as const
}