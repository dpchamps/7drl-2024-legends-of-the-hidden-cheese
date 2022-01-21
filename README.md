# jsrl
JavaScript Roguelike Boilerplate - The basics to start building your own

# What is this about
A very bare bones roguelike with a character based display with the following features

# Features
* Player can walk around
* Raycasting Field of View algorithm 
* Player can move between persistent levels
* Enemies move around chasing the player
* Player can pick up, drop and use items (including using items on a given direction)
* Player remember visited maps
* A simple Being class based on Races definitions, with random and follow player intents
* A simple Item class based on Item Type definitions
* Infrastructure for Level Generation
* Line wrap text boxes

# Online Demo
http://slashie.net/jsrl

# How to use
* `git clone git@github.com:slashman/jsrl.git`
* `cd jsrl`
* `rm -rf .git` (Delete .git folder)
* Create awesoem gaem

# Local Development Server

* `yarn install` or `npm install`
* `yarn start` or `npm start`
* Open your browser to `http://localhost:1234`

# Building Distribution
* `yarn run build` or `npm run build`
* Directory `dist` will contain the web directory you can serve

# Credits
Uses unicodetiles for IO - http://tapiov.net/unicodetiles.js/
