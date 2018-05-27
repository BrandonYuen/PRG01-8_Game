"use strict";
var Game = (function () {
    function Game() {
        var _this = this;
        this.background = new PIXI.Sprite();
        Game.PIXI = new PIXI.Application({ width: Game.canvasWidth, height: Game.canvasHeigth });
        document.body.appendChild(Game.PIXI.view);
        this.player = new Player();
        Game.PIXI.loader
            .add('./images/level/level1.png')
            .add('./images/player/manBlue_gun.png')
            .load(function () { return _this.setup(); });
    }
    Game.getInstance = function () {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    };
    Game.prototype.setup = function () {
        var _this = this;
        this.background.texture = Game.PIXI.loader.resources["./images/level/level1.png"].texture;
        Game.PIXI.stage.addChild(this.background);
        this.player.updateTexture(Game.PIXI.stage);
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    Game.prototype.gameLoop = function () {
        var _this = this;
        this.player.update();
        Game.PIXI.renderer.render(Game.PIXI.stage);
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    Game.canvasWidth = 1280;
    Game.canvasHeigth = 768;
    return Game;
}());
window.addEventListener("load", function () {
    Game.getInstance();
});
var Player = (function () {
    function Player() {
        var _this = this;
        this.sprite = new PIXI.Sprite();
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.x_speed = 0;
        this.y_speed = 0;
        window.addEventListener("keydown", function (e) { return _this.keyListener(e); });
        window.addEventListener("keyup", function (e) { return _this.keyListener(e); });
    }
    Player.prototype.reset = function () {
        this.sprite.x = Game.canvasWidth / 2;
        this.sprite.y = Game.canvasHeigth / 2;
    };
    Player.prototype.updateTexture = function (stage) {
        this.sprite.texture = Game.PIXI.loader.resources['./images/player/manBlue_gun.png'].texture;
        this.reset();
        stage.addChild(this.sprite);
    };
    Player.prototype.update = function () {
        this.movementController();
    };
    Player.prototype.keyListener = function (event) {
        var key_state = (event.type == "keydown") ? true : false;
        switch (event.keyCode) {
            case 87:
                this.up = key_state;
                console.log("up");
                break;
            case 83:
                this.down = key_state;
                console.log("down");
                break;
            case 65:
                this.left = key_state;
                console.log("left");
                break;
            case 68:
                console.log("right");
                this.right = key_state;
                break;
        }
    };
    Player.prototype.movementController = function () {
        if (this.up) {
            this.y_speed -= 0.5;
        }
        if (this.left) {
            this.x_speed -= 0.5;
        }
        if (this.right) {
            this.x_speed += 0.5;
        }
        if (this.down) {
            this.y_speed += 0.5;
        }
        this.sprite.x += this.x_speed;
        this.sprite.y += this.y_speed;
        this.x_speed *= 0.9;
        this.y_speed *= 0.9;
    };
    return Player;
}());
//# sourceMappingURL=bundle.js.map