/// <reference path="../Strategies/MovingState.ts"/>
/// <reference path="Entity.ts"/>
class EnemySoldier extends Entity {

	// Options
	protected _baseSpeed: number = 0.25

	constructor(stage: PIXI.Container, texture: PIXI.Texture, patrolDirection:string) {
		super(stage, texture, patrolDirection)

		this.gun = new Pistol(this)

		// Position
		this.sprite.x = Game.canvasWidth - 300
		this.sprite.y = Game.canvasHeight / 2
		this.sprite.anchor.x = 0.5
		this.sprite.anchor.y = 0.5
    }
    
    public update(): void {
		super.update()
		this.updateAim()

		// If enemy has gun
		if (this.gun instanceof Gun) {
			// If enemy has vision on player
			if (this.checkVisionOnPlayer()) {
				this.gun.visionLine.alpha = 0.7

				// Shoot at random
				let randomNumber = Math.random() * 100 
				if (randomNumber < 3) {
					this.shoot()
				}
			} else {
				this.gun.visionLine.alpha = 0.2
			}
		}
	}

	public checkVisionOnPlayer(): boolean {
		let vision = false
		let player = Game.player

		// If entity has no gun, return false because we can't check the visionline
		if (this.gun instanceof Gun && player != null) {

			// Create line object
			let visionLineEndPoint = this.gun.visionLine.getEndPoint()
			let barrelPosition = this.gun.getBarrelPosition()
			let line = {
				first: {
					x: barrelPosition.x,
					y: barrelPosition.y
				},
				second: {
					x: visionLineEndPoint.x,
					y: visionLineEndPoint.y
				}
			}

			// Check if collision with any walls
			let wallPoint = Util.checkCollisionLineWalls(line)
			if (wallPoint != false) {
				if (wallPoint.shortestDistance > math.distance([Game.player.sprite.x, Game.player.sprite.y], [this.sprite.x, this.sprite.y])) {
					return true
				}
			}
		}

		return false
	}

	private shoot(){  
		if (this.gun instanceof Gun) {
			if (this.gun.ammo <= 0) this.gun.reload()
			this.gun.shoot()
		}
	}
	
	private updateAim(): void {
		let angle = Util.rotateToPoint(
			Game.entities[0].sprite.x, 
			Game.entities[0].sprite.y, 
			this.sprite.x, 
			this.sprite.y
		)

		this.sprite.rotation = angle
	}
}