/**
 * Object that loads a predesigned map into a game level.
 *  
 */

const {globalDefs, levelMaps} = require('./data/Maps.data');
var Being = require('./model/Being.class');
var Item = require('./model/Item.class');

module.exports = {
	loadLevel: function(level, mapId, fromId){
		const map = levelMaps[mapId];
		level.map = [];
		const defsMap = {};
		const defsList = globalDefs.concat(map.defs);
		for (var y = 0; y < map.map.length; y++){
			for (var x = 0; x < map.map[0].length; x++){
				if (!level.map[x]) {
					level.map[x] = [];
				}
				const mapChar = map.map[y].charAt(x);
				let def = defsMap[mapChar];
				if (!def) {
					def = defsList.find(def => def.char == mapChar);
					defsMap[mapChar] = def;
				}
				level.map[x][y] = def.tile;
				if (def.item) {
					level.addItem(new Item(def.item), x, y);
				}
				if (def.being) {
					var being = new Being(level.game, level, def.being);
					level.addBeing(being, x, y);
					being.intent = 'RANDOM';
				}
				if (def.exitTo) {
					level.addExit(x, y, def.exitTo, def.tile);
				}
				if (def.start) {
					level.addExit(x, y, fromId, def.tile);
					level.player.x = x;
					level.player.y = y;
				}
			}
		}
	}
}