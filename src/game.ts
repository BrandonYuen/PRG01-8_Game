class Game {
	public static canvasWidth = 1280
	public static canvasHeigth = 768

	private static instance: Game
	public static PIXI: any
	private background: GameObject
	private player: Player
	public static bullets: Array<Bullet> = []
	public static sounds: any = {}
	public objects: Array<GameObject> = []

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

		// Add background
		this.background = new GameObject(Game.PIXI.stage)

		// Add player
		this.player = new Player(Game.PIXI.stage)

		// And add them to objects array
		this.objects.push(this.background, this.player)

		// Load textures
		Game.PIXI.loader
			.add('./images/level/level1.png')
			.add('./images/player/manBlue_gun.png')
			.add('./images/particles/Fire.png')
			.add('./images/particles/particle.png')
			.load(() => this.onLoaderComplete())

		// Load sounds
		Game.sounds.pistol1 = new Howl({
			src: ['./sounds/pistolShot1.mp3'],
			volume: 0.5,
			preload: true
		})
	}

	private onLoaderComplete(): void {
		// Update background texture
		this.background.updateTexture(Game.PIXI.loader.resources["./images/level/level1.png"].texture)

		// Update player texture
		this.player.updateTexture(Game.PIXI.loader.resources['./images/player/manBlue_gun.png'].texture)

		// Start gameloop
		requestAnimationFrame(() => this.gameLoop())
	}

	private gameLoop(): void {
		// Update all game objects
		for (let o of this.objects) {
			o.update()
		}

		// Update all bullets
		for (let b of Game.bullets) {
			b.update()
		}

		// Render stage
		Game.PIXI.renderer.render(Game.PIXI.stage)

		requestAnimationFrame(() => this.gameLoop())
	}

	public static removeBullet(b: Bullet): void {
		Game.PIXI.stage.removeChild(b)
		let index: number = Game.bullets.indexOf(b);
		if (index !== -1) {
			Game.bullets.splice(index, 1);
		}      
	}
}

window.addEventListener("load", () => {
	Game.getInstance()
})
