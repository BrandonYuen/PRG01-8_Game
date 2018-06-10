/// <reference path="Walking.ts"/>
/// <reference path="Entity.ts"/>

class Player extends Entity {
	private static instance: Player
	public gunShotContainer = new PIXI.Container
	public gunShotEmitter: any
	public accuracy: number = 1

	// Options
	public baseSpeed: number = 0.25
	private gun:Gun = new Pistol(this)

	public static getInstance(stage: PIXI.Container, texture: PIXI.Texture) {
		if (!Player.instance) {
			Player.instance = new Player(stage, texture)
		}
		return Player.instance
	}

	private constructor(stage: PIXI.Container, texture: PIXI.Texture) {
		super(stage, texture)

		// Add keyboard listeners
		window.addEventListener("keydown", (e: KeyboardEvent) => this.keyListener(e))
		window.addEventListener("keyup", (e: KeyboardEvent) => this.keyListener(e))
		Game.PIXI.stage.on("mousedown", () => this.shoot())

		// Reset position
		this.resetPosition()

		// Add container for gunshot particle
		Game.PIXI.stage.addChild(this.gunShotContainer)
	}

	private resetPosition(): void {
		this.sprite.x = Game.canvasWidth / 2;
		this.sprite.y = Game.canvasHeight / 2;
		this.sprite.anchor.x = 0.5;  
		this.sprite.anchor.y = 0.5;
	}

	public update(): void {
		// Update all observers too
        for (let observer of this.observers) {
            observer.update()
        }
		this.updateAim()
	}

	private shoot(){  
		this.gun.shoot({x: Game.PIXI.renderer.plugins.interaction.mouse.global.x, y: Game.PIXI.renderer.plugins.interaction.mouse.global.y})
	}

	private keyListener(event: KeyboardEvent): void {
		let key_state: boolean = (event.type == "keydown") ? true : false

		switch (event.keyCode) {
			//W; walk up
			case 87:
				this.up = key_state
				break
			//S; Walk down
			case 83:
				this.down = key_state
				break
			//A; Walk left
			case 65:
				this.left = key_state
				break
			//D; Walk right
			case 68:
				this.right = key_state
				break
		}
	}

	private updateAim(): void {
		this.sprite.rotation = Util.rotateToPoint(
			Game.PIXI.renderer.plugins.interaction.mouse.global.x, 
			Game.PIXI.renderer.plugins.interaction.mouse.global.y, 
			this.sprite.x, 
			this.sprite.y
		)
	}

}
