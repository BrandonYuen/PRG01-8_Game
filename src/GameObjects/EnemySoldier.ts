/// <reference path="../Strategies/Walking.ts"/>
/// <reference path="Entity.ts"/>
class EnemySoldier extends Entity {

	// Options
	public baseSpeed: number = 0.25

	constructor(stage: PIXI.Container, texture: PIXI.Texture) {
		super(stage, texture)

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
	}
	
	private updateAim(): void {

		// TODO: update aim use visionLine of GUN
	}
}