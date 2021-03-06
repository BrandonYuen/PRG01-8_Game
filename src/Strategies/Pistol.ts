/// <reference path="Gun.ts"/>

class Pistol extends Gun {
    private textureForPlayer:PIXI.Texture = PIXI.loader.resources['./images/sprites/player_pistol.png'].texture
    private textureForEnemy:PIXI.Texture = PIXI.loader.resources['./images/sprites/soldier_pistol.png'].texture
    public _maxAmmo:number = 6
    public ammo:number = this.maxAmmo
    public _damage:number = 10
    public shootingDelay: number = 0.2
	protected reloadingTime: number = 2
    protected shootingSpread:number = 7 // The shooting spread (in degrees), this will be multiplied by the users speed
	private gunOffset = {
		angle: 19.20,
		distance: 27
    }

    constructor(subject:Entity) {
        super(subject)
        this.shootingSound = Game.sounds.pistol[Math.round(Math.random() * 1)]
        this.reloadingSound = Game.sounds.pistolReload
        if (this.subject instanceof Player) {
            this.subject.sprite.texture = this.textureForPlayer
        } else if (this.subject instanceof EnemySoldier) {
            this.subject.sprite.texture = this.textureForEnemy
        }
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