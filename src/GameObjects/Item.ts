class Item extends GameObject {
    private _type: string
    private maxScale: number = 1.5
    private scalingState: string = 'expanding'

    constructor(type:string, stage: PIXI.Container, texture: PIXI.Texture){
        super(stage, texture)
        this._type = type

		// Position
		this.sprite.anchor.x = 0.5
		this.sprite.anchor.y = 0.5
    }

    public get type(): string {
        return this._type
    }
    
    update(): void {
        this.sprite.rotation = Util.toRadiant(Util.toDegrees(this.sprite.rotation) + 2)

        if (this.scalingState == 'expanding') {
            this.sprite.scale.x = this.sprite.scale.x + 0.005
            this.sprite.scale.y = this.sprite.scale.y + 0.005

            if (this.sprite.scale.x >= this.maxScale) {
                this.scalingState = 'shrinking'
            }
        } else {
            this.sprite.scale.x = this.sprite.scale.x - 0.005
            this.sprite.scale.y = this.sprite.scale.y - 0.005

            if (this.sprite.scale.x <= 1) {
                this.scalingState = 'expanding'
            }
        }
    }
}