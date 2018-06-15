
class Bullet extends PIXI.Graphics {
    private speed = 1 // Default speed
    private maxLifetime = 150 //Max life time in frames (60 frames = 1 second)
    private bulletTrailContainer:PIXI.Container = new PIXI.Container
    private bulletTrailEmitter:any
    private lifeTime = 0
    private damage: number
    private shooter:GameObject

	constructor(gunShotContainer: PIXI.Container, attributes: any) {
        super()
        this.shooter = attributes.shooter || null
        this.damage = attributes.damage || 1
        
        // Draw shape
		this.beginFill(0x123456)
		this.drawRect(0, 0, 10, 5)
        this.endFill()
        this.visible = false
        
        // Spawn position
		this.position.x = gunShotContainer.x
        this.position.y = gunShotContainer.y
        
        // Angle
        this.rotation = attributes.rotation

        // Speed
        this.speed = attributes.speed

        // Trail Container
        Game.containers.push(this.bulletTrailContainer)
        Game.PIXI.stage.addChild(this.bulletTrailContainer)

        // Trail Emitter
        this.bulletTrailEmitter = new Emitter(
            this.bulletTrailContainer,
            [
                PIXI.loader.resources['./images/particles/particle.png'].texture
            ],
            PIXI.loader.resources['./json/bulletTrail.json'].data,
            true // Repeat (keep emitting)
        )
        this.bulletTrailEmitter.start()
        this.bulletTrailEmitter.update()

		Game.PIXI.stage.addChild(this)
		Game.bullets.push(this)
    }

    public update(): void {
        this.lifeTime++

        // Update bullet position
        this.position.x += Math.cos(this.rotation) * this.speed;
        this.position.y += Math.sin(this.rotation) * this.speed;

        // Update bullet trail container position
        this.bulletTrailEmitter.updateSpawnPos(this.position.x, this.position.y)


        // Remove bullet if too old
        if (this.lifeTime > this.maxLifetime) {
            this.kill()
        }

        // Collision with walls
        if (Util.checkCollisionWithWalls(this)) {
            this.kill()

            // Create particle container
            let bulletImpactContainer = new PIXI.Container()
            bulletImpactContainer.x = this.position.x
            bulletImpactContainer.y = this.position.y
            bulletImpactContainer.rotation = this.rotation + 135
            Game.containers.push(bulletImpactContainer)
            let indexOfContainer = Game.containers.indexOf(bulletImpactContainer)
            Game.PIXI.stage.addChild(Game.containers[indexOfContainer])

            //Create particle emitter
            let bulletImpactEmitter = new Emitter(
                Game.containers[indexOfContainer],
                [
                    PIXI.loader.resources['./images/particles/particle.png'].texture
                ],
                PIXI.loader.resources['./json/bulletImpact.json'].data
            )
            let index2 = Game.emitters.indexOf(bulletImpactEmitter)
            Game.emitters[index2].start(100, true)

            // Sound effect
            let random = Math.floor(Math.random() * Math.floor(Game.sounds.bulletImpact.length))
            Game.sounds.bulletImpact[random].play()
        }

        // Collision with entities
        let collisionCheck = Util.checkCollisionWithEntities(this)
        if (collisionCheck != false) {
            // If not colliding with shooter of this bullet
            if (collisionCheck != this.shooter) {
                // Don't let enemies damage eachother
                if (this.shooter instanceof EnemySoldier && collisionCheck instanceof EnemySoldier) {
                    return
                }
                collisionCheck.health -= this.damage

                // Create particle container
                let bulletImpactContainer = new PIXI.Container()
                bulletImpactContainer.x = this.position.x
                bulletImpactContainer.y = this.position.y
                bulletImpactContainer.rotation = this.rotation
                Game.containers.push(bulletImpactContainer)
                let indexOfContainer = Game.containers.indexOf(bulletImpactContainer)
                Game.PIXI.stage.addChild(Game.containers[indexOfContainer])
    
                //Create particle emitter
                let bulletImpactEmitter = new Emitter(
                    Game.containers[indexOfContainer],
                    [
                        PIXI.loader.resources['./images/particles/particle.png'].texture
                    ],
                    PIXI.loader.resources['./json/blood.json'].data
                )
                let index2 = Game.emitters.indexOf(bulletImpactEmitter)
                Game.emitters[index2].start(100, true)

                // Sound effect
                let random = Math.floor(Math.random() * Math.floor(Game.sounds.bulletImpactBody.length))
                Game.sounds.bulletImpactBody[random].play()

                // Remove bullet
                this.kill()
            }
        }

    }

    public kill(): void {
        Game.removeBullet(this)

        // Remove the bullet trail particle CONTAINER of this bullet
        Game.removeContainer(this.bulletTrailContainer)
        // Remove the bullet trail particle EMITTER of this bullet
        Game.removeEmitter(this.bulletTrailEmitter)
    }
}