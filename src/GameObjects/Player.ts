/// <reference path="../Strategies/MovingState.ts"/>
/// <reference path="Entity.ts"/>

class Player extends Entity {
	private static instance: Player

	// Options
	public baseSpeed: number = 0.25

	public static getInstance(stage: PIXI.Container, texture: PIXI.Texture) {
		if (!Player.instance) {
			Player.instance = new Player(stage, texture)
		}
		return Player.instance
	}

	private constructor(stage: PIXI.Container, texture: PIXI.Texture) {
		super(stage, texture)

		this.gun = new Pistol(this)

		// Add keyboard listeners
		window.addEventListener("keydown", (e: KeyboardEvent) => this.keyListener(e))
		window.addEventListener("keyup", (e: KeyboardEvent) => this.keyListener(e))
		Game.PIXI.stage.on("mousedown", () => this.shoot())

		// Position
		this.sprite.x = 300
		this.sprite.y = Game.canvasHeight / 2
		this.sprite.anchor.x = 0.5
		this.sprite.anchor.y = 0.5
	}

	public update(): void {
		super.update()
		this.updateAim()
	}

	private shoot(){  
		if (this.gun instanceof Gun) {
			this.gun.shoot()
		}
	}

	private reloadGun() {  
		if (this.gun instanceof Gun) {
			this.gun.reload()
		}
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
			//R; Reload
			case 82:
				this.reloadGun()
				break
			//SHIFT; Run
			case 16:
				if (key_state) {
					this.movement.state = 'running'
				} else {
					this.movement.state = 'walking'
				}
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
