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
		})
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
		}
	},
	SAGE: {
		baseLevel: 2,
		tilesetData: '26-0',
		name: "Sage"
	},
	GOBLIN: {
		baseLevel: 2,
		tilesetData: '27-0',
		name: "Goblin"
	},
	GOBLIN_WARRIOR: {
		baseLevel: 5,
		tilesetData: '28-0',
		name: "Goblin Warrior"
	},
	GOBLIN_CHIEFTAIN: {
		baseLevel: 10,
		tilesetData: '29-0',
		name: "Goblin Chieftain"
	},
	KNIGHT: {
		baseLevel: 4,
		tilesetData: '29-0',
		name: "Knight"
	},
	LANCER: {
		baseLevel: 6,
		tilesetData: '30-0',
		name: "Lancer"
	},
	SCORPION: {
		baseLevel: 4,
		tilesetData: '26-5',
		name: "Scorpion"
	},
	CRAB: {
		baseLevel: 3,
		tilesetData: '27-5',
		name: "Crab"
	},
	BEE: {
		baseLevel: 4,
		tilesetData: '28-5',
		name: "Bee"
	},
	TURTLE: {
		baseLevel: 5,
		tilesetData: '29-5',
		name: "Turtle"
	},
	SPIDER: {
		baseLevel: 7,
		tilesetData: '30-5',
		name: "Spider"
	},
	DRAGON: {
		baseLevel: 15,
		tilesetData: '28-8',
		name: "Dragon"
	},
	WYVERN: {
		baseLevel: 13,
		tilesetData: '29-8',
		name: "Wyvern"
	},
	WEARWOLF: {
		baseLevel: 13,
		tilesetData: '30-8',
		name: "Wearwolf"
	}
}