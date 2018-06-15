/// <reference path="Gun.ts"/>

class MachineGun extends Gun {
    public textureForPlayer:PIXI.Texture = PIXI.loader.resources['./images/sprites/player_machinegun.png'].texture
    public textureForEnemy:PIXI.Texture = PIXI.loader.resources['./images/sprites/soldier_machinegun.png'].texture
    public _maxAmmo:number = 30
    public ammo:number = this.maxAmmo
    public _damage:number = 10
    public shootingDelay: number = 0.1
	protected reloadingTime: number = 4
    protected shootingSpread:number = 15 // The shooting spread (in degrees), this will be multiplied by the users speed
	protected minShootingSpread: number = 7
	private gunOffset = {
		angle: 19.20,
		distance: 27
    }

    constructor(subject:Entity) {
        super(subject)
        this.shootingSound = Game.sounds.machinegun[Math.round(Math.random() * 5)]
        this.reloadingSound = Game.sounds.pistolReload
        if (this.subject instanceof Player) {
            this.subject.sprite.texture = this.textureForPlayer
        } else if (this.subject instanceof EnemySoldier) {
            this.subject.sprite.texture = this.textureForEnemy
        }
    }

    public shoot() {
        super.shoot()
        this.shootingSound = Game.sounds.machinegun[Math.round(Math.random() * 5)]
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