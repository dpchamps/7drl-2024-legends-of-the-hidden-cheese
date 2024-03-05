import {armorModifier, weaponStats} from "../combat";

const ut = (window as any).ut;

import ItemType from './ItemTypes.data';

export default {
	IRON_SWORD: {
		type: ItemType.WEAPON,
		name: 'Iron Sword',
		tile: new ut.Tile('/', 128, 128, 128),
		tilesetData: '32-7',
		weaponStats: weaponStats({
			name: 'Iron Sword',
			damageRange: [1, 8],
			threatRange: [19, 20]
		})
	},
	GOLDEN_SWORD: {
		type: ItemType.WEAPON,
		name: 'Golden Sword',
		tile: new ut.Tile('/', 128, 128, 128),
		tilesetData: '32-7',
		weaponStats: weaponStats({
			name: 'Golden Sword',
			damageMod: 2,
			damageRange: [1, 12],
			threatRange: [18, 20]
		})
	},
	IRON_ARMOR: {
		type: ItemType.ARMOR,
		name: "Iron Armor",
		tilesetData: '33-1',
		armorModifier: armorModifier({
			name: "Iron Armor",
			base: 10
		})
	},
	BOOK_OF_MIRDAS: {
		type: ItemType.BOOK,
		name: 'Book of Mirdas',
		tile: new ut.Tile('B', 255, 0, 0),
		tilesetData: '45-5'
	},
	BOOK_OF_AURORA: {
		type: ItemType.BOOK,
		name: 'Book of Aurora',
		tile: new ut.Tile('B', 0, 0, 255),
		targetted: true,
		tilesetData: '45-5'
	},
	SPELL_OF_LOLZORS: {
		type: ItemType.SPELL,
		name: 'Spell of Lolzors',
		tile: new ut.Tile('S', 0, 255, 0),
		tilesetData: '45-5'
	},
	POTION_OF_HEALING: {
		type: ItemType.CONSUMABLE,
		name: "Potion of Healing",
		tilesetData: '42-11',
		consumableData: {
			category: "HEALING",
			affect: {
				health: 25
			}
		}
	},
	HEARTY_POTION_OF_HEALING: {
		type: ItemType.CONSUMABLE,
		name: "Hearty Potion of Healing",
		tilesetData: '42-11',
		consumableData: {
			category: "HEALING",
			affect: {
				health: 60
			}
		}
	},
	MAGIC_CHEESE_OF_NEYPH: {
		type: ItemType.KEY_ITEM,
		name: "Magic Cheese of Neyph",
		tilesetData: '34-16',
		useMessage: `You waft the pungent aroma of neyphian fromage.`
	},
	MAGIC_CHEESE_OF_ROE: {
		type: ItemType.KEY_ITEM,
		name: "Magic Cheese of Roe",
		tilesetData: '34-16',
		useMessage: `The aroma of roe fills you with memories of the past.`
	},
	MAGIC_CHEESE_OF_CINDARIUM: {
		type: ItemType.KEY_ITEM,
		name: "Magic Cheese of Cindarium",
		tilesetData: '34-16',
		useMessage: `The cheese glows with a rainbow hue.`
	}
}