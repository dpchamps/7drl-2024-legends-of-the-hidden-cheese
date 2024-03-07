import {Exit, exitToCoord, getRelativeCoordinate, OverworldMapTile} from "./generate-overworld";
import LevelGenerator from "../LevelGenerator";
import Level from "../model/Level.class";
import Game from "../Game";
import Random from "../Random";
import Tiles from "../data/Tiles.data";
import {Biome, Biomes, BiomeTypes} from "./biomes";
import {restartTries} from "concurrently/dist/src/defaults";

const mirror = (x: number, y: number, width: number, height: number) => {
    const xMirror = x === 0 ? width-1 : x === width-1? 0 : x;
    const yMirror = y === 0 ? height-1 : y === height-1 ? 0 : y;

	if(typeof xMirror=== "undefined" || typeof  yMirror === "undefined"){
		debugger
		throw new Error("uh oh spaghettio");
	}
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

const visitOverworld = (overworld: Record<string, OverworldMapTile>, visitTile: (tile: OverworldMapTile) => void) => {
	const visited = new Set();
	const queue = [overworld[`0-0`]];

	while(queue.length){
		const tile = queue.shift();
		const id =`${tile.worldMapCoord.x}-${tile.worldMapCoord.y}`;
		if(visited.has(id)) continue;
		visited.add(id);

		visitTile(tile);

		["North", "South", "East", "West"].map(exitToCoord).forEach((coord) => {
			const nextCoord = getRelativeCoordinate(tile.worldMapCoord, coord);
			const id = `${nextCoord.x}-${nextCoord.y}`;
			const neighborTile = overworld[id];
			if(typeof neighborTile !== "undefined"){
				queue.push(neighborTile)
			}
		})
	}
}

type VisitorState = {
	tileCount: number,
	tilesVisited: number,
	forestsToPlace: number,
	swampsToPlace: number,
	desertsToPlace: number,
	levels: Level[],
	idPrefix: string,
	levelDimensions: {x: number, y: number},
	createLevel: (id: string, biome: Biome) => Level,
	knownExits: Record<string, {x: number, y: number}>
};

const getNextBiomeToPlace = (visitorState: VisitorState) => {
	if(visitorState.forestsToPlace > 0){
		visitorState.forestsToPlace -= 1;
		return Biomes.Forest
	} else if (visitorState.swampsToPlace > 0){
		visitorState.swampsToPlace -= 1;
		return  Biomes.Swamp
	} else {
		visitorState.desertsToPlace -= 1;
		return Biomes.Desert
	}
}

const createVisitor = (visitorState: VisitorState) => (tile: OverworldMapTile) => {
	const {idPrefix, levelDimensions} = visitorState;
	const worldId = `${idPrefix}-${tile.mapId}`;

	const biome = getNextBiomeToPlace(visitorState);
	const level = visitorState.createLevel(worldId, biome);
	const width = levelDimensions.x;
	const height = levelDimensions.y;
	LevelGenerator.generateTestLevel(level, "", "", levelDimensions.y, levelDimensions.x);

	level.dimensions = levelDimensions;

	for(const exit of tile.exits) {
		let exitCoord;
		if(visitorState.knownExits[`${tile.mapId}-${exit.direction}`]) {
			exitCoord = visitorState.knownExits[`${tile.mapId}-${exit.direction}`];
		}else {
			const exitCenter = generateExitOnEdge(exit.direction, levelDimensions.x, levelDimensions.y);
			const mirroredExit = mirror(exitCenter.x, exitCenter.y, levelDimensions.x, levelDimensions.y);
			visitorState.knownExits[`${tile.mapId}-${exit.direction}`] = exitCenter;
			visitorState.knownExits[`${exit.toMapId}-${exit.oppositeExit}`] = mirroredExit;
			exitCoord = exitCenter;
		}

		const {x, y} = exitCoord;

		for(let xi = x-1; xi <= x+1; xi += 1){
			for(let yi = y-1; yi <= y+1; yi += 1){
				if(
					xi < 0
					|| xi > width-1
					|| yi < 0
					|| yi > height-1
					|| xi === width-1 && yi === width-1
					|| xi === 0 && yi === 0
				) continue;
				level.mapFeatures[xi][yi] = null;

				if(
					x === 0 && xi === 0
					|| x === width-1 && xi === width-1
					|| y === 0 && yi === 0
					|| y === height-1 && yi === height-1
				){
					level.addExit(xi, yi, `${idPrefix}-${exit.toMapId}`, level.biome.groundTile, mirror(xi, yi, width, height));
				}
			}
		}
	}

	visitorState.levels.push(level)
	visitorState.tilesVisited += 1;
}

export const generateLevelsFromOverworld = (game: typeof Game, overworld: Record<string, OverworldMapTile>, idPrefix: string, levelDimensions: {x: number, y: number}) => {
	const tileCount = Object.keys(overworld).length;
	const visitorState = {
		tileCount,
		tilesVisited: 0,
		forestsToPlace: Math.floor(tileCount / 3),
		swampsToPlace: Math.floor(tileCount / 3),
		desertsToPlace: Math.floor(tileCount/3),
		levels: [],
		levelDimensions,
		idPrefix,
		createLevel: (id: string, biome: Biome) => new Level(game, id, biome),
		knownExits: {}
	};
	const visitor = createVisitor(visitorState);
	visitOverworld(overworld, visitor);

	return visitorState.levels;
}