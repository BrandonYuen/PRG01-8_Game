/// <reference path="GameObject.ts"/>

abstract class Entity extends GameObject implements Subject {
    protected observers: Observer[] = [];
	public left: boolean = false
	public right: boolean = false
	public up: boolean = false
	public down: boolean = false
	public x_speed: number = 0
	public y_speed: number = 0
    public movement:Movement = new Walking(this)
    public baseSpeed:number = 0
    
    constructor(stage: PIXI.Container, texture: PIXI.Texture) {
        super(stage, texture)
    }

    registerObserver(o: Observer) {
        this.observers.push(o);
    }

    removeObserver(o: Observer) {
        let index = this.observers.indexOf(o);
        this.observers.splice(index, 1);
    }
}