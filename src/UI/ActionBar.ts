class ActionBar extends PIXI.Graphics implements Observer {
    private actionBarContainer: PIXI.Container = new PIXI.Container
    private entity:Entity
    private _width:number = 50
    private _heigth:number = 10
    private _offset:number = 25

    constructor(entity: Entity, width: number, heigth: number, offset: number) {
        super()
        this.entity = entity
        this._width = width
        this._heigth = heigth
        this._offset = offset

        entity.registerObserver(this)
        this.actionBarContainer.addChild(this)
        Game.PIXI.stage.addChild(this.actionBarContainer)
        
        // Draw shape
		this.beginFill(0x000000)
        this.drawRect(0, 0, this._width, this._heigth)
        this.alpha = 0.2
        this.endFill()
        this.visible = false
    }

    public setText(text: string) {
        for (let c of this.actionBarContainer.children) {
            if (c instanceof PIXI.Text) {
                this.actionBarContainer.removeChild(c)
            }
        }

        let textObject = new PIXI.Text(text.toString(), {
            fontFamily : 'Montserrat',
            fontSize: 16,
            fill : 0xffffff,
            align : 'center'
        })
        textObject.position.set(this._width/2 , this._heigth/2)
        textObject.anchor.set(0.5, 0.5)
        this.actionBarContainer.addChild(textObject)

        if (text == '') {
            this.visible = false
        } else {
            this.visible = true
        }
    }

    public update(): void {
        if (this.actionBarContainer.children.length > 0) {
            this.actionBarContainer.position.x = this.entity.sprite.x - this._width / 2
            this.actionBarContainer.position.y = this.entity.sprite.y + this._offset
        }
    }

    public remove(): void {
        Game.PIXI.stage.removeChild(this.actionBarContainer)
    }
}