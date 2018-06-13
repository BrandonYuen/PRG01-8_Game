/// <reference path="Gun.ts"/>

class Pistol extends Gun {
    public maxAmmo:number = 6
    public ammo:number = this.maxAmmo
    public damage:number = 10
    protected shootingSpread:number = 15 // The default spread of the gun TODO: base on the gun and movement of entity
	private gunOffset = {
		angle: 19.20,
		distance: 27
    }
    private visionLine = new PIXI.Graphics

    constructor(subject:Entity) {
        super(subject)
        this.shootingSound = Game.sounds.pistol1
        this.reloadingSound = Game.sounds.pistolReload
        
        // Draw vision line
        this.visionLine = new PIXI.Graphics
		this.visionLine.beginFill(0xd63600)
        this.visionLine.drawRect(0, 0, 1, Game.canvasWidth)
        this.visionLine.endFill()
        this.visionLine.alpha = 0.2
        Game.PIXI.stage.addChild(this.visionLine)
    }

    public shoot(targetPosition:any) {
        super.shoot(targetPosition)
    }

    public update(): void {
        super.update()
        
        if (this.subject instanceof Entity) {

        }
        let barrelPosition = this.getBarrelPosition()

        // Update visionline
        this.visionLine.position.x = barrelPosition.x
        this.visionLine.position.y = barrelPosition.y
        this.visionLine.rotation = Util.toRadiant(Util.toDegrees(this.subject.sprite.rotation) - 90)
        

        // Update location of the gunshot container at the barrel of this gun TODO: can be different for other entities / guns combinations
		this.gunShotContainer.x = barrelPosition.x
		this.gunShotContainer.y = barrelPosition.y
		this.gunShotContainer.rotation = this.subject.sprite.rotation - 30
    }

    private getBarrelPosition(): any {
        return {
            x: this.subject.sprite.x+Math.cos(this.subject.sprite.rotation+this.gunOffset.angle)*this.gunOffset.distance,
            y: this.subject.sprite.y+Math.sin(this.subject.sprite.rotation+this.gunOffset.angle)*this.gunOffset.distance
        }
    }
}