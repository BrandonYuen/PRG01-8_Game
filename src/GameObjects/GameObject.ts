
abstract class GameObject {
	public _sprite = new PIXI.Sprite()

	constructor(stage: PIXI.Container, texture: PIXI.Texture) {
		stage.addChild(this.sprite);
		this.sprite.texture = texture;
	}

	abstract update(): void

	public kill(): void {
		Game.removeGameObject(this)
		Game.PIXI.stage.removeChild(this.sprite);
	}

    public get sprite() {
        return this._sprite
	}

}
