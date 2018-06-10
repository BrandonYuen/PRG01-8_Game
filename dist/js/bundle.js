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
        Game.sounds.emptyMagazine = new Howl({
            src: ['./sounds/emptyMagazine.wav'],
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
        Game.entities.push(Player.getInstance(Game.PIXI.stage, PIXI.loader.resources['./images/player/manBlue_gun.png'].texture));
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    Game.prototype.gameLoop = function () {
        var _this = this;
        for (var _i = 0, _a = Game.entities; _i < _a.length; _i++) {
            var e = _a[_i];
            e.update();
        }
        for (var _b = 0, _c = Game.bullets; _b < _c.length; _b++) {
            var b = _c[_b];
            b.update();
        }
        for (var _d = 0, _e = Game.emitters; _d < _e.length; _d++) {
            var e = _e[_d];
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
    Game.entities = [];
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
    function GameObject(stage, texture) {
        this.sprite = new PIXI.Sprite();
        stage.addChild(this.sprite);
        this.sprite.texture = texture;
    }
    return GameObject;
}());
var Entity = (function (_super) {
    __extends(Entity, _super);
    function Entity(stage, texture) {
        var _this = _super.call(this, stage, texture) || this;
        _this.observers = [];
        _this.left = false;
        _this.right = false;
        _this.up = false;
        _this.down = false;
        _this.x_speed = 0;
        _this.y_speed = 0;
        _this.movement = new Walking(_this);
        _this.baseSpeed = 0;
        return _this;
    }
    Entity.prototype.registerObserver = function (o) {
        this.observers.push(o);
    };
    Entity.prototype.removeObserver = function (o) {
        var index = this.observers.indexOf(o);
        this.observers.splice(index, 1);
    };
    return Entity;
}(GameObject));
var Gun = (function () {
    function Gun(subject) {
        this.maxAmmo = 0;
        this.ammo = 0;
        this.gunShotContainer = new PIXI.Container;
        this.accuracy = 1;
        this.shootingSpread = 0;
        this.subject = subject;
        subject.registerObserver(this);
        Game.PIXI.stage.addChild(this.gunShotContainer);
        this.gunShotEmitter = new Emitter(this.gunShotContainer, [
            PIXI.loader.resources['./images/particles/particle.png'].texture,
            PIXI.loader.resources['./images/particles/Fire.png'].texture
        ], PIXI.loader.resources['./json/gunShot.json'].data);
    }
    Gun.prototype.update = function () {
        this.gunShotEmitter.update();
    };
    Gun.prototype.shoot = function (targetPosition) {
        if (this.ammo <= 0) {
            Game.sounds.emptyMagazine.play();
            return;
        }
        this.shootingSound.play();
        this.ammo--;
        var perfectAngle = Util.rotateToPoint(targetPosition.x, targetPosition.y, this.gunShotContainer.x, this.gunShotContainer.y);
        var randomAngleAddition = Math.floor(Math.random() * this.shootingSpread) - this.shootingSpread / 2;
        var randomAngle = Util.toRadiant(Util.correctDegrees(Util.toDegrees(perfectAngle) + randomAngleAddition));
        new Bullet(this.gunShotContainer, {
            rotation: randomAngle,
            speed: 30
        });
        this.gunShotEmitter.start(100);
    };
    return Gun;
}());
var Pistol = (function (_super) {
    __extends(Pistol, _super);
    function Pistol(subject) {
        var _this = _super.call(this, subject) || this;
        _this.maxAmmo = 6;
        _this.ammo = _this.maxAmmo;
        _this.shootingSpread = 15;
        _this.gunOffset = {
            angle: 19.20,
            distance: 27
        };
        _this.shootingSound = Game.sounds.pistol1;
        return _this;
    }
    Pistol.prototype.shoot = function (targetPosition) {
        _super.prototype.shoot.call(this, targetPosition);
    };
    Pistol.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.subject instanceof Entity) {
        }
        this.gunShotContainer.x = this.subject.sprite.x + Math.cos(this.subject.sprite.rotation + this.gunOffset.angle) * this.gunOffset.distance;
        this.gunShotContainer.y = this.subject.sprite.y + Math.sin(this.subject.sprite.rotation + this.gunOffset.angle) * this.gunOffset.distance;
        this.gunShotContainer.rotation = this.subject.sprite.rotation - 30;
    };
    return Pistol;
}(Gun));
var Walking = (function () {
    function Walking(subject) {
        this.speedMultiplier = 1;
        this.subject = subject;
        subject.registerObserver(this);
    }
    Walking.prototype.update = function () {
        var actualSpeed = this.subject.baseSpeed * this.speedMultiplier;
        if ((this.subject.right && this.subject.down) || (this.subject.right && this.subject.up) || (this.subject.left && this.subject.down) || (this.subject.left && this.subject.up)) {
            actualSpeed = actualSpeed * 0.8;
            actualSpeed = actualSpeed * 0.8;
        }
        if (this.subject.up) {
            this.subject.y_speed -= actualSpeed;
        }
        if (this.subject.left) {
            this.subject.x_speed -= actualSpeed;
        }
        if (this.subject.right) {
            this.subject.x_speed += actualSpeed;
        }
        if (this.subject.down) {
            this.subject.y_speed += actualSpeed;
        }
        this.subject.sprite.x += this.subject.x_speed;
        if (Util.checkCollisionWithWalls(this.subject.sprite)) {
            this.subject.sprite.x -= this.subject.x_speed;
            this.subject.x_speed = 0;
        }
        this.subject.sprite.y += this.subject.y_speed;
        if (Util.checkCollisionWithWalls(this.subject.sprite)) {
            this.subject.sprite.y -= this.subject.y_speed;
            this.subject.y_speed = 0;
        }
        this.subject.x_speed *= 0.9;
        this.subject.y_speed *= 0.9;
    };
    return Walking;
}());
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(stage, texture) {
        var _this = _super.call(this, stage, texture) || this;
        _this.gunShotContainer = new PIXI.Container;
        _this.accuracy = 1;
        _this.baseSpeed = 0.25;
        _this.gun = new Pistol(_this);
        window.addEventListener("keydown", function (e) { return _this.keyListener(e); });
        window.addEventListener("keyup", function (e) { return _this.keyListener(e); });
        Game.PIXI.stage.on("mousedown", function () { return _this.shoot(); });
        _this.resetPosition();
        Game.PIXI.stage.addChild(_this.gunShotContainer);
        return _this;
    }
    Player.getInstance = function (stage, texture) {
        if (!Player.instance) {
            Player.instance = new Player(stage, texture);
        }
        return Player.instance;
    };
    Player.prototype.resetPosition = function () {
        this.sprite.x = Game.canvasWidth / 2;
        this.sprite.y = Game.canvasHeight / 2;
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
    };
    Player.prototype.update = function () {
        for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
            var observer = _a[_i];
            observer.update();
        }
        this.updateAim();
    };
    Player.prototype.shoot = function () {
        this.gun.shoot({ x: Game.PIXI.renderer.plugins.interaction.mouse.global.x, y: Game.PIXI.renderer.plugins.interaction.mouse.global.y });
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
}(Entity));
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
        var correctDegrees = degrees;
        if (degrees > 180) {
            var rest = degrees - 180;
            correctDegrees = -180 + rest;
        }
        else if (degrees < -180) {
            var rest = degrees + 180;
            correctDegrees = 180 + rest;
        }
        return correctDegrees;
    };
    return Util;
}());
//# sourceMappingURL=bundle.js.map