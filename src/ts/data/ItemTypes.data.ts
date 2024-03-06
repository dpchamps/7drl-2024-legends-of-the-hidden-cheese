/**
 * Determines the types of items, as well as the script when using
 * them.
 */

export default {
	WEAPON: {
		name: 'Weapon',
		type: "Equipment",
		useFunction: function(game, item){
			game.display.message("You wield the "+item.def.name);
		}
	},
	ARMOR: {
		name: "Armor",
		type: "Equipment"
	},
	BOOK: {
		name: 'Book',
		useFunction: function(game, item){
			game.display.message("You read the "+item.def.name);
		}
	},
	SPELL: {
		name: 'Spell',
		targetted: true,
		useFunction: function(game, item, dx, dy){
			game.display.message("You cast the "+item.def.name+" in direction x "+dx+" y "+dy);
		}
	},
	CONSUMABLE: {
		name: 'Consumable',
		targetted: false,
		useFunction: function (game, item) {
			switch(item.def.consumableData.category){
				case "Healing": {
					const hpToGain = item.def.consumableData.affect.health;
					game.player.combatState.heal(hpToGain)
					game.display.message(`You use ${item.def.name} to gain ${hpToGain} health.`)
					break
				}
				case "Buff": {
					game.player.combatState.buffs.push({
						...item.def.consumableData.affect,
						name: item.def.name
					});
					game.display.message(`You use ${item.def.name} to gain ${Object.entries(item.def.consumableData.affect.stats).map(x => x.reverse().join(" ")).join(",")}.`);
					break;
				}
			}
		}
	},
	KEY_ITEM: {
		name: "Key Item",
		targetted: false,
		useFunction: (game, item) => {
			game.display.message(item.def.useMessage)
		}
	}
}