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
        Game.PIXI = new PIXI.Application({ width: Game.canvasWidth, height: Game.canvasHeight });
        Game.PIXI.stage.interactive = true;
        document.body.appendChild(Game.PIXI.view);
        Game.tiledMap = new PIXI.Container();
        Game.PIXI.stage.addChild(Game.tiledMap);
        this.player = new Player(Game.PIXI.stage);
        PIXI.loader
            .add('./images/player/manBlue_gun.png')
            .add('./images/particles/Fire.png')
            .add('./images/particles/particle.png')
            .add('./json/gunShot.json')
            .add('./json/bulletImpact.json')
            .add('./json/bulletTrail.json')
            .add('./maps/01_empty.tmx')
            .add('./maps/01_intro.tmx')
            .load(function () { return _this.onLoaderComplete(); });
        Game.sounds.pistol1 = new Howl({
            src: ['./sounds/pistolShot1.mp3'],
            volume: 0.5,
            preload: true
        });
        Game.sounds.bulletImpact = [];
        Game.sounds.bulletImpact[0] = new Howl({
            src: ['./sounds/bulletImpact1.wav'],
            volume: 1,
            preload: true
        });
        Game.sounds.bulletImpact[1] = new Howl({
            src: ['./sounds/bulletImpact2.wav'],
            volume: 1,
            preload: true
        });
        Game.sounds.bulletImpact[2] = new Howl({
            src: ['./sounds/bulletImpact3.wav'],
            volume: 1,
            preload: true
        });
        Game.sounds.glassBreak = new Howl({
            src: ['./sounds/glassBreak.wav'],
            volume: 1,
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
        for (var _b = 0, _c = Game.emitters; _b < _c.length; _b++) {
            var e = _c[_b];
            e.update();
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
    Game.removeEmitter = function (e) {
        var index = Game.emitters.indexOf(e);
        if (index !== -1) {
            Game.emitters.splice(index, 1);
        }
    };
    Game.removeContainer = function (c) {
        Game.PIXI.stage.removeChild(c);
        var index = Game.containers.indexOf(c);
        if (index !== -1) {
            Game.containers.splice(index, 1);
        }
    };
    Game.canvasWidth = 1600;
    Game.canvasHeight = 896;
    Game.BUMP = new Bump(PIXI);
    Game.bullets = [];
    Game.sounds = {};
    Game.walls = [];
    Game.emitters = [];
    Game.containers = [];
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
        _this.bulletTrailContainer = new PIXI.Container;
        _this.lifeTime = 0;
        _this.beginFill(0x123456);
        _this.drawRect(0, 0, 10, 5);
        _this.endFill();
        _this.visible = false;
        _this.position.x = gunShotContainer.x;
        _this.position.y = gunShotContainer.y;
        _this.rotation = attributes.rotation;
        _this.speed = attributes.speed;
        Game.containers.push(_this.bulletTrailContainer);
        Game.PIXI.stage.addChild(_this.bulletTrailContainer);
        _this.bulletTrailEmitter = new Emitter(_this.bulletTrailContainer, [
            PIXI.loader.resources['./images/particles/particle.png'].texture
        ], PIXI.loader.resources['./json/bulletTrail.json'].data, true);
        _this.bulletTrailEmitter.start();
        _this.bulletTrailEmitter.update();
        Game.PIXI.stage.addChild(_this);
        Game.bullets.push(_this);
        return _this;
    }
    Bullet.prototype.update = function () {
        this.lifeTime++;
        this.position.x += Math.cos(this.rotation) * this.speed;
        this.position.y += Math.sin(this.rotation) * this.speed;
        this.bulletTrailEmitter.updateSpawnPos(this.position.x, this.position.y);
        if (this.lifeTime > this.maxLifetime) {
            this.kill();
        }
        if (Util.checkCollisionWithWalls(this)) {
            this.kill();
            var bulletImpactContainer = new PIXI.Container();
            bulletImpactContainer.x = this.position.x;
            bulletImpactContainer.y = this.position.y;
            bulletImpactContainer.rotation = this.rotation + 135;
            Game.containers.push(bulletImpactContainer);
            var indexOfContainer = Game.containers.indexOf(bulletImpactContainer);
            Game.PIXI.stage.addChild(Game.containers[indexOfContainer]);
            var bulletImpactEmitter = new Emitter(Game.containers[indexOfContainer], [
                PIXI.loader.resources['./images/particles/particle.png'].texture
            ], PIXI.loader.resources['./json/bulletImpact.json'].data);
            var index2 = Game.emitters.indexOf(bulletImpactEmitter);
            Game.emitters[index2].start(100, true);
            var random = Math.floor(Math.random() * Math.floor(Game.sounds.bulletImpact.length));
            Game.sounds.bulletImpact[random].play();
        }
    };
    Bullet.prototype.kill = function () {
        Game.removeBullet(this);
        Game.removeContainer(this.bulletTrailContainer);
        Game.removeEmitter(this.bulletTrailEmitter);
    };
    return Bullet;
}(PIXI.Graphics));
var Emitter = (function (_super) {
    __extends(Emitter, _super);
    function Emitter(container, particleResourceTextures, config, repeat) {
        if (repeat === void 0) { repeat = false; }
        var _this = _super.call(this, container, particleResourceTextures, config) || this;
        _this.container = container;
        _this.elapsed = Date.now();
        if (!repeat) {
            _this.emit = false;
        }
        Game.emitters.push(_this);
        return _this;
    }
    Emitter.prototype.start = function (duration, deleteAfter) {
        var _this = this;
        if (duration === void 0) { duration = 0; }
        if (deleteAfter === void 0) { deleteAfter = false; }
        this.emit = true;
        if (duration > 0) {
            setTimeout(function () {
                _this.emit = false;
            }, duration);
            if (deleteAfter) {
                var maxLifeTime = PIXI.loader.resources['./json/bulletImpact.json'].data.lifetime.max * 1000;
                setTimeout(function () {
                    _this.kill();
                }, maxLifeTime);
            }
        }
    };
    Emitter.prototype.update = function () {
        var now = Date.now();
        _super.prototype.update.call(this, (now - this.elapsed) * 0.001);
        this.elapsed = Date.now();
    };
    Emitter.prototype.kill = function () {
        Game.removeEmitter(this);
        Game.removeContainer(this.container);
    };
    return Emitter;
}(PIXI.particles.Emitter));
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
var Walking = (function () {
    function Walking(entity) {
        this.speedMultiplier = 1;
        this.entity = entity;
    }
    Walking.prototype.move = function () {
        var actualSpeed = this.entity.baseSpeed * this.speedMultiplier;
        if ((this.entity.right && this.entity.down) || (this.entity.right && this.entity.up) || (this.entity.left && this.entity.down) || (this.entity.left && this.entity.up)) {
            actualSpeed = actualSpeed * 0.8;
            actualSpeed = actualSpeed * 0.8;
        }
        if (this.entity.up) {
            this.entity.y_speed -= actualSpeed;
        }
        if (this.entity.left) {
            this.entity.x_speed -= actualSpeed;
        }
        if (this.entity.right) {
            this.entity.x_speed += actualSpeed;
        }
        if (this.entity.down) {
            this.entity.y_speed += actualSpeed;
        }
        this.entity.sprite.x += this.entity.x_speed;
        if (Util.checkCollisionWithWalls(this.entity.sprite)) {
            this.entity.sprite.x -= this.entity.x_speed;
            this.entity.x_speed = 0;
        }
        this.entity.sprite.y += this.entity.y_speed;
        if (Util.checkCollisionWithWalls(this.entity.sprite)) {
            this.entity.sprite.y -= this.entity.y_speed;
            this.entity.y_speed = 0;
        }
        this.entity.x_speed *= 0.9;
        this.entity.y_speed *= 0.9;
    };
    return Walking;
}());
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
        _this.movement = new Walking(_this);
        _this.baseSpeed = 0.25;
        _this.shootingSpread = 15;
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
        this.sprite.y = Game.canvasHeight / 2;
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
    };
    Player.prototype.updateTexture = function (texture) {
        _super.prototype.updateTexture.call(this, texture);
        this.gunShotEmitter = new Emitter(this.gunShotContainer, [
            PIXI.loader.resources['./images/particles/particle.png'].texture,
            PIXI.loader.resources['./images/particles/Fire.png'].texture
        ], PIXI.loader.resources['./json/gunShot.json'].data);
    };
    Player.prototype.update = function () {
        this.gunShotContainer.x = this.sprite.x + Math.cos(this.sprite.rotation + this.gunOffset.angle) * this.gunOffset.distance;
        this.gunShotContainer.y = this.sprite.y + Math.sin(this.sprite.rotation + this.gunOffset.angle) * this.gunOffset.distance;
        this.gunShotContainer.rotation = this.sprite.rotation - 30;
        this.gunShotEmitter.update();
        this.movement.move();
        this.updateAim();
    };
    Player.prototype.shoot = function () {
        var perfectAngle = Util.rotateToPoint(Game.PIXI.renderer.plugins.interaction.mouse.global.x, Game.PIXI.renderer.plugins.interaction.mouse.global.y, this.gunShotContainer.x, this.gunShotContainer.y);
        var randomAngleAddition = Math.floor(Math.random() * this.shootingSpread) - this.shootingSpread / 2;
        var randomAngle = Util.toRadiant(Util.correctDegrees(Util.toDegrees(perfectAngle) + randomAngleAddition));
        new Bullet(this.gunShotContainer, {
            rotation: randomAngle,
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
    Util.toRadiant = function (degrees) {
        return degrees * Math.PI / 180;
    };
    Util.toDegrees = function (radians) {
        return radians * 180 / Math.PI;
    };
    Util.correctDegrees = function (degrees) {
        console.log('Correcting (' + degrees + ')');
        var correctDegrees = degrees;
        if (degrees > 180) {
            var rest = degrees - 180;
            correctDegrees = -180 + rest;
        }
        else if (degrees < -180) {
            var rest = degrees + 180;
            correctDegrees = 180 + rest;
        }
        console.log('Correct degrees (' + correctDegrees + ')');
        return correctDegrees;
    };
    return Util;
}());
//# sourceMappingURL=bundle.js.map