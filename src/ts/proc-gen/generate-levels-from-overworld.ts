import {Exit, OverworldMapTile} from "./generate-overworld";
import LevelGenerator from "../LevelGenerator";
import Level from "../model/Level.class";
import Game from "../Game";
import Random from "../Random";
import Tiles from "../data/Tiles.data";
import {Biomes, BiomeTypes} from "./biomes";

const mirror = (x: number, y: number, width: number, height: number) => {
    const xMirror = x === 0 ? width-1 : x === width-1? 0 : x;
    const yMirror = y === 0 ? height-1 : y === height-1 ? 0 : y;
    return {
        x: xMirror,
        y: yMirror
    }
}

const generateExitOnEdge = (direction: Exit, width: number, height: number) => {
    	const xRand = Random.n(1, width-2);
    	const yRand =  Random.n(1, height-2);
    	let x = 0;
    	let y = 0;
    	switch (direction) {
    		case "North": {
    			y = 0
    			x = xRand;
    			break;
    		}
    		case "East": {
    			x = width-1
    			y = yRand;
    			break;
    		}
    		case "South": {
    			y = height - 1;
    			x = xRand;
    			break;
    		}
    		case "West": {
    			x = 0;
    			y = yRand;
    			break;
    		}
    	}

        return {x, y}
}

const isIntroTile = (tile: OverworldMapTile) => {
	return tile.mapId === `0-0` || tile.exits.some((exit) => exit.toMapId === "0-0")
}

export const generateLevelsFromOverworld = (game: typeof Game, overworld: Record<string, OverworldMapTile>, idPrefix: string, levelDimensions: {x: number, y: number}) => {
    const knownExits: Record<string, {x: number, y: number}> = {};
	const biomeTypes = Object.keys(Biomes);
	const levels: Level[] = [];

    for(const tile of Object.values(overworld)) {
        const worldId = `${idPrefix}-${tile.mapId}`;
		// todo: how to choose biome
		const randomBiome = biomeTypes[Random.n(0, biomeTypes.length-1)];
		const biome = isIntroTile(tile) ? Biomes.Forest : Biomes[randomBiome];
        const level = new Level(game, worldId, biome);
		const width = levelDimensions.x;
		const height = levelDimensions.y;
        LevelGenerator.generateTestLevel(level, (game as any).player, "", "", levelDimensions.y, levelDimensions.x, "", overworld);

		level.dimensions = levelDimensions;

        for(const exit of tile.exits) {
            let exitCoord;
            if(knownExits[`${tile.mapId}-${exit.direction}`]) {
                exitCoord = knownExits[`${tile.mapId}-${exit.direction}`];
            }else {
                const exitCenter = generateExitOnEdge(exit.direction, levelDimensions.x, levelDimensions.y);
                const mirroredExit = mirror(exitCenter.x, exitCenter.y, levelDimensions.x, levelDimensions.y);
                knownExits[`${tile.mapId}-${exit.direction}`] = exitCenter;
                knownExits[`${exit.toMapId}-${exit.oppositeExit}`] = mirroredExit;
                exitCoord = exitCenter;
            }

			const {x, y} = exitCoord;

			for(let xi = x-1; xi <= x+1; xi += 1){
				for(let yi = y-1; yi <= y+1; yi += 1){
					if(xi < 0 || xi > width-1 || yi < 0 || yi > height-1 || xi === width-1 && yi === width-1 || xi === 0 && yi === 0) continue;
					level.mapFeatures[xi][yi] = null;
					if(x === 0 && xi === 0 || x === width-1 && xi === width-1 || y === 0 && yi === 0 || y === height-1 && yi === height-1){
						level.addExit(xi, yi, `${idPrefix}-${exit.toMapId}`, level.biome.groundTile, mirror(xi, yi, width, height));
					}
				}
			}
        }

		levels.push(level)
    }

	return levels;
}