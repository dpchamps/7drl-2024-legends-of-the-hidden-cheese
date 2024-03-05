/**
 * Object representing the entirety of the world of the game.
 * Connects with LevelLoader and procedural level generators to build levels as required.
 * Contains the state of the levels generated or loaded previously.
 */

import Level from './Level.class';
import LevelGenerator from '../LevelGenerator';
import LevelLoader from '../LevelLoader';
import Random from '../Random';
import {generateOverWorld} from "../proc-gen/generate-overworld";
import {generateLevelsFromOverworld} from "../proc-gen/generate-levels-from-overworld";
import {spawnWanderingMonsters} from "../proc-gen/wandering-monsters";
import {generateGameWinningItems} from "../proc-gen/generate-game-winning-items";

export default {
	levels: {},
	reset(game){
		this.levels = {};
		this.level = null;
		this.init(game);
	},
	init: function(game) {
		this.game = game;
		this.player = game.player;
		this.overworldMap =  generateOverWorld(8);
		const levels = generateLevelsFromOverworld(game, this.overworldMap, "world", {x: 25, y: 25});
		levels.forEach((level) => {
			this.levels[level.id] = level
		})
		generateGameWinningItems(this.levels);
		console.log(this.overworldMap);
		this.level = this.levels['world-0-0'];
		this.loadLevel(`world-0-0`);
	},
	loadLevel: function(levelId: string) {
		if (this.levels[levelId]){
			this.level = this.levels[levelId];
			spawnWanderingMonsters(this.level);
			const mappedPosition = this.level.exitMap[`${this.player.x}-${this.player.y}`];
			if(mappedPosition){
				this.player.x = mappedPosition.x;
				this.player.y = mappedPosition.y;
			}
		} else {
			if (this.level) {
				this.level.exitX = this.player.x;
				this.level.exitY = this.player.y;
				var previousLevelId = this.level.id;
				this.level = new Level(this.game, levelId);
				LevelLoader.loadLevel(this.level, levelId, previousLevelId, "world", this.overworldMap);
			} else {
				this.level = new Level(this.game, levelId);
				LevelGenerator.generateTestLevel(this.level, this.player, undefined, levelId, 25, 25, "world", this.overworldMap);
			}
			this.levels[levelId] = this.level;
		}
	}
}