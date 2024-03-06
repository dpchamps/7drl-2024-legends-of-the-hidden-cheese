
import * as Stats from "../combat/stats";
import * as Vitals from "../combat/vitals";
import * as Combat from "../combat";
import {CombatState} from "../combat/combat-state";
import {calculateXpGained} from "../data/experience-table.data";

const ut = (window as any).ut;

/**
 * Object that contains the state of the player, as well as functions for it
 * to interact with the world.
 * 
 * Contains the player inventory and functions to grab and drop.
 * 
 * Contains the player memory (tiles he has seen previously per level)
 * 
 * Contains the field of view logic using simple raycasting.
 */

export default {
	MAX_SIGHT_RANGE: 10,
	x: 20,
	y: 20,
	tile: new ut.Tile('@', 255, 255, 255),
	visible: [],
	memory: {},
	items: [],
	weapon: {
		name: "Fist",
		accuracyMod: 1,
		damageMod: 1,
		damageRange: [1, 4],
		threatRange: [20, 20]
	},
	combatState: new CombatState({
		health: 60,
		strength: 2,
		dexterity: 2
	}),
	armorModifier: {
		base: 5
	},
	init: function(game) {
		this.game = game;
		this.initSight();
	},
	reset(){
		this.items = [];
		this.memory = {};
		this.combatState = new CombatState({
			health: 60,
			strength: 2,
			dexterity: 2
		});
		this.initSight();
	},
	getConsumables(){
		return this.items.filter((item) => item.def.type.type !== "Equipment")
	},
	getEquipment(){
		return this.items.filter((item) => item.def.type.type === "Equipment")
	},
	getKeyItems(){
		return this.items.filter((item) => item.def.type.name === "Key Item")
	},
	initSight() {
		for (let j = -this.MAX_SIGHT_RANGE; j <= this.MAX_SIGHT_RANGE; j++){
			this.visible[j] = [];
		}
	},
	tryMove: function(dir) {
		const targetDirectionX = this.x+dir.x;
		const targetDirectionY = this.y+dir.y;

		const targetBeing = this.game.world.level.getBeing(targetDirectionX, targetDirectionY);
		if(targetBeing){
			Combat.combatPhase(this, targetBeing, (hitType) => {
				switch (hitType.type) {
					case "Miss": {
						this.game.display.message(`You attempt to hit the enemy ${targetBeing.tileName} with your ${this.weapon.name}, but miss.`);
						break;
					}
					case "Hit": {
						this.game.display.message(`You strike the enemy ${targetBeing.tileName} with your ${this.weapon.name}.`);
						break;
					}
					case "Critical": {
						this.game.display.message(`You deal a devastating blow to the enemy ${targetBeing.tileName} with your ${this.weapon.name}!`);
						break;
					}
				}
			});

			if(targetBeing.combatState.getStatus() === "Dead"){
				const xpGained = calculateXpGained(this.combatState.stats.level, targetBeing.combatState.stats.level);
				console.log({xpGained});
				this.combatState.gainExperience(xpGained, (lastLevel, nextLevel) => {
					this.game.display.message(`You gained a level, from ${lastLevel} to ${nextLevel}.`);
				})
			}

			this.endTurn();
			return;
		}

		if (!this.game.world.level.canWalkTo(this.x+dir.x, this.y+dir.y)){
			this.game.input.inputEnabled = true;
			return;
		}
		this.x += dir.x;
		this.y += dir.y;
		this.tryPickup();
		this.land();
	},
	land: function() {
		if (this.game.world.level.exits[this.x] && this.game.world.level.exits[this.x][this.y]){
			this.game.world.loadLevel(this.game.world.level.exits[this.x][this.y]);
		}
		this.endTurn();
	},
	endTurn: function() {
		this.updateFOV();
		this.game.display.refresh();
		if(this.combatState.getStatus() === "Dead"){
			this.game.endGame("LOSE");
		}
		if(this.getKeyItems().length === 3){
			this.game.endGame("WIN");
		}
		this.tickActiveBuffs();
		this.game.world.level.beingsTurn();
	},
	remember: function(x: number, y: number) {
		var memory = this.memory[this.game.world.level.id];
		if (!memory){
			memory = [];
			this.memory[this.game.world.level.id] = memory;
		}
		if (!memory[x]){
			memory[x] = [];
		}
		memory[x][y] = true;
	},
	remembers: function(x: number, y: number) {
		var memory = this.memory[this.game.world.level.id];
		if (!memory){
			return false;
		}
		if (!memory[x]){
			return false;
		}
		return memory[x][y] === true;
	},
	canSee: function(dx: number, dy: number) {
		try {
			return this.visible[dx][dy] === true;
		} catch(err) {
			// Catch OOB
			return false; 
		}
	},
	getSightRange: function() {
		return 15;
	},
	updateFOV: function() {
		/*
		 * This function uses simple raycasting, 
		 * use something better for longer ranges
		 * or increased performance
		 */
		for (var j = -this.MAX_SIGHT_RANGE; j <= this.MAX_SIGHT_RANGE; j++)
			for (var i = -this.MAX_SIGHT_RANGE; i <= this.MAX_SIGHT_RANGE; i++)
				this.visible[i][j] = false;
		var step = Math.PI * 2.0 / 1080;
		for (var a = 0; a < Math.PI * 2; a += step)
			this.shootRay(a);
	},
	shootRay: function (a: number) {
		var step = 0.3333;
		var maxdist = this.getSightRange() < this.MAX_SIGHT_RANGE ? this.getSightRange() : this.MAX_SIGHT_RANGE;
		maxdist /= step;
		var dx = Math.cos(a) * step;
		var dy = -Math.sin(a) * step;
		var xx = this.x, yy = this.y;
		for (var i = 0; i < maxdist; ++i) {
			var testx = Math.round(xx);
			var testy = Math.round(yy);
			this.visible[testx-this.x][testy-this.y] = true;
			this.remember(testx, testy);
			try {
				if (this.game.world.level.map[testx][testy].opaque || this.game.world.level.mapFeatures?.[testx]?.[testy]?.opaque)
					return;
			} catch(err) {
				// Catch OOB
				return; 
			}
			xx += dx; yy += dy;
		}
	},
	canPick: function() {
		return true;
	},
	addItem: function(item) {
		this.items.push(item);
		this.items.sort(this.itemSorter);
	},
	removeItem: function(item) {
		this.items.splice(this.items.indexOf(item), 1);
		this.items.sort(this.itemSorter);	
	},
	itemSorter: function(a, b) {
		if (a.def.type.name === b.def.type.name){
			return a.def.name > b.def.name ? 1 : -1;
		} else {
			return a.def.type.name > b.def.type.name ? 1 : -1;
		}
	},
	tryPickup: function() {
		var item = this.game.world.level.getItem(this.x, this.y);
		if (item){
			if (!this.canPick()){
				this.game.display.message("You can't pickup the "+item.def.name);
			} else {
				this.game.display.message("You pickup the "+item.def.name);
				this.game.world.level.removeItem(this.x, this.y);
				this.addItem(item);
			}
		}
	},
	tryDrop: function(item) {
		var underItem = this.game.world.level.items[this.x] && this.game.world.level.items[this.x][this.y];
		if (underItem){
			this.game.display.message("Cannot drop the "+item.def.name+" here.");
		} else {
			this.game.world.level.addItem(item, this.x, this.y);
			this.removeItem(item);
			this.game.display.message("You drop the "+item.def.name+".");
		}
	},
	tryUse: function(item, dx, dy) {
		item.def.type.useFunction(this.game, item, dx, dy);
		if(item.def.type.name === "Consumable"){
			this.removeItem(item);
			this.game.display.message(`The item has been consumed.`);
		}
	},
	tickActiveBuffs(){
		this.combatState.buffs = this.combatState.buffs
			.map((buff) => ({...buff, turns: buff.turns-1}))
			.filter((buff) => {
				if(buff.turns <= 0){
					this.game.display.message(`The ${buff.name} wore off.`);
				}
				return buff.turns > 0;
			});
	}
}