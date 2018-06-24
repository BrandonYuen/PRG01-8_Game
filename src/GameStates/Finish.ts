class Finish implements GameState {
    constructor() {
        //TODO: Place level complete screen with score
        Game.screen = new FinishScreen()
    }

    public update(): void {

    }
}