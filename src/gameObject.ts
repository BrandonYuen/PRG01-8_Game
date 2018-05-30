
class GameObject {
	public sprite = new PIXI.Sprite()

	constructor(stage: PIXI.Container) {
		stage.addChild(this.sprite);
	}

	public updateTexture(texture: any): void {
		this.sprite.texture = texture;
	}
}
