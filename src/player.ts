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
		this.sprite.y = Game.canvasHeigth / 2;
		this.sprite.anchor.x = 0.5;  
		this.sprite.anchor.y = 0.5;
	}

	public updateTexture(texture: any): void {
		super.updateTexture(texture)

		// Create gunshot emitter when textures are loaded and updated
		this.gunShotEmitter = new gunShotEmitter(this.gunShotContainer,
			[
				Game.PIXI.loader.resources['./images/particles/particle.png'].texture,
				Game.PIXI.loader.resources['./images/particles/Fire.png'].texture
			],
			{
				alpha: {
					start: 0.62,
					end: 0
				},
				scale: {
					start: 0.2,
					end: 0.001,
					minimumScaleMultiplier: 0.68
				},
				color: {
					start: '#fff185',
					end: '#ff622c'
				},
				speed: {
					start: 100,
					end: 1,
					minimumSpeedMultiplier: 1.11
				},
				acceleration: {
					x: 0,
					y: 0
				},
				maxSpeed: 1,
				startRotation: {
					min: 250,
					max: 300
				},
				noRotation: false,
				rotationSpeed: {
					min: 0,
					max: 0
				},
				lifetime: {
					min: 0.01,
					max: 0.5
				},
				blendMode: 'color_dodge',
				frequency: 0.001,
				emitterLifetime: 0,
				maxParticles: 100,
				pos: {
					x: 0,
					y: 0
				},
				addAtBack: false,
				spawnType: 'circle',
				spawnCircle: {
					x: 0,
					y: 0,
					r: 0.01
				}
			}
		)
	}

	public update(): void {
		// Update gunshot container's location to match pistol
		let offset = {
			x: 20,
			y: 20
		}

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

		let bullet = new PIXI.Graphics();  
		bullet.beginFill(0x123456);  
		bullet.drawRect(0,0,20,5);  
		bullet.endFill();  
		bullet.position.x = this.gunShotContainer.x;
		bullet.position.y = this.gunShotContainer.y;
		bullet.rotation = rotation;

		Game.PIXI.stage.addChild(bullet);
		Game.bullets.push(bullet);

		// Spawn gunshot particle
		this.gunShotEmitter.start(100)
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
		if (this.up) {
			this.y_speed -= 0.13
		}

		if (this.left) {
			this.x_speed -= 0.13
		}

		if (this.right) {
			this.x_speed += 0.13
		}

		if (this.down) {
			this.y_speed += 0.13
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
