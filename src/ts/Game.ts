/**
 * Single object that controls the initialization of the 
 * game and serves as a container for its main subsystems (Display, World, Player and Input)
 * 
 */

import UnicodeTilesDisplay from './display/unicodeTilesDisplay/UnicodeTilesDisplay';
import PIXIDisplay from'./display/pixiDisplay/PixiDisplay';
import TestDisplay from './display/TestDisplay';

import World from './model/World';
import Player from './model/Player';
import Input from './Input';

import Item from './model/Item.class';
import Items, {ConsumableCategories} from './data/Items.data';
import {GameOverState} from "./screens/game-over";
import random from "./Random";
import player from "./model/Player";

declare global {
	interface Window {
		Game: {}
	}
}

const Game = {
	seed: undefined,
	deathCount: 0,
	start: async function(config) {

		let selectedDisplay;
		switch (config.display) {
			case 'pixi':
				selectedDisplay = PIXIDisplay;
				break;
			case 'test':
				selectedDisplay = TestDisplay;
				break;
			case 'unicodeTiles':
			default:
				selectedDisplay = UnicodeTilesDisplay;
				break;
		}
		// this.seed = config.seed;
		random.setSeed(this.seed);
		this.display = selectedDisplay;
		this.world = World;
		this.player = Player;
		this.input = Input;
		await this.display.init(this, config.displayConfig);
		Player.init(this);
		World.init(this);
		Input.init(this);
		this.display.titleScreen();
	},
	endGame(endGameStatus: GameOverState) {
		if(endGameStatus === "LOSE"){
			this.deathCount += 1;
		}
		random.setSeed(this.seed);
		this.input.mode = "TITLE";

		this.player.reset();
		Input.init(this);
		this.world.reset(this);
		this.display.showGameOverScreen(endGameStatus);
	},
	newGame: function () {
		this.player.x = Math.floor(this.world.level.dimensions.x / 2);
		this.player.y = Math.floor(this.world.level.dimensions.y / 2);
		this.player.updateFOV();

		this.display.refresh();
		this.display.textBox.setText("Find the Cheese. [WASD] to explore, [i] to open menu");

		const starterItems = this.world.lootTable.getItemsByTypeByRarity("consumables", "Common");

		starterItems.filter((item) => item?.consumableData.category === ConsumableCategories.Healing).slice(0, 3).forEach(item => {
			Player.addItem(new Item(item));
		});

		starterItems.filter((item) => item?.consumableData.category === ConsumableCategories.Buff).slice(0, 1).forEach((item) => {
			Player.addItem(new Item(item))
		});

		this.display.activateNewGame();
	}
}

window.Game = Game;

export default Game;
