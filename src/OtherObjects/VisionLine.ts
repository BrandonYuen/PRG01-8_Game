
class VisionLine extends PIXI.Graphics {
    private subject: Gun | Entity

    constructor(subject: Gun | Entity) {
        super()
        this.subject = subject

        // Draw vision line
		this.beginFill(0xd63600)
        this.drawRect(0, 0, 1, Game.canvasWidth)
        this.endFill()
        this.alpha = 1
        Game.PIXI.stage.addChild(this)
    }

    public update(): void {
        let beginPosition = {x: 0, y: 0}
        let rotation = 0
        if (this.subject instanceof Entity) {
            beginPosition = {x: this.subject.sprite.x, y: this.subject.sprite.y}
            rotation = Util.toRadiant(Util.toDegrees(this.subject.sprite.rotation) - 90)
        } else if (this.subject instanceof Gun) {
            beginPosition = this.subject.getBarrelPosition()
            rotation = Util.toRadiant(Util.toDegrees(this.subject.subject.sprite.rotation) - 91)
            this.height = this.getMaxDistance()
        }

        // Update visionline
        this.position.x = beginPosition.x
        this.position.y = beginPosition.y
        this.rotation =  rotation
    }

    public getEndPoint(): any {
        if (this.subject instanceof Gun) {
            return {
                x: this.subject.subject.sprite.x + Math.cos(Util.toRadiant(Util.toDegrees(this.rotation) + 91)) * Game.canvasWidth,
                y: this.subject.subject.sprite.y + Math.sin(Util.toRadiant(Util.toDegrees(this.rotation) + 91)) * Game.canvasWidth
            }
        } else if (this.subject instanceof Entity) {
            return {
                x: this.subject.sprite.x + Math.cos(Util.toRadiant(Util.toDegrees(this.rotation) + 90)) * Game.canvasWidth,
                y: this.subject.sprite.y + Math.sin(Util.toRadiant(Util.toDegrees(this.rotation) + 90)) * Game.canvasWidth
            }
        }
    }

    public getMaxDistance(): any {

        // Create line object
        let visionLineEndPoint = {x: 0, y: 0}
        let beginPosition = {x: 0, y: 0}

		if (this.subject instanceof Gun) {
			visionLineEndPoint = this.getEndPoint()
            beginPosition = this.subject.getBarrelPosition()
        } else if (this.subject instanceof Player) {
            visionLineEndPoint = this.getEndPoint()
            beginPosition = {
                x: this.subject.sprite.x,
                y: this.subject.sprite.y
            }
        }

        // Create line object
        let line = {
            first: {
                x: beginPosition.x,
                y: beginPosition.y
            },
            second: {
                x: visionLineEndPoint.x,
                y: visionLineEndPoint.y
            }
        }

        // Check if collision with player
        let player = Game.player 
        if (player instanceof Player && this.subject instanceof Gun) {
            if (this.subject.subject instanceof EnemySoldier) {
                if (this.subject.subject.checkVisionOnPlayer()) {
                    return math.distance([beginPosition.x, beginPosition.y], [Game.player.sprite.x, Game.player.sprite.y])
                }
            }
        }

        // Check if collision with any walls
        let wallPoint = Util.checkCollisionLineWalls(line)
        if (wallPoint != false) {
            return wallPoint.shortestDistance
        }
        return -1

    }

    public remove(): void {
        Game.PIXI.stage.removeChild(this)
    }
}