import Level from "../model/Level.class";
import Random from "../Random";
import Being from "../model/Being.class";

export const spawnWanderingMonsters = (level: Level) => {
    if(level.hasBeings() || Random.n(0, 1) === 1) {
        return
    }
    const monstersToSpawn = Random.n(0, 4);
    const unoccupiedSpaces = level.getUnoccupiedSpaces();
    Array(monstersToSpawn).fill(0).forEach(() => {
        const race = level.biome.npcs[Random.n(0, level.biome.npcs.length-1)];
        const being = new Being(level.game, level, race);
        const unoccupiedIndex = Random.n(0, unoccupiedSpaces.length-1);
        const {x, y} = unoccupiedSpaces[unoccupiedIndex];
        unoccupiedSpaces.splice(unoccupiedIndex, 1);

        // todo random intents (perhaps default intents based on race)
        being.setIntent("CHASE");

        level.addBeing(being, x, y);
    })
}