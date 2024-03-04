import * as Stats from "../combat/stats";

const ut = (window as any).ut;

export default {
	RAT: {
		tile: new ut.Tile('r', 128, 128, 0),
		name: 'Rat',
		tilesetData: '31-8',
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
}