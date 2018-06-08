/// <reference path="GameObject.ts"/>
/// <reference path="Walking.ts"/>

class Player extends GameObject {
	private left: boolean = false
	private right: boolean = false
	private up: boolean = false
	private down: boolean = false
	private x_speed: number = 0
	private y_speed: number = 0
	public gunShotContainer = new PIXI.Container
	public gunShotEmitter: any
	private movement:Movement = new Walking(this)

	// Options
	private baseSpeed: number = 0.25
	private shootingSpread: number = 15 // The default spread of the gun TODO: base on the gun and movement of entity
	private gunOffset = {
		angle: 19.20,
		distance: 27
	}

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
		this.sprite.y = Game.canvasHeight / 2;
		this.sprite.anchor.x = 0.5;  
		this.sprite.anchor.y = 0.5;
	}

	public updateTexture(texture: any): void {
		super.updateTexture(texture)

		// Create gunshot emitter when textures are loaded and updated
		this.gunShotEmitter = new Emitter(
			this.gunShotContainer, 
			[
				PIXI.loader.resources['./images/particles/particle.png'].texture,
				PIXI.loader.resources['./images/particles/Fire.png'].texture
			],
			PIXI.loader.resources['./json/gunShot.json'].data
		)
		
	}

	public update(): void {
		// Update gunshot container's location to match pistol barrel
		this.gunShotContainer.x = this.sprite.x+Math.cos(this.sprite.rotation+this.gunOffset.angle)*this.gunOffset.distance
		this.gunShotContainer.y = this.sprite.y+Math.sin(this.sprite.rotation+this.gunOffset.angle)*this.gunOffset.distance
		this.gunShotContainer.rotation = this.sprite.rotation - 30
		this.gunShotEmitter.update()
		this.movement.move()
		this.updateAim()
	}

	private shoot(){  
		let perfectAngle = Util.rotateToPoint(
			Game.PIXI.renderer.plugins.interaction.mouse.global.x, 
			Game.PIXI.renderer.plugins.interaction.mouse.global.y, 
			this.gunShotContainer.x, 
			this.gunShotContainer.y
		)

		// Random angle of bullet based on entities shooting spread angle
		let randomAngleAddition = Math.floor(Math.random() * this.shootingSpread) - this.shootingSpread/2
		let randomAngle = Util.toRadiant(Util.correctDegrees(Util.toDegrees(perfectAngle) + randomAngleAddition))

		new Bullet(this.gunShotContainer, {
			rotation: randomAngle,
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

	private updateAim(): void {
		this.sprite.rotation = Util.rotateToPoint(
			Game.PIXI.renderer.plugins.interaction.mouse.global.x, 
			Game.PIXI.renderer.plugins.interaction.mouse.global.y, 
			this.sprite.x, 
			this.sprite.y
		)
	}

}
