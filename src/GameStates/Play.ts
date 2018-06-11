class Play implements GameState {
    constructor() {

    }

    public update(): void {

		// Update all entities
		for (let e of Game.entities) {
			e.update()
		}

		// Update all bullets
		for (let b of Game.bullets) {
			b.update()
		}

		// Update all emitters
		for (let e of Game.emitters) {
			e.update()
		}
    }
}