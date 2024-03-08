/**
 * Represent an "alive" entity that moves around the world
 * and can be interacted with by the player.
 * 
 */

import Random from '../Random';
import Level from './Level.class';
import * as Stats from "../combat/stats";
import {CombatState} from "../combat/combat-state";
import {ArmorModifier} from "../combat";
import * as Combat from "../combat";
import {Weapon} from "../combat";

export default class Being {
	private game: any;
	private level: Level;
	private tile: any;
	tileName: string;
	private tilesetData: any;
	private xPosition: number;
	private yPosition: number;
	private intent: string;
	combatState: CombatState;
	armorModifier: ArmorModifier;
	weapon: Weapon;
	speed: number
	speedState: number;

	get x(): number {
		return this.xPosition;
	}

	get y(): number {
		return this.yPosition;
	}

	constructor (game: any, level: Level, race: any) {
		this.game = game;
		this.level = level;
		this.tile = race.tile;
		this.tileName = race.name;
		this.tilesetData = race.tilesetData;
		this.xPosition = 0;
		this.yPosition = 0;
		this.intent = 'DONOTHING';
		this.combatState = new CombatState(race.stats);
		this.armorModifier = race.armorModifier || {base: 2};
		this.weapon = race.weapon || {
			name: "Claw",
			accuracyMod: 3,
			damageMod: 2,
			damageRange: [1, 12],
			threatRange: [20, 20],
		}
		this.speed = race.speed || 2;
		this.speedState = 0;
	}

	act () {
		switch (this.intent){
			case 'RANDOM':
				this.actRandom();
				break;
			case 'CHASE':
				this.actChase();
				break;
			case 'Guard':
				this.actGuard();
				break
			case 'DONOTHING':
				break;
		}
	}

	actRandom () {
		var dx = Random.n(-1, 1);
		var dy = Random.n(-1, 1);
		if (!this.level.canWalkTo(this.x+dx,this.y+dy)){
			return;
		}
		this.moveTo(dx, dy);
	}

	actChase () {
		var nearestEnemy = this.getNearestEnemy();
		if (!nearestEnemy){
			return;
		}
		var dx = Math.sign(nearestEnemy.x - this.x);
		var dy = Math.sign(nearestEnemy.y - this.y);

		const targetX = this.x + dx;
		const targetY = this.y + dy;
		if(targetX === nearestEnemy.x && targetY === nearestEnemy.y){
			Combat.combatPhase(this, nearestEnemy, (hitType) => {
				switch (hitType.type) {
					case "Miss": {
						this.game.display.message(`The enemy ${this.tileName} attempts to hit you with it's ${this.weapon.name}, but it misses.`)
						break;
					}
					case "Hit": {
						this.game.display.message(`The enemy ${this.tileName} hits you with it's ${this.weapon.name}.`)
						break
					}
					case "Critical": {
						this.game.display.message(`The enemy ${this.tileName} deals a devastating blow with it's ${this.weapon.name}.`)
					}
				}
			})
		}

		if (!this.level.canWalkTo(this.x+dx,this.y+dy)){
			return;
		}

		this.speedState += 1;
		this.speedState = this.speedState % this.speed;
		if(this.speedState === 0){
			this.moveTo(dx, dy);
		}
	}

	actGuard(){
		var nearestEnemy = this.getNearestEnemy();
		if (!nearestEnemy){
			return;
		}
		var dx = Math.sign(nearestEnemy.x - this.x);
		var dy = Math.sign(nearestEnemy.y - this.y);

		const targetX = this.x + dx;
		const targetY = this.y + dy;
		if(targetX === nearestEnemy.x && targetY === nearestEnemy.y){
			Combat.combatPhase(this, nearestEnemy, (hitType) => {
				switch (hitType.type) {
					case "Miss": {
						this.game.display.message(`The enemy ${this.tileName} attempts to hit you with it's ${this.weapon.name}, but it misses.`)
						break;
					}
					case "Hit": {
						this.game.display.message(`The enemy ${this.tileName} hits you with it's ${this.weapon.name}.`)
						break
					}
					case "Critical": {
						this.game.display.message(`The enemy ${this.tileName} deals a devastating blow with it's ${this.weapon.name}.`)
					}
				}
			})
		}
	}

	getNearestEnemy () {
		return this.game.player;
	}

	moveTo (dx: number, dy: number) {
		this.level.moveBeing(this, dx, dy)
		this.xPosition = this.x + dx;
		this.yPosition = this.y + dy;
	}

	setIntent (intent: string) {
		this.intent = intent;
	}
}