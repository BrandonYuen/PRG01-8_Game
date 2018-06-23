class Complete implements GameState {
    constructor() {
        MapLoader.unloadCurrentMap()

        //TODO: Place level complete screen with score
        Game.screen = new LevelCompleteScreen()
    }

    public update(): void {

    }
}