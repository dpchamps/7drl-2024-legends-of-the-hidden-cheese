/**
 * Object representing the entirety of the world of the game.
 * Connects with LevelLoader and procedural level generators to build levels as required.
 * Contains the state of the levels generated or loaded previously.
 */

import Level from './Level.class';
import LevelGenerator from '../LevelGenerator';
import LevelLoader from '../LevelLoader';
import Random from '../Random';

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
		this.loadLevel('testLevel' + Random.n(0,1000));
	},
	loadLevel: function(levelId: string) {
		if (this.levels[levelId]){
			this.level.exitX = this.player.x;
			this.level.exitY = this.player.y;
			this.level = this.levels[levelId];
			this.player.x = this.level.exitX;
			this.player.y = this.level.exitY;
		} else {
			if (this.level) {
				this.level.exitX = this.player.x;
				this.level.exitY = this.player.y;
				var previousLevelId = this.level.id;
				this.level = new Level(this.game, levelId);
				LevelLoader.loadLevel(this.level, levelId, previousLevelId);
			} else {
				this.level = new Level(this.game, levelId);
				LevelGenerator.generateTestLevel(this.level, this.player, undefined, Random.n(0, 10000).toString(), 25, 25);
			}
			this.levels[levelId] = this.level;
		}
	}
}