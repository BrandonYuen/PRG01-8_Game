"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Game = (function () {
    function Game() {
        var _this = this;
        this.background = new PIXI.Sprite();
        Game.PIXI = new PIXI.Application({ width: Game.canvasWidth, height: Game.canvasHeigth });
        Game.PIXI.stage.interactive = true;
        document.body.appendChild(Game.PIXI.view);
        Game.bullets = [];
        Game.PIXI.stage.addChild(this.background);
        this.player = new Player(Game.PIXI.stage);
        Game.PIXI.loader
            .add('./images/level/level1.png')
            .add('./images/player/manBlue_gun.png')
            .add('./images/particles/Fire.png')
            .add('./images/particles/particle.png')
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
        this.player.updateTexture(Game.PIXI.loader.resources['./images/player/manBlue_gun.png'].texture);
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    Game.prototype.gameLoop = function () {
        var _this = this;
        this.player.update();
        for (var b = Game.bullets.length - 1; b >= 0; b--) {
            Game.bullets[b].position.x += Math.cos(Game.bullets[b].rotation) * 20;
            Game.bullets[b].position.y += Math.sin(Game.bullets[b].rotation) * 20;
        }
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
var GameObject = (function () {
    function GameObject(stage) {
        this.sprite = new PIXI.Sprite();
        stage.addChild(this.sprite);
    }
    GameObject.prototype.updateTexture = function (texture) {
        this.sprite.texture = texture;
    };
    return GameObject;
}());
var gunShotEmitter = (function (_super) {
    __extends(gunShotEmitter, _super);
    function gunShotEmitter(container, particleTextures, config) {
        var _this = _super.call(this, container, particleTextures, config) || this;
        _this.elapsed = Date.now();
        _this.emit = false;
        return _this;
    }
    gunShotEmitter.prototype.start = function (time) {
        var _this = this;
        this.emit = true;
        setTimeout(function () {
            _this.emit = false;
        }, time);
    };
    gunShotEmitter.prototype.update = function () {
        var now = Date.now();
        _super.prototype.update.call(this, (now - this.elapsed) * 0.001);
        this.elapsed = Date.now();
    };
    return gunShotEmitter;
}(PIXI.particles.Emitter));
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(stage) {
        var _this = _super.call(this, stage) || this;
        _this.left = false;
        _this.right = false;
        _this.up = false;
        _this.down = false;
        _this.x_speed = 0;
        _this.y_speed = 0;
        _this.gunShotContainer = new PIXI.Container;
        _this.gunOffset = {
            angle: 19.20,
            distance: 27
        };
        window.addEventListener("keydown", function (e) { return _this.keyListener(e); });
        window.addEventListener("keyup", function (e) { return _this.keyListener(e); });
        Game.PIXI.stage.on("mousedown", function () { return _this.shoot(); });
        _this.resetPosition();
        Game.PIXI.stage.addChild(_this.gunShotContainer);
        return _this;
    }
    Player.prototype.resetPosition = function () {
        this.sprite.x = Game.canvasWidth / 2;
        this.sprite.y = Game.canvasHeigth / 2;
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
    };
    Player.prototype.updateTexture = function (texture) {
        _super.prototype.updateTexture.call(this, texture);
        this.gunShotEmitter = new gunShotEmitter(this.gunShotContainer, [
            Game.PIXI.loader.resources['./images/particles/particle.png'].texture,
            Game.PIXI.loader.resources['./images/particles/Fire.png'].texture
        ], {
            alpha: {
                start: 0.62,
                end: 0
            },
            scale: {
                start: 0.2,
                end: 0.001,
                minimumScaleMultiplier: 0.68
            },
            color: {
                start: '#fff185',
                end: '#ff622c'
            },
            speed: {
                start: 100,
                end: 1,
                minimumSpeedMultiplier: 1.11
            },
            acceleration: {
                x: 0,
                y: 0
            },
            maxSpeed: 1,
            startRotation: {
                min: 250,
                max: 300
            },
            noRotation: false,
            rotationSpeed: {
                min: 0,
                max: 0
            },
            lifetime: {
                min: 0.01,
                max: 0.5
            },
            blendMode: 'color_dodge',
            frequency: 0.001,
            emitterLifetime: 0,
            maxParticles: 100,
            pos: {
                x: 0,
                y: 0
            },
            addAtBack: false,
            spawnType: 'circle',
            spawnCircle: {
                x: 0,
                y: 0,
                r: 0.01
            }
        });
    };
    Player.prototype.update = function () {
        var offset = {
            x: 20,
            y: 20
        };
        this.gunShotContainer.x = this.sprite.x + Math.cos(this.sprite.rotation + this.gunOffset.angle) * this.gunOffset.distance;
        this.gunShotContainer.y = this.sprite.y + Math.sin(this.sprite.rotation + this.gunOffset.angle) * this.gunOffset.distance;
        this.gunShotContainer.rotation = this.sprite.rotation - 30;
        this.gunShotEmitter.update();
        this.updateMovement();
        this.updateAim();
    };
    Player.prototype.shoot = function () {
        var rotation = Util.rotateToPoint(Game.PIXI.renderer.plugins.interaction.mouse.global.x, Game.PIXI.renderer.plugins.interaction.mouse.global.y, this.gunShotContainer.x, this.gunShotContainer.y);
        var bullet = new PIXI.Graphics();
        bullet.beginFill(0x123456);
        bullet.drawRect(0, 0, 20, 5);
        bullet.endFill();
        bullet.position.x = this.gunShotContainer.x;
        bullet.position.y = this.gunShotContainer.y;
        bullet.rotation = rotation;
        Game.PIXI.stage.addChild(bullet);
        Game.bullets.push(bullet);
        this.gunShotEmitter.start(100);
    };
    Player.prototype.keyListener = function (event) {
        var key_state = (event.type == "keydown") ? true : false;
        switch (event.keyCode) {
            case 87:
                this.up = key_state;
                break;
            case 83:
                this.down = key_state;
                break;
            case 65:
                this.left = key_state;
                break;
            case 68:
                this.right = key_state;
                break;
        }
    };
    Player.prototype.updateMovement = function () {
        if (this.up) {
            this.y_speed -= 0.13;
        }
        if (this.left) {
            this.x_speed -= 0.13;
        }
        if (this.right) {
            this.x_speed += 0.13;
        }
        if (this.down) {
            this.y_speed += 0.13;
        }
        this.sprite.x += this.x_speed;
        this.sprite.y += this.y_speed;
        this.x_speed *= 0.9;
        this.y_speed *= 0.9;
    };
    Player.prototype.updateAim = function () {
        this.sprite.rotation = Util.rotateToPoint(Game.PIXI.renderer.plugins.interaction.mouse.global.x, Game.PIXI.renderer.plugins.interaction.mouse.global.y, this.sprite.x, this.sprite.y);
    };
    return Player;
}(GameObject));
var Util = (function () {
    function Util() {
    }
    Util.rotateToPoint = function (mx, my, px, py) {
        var dist_Y = my - py;
        var dist_X = mx - px;
        var angle = Math.atan2(dist_Y, dist_X);
        return angle;
    };
    return Util;
}());
//# sourceMappingURL=bundle.js.map