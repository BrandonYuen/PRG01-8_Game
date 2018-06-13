class HealthBar extends PIXI.Container implements Observer {
    private entity:Entity
    private healthObject:PIXI.Graphics
    private maxHealthObject:PIXI.Graphics
    private options = {
        width: 75,
        heigth: 10,
        bottomMargin: 50
    }

    constructor(entity: Entity) {
        super()
        this.entity = entity
        entity.registerObserver(this)
        Game.PIXI.stage.addChild(this)
        
        // Draw red bar
        this.maxHealthObject = new PIXI.Graphics
		this.maxHealthObject.beginFill(0xc80000)
        this.maxHealthObject.lineStyle(2)
        this.maxHealthObject.drawRect(0, 0, this.options.width, this.options.heigth)
        this.maxHealthObject.endFill()
        this.maxHealthObject.alpha = 0.8
        this.addChild(this.maxHealthObject)
        
        // Draw green bar
        this.healthObject = new PIXI.Graphics
		this.healthObject.beginFill(0x00c62e)
        this.healthObject.lineStyle(2)
        this.healthObject.drawRect(0, 0, this.options.width, this.options.heigth)
        this.healthObject.endFill()
        this.healthObject.alpha = 0.8
        this.addChild(this.healthObject)
    }

    public update(): void {
        // Update maxhealth object (red)
        this.maxHealthObject.position.x = this.entity.sprite.x - this.options.width/2
        this.maxHealthObject.position.y = this.entity.sprite.y - this.options.bottomMargin

        // Update health object (green)
        this.healthObject.position.x = this.entity.sprite.x - this.options.width/2
        this.healthObject.position.y = this.entity.sprite.y - this.options.bottomMargin
    }

    public updateHealth(): void {
        // Remove old healthObject
        this.removeChild(this.healthObject)

        // Update health object (green)
        let percHealth = this.entity.health / this.entity.maxHealth
        let correctWidth = this.options.width * percHealth
        
        this.healthObject = new PIXI.Graphics
		this.healthObject.beginFill(0x00c62e)
        this.healthObject.lineStyle(2)
        this.healthObject.drawRect(0, 0, correctWidth, this.options.heigth)
        this.healthObject.endFill()
        this.healthObject.alpha = 0.8
        this.addChild(this.healthObject)
    }

    public remove(): void {
        Game.PIXI.stage.removeChild(this)
    }
}