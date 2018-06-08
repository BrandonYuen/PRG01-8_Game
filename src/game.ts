
class Game {
	public static canvasWidth = 1600
	public static canvasHeigth = 896

	private static instance: Game
	public static PIXI: any
	public static BUMP: any = new Bump(PIXI)
	public static tiledMap: any
	private player: Player
	public static bullets: Array<Bullet> = []
	public static sounds: any = {}

	public static walls: Array<PIXI.extras.AnimatedSprite> = []

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

		// Add tiledMap
		Game.tiledMap = new PIXI.Container()
		Game.PIXI.stage.addChild(Game.tiledMap);

		// Add player
		this.player = new Player(Game.PIXI.stage)

		// Load textures
		PIXI.loader
			.add('./images/player/manBlue_gun.png')
			.add('./images/particles/Fire.png')
			.add('./images/particles/particle.png')
			.add('./maps/01_empty.tmx')
			.add('./maps/01_intro.tmx')
			.load(() => this.onLoaderComplete())

		// Load sounds
		Game.sounds.pistol1 = new Howl({
			src: ['./sounds/pistolShot1.mp3'],
			volume: 0.5,
			preload: true
		})
	}

	private onLoaderComplete(): void {

		// Add tiled map
		Game.tiledMap.addChild(new PIXI.extras.TiledMap("./maps/01_intro.tmx"));

		// Save all walls to alias
		for (let w of Game.tiledMap.children[0].children[2].children) {
			Game.walls.push(w)
		}
		// Update player texture
		this.player.updateTexture(PIXI.loader.resources['./images/player/manBlue_gun.png'].texture)

		// Start gameloop
		requestAnimationFrame(() => this.gameLoop())
	}

	private gameLoop(): void {
		// Update player
		this.player.update()

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
