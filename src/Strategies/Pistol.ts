/// <reference path="Gun.ts"/>

class Pistol extends Gun {
    public _maxAmmo:number = 6
    public ammo:number = this.maxAmmo
    public _damage:number = 10
    public shootingDelay: number = 0.2
	protected reloadingTime: number = 2
    protected shootingSpread:number = 10 // The shooting spread (in degrees), this will be multiplied by the users speed
	private gunOffset = {
		angle: 19.20,
		distance: 27
    }

    constructor(subject:Entity) {
        super(subject)
        this.shootingSound = Game.sounds.pistol1
        this.reloadingSound = Game.sounds.pistolReload
    }

    public shoot() {
        super.shoot()
    }

    public update(): void {
        super.update()
        let barrelPosition = this.getBarrelPosition()

        // Update location of the gunshot container at the barrel of this gun TODO: can be different for other entities / guns combinations
		this.gunShotContainer.x = barrelPosition.x
		this.gunShotContainer.y = barrelPosition.y
		this.gunShotContainer.rotation = this.subject.sprite.rotation - 30
    }

    public getBarrelPosition(): any {
        return {
            x: this.subject.sprite.x+Math.cos(this.subject.sprite.rotation+this.gunOffset.angle)*this.gunOffset.distance,
            y: this.subject.sprite.y+Math.sin(this.subject.sprite.rotation+this.gunOffset.angle)*this.gunOffset.distance
        }
    }
}