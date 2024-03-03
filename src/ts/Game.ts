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

declare global {
	interface Window {
		Game: {}
	}
}

const Game = {
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
		this.player.reset();
		this.display.showGameOverScreen(endGameStatus);
	},
	newGame: function () {
		this.player.updateFOV();
		this.display.refresh();
		this.display.textBox.setText("Find the Cheese. [WASD] to explore, [i] to open menu");
		Player.addItem(new Item(Items.BOOK_OF_MIRDAS));
		Player.addItem(new Item(Items.IRON_SWORD));
		Player.addItem(new Item(Items.BOOK_OF_MIRDAS));
		Player.addItem(new Item(Items.IRON_SWORD));
		Player.addItem(new Item(Items.SPELL_OF_LOLZORS));
		Player.addItem(new Item(Items.SPELL_OF_LOLZORS));
		Player.addItem(new Item(Items.SPELL_OF_LOLZORS));
		Player.addItem(new Item(Items.SPELL_OF_LOLZORS));
		Player.addItem(new Item(Items.SPELL_OF_LOLZORS));
		Player.addItem(new Item(Items.SPELL_OF_LOLZORS));

		Player.addItem(new Item(Items.BOOK_OF_AURORA));
		Player.addItem(new Item(Items.IRON_SWORD));
		Player.addItem(new Item(Items.GOLDEN_SWORD));
		Player.addItem(new Item(Items.GOLDEN_SWORD));
		Player.addItem(new Item(Items.GOLDEN_SWORD));
		Player.addItem(new Item(Items.GOLDEN_SWORD));
		Player.addItem(new Item(Items.GOLDEN_SWORD));
		Player.addItem(new Item(Items.GOLDEN_SWORD));
		Player.addItem(new Item(Items.GOLDEN_SWORD));
		Player.addItem(new Item(Items.GOLDEN_SWORD));
		Player.addItem(new Item(Items.GOLDEN_SWORD));
		Player.addItem(new Item(Items.GOLDEN_SWORD));
		Player.addItem(new Item(Items.GOLDEN_SWORD));
		Player.addItem(new Item(Items.GOLDEN_SWORD));
		Player.addItem(new Item(Items.GOLDEN_SWORD));
		Player.addItem(new Item(Items.GOLDEN_SWORD));

		Player.addItem(new Item(Items.BOOK_OF_AURORA));
		Player.addItem(new Item(Items.IRON_SWORD));
		Player.addItem(new Item(Items.BOOK_OF_AURORA));
		Player.addItem(new Item(Items.IRON_SWORD));
		Player.addItem(new Item(Items.BOOK_OF_AURORA));
		Player.addItem(new Item(Items.IRON_SWORD));
		Player.addItem(new Item(Items.BOOK_OF_AURORA));
		Player.addItem(new Item(Items.IRON_SWORD));
		Player.addItem(new Item(Items.BOOK_OF_AURORA));
		Player.addItem(new Item(Items.IRON_SWORD));
		Player.addItem(new Item(Items.BOOK_OF_AURORA));
		Player.addItem(new Item(Items.IRON_SWORD));
		Player.addItem(new Item(Items.BOOK_OF_AURORA));
		this.display.activateNewGame();
	}
}

window.Game = Game;

export default Game;
