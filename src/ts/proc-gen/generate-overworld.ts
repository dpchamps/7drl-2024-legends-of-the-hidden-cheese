import Random from "../Random";
export type Exit = "North" | "South" | "East" | "West";
type Coord = {x: number, y: number};

const assert = (condition: boolean, message) => {
    if(!condition){
        throw new Error(`Assertion Error: ${message}`)
    }
}
const EXITS = ["North", "South", "East", "West"] as const;
export const exitToCoord = (exit: Exit) => {
    switch (exit){
        case "East": return {x: 1, y: 0}
        case "West": return {x: -1, y: 0}
        case "North": return {x: 0, y: -1}
        case "South": return {x: 0, y : 1}
        default: throw new Error("unreachable")
    }
}

export const coordToExit = (coord: Coord): Exit => {
    if(coord.x === 0 && coord.y === 1) return "South";
    if(coord.x === 0 && coord.y === -1) return "North";
    if(coord.x === -1 && coord.y === 0) return "West";
    if(coord.x === 1 && coord.y === 0) return "East";

    throw new Error("unreachable")
}

const oppositeExit = (exit: Exit): Exit => {
    switch(exit){
        case "East": return "West";
        case "North": return "South";
        case "South": return "North";
        case "West": return "East";
    }
}

type OverworldTile = {
    exits: Coord[],
    worldMapCoord: Coord
}

export type OverworldMapTile = {
    mapId: string,
    worldMapCoord: Coord
    exits: {direction: Exit, oppositeExit: Exit, directionCoord: Coord, toMapId: string}[]
}

const overworldMapBuilder = () => {
    const overworldMap: Record<string, OverworldTile> = {};

    return {
        testGet: () => overworldMap,
        getOverworldMap(){
            Object.values(overworldMap).forEach((tile) => this.updateExitsFromNewNeighbor(tile));
            return Object.values(overworldMap).reduce(
                (constructedBuilderMap, mapTile) => {
                    const mapId = `${mapTile.worldMapCoord.x}-${mapTile.worldMapCoord.y}`;
                    if(mapTile.exits.length === 0){
                        return constructedBuilderMap
                    }
                    this.clearNonConnectingExits(mapTile);
                    assert(mapTile.exits.length > 0, `Found a map tile that has no exits! ${mapId}`);
                    constructedBuilderMap[mapId] = {
                        mapId,
                        worldMapCoord: mapTile.worldMapCoord,
                        exits: mapTile.exits
                            .map((exit) => {
                            const realCoord = getRelativeCoordinate(mapTile.worldMapCoord, exit);
                            const toMapId = `${realCoord.x}-${realCoord.y}`;
                            assert(typeof overworldMap[toMapId] !== "undefined", `Found an exit that doesn't go anywhere: ${mapId}, ${toMapId}`);

                            return {
                                direction: coordToExit(exit),
                                directionCoord: exit,
                                oppositeExit: oppositeExit(coordToExit(exit)),
                                toMapId
                            }
                        })
                    }

                    return constructedBuilderMap;
                },
                {} as Record<string, OverworldMapTile>
            );
        },
        insertTile: (tile: OverworldTile) => {
            overworldMap[`${tile.worldMapCoord.x}-${tile.worldMapCoord.y}`] = tile
        },
        getTile: (x: number, y: number) => {
            return overworldMap[`${x}-${y}`];
        },
        updateExitsFromNewNeighbor: (tile: OverworldTile) => {
            for(const exit of tile.exits) {
                const neighbor = getRelativeCoordinate(tile.worldMapCoord, exit);
                const existingTile = overworldMap[`${neighbor.x}-${neighbor.y}`];
                if(existingTile){
                    const existingExits = new Set(existingTile.exits.map((exit) => coordToExit(exit)))
                    const oppositeExitCoord = oppositeExit(coordToExit(exit));
                    existingExits.add(oppositeExitCoord);
                    existingTile.exits = Array.from(existingExits).map(exitToCoord);
                }
            }
        },
        clearNonConnectingExits: (tile: OverworldTile) => {
            tile.exits = tile.exits.filter((exitCoord) => {
                const exitTo = getRelativeCoordinate(tile.worldMapCoord, exitCoord);
                return typeof overworldMap[`${exitTo.x}-${exitTo.y}`] !== "undefined"
            });
            overworldMap[`${tile.worldMapCoord.x}-${tile.worldMapCoord.y}`] = tile
        },
    }
}

const getRandomExits = () => {
    const x = Array(4).fill(0).map(() => Random.n(1, 4)).filter((x) => x > 0);
    const y = Array.from(new Set(x)).map((n) => exitToCoord(EXITS[n-1]));
    return y
}

const randomTile = (x: number, y: number) => ({
    worldMapCoord: {x, y},
    exits: getRandomExits()
});

export const getRelativeCoordinate = (lastCoord: Coord, direction: Coord) => ({
    x: lastCoord.x + direction.x,
    y: lastCoord.y + direction.y
})

export const generateOverWorld = (nTiles: number) => {
    let stack = [randomTile(0, 0)];
    const visited = new Set();
    const overworld = overworldMapBuilder();

    while(nTiles !== 0){
        const nextTile = stack.shift();
        if(visited.has(`${nextTile.worldMapCoord.x}-${nextTile.worldMapCoord.y}`)) continue;
        visited.add(`${nextTile.worldMapCoord.x}-${nextTile.worldMapCoord.y}`);
        overworld.insertTile(nextTile);
        overworld.updateExitsFromNewNeighbor(nextTile);
        nextTile.exits.forEach((exit) => {
            const nextPosition = getRelativeCoordinate(nextTile.worldMapCoord, exit);
            const id = `${nextPosition.x}-${nextPosition.y}`
            if(visited.has(id)) return;

            const tile = randomTile(nextPosition.x, nextPosition.y);
            const nextExits = new Set([...tile.exits.map(coordToExit), oppositeExit(coordToExit(exit))]);
            tile.exits  = Array.from(nextExits).map(exitToCoord)
            stack.push(tile);
        })
        nTiles -=1;
    }

    return overworld.getOverworldMap();
}