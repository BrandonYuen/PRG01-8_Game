class Game {
	public static canvasWidth = 1280
	public static canvasHeigth = 768

	private static instance: Game

	public static PIXI: any
	public static JSON:any

	private background = new PIXI.Sprite()
	private player: Player
	public static bullets: Array<PIXI.Graphics>

	public static getInstance() {
		if (!Game.instance) {
			Game.instance = new Game()
		}
		return Game.instance
	}

	constructor() {
		Game.PIXI = new PIXI.Application({ width: Game.canvasWidth, height: Game.canvasHeigth })
		Game.PIXI.stage.interactive = true
		document.body.appendChild(Game.PIXI.view)

		// Add empty properties
		Game.bullets = []

		// Add background
		Game.PIXI.stage.addChild(this.background)

		// Add player
		this.player = new Player(Game.PIXI.stage)

		// Load textures
		Game.PIXI.loader
			.add('./images/level/level1.png')
			.add('./images/player/manBlue_gun.png')
			.add('./images/particles/Fire.png')
			.add('./images/particles/particle.png')
			.load(() => this.setup())
	}

	// Run setup when textures are loaded
	private setup(): void {
		// Update background texture
		this.background.texture = Game.PIXI.loader.resources["./images/level/level1.png"].texture

		// Update player texture
		this.player.updateTexture(Game.PIXI.loader.resources['./images/player/manBlue_gun.png'].texture)

		// Start gameloop
		requestAnimationFrame(() => this.gameLoop())
	}

	private gameLoop(): void {
		// Update player
		this.player.update()
		
		for(var b=Game.bullets.length-1;b>=0;b--){
			Game.bullets[b].position.x += Math.cos(Game.bullets[b].rotation)*20;
			Game.bullets[b].position.y += Math.sin(Game.bullets[b].rotation)*20;
		}

		// Render stage
		Game.PIXI.renderer.render(Game.PIXI.stage)

		requestAnimationFrame(() => this.gameLoop())
	}
}

window.addEventListener("load", () => {
	Game.getInstance()
})
