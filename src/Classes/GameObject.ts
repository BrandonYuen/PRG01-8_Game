
abstract class GameObject {
	public sprite = new PIXI.Sprite()

	constructor(stage: PIXI.Container, texture: PIXI.Texture) {
		stage.addChild(this.sprite);
		this.sprite.texture = texture;
	}

	abstract update(): void
}
