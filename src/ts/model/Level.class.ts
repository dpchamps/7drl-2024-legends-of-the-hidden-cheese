/**
 * Represent an area of the World, connected to others via stairs
 * 
 * Contains Beings, Items and exits.
 * Controls the order of interaction of all beings and the player.
 * 
 */

import Being from "./Being.class";
import Item from "./Item.class";
import {Biome, Biomes} from "../proc-gen/biomes";
import {rollDrop} from "../data/drop-tables";

export default class Level {
	private map: any[];
	mapFeatures: any[] = [];
	private beings: Being[][];
	private exits: any[];
	private items: any[];
	
	private beingsList: Being[];
	game: any;
	id: string;
	private player: any;
	exitMap: Record<string, {x: number, y: number}> = {};
	biome: Biome
	dimensions: {x: number, y: number};

	constructor (game: any, id: string, biome?: Biome, dimensions?: {x: number, y: number}) {
		this.init(game, id);
		this.biome = biome || Biomes.Forest;
		this.dimensions = dimensions;
	}

	init (game: any, id: string) {
		this.map = [];
		this.beings = [];
		this.beingsList = [];
		this.exits = [];
		this.items = [];

		this.game = game;
		this.id = id;
		this.player = game.player;
	}

	beingsTurn () {
		const removeList = [];
		for (var i = 0; i < this.beingsList.length; i++){
			if(this.beingsList[i].combatState.getStatus() === "Dead") {
				removeList.push(i)
			}else {
				this.beingsList[i].act();
			}
		}

		for(const beingsListIdx of removeList){
			const being = this.beingsList[beingsListIdx];
			this.game.display.message(`The ${being.tileName} died.`);
			const drop = rollDrop(this.game.world.lootTable, being.combatState.stats.level);
			this.beingsList.splice(beingsListIdx, 1);
			this.beings[being.x][being.y] = undefined;
			if(drop && !this.getItem(being.x, being.y)){
				this.addItem(drop, being.x, being.y);
				this.game.display.message(`The ${being.tileName} dropped a ${drop.def.name}.`);
			}
		}

		this.player.updateFOV();
		this.game.display.refresh();
		this.game.input.inputEnabled = true;
	}

	addBeing (being: Being, x: number, y: number) {
		this.beingsList.push(being);
		if (!this.beings[x])
			this.beings[x] = [];
		being.moveTo(x, y);
		this.beings[x][y] = being;
	}

	canWalkTo (x: number, y: number) {
		try {
			if (this.map[x][y].solid || this.mapFeatures?.[x]?.[y]?.solid ){
				return false;
			}
		} catch (e){
			// Catch OOB
			return false;
		}
		if (this.beings[x] && this.beings[x][y]){
			return false;
		}
		if (this.player && this.player.x === x && this.player.y === y)
			return false;
		return true;
	}

	addExit (x: number, y: number, levelId: string, tile: any, start?: {x: number, y: number}) {
		if (!this.map[x])
			this.map[x] = [];
		this.map[x][y] = tile;
		if (!this.exits[x])
			this.exits[x] = [];
		this.exits[x][y] = levelId;
		if(start){
			this.exitMap[`${start.x}-${start.y}`] = {x, y}
		}
	}

	addItem (item: Item, x: number, y: number) {
		if (!this.items[x])
			this.items[x] = [];
		this.items[x][y] = item;
	}

	getItem (x: number, y: number) {
		if (!this.items[x])
			return false;
		return this.items[x][y];
	}

	removeItem (x: number, y: number) {
		if (!this.items[x])
			this.items[x] = [];
		this.items[x][y] = false;
	}

	moveBeing (being: Being, dx: number, dy: number) {
		if (!this.beings[being.x])
			this.beings[being.x] = [];
		this.beings[being.x][being.y] = null;
		if (!this.beings[being.x + dx])
			this.beings[being.x + dx] = [];
		this.beings[being.x + dx][being.y + dy] = being;
	}

	getBeing(x: number, y: number): Being | undefined {
		return this.beings[x]?.[y];
	}

	getUnoccupiedSpaces(){
		const unoccupiedSpaces: {x: number, y: number}[] = [];

		for(let x = 1; x < this.map.length-1; x += 1){
			for(let y = 1; y < this.map[0].length-1; y += 1){
				if(
					!Boolean(this.beings?.[x]?.[y])
					&& !Boolean(this.items?.[x]?.[y])
					&& !Boolean(this.mapFeatures?.[x]?.[y])
				) {
					unoccupiedSpaces.push(({x, y}))
				}
			}
		}

		return unoccupiedSpaces
	}

	hasBeings(){
		return this.beingsList.length > 0
	}
}