
class Game {
	public static canvasWidth = 1600
	public static canvasHeight = 896

	private static instance: Game
	public static PIXI: any
	public static BUMP: any = new Bump(PIXI)
	public static tiledMap: any
	private player: Player
	public static bullets: Array<Bullet> = []
	public static sounds: any = {}

	public static walls: Array<PIXI.extras.AnimatedSprite> = []

	public static emitters: Array<any> = []
	public static containers: Array<any> = []

	public static getInstance() {
		if (!Game.instance) {
			Game.instance = new Game()
		}
		return Game.instance
	}

	constructor() {
		Game.PIXI = new PIXI.Application({ width: Game.canvasWidth, height: Game.canvasHeight })
		Game.PIXI.stage.interactive = true
		document.body.appendChild(Game.PIXI.view)

		// Add tiledMap
		Game.tiledMap = new PIXI.Container()
		Game.PIXI.stage.addChild(Game.tiledMap);

		// Add player
		this.player = new Player(Game.PIXI.stage)

		// Load textures
		PIXI.loader
			// Images
			.add('./images/player/manBlue_gun.png')
			// Particles
			.add('./images/particles/Fire.png')
			.add('./images/particles/particle.png')
			// Json
			.add('./json/gunShot.json')
			.add('./json/bulletImpact.json')
			.add('./json/bulletTrail.json')
			// TileMaps
			.add('./maps/01_empty.tmx')
			.add('./maps/01_intro.tmx')
			.load(() => this.onLoaderComplete())

		// Load sounds
		Game.sounds.pistol1 = new Howl({
			src: ['./sounds/pistolShot1.mp3'],
			volume: 0.5,
			preload: true
		})
		Game.sounds.bulletImpact = []
		Game.sounds.bulletImpact[0] = new Howl({
			src: ['./sounds/bulletImpact1.wav'],
			volume: 1,
			preload: true
		})
		Game.sounds.bulletImpact[1] = new Howl({
			src: ['./sounds/bulletImpact2.wav'],
			volume: 1,
			preload: true
		})
		Game.sounds.bulletImpact[2] = new Howl({
			src: ['./sounds/bulletImpact3.wav'],
			volume: 1,
			preload: true
		})
		Game.sounds.glassBreak = new Howl({
			src: ['./sounds/glassBreak.wav'],
			volume: 1,
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

		// Update all emitters
		for (let e of Game.emitters) {
			e.update()
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

	public static removeEmitter(e: Emitter): void {
		let index = Game.emitters.indexOf(e)
		if (index !== -1) {
			Game.emitters.splice(index, 1);
		}
	}

	public static removeContainer(c: PIXI.Container): void {
		Game.PIXI.stage.removeChild(c)
		let index = Game.containers.indexOf(c)
		if (index !== -1) {
			Game.containers.splice(index, 1);
		}
	}
}

window.addEventListener("load", () => {
	Game.getInstance()
})
