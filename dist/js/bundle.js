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
        Game.PIXI = new PIXI.Application({ width: Game.canvasWidth, height: Game.canvasHeigth });
        Game.PIXI.stage.interactive = true;
        document.body.appendChild(Game.PIXI.view);
        Game.tiledMap = new PIXI.Container();
        Game.PIXI.stage.addChild(Game.tiledMap);
        this.player = new Player(Game.PIXI.stage);
        PIXI.loader
            .add('./images/player/manBlue_gun.png')
            .add('./images/particles/Fire.png')
            .add('./images/particles/particle.png')
            .add('./maps/01_empty.tmx')
            .add('./maps/01_intro.tmx')
            .load(function () { return _this.onLoaderComplete(); });
        Game.sounds.pistol1 = new Howl({
            src: ['./sounds/pistolShot1.mp3'],
            volume: 0.5,
            preload: true
        });
    }
    Game.getInstance = function () {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    };
    Game.prototype.onLoaderComplete = function () {
        var _this = this;
        Game.tiledMap.addChild(new PIXI.extras.TiledMap("./maps/01_intro.tmx"));
        for (var _i = 0, _a = Game.tiledMap.children[0].children[2].children; _i < _a.length; _i++) {
            var w = _a[_i];
            Game.walls.push(w);
        }
        this.player.updateTexture(PIXI.loader.resources['./images/player/manBlue_gun.png'].texture);
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    Game.prototype.gameLoop = function () {
        var _this = this;
        this.player.update();
        for (var _i = 0, _a = Game.bullets; _i < _a.length; _i++) {
            var b = _a[_i];
            b.update();
        }
        Game.PIXI.renderer.render(Game.PIXI.stage);
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    Game.removeBullet = function (b) {
        Game.PIXI.stage.removeChild(b);
        var index = Game.bullets.indexOf(b);
        if (index !== -1) {
            Game.bullets.splice(index, 1);
        }
    };
    Game.canvasWidth = 1600;
    Game.canvasHeigth = 896;
    Game.BUMP = new Bump(PIXI);
    Game.bullets = [];
    Game.sounds = {};
    Game.walls = [];
    return Game;
}());
window.addEventListener("load", function () {
    Game.getInstance();
});
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(gunShotContainer, attributes) {
        var _this = _super.call(this) || this;
        _this.speed = 1;
        _this.maxLifetime = 150;
        _this.lifeTime = 0;
        _this.beginFill(0x123456);
        _this.drawRect(0, 0, 10, 3);
        _this.endFill();
        _this.position.x = gunShotContainer.x;
        _this.position.y = gunShotContainer.y;
        _this.rotation = attributes.rotation;
        _this.speed = attributes.speed;
        Game.PIXI.stage.addChild(_this);
        Game.bullets.push(_this);
        return _this;
    }
    Bullet.prototype.update = function () {
        this.position.x += Math.cos(this.rotation) * this.speed;
        this.position.y += Math.sin(this.rotation) * this.speed;
        this.lifeTime++;
        if (this.lifeTime > this.maxLifetime) {
            Game.removeBullet(this);
        }
        if (Util.checkCollisionWithWalls(this)) {
            Game.removeBullet(this);
        }
    };
    return Bullet;
}(PIXI.Graphics));
var GameObject = (function () {
    function GameObject(stage) {
        this.sprite = new PIXI.Sprite();
        stage.addChild(this.sprite);
    }
    GameObject.prototype.updateTexture = function (texture) {
        this.sprite.texture = texture;
    };
    GameObject.prototype.update = function () { };
    return GameObject;
}());
var gunShotEmitter = (function (_super) {
    __extends(gunShotEmitter, _super);
    function gunShotEmitter(container) {
        var _this = _super.call(this, container, [
            PIXI.loader.resources['./images/particles/particle.png'].texture,
            PIXI.loader.resources['./images/particles/Fire.png'].texture
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
        }) || this;
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
        _this.speed = 0.25;
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
        this.gunShotEmitter = new gunShotEmitter(this.gunShotContainer);
    };
    Player.prototype.update = function () {
        this.gunShotContainer.x = this.sprite.x + Math.cos(this.sprite.rotation + this.gunOffset.angle) * this.gunOffset.distance;
        this.gunShotContainer.y = this.sprite.y + Math.sin(this.sprite.rotation + this.gunOffset.angle) * this.gunOffset.distance;
        this.gunShotContainer.rotation = this.sprite.rotation - 30;
        this.gunShotEmitter.update();
        this.updateMovement();
        this.updateAim();
    };
    Player.prototype.shoot = function () {
        var rotation = Util.rotateToPoint(Game.PIXI.renderer.plugins.interaction.mouse.global.x, Game.PIXI.renderer.plugins.interaction.mouse.global.y, this.gunShotContainer.x, this.gunShotContainer.y);
        new Bullet(this.gunShotContainer, {
            rotation: rotation,
            speed: 30
        });
        this.gunShotEmitter.start(100);
        Game.sounds.pistol1.play();
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
        var actualSpeed = this.speed;
        if ((this.right && this.down) || (this.right && this.up) || (this.left && this.down) || (this.left && this.up)) {
            actualSpeed = actualSpeed * 0.8;
            actualSpeed = actualSpeed * 0.8;
        }
        if (this.up) {
            this.y_speed -= actualSpeed;
        }
        if (this.left) {
            this.x_speed -= actualSpeed;
        }
        if (this.right) {
            this.x_speed += actualSpeed;
        }
        if (this.down) {
            this.y_speed += actualSpeed;
        }
        this.sprite.x += this.x_speed;
        if (Util.checkCollisionWithWalls(this.sprite)) {
            this.sprite.x -= this.x_speed;
            this.x_speed = 0;
        }
        this.sprite.y += this.y_speed;
        if (Util.checkCollisionWithWalls(this.sprite)) {
            this.sprite.y -= this.y_speed;
            this.y_speed = 0;
        }
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
    Util.checkCollisionWithWalls = function (object) {
        var colliding = false;
        for (var _i = 0, _a = Game.walls; _i < _a.length; _i++) {
            var w = _a[_i];
            if (Game.BUMP.hitTestRectangle(object, w)) {
                colliding = true;
                break;
            }
        }
        return colliding;
    };
    return Util;
}());
//# sourceMappingURL=bundle.js.map