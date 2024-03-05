import Random from './Random';
import {OverworldMapTile} from "./proc-gen/generate-overworld";
import {spawnItemLootDrops} from "./proc-gen/level-loot-drops";

export default {
	generateTestLevel: function(level, player, fromId, nextLevelId, height, width, idPrefix: string, overworld: Record<string, OverworldMapTile>, knownExit?: {x: number, y: number}){
		for (var x = 0; x < width; x++){
			level.map[x] = [];
			level.mapFeatures[x] = [];
			for (var y = 0; y < height; y++){
				level.map[x][y] = level.biome.groundTile;
				if((x === 0 || x === width-1) || (y === 0 || y === height-1)){
					level.mapFeatures[x][y] = level.biome.edgeTile;
				} else {
					level.mapFeatures[x][y] = null;
				}

			}
		}


		for(let x = 1; x <= width-2; x += 1){
			for (let y = 1; y <= height-2; y += 1){
				const noise = Random.noise2D(x, y);
				if(noise >= 0.49){
					const decorationTile = level.biome.decorations[Random.n(0, level.biome.decorations.length-1)];
					level.mapFeatures[x][y] = decorationTile
				}
			}
		}

		spawnItemLootDrops(level);
	}
}