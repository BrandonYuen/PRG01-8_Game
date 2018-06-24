class GameOver implements GameState {
    constructor() {
        //TODO: Place level complete screen with score
        Game.screen = new GameOverScreen()
    }

    public update(): void {

    }
}