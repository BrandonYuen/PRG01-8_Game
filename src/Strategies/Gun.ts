abstract class Gun implements Observer {
    public _maxAmmo: number = 0
    public _ammo: number = 0
    public _damage: number = 0
    public shootingDelay: number = 0
	public gunShotContainer = new PIXI.Container
    protected gunShotEmitter: any
    public _subject: Entity
    protected accuracy: number = 1
	protected shootingSpread: number = 0
	protected minShootingSpread: number = 3
	protected shootingSound: any
	protected reloadingSound: any
	protected reloadingTime: number = 2
	private reloading: boolean = false
	private shooting: boolean = false
	private _visionLine = new VisionLine(this)
    
    constructor(subject:Entity) {
		this._subject = subject
		subject.registerObserver(this)

		// Add container for gunshot particle
		Game.PIXI.stage.addChild(this.gunShotContainer)

		// Create gunshot emitter
		this.gunShotEmitter = new Emitter(
			this.gunShotContainer,
			[
				PIXI.loader.resources['./images/particles/particle.png'].texture,
				PIXI.loader.resources['./images/particles/Fire.png'].texture
			],
			PIXI.loader.resources['./json/gunShot.json'].data
		)
	}

    public get damage(): number {
        return this._damage
    }

    public get maxAmmo(): number {
        return this._maxAmmo
    }

	public get subject(): Entity {
		return this._subject
	}

	public get visionLine(): VisionLine {
		return this._visionLine
	}

	public set ammo(ammo: number) {
		this._ammo = ammo
		this.updateAmmoBar()
	}

	public get ammo() {
		return this._ammo
	}
	
	abstract getBarrelPosition(): any

    public update(): void {
		this.gunShotEmitter.update()
		this.visionLine.update()
	}
	
	public reload(): void {
		if (!this.reloading && !this.shooting) {
			this.reloading = true
			if (this.subject instanceof Player) this.reloadingSound.play()
			this.subject.reloadBar.setText('RELOADING')
	
			setTimeout( () => {
				this.ammo = this.maxAmmo
				this.subject.reloadBar.setText('')
				this.reloading = false
			}, this.reloadingTime * 1000)
		}
	}

    public shoot(): void {
		if (this.reloading || this.shooting) {
			return
		} else if (this.ammo <= 0) {
			if (this.subject instanceof Player) Game.sounds.emptyMagazine.play()
            return
        } 

		// Start sound effect
        this.shootingSound.play()
		this.ammo--

		// Set pistol to shooting, to prevent spam (using a delay per shoot() action)
		this.shooting = true
	
		setTimeout( () => {
			this.shooting = false
		}, this.shootingDelay*1000)
        
		// Calculate perfect angle to shoot the target
		let perfectAngle = Util.rotateToPoint(
			this.subject.sprite.x + Math.cos(Util.toRadiant(Util.toDegrees(this.visionLine.rotation) + 95.5)) * 100, 
			this.subject.sprite.y + Math.sin(Util.toRadiant(Util.toDegrees(this.visionLine.rotation) + 95.5)) * 100, 
			this.gunShotContainer.x, 
			this.gunShotContainer.y
		)

		// Randomize the angle based on the shooting spread of the gun and movement speed of entity holding the gun
		let shootingSpread = this.minShootingSpread + this.shootingSpread * (this.subject.x_speed + this.subject.y_speed)
		let randomAngleAddition = Math.floor(Math.random() * shootingSpread) - shootingSpread/2
		let randomAngle = Util.toRadiant(Util.correctDegrees(Util.toDegrees(perfectAngle) + randomAngleAddition))

		new Bullet(this.gunShotContainer, {
			rotation: randomAngle,
			speed: 30,
			damage: this.damage,
			shooter: this.subject
		})

		// Start a gunshot animation
		this.gunShotEmitter.start(100)
	}
	
	public remove(): void {
		Game.PIXI.stage.removeChild(this.gunShotContainer)
		this.visionLine.remove()
		this.subject.gun = null
	}

	public updateAmmoBar(): void {
		this.subject.ammoBar.setText(this.ammo.toString()+'/'+this.maxAmmo.toString())
	}
}