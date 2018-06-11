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

    constructor(subject:Entity) {
        super(subject)
        this.shootingSound = Game.sounds.pistol1
        this.reloadingSound = Game.sounds.pistolReload
    }

    public shoot(targetPosition:any) {
        super.shoot(targetPosition)
    }

    public update(): void {
        super.update()
        
        if (this.subject instanceof Entity) {

        }
        // Update location of the gunshot container at the barrel of this gun TODO: can be different for other entities / guns combinations
		this.gunShotContainer.x = this.subject.sprite.x+Math.cos(this.subject.sprite.rotation+this.gunOffset.angle)*this.gunOffset.distance
		this.gunShotContainer.y = this.subject.sprite.y+Math.sin(this.subject.sprite.rotation+this.gunOffset.angle)*this.gunOffset.distance
		this.gunShotContainer.rotation = this.subject.sprite.rotation - 30
    }
}