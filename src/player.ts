/// <reference path="gameObject.ts"/>

class Player extends GameObject {
	private left: boolean = false
	private right: boolean = false
	private up: boolean = false
	private down: boolean = false
	private x_speed: number = 0
	private y_speed: number = 0
	public gunShotContainer = new PIXI.Container
	public gunShotEmitter: any

	// Options
	private gunOffset = {
		angle: 19.20,
		distance: 27
	}
	private speed: number = 0.25


	constructor(stage: PIXI.Container) {
		super(stage)

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
		this.sprite.y = Game.canvasHeigth / 2;
		this.sprite.anchor.x = 0.5;  
		this.sprite.anchor.y = 0.5;
	}

	public updateTexture(texture: any): void {
		super.updateTexture(texture)

		// Create gunshot emitter when textures are loaded and updated
		this.gunShotEmitter = new gunShotEmitter(this.gunShotContainer)
		
	}

	public update(): void {
		// Update gunshot container's location to match pistol barrel
		this.gunShotContainer.x = this.sprite.x+Math.cos(this.sprite.rotation+this.gunOffset.angle)*this.gunOffset.distance
		this.gunShotContainer.y = this.sprite.y+Math.sin(this.sprite.rotation+this.gunOffset.angle)*this.gunOffset.distance
		this.gunShotContainer.rotation = this.sprite.rotation - 30
		this.gunShotEmitter.update()
		this.updateMovement()
		this.updateAim()
	}

	private shoot(){  
		let rotation = Util.rotateToPoint(
			Game.PIXI.renderer.plugins.interaction.mouse.global.x, 
			Game.PIXI.renderer.plugins.interaction.mouse.global.y, 
			this.gunShotContainer.x, 
			this.gunShotContainer.y
		)

		new Bullet(this.gunShotContainer, {
			rotation: rotation,
			speed: 30
		})

		// Start a gunshot animation
		this.gunShotEmitter.start(100)

		// Start sound effect
		Game.sounds.pistol1.play()
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

	private updateMovement(): void {
		let actualSpeed = this.speed

		// Reduce speed if moving in multiple directions
		if ((this.right && this.down) || (this.right && this.up) || (this.left && this.down) || (this.left && this.up)) {
			actualSpeed = actualSpeed * 0.8
			actualSpeed = actualSpeed * 0.8
		}

		if (this.up) {
			this.y_speed -= actualSpeed
		}

		if (this.left) {
			this.x_speed -= actualSpeed
		}

		if (this.right) {
			this.x_speed += actualSpeed
		}

		if (this.down) {
			this.y_speed += actualSpeed
		}
		this.sprite.x += this.x_speed
		this.sprite.y += this.y_speed
		this.x_speed *= 0.9 // friction
		this.y_speed *= 0.9 // friction
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
