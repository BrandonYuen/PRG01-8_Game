abstract class Gun implements Observer {
    public maxAmmo:number = 0
    public ammo:number = 0
	public gunShotContainer = new PIXI.Container
    protected gunShotEmitter: any
    protected subject:Entity
    protected accuracy:number = 1
    protected shootingSpread:number = 0
	protected shootingSound:any
    
    constructor(subject:Entity) {
		this.subject = subject
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

    public update(): void {
        this.gunShotEmitter.update()
    }

    public shoot(targetPosition:any): void {
        if (this.ammo <= 0) {
            Game.sounds.emptyMagazine.play()
            return
        }

		// Start sound effect
        this.shootingSound.play()

        this.ammo--
        
        // Calculate perfect angle to shoot the target
		let perfectAngle = Util.rotateToPoint(
			targetPosition.x, 
			targetPosition.y, 
			this.gunShotContainer.x, 
			this.gunShotContainer.y
		)

		// Randomize the angle based on the shooting spread of the gun
		let randomAngleAddition = Math.floor(Math.random() * this.shootingSpread) - this.shootingSpread/2
		let randomAngle = Util.toRadiant(Util.correctDegrees(Util.toDegrees(perfectAngle) + randomAngleAddition))

		new Bullet(this.gunShotContainer, {
			rotation: randomAngle,
			speed: 30
		})

		// Start a gunshot animation
		this.gunShotEmitter.start(100)
    }
}