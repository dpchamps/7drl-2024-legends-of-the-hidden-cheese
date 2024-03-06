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
	private lastMessages: string[]

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
	addText (str: string) {
		this.lastMessages.push(str);
		var currentTime = new Date().getTime();
		if (currentTime - this.lastUpdateMillis > 200){
			this.PIXIText.text = '';
		}
		this.lastUpdateMillis = currentTime; 
		this.PIXIText.text += str;
	}

	getLog(){
		return this.lastMessages.slice(Math.max(0, this.lastMessages.length - 20)).join("\n");
	}
}