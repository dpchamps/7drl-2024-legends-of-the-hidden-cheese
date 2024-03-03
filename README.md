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
* Map Generation
  * Steal some of the map gen algos that I've already written for a different project
* Leveling System
  * Steal from pathfinder
* Equipment system
  * Equip Weapon

## Required Menus For a Functioning Game

* Inventory
* Instructions / Controls
* Equipment

### Nice To Haves:

* Event Log

## Game Screens

- [x] Title
  - Start New Game
- [ ] Gameplay
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