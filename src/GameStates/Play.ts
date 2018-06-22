class Play implements GameState {

    constructor() {
		// Load next map
		MapLoader.loadNextMap()
	}

    public update(): void {

		// Update all bullets
		for (let b of Game.bullets) {
			b.update()
		}

		// Update all emitters
		for (let e of Game.emitters) {
			e.update()
		}

		// Update all emitters
		for (let g of Game.gameObjects) {
			g.update()
		}

		// If all enemies dead, go to complete gamestate
    }
}