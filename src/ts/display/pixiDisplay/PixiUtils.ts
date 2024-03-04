import { Text } from 'pixi.js';

const textScale = 0.25;
export default {
	getTextScaledHeight: (fontSize: number) => fontSize*textScale,
	createTextBox(x, y, fontSize, initialText, wordWrapWidth?, fill?) {
		const textBox = new Text(initialText, {
			fontFamily: 'Kenney Pixel',
			fontSize: fontSize,
			fill: typeof fill === 'undefined' ? 0xdddddd : fill,
			align: 'left',
			wordWrap: !!wordWrapWidth,
			wordWrapWidth: wordWrapWidth
		});
		textBox.scale.x = textScale;
		textBox.scale.y = textScale;
		textBox.position.x = x;
		textBox.position.y = y;
		textBox.text = initialText;
		return textBox;
	}
}