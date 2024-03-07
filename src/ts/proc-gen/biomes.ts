import Tiles from "../data/Tiles.data";
import RacesData from "../data/Races.data";
import ItemsData from "../data/Items.data";
import Item from "../model/Item.class";
import {ItemRarity} from "./item-generator";

type T_Tile = typeof Tiles[keyof typeof Tiles];
type T_Race = typeof RacesData[keyof typeof RacesData];
type T_Item = typeof ItemsData[keyof typeof ItemsData];

export type Biome = {
    name: string,
    groundTile: T_Tile,
    edgeTile: T_Tile,
    decorations: T_Tile[],
    npcs: T_Race[],
    items: T_Item[],
    rarityDrops: ItemRarity[],
    levelRange: [number, number]
};

const createBiome = (biome: Biome): Biome => biome


export type BiomeTypes = keyof typeof Biomes;

export const Biomes = {
    Forest: createBiome({
        name: "Forest",
        groundTile: Tiles.GRASS,
        edgeTile: Tiles.BUSH,
        decorations: [
            Tiles.ForestTree,
            Tiles.ROCKS,
            Tiles.FLOWERS,
            Tiles.GRASS_FEATURE_ONE,
            Tiles.GRASS_FEATURE_TWO
        ],
        npcs: [
            RacesData.RAT,
        ],
        items: [
            ItemsData.IRON_SWORD,
            ItemsData.IRON_ARMOR,
            ItemsData.POTION_OF_HEALING
        ],
        rarityDrops: [
            "Common"
        ],
        levelRange: [1, 3]
    }),
    Desert: createBiome({
        name: "Desert",
        groundTile: Tiles.SAND_TERRAIN,
        edgeTile: Tiles.ROCKS,
        decorations: [
            Tiles.CACTUS_1,
            Tiles.CACTUS_2,
            Tiles.DEAD_TREE,
            Tiles.DESERT_MUSHROOM_ONE,
        ],
        npcs: [
            RacesData.TROLL
        ],
        items: [
            ItemsData.HEARTY_POTION_OF_HEALING,
            ItemsData.GOLDEN_SWORD
        ],
        rarityDrops: [
            "Uncommon",
            "Rare"
        ],
        levelRange: [10,20]
    }),
    Swamp: createBiome({
        name: "Swamp",
        groundTile: Tiles.SWAMP_TERRAIN,
        edgeTile: Tiles.PILLAR,
        decorations: [
            Tiles.SWAMP_BUSH,
            // Tiles.Stump,
            Tiles.BERRY_BUSH,
            Tiles.SWAMP_MUSHROOM_CLUSTER,
        ],
        npcs: [
            RacesData.RAT,
            RacesData.TROLL
        ],
        items: [
            ItemsData.POTION_OF_HEALING,
            ItemsData.HEARTY_POTION_OF_HEALING
        ],
        rarityDrops: [
            "Common",
            "Uncommon"
        ],
        levelRange: [5, 15]
    })
} as const;