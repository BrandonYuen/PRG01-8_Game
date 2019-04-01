/// <reference path="../Strategies/MovingState.ts"/>
/// <reference path="Entity.ts"/>
class EnemySoldier extends Entity {
	public AI:AI

	// Options
	protected _baseSpeed: number = 0.25
	private pointsOnKill:number = 10
    protected _maxHealth:number = 50

	constructor(stage: PIXI.Container, texture: PIXI.Texture, patrolDirection:string) {
		super(stage, texture)

		this.AI = new Patrol(this, patrolDirection)
		this.gun = GunFactory.getGun('pistol', this)

		// Position
		this.sprite.x = Game.canvasWidth - 300
		this.sprite.y = Game.canvasHeight / 2
		this.sprite.anchor.x = 0.5
		this.sprite.anchor.y = 0.5
		
		// Add enemy count to game state
		Game.enemyCount++

		// Update custom health
		this.health = this._maxHealth
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
				if (wallPoint.shortestDistance > math.distance([Game.player.sprite.x, Game.player.sprite.y], [barrelPosition.x, barrelPosition.y])) {
					return true
				}
			}
		}

		return false
	}

	private shoot(){  
		if (this.gun instanceof Gun) {
			if (this.gun.ammo <= 0) this.gun.reload()
			if (this.gun instanceof Pistol) this.gun.shoot()
			if (this.gun instanceof MachineGun) {
				let counter = 0
				let shoot = () => {
					this.gun.shoot()
					counter++
					if (counter >= 3) {
						return
					}
					setTimeout(() => {
						shoot()
					}, 150)
				}
				shoot()
			}
		}
	}
	
	private updateAim(): void {
		let angle = Util.rotateToPoint(
			Game.gameObjects[0].sprite.x, 
			Game.gameObjects[0].sprite.y, 
			this.sprite.x, 
			this.sprite.y
		)

		this.sprite.rotation = angle
	}

	public kill(reason:string='none'): void {
		super.kill()
		if (Game.state instanceof Play) {
			if (reason != 'map') {
				Game.AddPoints(this.pointsOnKill)
			}
			Game.enemyCount--
		}
	}
}