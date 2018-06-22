/// <reference path="GameStates/Init.ts"/>
/// <reference path="../dist/js/pixi-bump.js"/>

class Game {
	public static canvasWidth = 1600
	public static canvasHeight = 896

	private static instance: Game
	public static PIXI: any
	public static BUMP: any = new Bump(PIXI)

	public static tiledMapContainer: any = new PIXI.Container()
	public static bullets: Array<Bullet> = []
	public static sounds: any = {}
	public static walls: Array<PIXI.extras.AnimatedSprite> = []
	public static emitters: Array<any> = []
	public static containers: Array<PIXI.Container> = []
	public static gameObjects: Array<GameObject> = []

	public static state: GameState
	public static screen: UIScreen
	
	public static points: number = 0
	private static _enemyCount:number = 0
	
	public static set enemyCount(count:number) {
		console.log('setting enemy count to: ',count)
		Game._enemyCount = count
		if (count <= 0) {
			Game.state = new Complete()
		}
	}

	public static get enemyCount(): number {
		return Game._enemyCount
	}

	public static getInstance() {
		if (!Game.instance) {
			Game.instance = new Game()
		}
		return Game.instance
	}

	private constructor() {
		Game.PIXI = new PIXI.Application({ width: Game.canvasWidth, height: Game.canvasHeight })
		Game.PIXI.stage.interactive = true
		document.body.appendChild(Game.PIXI.view)

		// Add tiledMap container to stage
		Game.PIXI.stage.addChild(Game.tiledMapContainer);

		// Start gameLoop
		this.gameLoop()
	}

	private gameLoop(): void {
		// Update everything based on the gamestate
		if (Game.state != null) {
			Game.state.update()
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

	public static removeGameObject(e: GameObject): void {
		let index = Game.gameObjects.indexOf(e)
		if (index !== -1) {
			Game.gameObjects.splice(index, 1);
		}
	}

	public static removeWall(w: PIXI.extras.AnimatedSprite): void {
		let index = Game.walls.indexOf(w)
		if (index !== -1) {
			Game.walls.splice(index, 1);
		}
	}

	public static get player(): any {
		for (let e of Game.gameObjects) {
			if (e instanceof Player) {
				return e as Player
			}
		}
		return null
	}
}
