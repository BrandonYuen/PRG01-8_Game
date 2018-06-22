/// <reference path="Gun.ts"/>

class Unarmed extends Gun {
    private textureForPlayer:PIXI.Texture = PIXI.loader.resources['./images/sprites/player.png'].texture
    private textureForEnemy:PIXI.Texture = PIXI.loader.resources['./images/sprites/soldier.png'].texture

    constructor(subject:Entity) {
        super(subject)
        if (this.subject instanceof Player) {
            this.subject.sprite.texture = this.textureForPlayer
        } else if (this.subject instanceof EnemySoldier) {
            this.subject.sprite.texture = this.textureForEnemy
        }
    }

    // Override normal gun use
    public shoot() {}
    public update(): void {}
    public reload(): void {}
    public getBarrelPosition(): any {
        return {
            x: this.subject.sprite.x,
            y: this.subject.sprite.y
        }
    }
}