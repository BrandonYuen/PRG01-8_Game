class Play implements GameState {

    constructor() {
		
		// Load next map
		MapLoader.loadNextMap()

		// Start times
		if (!Game.startTime) {
			Game.startTime = new Date()
		}
		Game.levelStartTime = new Date()

		Game.levelPoints = 0
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
    }
}