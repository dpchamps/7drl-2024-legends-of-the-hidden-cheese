/**
 * Sample object for "procedural generation".
 * 
 * Used by the World object whenever a level needs to be generated.
 */

import Tiles from './data/Tiles.data';
import Races from './data/Races.data';
import Items from './data/Items.data';
import Being from './model/Being.class';
import Item from './model/Item.class';
import Random from './Random';

export default {
	generateTestLevel: function(level, player, fromId, nextLevelId, height, width, knownExit?: {x: number, y: number}){
		for (var x = 0; x < width; x++){
			level.map[x] = [];
			level.mapFeatures[x] = [];
			for (var y = 0; y < height; y++){
				level.map[x][y] = Tiles.GRASS;
				if((x === 0 || x === width-1) || (y === 0 || y === height-1)){
					level.mapFeatures[x][y] = Tiles.BUSH;
				} else {
					level.mapFeatures[x][y] = null;
				}

			}
		}

		for (let i = 0; i < 40; i++){
			level.mapFeatures[Random.n(0,width-2)][Random.n(1,height-2)] = Tiles.BUSH;
			level.mapFeatures[Random.n(0,width-2)][Random.n(1,height-2)] = Tiles.ROCKS;
			level.mapFeatures[Random.n(0,width-2)][Random.n(1,height-2)] = Tiles.FLOWERS;
			level.mapFeatures[Random.n(0,width-2)][Random.n(1,height-2)] = Tiles.GRASS_FEATURE_ONE;
		}

		for (let i = 0; i < 4; i += 1){
			const xRand = Random.n(1, width-2);
			const yRand =  Random.n(1, height-2);
			let x = 0;
			let y = 0;
			switch(i) {
				case 0: {
					debugger
					y = 0
					x = knownExit?.y === y ? knownExit?.x : xRand;
					break;
				}
				case 1: {
					x = width-1
					y = knownExit?.x === x ? knownExit?.y : yRand;
					break;
				}
				case 2: {
					y = height - 1;
					x = knownExit?.y === y ? knownExit?.x : xRand;
					break;
				}
				case 3: {
					x = 0;
					y = knownExit?.x === x ? knownExit?.y : yRand;
					break;
				}
			}
			const id = knownExit?.x === x && knownExit?.y === y ? fromId : Random.n(0, 10000).toString();
			for(let xi = x-1; xi <= x+1; xi += 1){
				for(let yi = y-1; yi <= y+1; yi += 1){
					if(xi < 0 || xi > width-1 || yi < 0 || yi > height-1) continue;
					level.mapFeatures[xi][yi] = null;
					if(x === 0 && xi === 0 || x === width-1 && xi === width-1 || y === 0 && yi === 0 || y === height-1 && yi === height-1){
						level.addExit(xi, yi, id, Tiles.GRASS)
					}
				}
			}
		}


		// for (var i = 0; i < 5; i++){
		// 	let being = new Being(level.game, level, Races.RAT);
		// 	level.addBeing(being, Random.n(0,width-1), Random.n(0,height-1));
		// 	being.setIntent('CHASE');
		// }

		level.addItem(new Item(Items.IRON_SWORD), Random.n(1,width-2), Random.n(1,height-2));

		level.addItem(new Item(Items.MAGIC_CHEESE_OF_NEYPH), Random.n(1, width-2), Random.n(1, height-2));
		level.addItem(new Item(Items.MAGIC_CHEESE_OF_CINDARIUM), Random.n(1, width-2), Random.n(1, height-2));
		level.addItem(new Item(Items.MAGIC_CHEESE_OF_ROE), Random.n(1, width-2), Random.n(1, height-2));
	}
}