/**
 * Represents an inanimate object that can be picked up by
 * the player and droped into the level.
 * 
 * @param {*} def ItemDefinition describing the attributes of a particular type of item.
 */

export default class Item {
	def: any;
	constructor (def: any) {
		this.def = def;
	}

}