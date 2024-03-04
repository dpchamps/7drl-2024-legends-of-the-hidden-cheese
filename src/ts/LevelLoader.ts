/**
 * Object that loads a predesigned map into a game level.
 *  
 */

import {globalDefs, levelMaps} from './data/Maps.data';
import Being from './model/Being.class';
import Item from './model/Item.class';
import LevelGenerator from "./LevelGenerator";
import Random from "./Random";

const mirrorExit = (playerX: number, playerY: number) => {
	const x = playerX === 0 ? 24 : playerX === 24 ? 0 : playerX;
	const y = playerY === 0 ? 24 : playerY === 24 ? 0 : playerY;
	return {
		x,
		y
	}
}
export default {
	loadLevel: function(level, mapId, fromId){
		const map = levelMaps[mapId];
		level.map = [];
		if(!map) {
			const knownExit = mirrorExit(level.player.x, level.player.y);

			LevelGenerator.generateTestLevel(level, level.player, fromId, mapId, 25, 25, knownExit);
			level.player.x = knownExit.x;
			level.player.y = knownExit.y;
			return
		}
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
					being.setIntent('CHASE');
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