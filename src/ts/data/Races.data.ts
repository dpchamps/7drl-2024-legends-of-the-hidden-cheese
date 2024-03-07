import * as Stats from "../combat/stats";

const ut = (window as any).ut;

export default {
	RAT: {
		tile: new ut.Tile('r', 128, 128, 0),
		name: 'Rat',
		tilesetData: '31-8',
		baseLevel: 1,
		stats: Stats.from({
			level: 1,
			health: 20,
			strength: 2,
			dexterity: 10
		}),
		speed: 2
	},
	TROLL: {
		tile: new ut.Tile('T', 128, 128, 0),
		name: 'Troll',
		tilesetData: '26-2',
		baseLevel: 4,
		stats: Stats.from({
			level: 5,
			health: 50,
			strength: 10,
			dexterity: 2,
		}),
		armorModifier: {
			base: 10
		},
		speed: 3
	},
	SAGE: {
		baseLevel: 2,
		tilesetData: '26-0',
		name: "Sage",
		speed: 1
	},
	GOBLIN: {
		baseLevel: 2,
		tilesetData: '27-0',
		name: "Goblin",
		speed: 2
	},
	GOBLIN_WARRIOR: {
		baseLevel: 5,
		tilesetData: '28-0',
		name: "Goblin Warrior",
		speed: 2
	},
	GOBLIN_CHIEFTAIN: {
		baseLevel: 10,
		tilesetData: '29-0',
		name: "Goblin Chieftain",
		speed: 2
	},
	KNIGHT: {
		baseLevel: 4,
		tilesetData: '29-0',
		name: "Knight",
		speed: 2
	},
	LANCER: {
		baseLevel: 6,
		tilesetData: '30-0',
		name: "Lancer",
		speed: 2
	},
	SCORPION: {
		baseLevel: 4,
		tilesetData: '26-5',
		name: "Scorpion",
		speed: 1,
	},
	CRAB: {
		baseLevel: 3,
		tilesetData: '27-5',
		name: "Crab",
		speed: 2
	},
	BEE: {
		baseLevel: 4,
		tilesetData: '28-5',
		name: "Bee",
		speed: 1
	},
	TURTLE: {
		baseLevel: 5,
		tilesetData: '29-5',
		name: "Turtle",
		speed: 3,
	},
	SPIDER: {
		baseLevel: 7,
		tilesetData: '30-5',
		name: "Spider",
		speed: 2
	},
	DRAGON: {
		baseLevel: 15,
		tilesetData: '28-8',
		name: "Dragon",
		speed: 3
	},
	WYVERN: {
		baseLevel: 13,
		tilesetData: '29-8',
		name: "Wyvern",
		speed: 2
	},
	WEARWOLF: {
		baseLevel: 13,
		tilesetData: '30-8',
		name: "Wearwolf",
		speed: 2
	},
	GUARDIAN_OF_THE_CHEESE: {
		baseLevel: 14,
		tilesetData: '28-6',
		name: "Guardian of the Cheese",
		speed: 1,
	}
}