/**
 * Wraps a text component with a function that adds texts smartly so that it can serve as a
 * rolling message log.
 *  
 * @param {PIXI.Text} PIXIText A Pixi.js Text game object
 */

import { Text } from "@pixi/text";

export default class PIXITextBox {
	PIXIText: Text;
	private lastUpdateMillis: number;
	private lastMessages: string[];
	timeoutClear: NodeJS.Timeout | undefined = undefined;

	constructor (PIXIText: Text) {
		this.PIXIText = PIXIText;
		this.lastMessages = [];
		this.lastUpdateMillis = 0;
	}

	reset(){
		this.lastMessages = [];
	}

	setText (str: string) {
		this.PIXIText.text = str;
	};

	getLastMessages(n: number){
		return this.lastMessages.slice(Math.max(0, this.lastMessages.length - n))
	}

	addText (str: string) {
		this.lastMessages.push(str);
		const nextText = this.getLastMessages(2);
		var currentTime = new Date().getTime();
		clearTimeout(this.timeoutClear);
		this.timeoutClear = setTimeout(() => {
			this.PIXIText.text = this.lastMessages[this.lastMessages.length-1];
		}, 1200);

		this.lastUpdateMillis = currentTime;
		this.PIXIText.text = nextText.join(" ");
	}

	getLog(){
		return this.getLastMessages(20).join("\n");
	}
}