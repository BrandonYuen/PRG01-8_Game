
class Player {
    private sprite = new PIXI.Sprite();
  
    reset() {
        this.sprite.x = Game.canvasWidth / 2;
        this.sprite.y = Game.canvasHeigth / 2;
    }
  
    constructor(stage: PIXI.Container) {
        this.sprite.texture = Game.PIXI.loader.resources['./images/player/manBlue_gun.png'].texture;
        this.reset()
        stage.addChild(this.sprite);
    }
}
