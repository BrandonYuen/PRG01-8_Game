class Game {
	public static canvasWidth = 1280;
	public static canvasHeigth = 768;

	private static instance: Game;
	public static PIXI: any;

	private background = new PIXI.Sprite()
	private player: Player

	public static getInstance() {
		if (!Game.instance) {
			Game.instance = new Game();
		}
		return Game.instance;
	}

	constructor() {
		Game.PIXI = new PIXI.Application({ width: Game.canvasWidth, height: Game.canvasHeigth });
		document.body.appendChild(Game.PIXI.view);

		// Add player
		this.player = new Player();

		// Load textures
		Game.PIXI.loader
			.add('./images/level/level1.png')
			.add('./images/player/manBlue_gun.png')
			.load(() => this.setup());
	}

	// Run setup when textures are loaded
	private setup(): void {
		// Add background
		this.background.texture = Game.PIXI.loader.resources["./images/level/level1.png"].texture
		Game.PIXI.stage.addChild(this.background);

		//Update player texture
		this.player.updateTexture(Game.PIXI.stage)

		// Start gameloop
		requestAnimationFrame(() => this.gameLoop());
	}

	private gameLoop(): void {
		this.player.update()

		// Render stage
		Game.PIXI.renderer.render(Game.PIXI.stage);

		requestAnimationFrame(() => this.gameLoop());
	}
}

window.addEventListener("load", () => {
	Game.getInstance()
})
