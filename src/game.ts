/// <reference path="GameStates/Init.ts"/>

class Game {
	public static canvasWidth = 1600
	public static canvasHeight = 896

	private static instance: Game
	public static PIXI: any
	public static BUMP: any = new Bump(PIXI)

	public static tiledMap: any
	public static bullets: Array<Bullet> = []
	public static sounds: any = {}
	public static walls: Array<PIXI.extras.AnimatedSprite> = []
	public static emitters: Array<any> = []
	public static containers: Array<PIXI.Container> = []
	public static entities: Array<Entity> = []

	public static state: GameState
    public static screen: UIScreen

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

		// Add tiledMap
		Game.tiledMap = new PIXI.Container()
		Game.PIXI.stage.addChild(Game.tiledMap);

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

	public static removeEntity(e: Entity): void {
		let index = Game.entities.indexOf(e)
		if (index !== -1) {
			Game.entities.splice(index, 1);
		}
	}

	public static get player(): any {
		for (let e of Game.entities) {
			if (e instanceof Player) {
				return e as Player
			}
		}
		return null
	}
}
