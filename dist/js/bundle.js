"use strict";
var Game = (function () {
    function Game() {
        Game.PIXI = new PIXI.Application({ width: Game.canvasWidth, height: Game.canvasHeigth });
        document.body.appendChild(Game.PIXI.view);
        Game.PIXI.loader
            .add('./images/player/manBlue_gun.png')
            .add('./images/level/level1.png')
            .load(setup);
        function setup() {
            var background = new PIXI.Sprite(Game.PIXI.loader.resources["./images/level/level1.png"].texture);
            Game.PIXI.stage.addChild(background);
            var player = new Player(Game.PIXI.stage);
            requestAnimationFrame(gameLoop);
        }
        function gameLoop() {
            Game.PIXI.renderer.render(Game.PIXI.stage);
            requestAnimationFrame(gameLoop);
        }
    }
    Game.getInstance = function () {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    };
    Game.canvasWidth = 1280;
    Game.canvasHeigth = 768;
    return Game;
}());
window.addEventListener("load", function () {
    Game.getInstance();
});
var Player = (function () {
    function Player(stage) {
        this.sprite = new PIXI.Sprite();
        this.sprite.texture = Game.PIXI.loader.resources['./images/player/manBlue_gun.png'].texture;
        this.reset();
        stage.addChild(this.sprite);
    }
    Player.prototype.reset = function () {
        this.sprite.x = Game.canvasWidth / 2;
        this.sprite.y = Game.canvasHeigth / 2;
    };
    return Player;
}());
//# sourceMappingURL=bundle.js.map