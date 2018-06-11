class ActionBar extends PIXI.Graphics implements Observer {
    private actionBarContainer: PIXI.Container = new PIXI.Container
    private entity:Entity

    constructor(entity: Entity) {
        super()
        this.entity = entity
        entity.registerObserver(this)
        this.actionBarContainer.addChild(this)
        Game.PIXI.stage.addChild(this.actionBarContainer)
        
        // Draw shape
		this.beginFill(0x000000)
        this.drawRect(0, 0, 100, 20)
        this.alpha = 0.2
        this.endFill()
        this.visible = false
    }

    public setText(text: String) {
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
        textObject.position.set(50,10)
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
            this.actionBarContainer.position.x = this.entity.sprite.x - 50
            this.actionBarContainer.position.y = this.entity.sprite.y + 25
        }
    }

    public remove(): void {
        Game.PIXI.stage.removeChild(this.actionBarContainer)
    }
}