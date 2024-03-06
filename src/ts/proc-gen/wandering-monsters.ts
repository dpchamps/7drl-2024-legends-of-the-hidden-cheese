import Level from "../model/Level.class";
import Random from "../Random";
import Being from "../model/Being.class";
import {spawnMonster} from "./monster-generator";
import {LootTable} from "./LootTable";

const MONSTER_SPAWN_RATE = 0.6;
const MONSTER_SPAWN_PERCENT = MONSTER_SPAWN_RATE * 100;
export const spawnWanderingMonsters = (level: Level, lootTable: LootTable) => {
    const roll = Random.n(0, 100);
    console.log({roll, beings: level.hasBeings(), MONSTER_SPAWN_PERCENT})
    if(level.hasBeings() || roll > MONSTER_SPAWN_PERCENT) {
        console.log("fail");
        return
    }
    const monstersToSpawn = Random.n(1, 4);
    const unoccupiedSpaces = level.getUnoccupiedSpaces();

    Array(monstersToSpawn).fill(0).forEach(() => {
        const levelRange = level.id === `world-0-0` ? [1,1] as const : level.biome.levelRange
        const race = spawnMonster(levelRange as any, lootTable)
        const being = new Being(level.game, level, race);
        const unoccupiedIndex = Random.n(0, unoccupiedSpaces.length-1);
        const {x, y} = unoccupiedSpaces[unoccupiedIndex];
        unoccupiedSpaces.splice(unoccupiedIndex, 1);
        console.log(`Spawning ${race.name} @ ${x}, ${y}`);

        // todo random intents (perhaps default intents based on race)
        being.setIntent("CHASE");

        level.addBeing(being, x, y);
    })
}