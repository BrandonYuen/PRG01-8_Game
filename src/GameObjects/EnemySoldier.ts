/// <reference path="../Strategies/MovingState.ts"/>
/// <reference path="Entity.ts"/>
class EnemySoldier extends Entity {

	// Options
	public baseSpeed: number = 0.25

	constructor(stage: PIXI.Container, texture: PIXI.Texture) {
		super(stage, texture)

		this.gun = new Pistol(this)
		this.gun.visionLine.visible = false

		// Position
		this.sprite.x = Game.canvasWidth - 300
		this.sprite.y = Game.canvasHeight / 2
		this.sprite.anchor.x = 0.5
		this.sprite.anchor.y = 0.5
    }
    
    public update(): void {
		super.update()
		this.updateAim()

		let randomNumber = Math.random() * 100 
		if (randomNumber < 2) {
			this.shoot()
		}
	}

	private shoot(){  
		if (this.gun instanceof Gun) {
			this.gun.shoot()
			if (this.gun.ammo <= 0) this.gun.reload()
		}
	}
	
	private updateAim(): void {
		let angle = Util.rotateToPoint(
			Game.entities[0].sprite.x, 
			Game.entities[0].sprite.y, 
			this.sprite.x, 
			this.sprite.y
		)

		this.sprite.rotation = Util.toRadiant(Util.correctDegrees(Util.toDegrees(angle) - 1))
	}
}