/// <reference path="GameObject.ts"/>

abstract class Entity extends GameObject implements Subject {
    protected observers: Observer[] = [];
	public left: boolean = false
	public right: boolean = false
	public up: boolean = false
    public down: boolean = false
    public reload: boolean = false
	public x_speed: number = 0
	public y_speed: number = 0
    protected movement:Movement = new MovingState(this)
    protected _baseSpeed:number = 0
    private _reloadBar:ActionBar = new ActionBar(this, 100, 20, 25)
    private _ammoBar:ActionBar = new ActionBar(this, 50, 20, -75)
    private _healthBar:HealthBar = new HealthBar(this)
    protected _maxHealth:number = 100
    private _health:number = this._maxHealth
    protected _gun:Gun = GunFactory.getGun('unarmed', this)
    protected visionLine:VisionLine = new VisionLine(this)
    
    constructor(stage: PIXI.Container, texture: PIXI.Texture) {
        super(stage, texture)
		this.visionLine.visible = false
        this.update()
    }

    registerObserver(o: Observer) {
        this.observers.push(o);
    }

    removeObserver(o: Observer) {
        let index = this.observers.indexOf(o);
        this.observers.splice(index, 1)
    }

    public set gun(gun:Gun) {
        this._gun.remove()
        this._gun = gun
    }

    public get gun(): Gun {
        return this._gun
    }

    public set health(health: number) {
        this._health = health
        if (this._health <= 0) {
            this._health = 0
            this.kill()
        } else if (this._health > this.maxHealth) {
            this._health = this.maxHealth
        }
        this.healthBar.updateHealth()
    }

    public get health() {
        return this._health
    }

    public get maxHealth() {
        return this._maxHealth
    }

    public set maxHealth(maxHealth: number) {
        this._maxHealth = maxHealth
    }

    public get baseSpeed() {
        return this._baseSpeed
    }

    public set baseSpeed(baseSpeed: number) {
        this._baseSpeed = baseSpeed
    }

    public get reloadBar() {
        return this._reloadBar
    }

    public get healthBar() {
        return this._healthBar
    }

    public get ammoBar() {
        return this._ammoBar
    }

	public update(): void {
		// Update all observers too
        for (let observer of this.observers) {
            observer.update()
        }
		this.visionLine.update()
		this.pickupCheck()
    }

	private pickupCheck(): void {
		// Check if player is colloding with Item
        for (let i of Game.gameObjects) {
            if (i instanceof Item) {
                if (Game.BUMP.hit(this.sprite, i.sprite)) {
                    // Player picks up this item
                    i.pickup(this)
                    i.kill()
                }
            }
        }
	}
    
    public kill(): void {
        super.kill()
        Game.removeGameObject(this)
        if (this.gun instanceof Gun) {
            this.gun.remove()
        }
        this.healthBar.remove()
        this.reloadBar.remove()
        this.ammoBar.remove()
        this.visionLine.remove()
    }
}