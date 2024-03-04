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
import Items from './data/Items.data';
import {GameOverState} from "./screens/game-over";
import Random from "./Random";
import random from "./Random";

declare global {
	interface Window {
		Game: {}
	}
}

const Game = {
	seed: undefined,
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
		random.setSeed(this.seed);
		this.input.mode = "TITLE";
		this.player.reset();
		Input.init(this);
		this.world.reset(this);
		this.display.showGameOverScreen(endGameStatus);
	},
	newGame: function () {
		this.player.updateFOV();
		this.display.refresh();
		this.display.textBox.setText("Find the Cheese. [WASD] to explore, [i] to open menu");
		Player.addItem(new Item(Items.POTION_OF_HEALING));
		Player.addItem(new Item(Items.POTION_OF_HEALING));
		Player.addItem(new Item(Items.POTION_OF_HEALING));
		Player.addItem(new Item(Items.HEARTY_POTION_OF_HEALING));
		this.display.activateNewGame();
	}
}

window.Game = Game;

export default Game;
