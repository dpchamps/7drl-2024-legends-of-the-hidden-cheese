import {type Stats} from "./stats";
import * as stats from "./stats";
import Random from "../Random";
import {CombatState} from "./combat-state";




export const doDamage = (stats: Stats, damage: number) => ({
    ...stats,
    health: stats.health - damage
});

export type Weapon = {
    name: string,
    accuracyMod: number,
    damageMod: number,
    damageRange: readonly [number, number],
    threatRange: readonly [number, number],
};

export const weaponStats = (input: Partial<Weapon> & {name: string}) => ({
    accuracyMod: 0,
    damageMod: 0,
    damageRange: [1, 4],
    threatRange: [20, 20],
    ...input
});

export type ArmorModifier = {
    name: string,
    base: number
}

export const armorModifier = (input: Partial<ArmorModifier> & {name: string}) => ({
    base: 0,
    ...input
})

export type HitType =
    {type: "Miss"} | {type: "Hit" } | {type: "Critical"}

export const rollToHit = (sourceStats: Stats, sourceWeapon: Weapon, targetStats: Stats, targetArmorMod: ArmorModifier): HitType => {
    const baseRoll = Random.n(1, 20);

    if(baseRoll === 1){
        return {type: "Miss"}
    }

    if(baseRoll >= sourceWeapon.threatRange[0] || baseRoll === 20) {
        return {type: "Critical"}
    }

    if((baseRoll + stats.toHit(sourceStats, sourceWeapon)) >= stats.armorClass(targetStats, targetArmorMod)) {
        return {type: "Hit"}
    }

    return {type: "Miss"};
}


export const rollDamage = (sourceStats: Stats, sourceWeapon: Weapon) => sourceStats.strength + Random.n(sourceWeapon.damageRange[0], sourceWeapon.damageRange[1]) + sourceWeapon.damageMod

type CombatableBeing = {
    combatState: CombatState,
    weapon: Weapon,
    armorModifier: ArmorModifier
}

export const combatPhase = (sourceBeing: CombatableBeing, targetBeing: CombatableBeing, cb: (hitType: HitType) => void) => {
    const hitType = rollToHit(sourceBeing.combatState.stats, sourceBeing.weapon, targetBeing.combatState.stats, targetBeing.armorModifier);
    cb(hitType);
    switch (hitType.type) {
        case "Miss": {
            break;
        }
        case "Hit": {
            const damage = rollDamage(sourceBeing.combatState.stats, sourceBeing.weapon);
            targetBeing.combatState.dealDamage(damage);
            break;
        }
        case "Critical": {
            const damage = rollDamage(sourceBeing.combatState.stats, sourceBeing.weapon) * 2;
            targetBeing.combatState.dealDamage(damage);
            break;
        }
    }
}