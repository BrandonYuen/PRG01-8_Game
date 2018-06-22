/// <reference path="../Strategies/MovingState.ts"/>
/// <reference path="Entity.ts"/>

class Player extends Entity {
	private mouseDown:boolean = false

	// Options
	protected _baseSpeed: number = 0.25
    protected _maxHealth:number = 150

	constructor(stage: PIXI.Container, texture: PIXI.Texture) {
		super(stage, texture)

		// Add keyboard listeners
		window.addEventListener("keydown", (e: KeyboardEvent) => this.keyListener(e))
		window.addEventListener("keyup", (e: KeyboardEvent) => this.keyListener(e))
		Game.PIXI.stage.on("mousedown", (e: MouseEvent) => this.mouseListener(e))
		Game.PIXI.stage.on("mouseup", (e: MouseEvent) => this.mouseListener(e))

		// Position
		this.sprite.x = 300
		this.sprite.y = Game.canvasHeight / 2
		this.sprite.anchor.x = 0.5
		this.sprite.anchor.y = 0.5

		// Update custom health
		this.health = this._maxHealth

		// Remove gun visionline
		this.gun.visionLine.visible = false
	}

	// Override
	public set gun(gun: Gun) {
		this._gun.remove()
		this._gun = gun
		this.gun.visionLine.visible = false
	}
	
	public get gun(): Gun {
		return this._gun
	}

	public update(): void {
		super.update()
		this.updateAim()
		this.pickupCheck()

		if (this.mouseDown) {
			this.shoot()

			if (this.gun instanceof Pistol) {
				this.mouseDown = false
			}
		}
	}

	private pickupCheck(): void {
		// Check if player is colloding with Item
        for (let i of Game.gameObjects) {
            if (i instanceof Item) {
                if (Game.BUMP.hit(this.sprite, i.sprite)) {
                    // Player picks up this item
                    if (i.type == 'Pistol') {
						this.gun = new Pistol(this) 
						i.kill()
                    } else if (i.type == 'MachineGun') {
						this.gun = new MachineGun(this)
						i.kill()
					}
                }
            }
        }
	}

	private shoot(){  
		if (this.gun) {
			this.gun.shoot()
		}
	}

	private reloadGun() {  
		if (this.gun) {
			this.gun.reload()
		}
	}

	private mouseListener(event: MouseEvent): void {
		this.mouseDown = (event.type == "mousedown") ? true : false
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

	public kill(): void {
		super.kill()
	}

}
