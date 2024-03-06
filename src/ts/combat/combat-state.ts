import * as Stats from "./stats";
import * as Vitals from "./vitals";
import {ExperienceThresholds, getExperienceForLevel, StatGrowthTable} from "../data/experience-table.data";

export type BeingState = "Alive" | "Dead" | "Dying";

export type Buff = {
    stats: Pick<Stats.Stats, "strength" | "health" | "dexterity">,
    turns: number,
    name: string,
}

export class CombatState {
    stats: Stats.Stats;
    vitals: Vitals.Vitals;
    buffs: Buff[] = []


    constructor(stats: Partial<Stats.Stats>) {
        this.stats = Stats.from(stats);
        const {currentXp, nextLevelXp} = getExperienceForLevel(this.stats.level);
        this.stats.xp = nextLevelXp;
        this.vitals = Vitals.from({
            health: stats.health,
            xp: currentXp
        });
    }

    getStatus():BeingState{
        return this.vitals.health > 0 ? "Alive" : "Dead"
    }

    dealDamage(damage: number){
        this.vitals.health = Math.max(this.vitals.health - damage, 0)
    }

    heal(amount: number){
        this.vitals.health = Math.min(this.vitals.health + amount, this.stats.health);
    }

    gainExperience(amount: number, onLevelUp: (from: number, to: number) => void) {
        this.vitals.xp += amount;

        if(this.vitals.xp >= this.stats.xp){
            const lastLevel = this.stats.level;
            this.stats.level += 1;
            const {health, strength, dexterity} = StatGrowthTable[this.stats.level];
            const {nextLevelXp} = getExperienceForLevel(this.stats.level);

            this.stats.xp = nextLevelXp;
            this.stats.strength += strength;
            this.stats.dexterity += dexterity;
            this.stats.health += health;
            this.vitals.health = this.stats.health
            onLevelUp(lastLevel, this.stats.level)
            this.gainExperience(0, onLevelUp);
        }
    }

    getStatsWithBuffs(): Stats.Stats{
        return this.buffs.reduce(
            (acc, buff) => {
                return Object.entries(buff.stats).reduce(
                    (acc, [buffName, buffValue]) => {
                        acc[buffName] += buffValue;
                        return acc
                    },
                    acc
                )
            },
            {...this.stats}
        );
    }
}