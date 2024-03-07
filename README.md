# Legends of the Hidden Cheese

## Game loop
1. Get Loot
2. Kill Monsters
3. Gain XP
4. Level Up
5. Goto 1

## Game Goal

Collect 3 three keys, to unlock 3 chests, to get 3 aged cheeses

## Required Systems for a Functioning Game

* Combat
  * You have a weapon equipped, and move into an enemy square
  * Melee-only
  * (Stretch goal): Magic? Ranged?
* Leveling System
  * Steal from pathfinder
* Equipment system
  * Equip Weapon
* Map Generation
  * Steal some of the map gen algos that I've already written for a different project
## Required Menus For a Functioning Game

* Inventory
* Instructions / Controls
* Equipment

### Nice To Haves:

* Event Log

## Game Screens

- [x] Title
  - Start New Game
- [x] Gameplay
    - The Actual Game
    - Menu Screen Overlay
- [x] Game Over
    - "You Died" Start Again
    - "Game Won" Start Again

Nice to haves:

- [ ] See Instructions / Controls
- [ ] Stretch Goal: Continue Game (assumes a save system)

## Milestones

### Game Screen Loop

- [x] A complete functioning screen loop
  - [x] Start Screen
  - [x] Game Screen
  - [x] Game Over Screen
    - [x] You Won
    - [x] You Died


### Inventory Management

As a player of the game, I want a menu screen that allows me to navigate inventory and equipment.
I expect to use items from my inventory to buff or gain health, and equip items from my equipment menu
to bash monsters with.

- [x] Top Level Inventory Management Screen
  - [x] Select Text
    - Instructions
    - Inventory
    - Equipment
    - Stats
- [x] Subscreens
  - [x] Inventory
  - [x] Equipment
  - [x] Controls
  - [x] Stats

Expectations:

Select a top-level sub screen, navigate subscreen. Drop / Use / Equip items on sub screen. With the
exception of the controls subscreen which is not interactive.

Things:
- [x] Scrolling is Required
- [ ] Item Descriptions are Required

# BREAK TIEM 
### Combat System

As a player of the game, I want to bash monsters. I expect combat to be straightforward, and to get feedback
on how I'm doing. I would like to see my current hit points in relation to the total, and I would
like to have some indication for how much the monster has.

- [x] The ability to deal damage to NPCs
  - [x] Equipment modifies the damage
- [x] The ability to receive damage from NPCs
- [x] Visual indication of main characters hit points
- [x] Damage System
  - [x] Chance to hit
  - [x] Damage to deal

### Level Up System

- [x] There are xp thresholds per-level
  - [x] Static thresholds set in code
- [x] Gain xp from fighting NPCs
  - [x] The higher the level NPC, the more XP you gain

### Equipment System

- [x] Weapons improve chance to hit &/or damage dealt
- [x] Armor improves chance to dodge a hit

### Procedural Map Generation

As a player, I would like a rich and unique experience each time I play the game. This should materialize
as different maps, different layouts, different loot drops on each run.

- [x] A world that is randomly connected
- [x] Loot dropped throughout this world
- [x] Interesting looking maps that are randomly generated
  - [x] Biomes throughout the world
  - [x] Appropriate item placement in each biome
- [x] Sensible wandering monster encounters

### Bug Bash and QOL Edition


- [x] "Not being able to flee is a bummer."
  - [x] Currently, player is unable to flee from monsters. Bad game experience
  - [x] Fix: Make monsters slower
- [x] I don't know what I'm fighting until it's too late
  - Fix: display level ontop of monster
- [x] Text Log frequently overflows the container that it's in
  - [x] Fix: Maybe Log Rotation
  - [x] Made HUD a little teensy bit bigger
  - [x] QOL: Add event log to main menu
- [x] Biomes are totally random right now
  - [x] It's very easy to quickly wander into a high-level biome, which means certain death
  - [x] Balance problem: I can get a desert biome on the second screen and get a +15 armor
  - [x] Fix: assign biomes based on layers from 0-0 outward increasing in biome difficulty
- [ ] The start of the game is super duper random.
  - [ ] Fix: have a deterministic starting tile. One rat, one weapon.
- [x] Death Counter.
- [x] Bug: sometimes for reasons unknown player gets sent to edge
  - ???
- [x] Bug: enemies can be spawned on edge tiles, which leads to surprise deaths
  - [x] Do not spawn things on the edge ever
- [x] Weapons are a little bit boring
  - [x] Axes and daggers should be rebalanced to do 2d10 and 2d4 respectively
  - [x] Base sword accuracy is plus 1 
  - [x] Base Dagger accuracy is plus 1