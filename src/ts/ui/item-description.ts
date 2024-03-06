import ItemsData, {ConsumableCategories} from "../data/Items.data";
import ItemType from "../data/ItemTypes.data";
import Item from "../model/Item.class";
import {ArmorModifier, Weapon} from "../combat";
type T_ITEM = typeof ItemsData[keyof typeof ItemsData];

const getConsumableInventoryDescription = (item: Item) => {
    switch (item.def.consumableData.category) {
        case ConsumableCategories.Healing: {
            return `Restores ${item.def.consumableData.affect.health} health.`
        }
        default: {
            return `Boosts ${Object.entries(item.def.consumableData.affect.stats).map(x => x.reverse().join(" "))} for ${item.def.consumableData.affect.turns} turns.`;
        }
    }
}

const getWeaponInventoryDescription = (item: Weapon) => {
    const damage = `Damage: ${item.damageRange[0]+item.damageMod}-${item.damageRange[1]+item.damageMod}`;
    const threat = `Critical: ${item.threatRange[0]}-${item.threatRange[1]}`;
    const accuracy = item.accuracyMod ? `, Accuracy: +${item.accuracyMod}` : '';
    return `${damage}, ${threat}${accuracy}`
}

export const getArmorInventoryDescription = (item: ArmorModifier) => {
    return `Armor Mod: +${item.base}`
}

export const getItemInventoryDescription = (item: Item) => {
    debugger
    switch (item.def.type.name){
        case ItemType.KEY_ITEM.name: {
            return `An item necessary for winning the game. Use as much as you'd like.`;
        }
        case ItemType.CONSUMABLE.name:{
            return getConsumableInventoryDescription(item) + `\nWill be destroyed on use.`
        }
        case ItemType.WEAPON.name: {
            return getWeaponInventoryDescription(item.def.weaponStats);
        }
        case ItemType.ARMOR.name: {
            return getArmorInventoryDescription(item.def.armorModifier);
        }
        default: {
            return ""
        }
    }
}