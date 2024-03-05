const ut = (window as any).ut;

export default {
	GRASS: {
		tile: new ut.Tile('.', 0, 128, 0),
		darkTile: new ut.Tile('.', 128, 128, 128),
		solid: false,
		opaque: false,
		name: 'Grass',
		tilesetData: 'world-5-0'
	},
	SAND_TERRAIN: {
		solid: false,
		opaque: false,
		name: "Sand",
		tilesetData: 'world-8-0'
	},
	SWAMP_TERRAIN: {
		solid: false,
		opaque: false,
		name: "Swamp",
		tilesetData: 'world-3-19'
	},
	STAIRS_DOWN: {
		tile: new ut.Tile('>', 255, 255, 255),
		darkTile: new ut.Tile('>', 128, 128, 128),
		solid: false,
		opaque: false,
		name: 'Stairs Down',
		tilesetData: '21-0'
	},
	STAIRS_UP: {
		tile: new ut.Tile('<', 255, 255, 255),
		darkTile: new ut.Tile('<', 128, 128, 128),
		solid: false,
		opaque: false,
		name: 'Stairs Up',
		tilesetData: '21-1'
	},
	BUSH: {
		tile: new ut.Tile('&', 0, 128, 0),
		darkTile: new ut.Tile('&', 128, 128, 128),
		solid: true,
		opaque: true,
		name: 'Bush',
		tilesetData: 'world-13-9'
	},
	PILLAR: {
		tile: new ut.Tile('&', 0, 128, 0),
		darkTile: new ut.Tile('&', 128, 128, 128),
		solid: true,
		opaque: true,
		name: 'Pillar',
		tilesetData: 'world-13-20'
	},
	ForestTree: {
		tile: new ut.Tile('&', 0, 128, 0),
		darkTile: new ut.Tile('&', 128, 128, 128),
		solid: true,
		opaque: true,
		name: 'Bush',
		tilesetData: 'world-16-9'
	},
	Stump: {
		solid: true,
		opaque: true,
		name: 'Rocks',
		tilesetData: 'world-53-20',
	},
	WATER: {
		tile: new ut.Tile('~', 0, 0, 255),
		darkTile: new ut.Tile('~', 128, 128, 128),
		solid: true,
		opaque: false,
		name: 'Water',
		tilesetData: 'world-0-0'
	},
	ROCKS: {
		solid: true,
		opaque: true,
		name: 'Rocks',
		tilesetData: 'world-55-20',
	},
	FLOWERS: {
		solid: false,
		opaque: false,
		name: 'Flowers',
		tilesetData: 'world-3-7'
	},
	GRASS_FEATURE_ONE: {
		solid: false,
		opaque: false,
		name: 'Flowers',
		tilesetData: 'world-22-11'
	},
	GRASS_FEATURE_TWO: {
		solid: false,
		opaque: false,
		name: 'Flowers',
		tilesetData: 'world-22-10'
	},
	CACTUS_1: {
		solid: true,
		opaque: true,
		name: 'Bush',
		tilesetData: 'world-22-9',
	},
	CACTUS_2: {
		solid: true,
		opaque: true,
		name: 'Bush',
		tilesetData: 'world-26-9',
	},
	DEAD_TREE: {
		solid: true,
		opaque: true,
		name: 'Bush',
		tilesetData: 'world-27-11',
	},
	DESERT_MUSHROOM_ONE: {
		solid: false,
		opaque: false,
		name: 'Desert Mushroom',
		tilesetData: 'world-34-9',
	},
	SWAMP_BUSH: {
		solid: true,
		opaque: true,
		name: 'Bush',
		tilesetData: 'world-18-9'
	},
	SWAMP_ROCK: {
		solid: true,
		opaque: true,
		name: 'Rocks',
		tilesetData: 'world-54-21'
	},
	BERRY_BUSH: {
		solid: true,
		opaque: true,
		name: 'Rocks',
		tilesetData: 'world-24-11'
	},
	SWAMP_MUSHROOM_CLUSTER: {
		solid: false,
		opaque: false,
		name: 'Desert Mushroom',
		tilesetData: 'world-32-9',
	}
}