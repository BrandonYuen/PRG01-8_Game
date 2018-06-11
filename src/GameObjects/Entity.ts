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
    public movement:Movement = new Walking(this)
    public baseSpeed:number = 0
    public actionBar:ActionBar = new ActionBar(this)
    public healthBar:HealthBar = new HealthBar(this)
    public maxHealth:number = 100
    private _health:number = this.maxHealth
    public gun:Gun | null = null
    
    constructor(stage: PIXI.Container, texture: PIXI.Texture) {
        super(stage, texture)
        this.update()
    }

    registerObserver(o: Observer) {
        this.observers.push(o);
    }

    removeObserver(o: Observer) {
        let index = this.observers.indexOf(o);
        this.observers.splice(index, 1)
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

	public update(): void {
		// Update all observers too
        for (let observer of this.observers) {
            observer.update()
        }
    }
    
    public kill(): void {
        super.kill()
        if (this.gun instanceof Gun) {
            this.gun.remove()
        }
        this.healthBar.remove()
        this.actionBar.remove()
    }
}