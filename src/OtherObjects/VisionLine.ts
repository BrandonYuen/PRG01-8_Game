class VisionLine extends PIXI.Graphics {
    private gunObject: Gun
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
}