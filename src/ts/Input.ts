const ut = (window as any).ut;

/**
 * Single object that receives keypresses from the player and
 * executes actions based on them.
 */

type Mode = "TITLE" | "MOVEMENT" | "INVENTORY" | "SELECT_DIRECTION";

type InputObject = {mode?: Mode} & Record<string, any>;

const inventoryInputManager = (game) => {
	let selectionPane = false;
	let outerSelect = 0;
	let selectionIdx = 0;
	let equippedWeapon = null;
	let equippedArmor = null;

	const exitInventory = (): Mode => {
		game.display.hideInventory();
		return 'MOVEMENT';
	}
	
	return {
		getEquipped: () => [equippedWeapon, equippedArmor],
		isEquipped: (item) => {
			return item === equippedWeapon || item === equippedArmor
		},
		selectionPane: () => selectionPane,
		selectionIdx: () => selectionIdx,
		screenItems: () => outerSelect === 0 ? game.player.getConsumables() : outerSelect === 1 ? game.player.getEquipment() : game.display.textBox.getLastMessages(20),
		selectedItem(){
			const items = this.screenItems();
			return items[selectionIdx]
		},
		outerSelectionIdx: () => outerSelect,
		manageInventory(k): Mode {
			if(selectionPane) {
				return this.manageNestedInventory(k)
			}
			switch (k) {
				case ut.KEY_ESCAPE: return exitInventory();
				case ut.KEY_S: {
					outerSelect = Math.min(outerSelect + 1, 4);
					break;
				}
				case ut.KEY_W: {
					outerSelect = Math.max(outerSelect - 1, 0);
					break
				}
				case ut.KEY_D: {
					if(outerSelect > 1 && outerSelect !== 4) break;
					selectionPane = true;
					selectionIdx = 0;
					break
				}
			}
			return "INVENTORY";
		},
		manageNestedInventory(k): Mode {
			if (k === ut.KEY_ESCAPE){
				return exitInventory();
			} else if (k === ut.KEY_W){
				selectionIdx = Math.max(selectionIdx - 1, 0);
			} else if (k === ut.KEY_S){
				selectionIdx = Math.min(selectionIdx + 1, this.screenItems().length-1);
			}
			else if (k === ut.KEY_A) {
				selectionIdx = 0;
				selectionPane = false;
			}
			else if (k === ut.KEY_ENTER ){
				if(outerSelect === 4) return "INVENTORY";
				const selectedItem = this.selectedItem();

				if(outerSelect === 1){
					switch (selectedItem.def.type.name){
						case "Weapon": {
							game.player.weapon = selectedItem.def.weaponStats
							equippedWeapon = selectedItem
							break;
						}
						case "Armor": {
							game.player.armorModifier = selectedItem.def.armorModifier
							equippedArmor = selectedItem
							break;
						}
					}
					return "INVENTORY";
				}


				if (selectedItem.def.targetted || selectedItem.def.type.targetted){
					game.display.message("Select a direction.");
					game.display.hideInventory();
					return 'SELECT_DIRECTION';
				} else {
					game.player.tryUse(selectedItem);
					game.display.hideInventory();
					return 'MOVEMENT';
				}
			}
			return "INVENTORY"
		}
	}
}

export default {
	inputEnabled: true,
	init: function(this: InputObject, game){
		this.inventoryManager = inventoryInputManager(game);
		this.game = game;
		ut.initInput(this.onKeyDown.bind(this));
		this.mode = 'TITLE';
	},
	movedir: { x: 0, y: 0 },
	onKeyDown: function(k){
		if (!this.inputEnabled)
			return;
		if (this.mode === 'TITLE'){
			if (k === ut.KEY_SPACE){
				this.game.newGame();
				this.mode = 'MOVEMENT';
			}
		} else if (this.mode === 'MOVEMENT'){
			if(k === ut.KEY_1){
				this.game.endGame("WIN");
			}
			if(k === ut.KEY_2) {
				this.game.endGame("LOSE");
			}

			if (k === ut.KEY_I){
				if (this.game.player.items.length === 0){
					this.game.display.message("You don't have any items");
					return;
				}
				this.mode = 'INVENTORY';
				this.selectedItemIndex = 0;
				this.selectedItem = this.game.player.items[0];
				this.game.display.showInventory();
				return;
			}
			this.movedir.x = 0;
			this.movedir.y = 0;
			if ( k === ut.KEY_A) {
				this.movedir.x = -1;
			}
			if ( k === ut.KEY_D) {
				this.movedir.x = 1;
			}
			if (k === ut.KEY_W) {
				this.movedir.y = -1;
			}
			if (k === ut.KEY_S) {
				this.movedir.y = 1;
			}
			if (this.movedir.x === 0 && this.movedir.y === 0){
				return;
			}
			this.inputEnabled = false;
			this.game.player.tryMove(this.movedir);
		} else if (this.mode === 'INVENTORY'){
			this.mode = this.inventoryManager.manageInventory(k);
			if(this.mode === "INVENTORY"){
				this.game.display.showInventory();
			}
		} else if (this.mode === 'SELECT_DIRECTION'){
			if (k === ut.KEY_ESCAPE){
				this.mode = 'INVENTORY';
				this.game.display.showInventory();
				this.game.display.message("Cancelled.");
				return;
			}
			this.movedir.x = 0;
			this.movedir.y = 0;
			if (k === ut.KEY_LEFT || k === ut.KEY_H) this.movedir.x = -1;
			else if (k === ut.KEY_RIGHT || k === ut.KEY_L) this.movedir.x = 1;
			else if (k === ut.KEY_UP || k === ut.KEY_K) this.movedir.y = -1;
			else if (k === ut.KEY_DOWN || k === ut.KEY_J) this.movedir.y = 1;
			else return;
			this.game.player.tryUse(this.inventoryManager.selectedItem(), this.movedir.x, this.movedir.y);
			this.mode = 'MOVEMENT';
		}
	}
}