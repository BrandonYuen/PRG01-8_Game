
class Bullet extends PIXI.Graphics {
    private speed = 1 // Default speed
    public maxLifetime = 150 //Max life time in frames (60 frames = 1 second)

    public lifeTime = 0

	constructor(gunShotContainer: PIXI.Container, attributes: any) {
        super()
        
        // Draw shape
		this.beginFill(0x123456)
		this.drawRect(0, 0, 10, 3)
        this.endFill(); 
        
        // Spawn position
		this.position.x = gunShotContainer.x
        this.position.y = gunShotContainer.y
        
        // Angle
        this.rotation = attributes.rotation

        // Speed
        this.speed = attributes.speed

		Game.PIXI.stage.addChild(this)
		Game.bullets.push(this)
    }

    public update(): void {
        this.position.x += Math.cos(this.rotation) * this.speed;
        this.position.y += Math.sin(this.rotation) * this.speed;
        this.lifeTime++

        // Remove bullet if too old
        if (this.lifeTime > this.maxLifetime) {
            Game.removeBullet(this)
        }
    }
}