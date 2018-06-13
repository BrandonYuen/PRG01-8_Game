class VisionLine2 extends PIXI.Graphics {
    private gunObject: Gun
    private maxHeigth = Game.canvasWidth
    constructor(gunObject: Gun) {
        super()
        this.gunObject = gunObject

        // Draw vision line
		this.beginFill(0xd63600)
        this.drawRect(0, 0, 1, Game.canvasWidth)
        this.endFill()
        this.alpha = 0.2
        Game.PIXI.stage.addChild(this)
    }

    public update(): void {
        let barrelPosition = this.gunObject.getBarrelPosition()

        // Update visionline
        this.position.x = barrelPosition.x
        this.position.y = barrelPosition.y
        this.rotation = Util.toRadiant(Util.toDegrees(this.gunObject.subject.sprite.rotation) - 90)
    }

    public remove(): void {
        Game.PIXI.stage.removeChild(this)
    }

    public checkVision(): boolean | Entity {
        // Calculate check distance (between visionLine and player)
        let colliding = false
        let x = 0
        let y = 0
        // Loop all points in visionline
        let a = Game.entities[0].sprite.x - this.position.x
        let b = Game.entities[0].sprite.y - this.position.y
        let distanceToPlayer = Math.sqrt( a*a + b*b )
        for (let i=0; i < distanceToPlayer; i= i + 5) {
            // Calculate x and y based on width
            x = this.x + Math.cos(Util.toRadiant(Util.toDegrees(this.rotation) + 90)) * i
            y = this.y + Math.sin(Util.toRadiant(Util.toDegrees(this.rotation) + 90)) * i

            // Check if colliding with any walls
            for (let w of Game.walls) {
                // Check if looped-wall is within vision
                if (Game.BUMP.hitTestPoint({x: x, y: y}, w)) {
                    // Colliding with wall
                    let a = w.x - this.position.x
                    let b = w.y - this.position.y
                    let distanceToWall = Math.sqrt( a*a + b*b )
                    this.height = distanceToWall
                    return false
                }
            }

            // Check if colliding with any entity
            for (let e of Game.entities) {
                // Don't check the entity holding the gun
                if (this.gunObject.subject != e)

                // Check if looped-entity is within vision
                if (Game.BUMP.hitTestPoint({x: x, y: y}, e.sprite)) {
                    // Colliding with entity, so check if there is a wall within the vision
                    return e
                }
            }
        }
        return colliding
    }
}