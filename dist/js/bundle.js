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
window.addEventListener("load", function () {
    Game.getInstance();
    Game.state = new Init();
});
var Init = (function () {
    function Init() {
        var _this = this;
        this.complete = false;
        console.log('Loading all assets...');
        PIXI.loader
            .add('./images/sprites/player.png')
            .add('./images/sprites/soldier.png')
            .add('./images/sprites/player_pistol.png')
            .add('./images/sprites/soldier_pistol.png')
            .add('./images/sprites/player_machinegun.png')
            .add('./images/sprites/soldier_machinegun.png')
            .add('./images/sprites/weapon_pistol.png')
            .add('./images/sprites/weapon_machinegun.png')
            .add('./images/particles/Fire.png')
            .add('./images/particles/particle.png')
            .add('./json/gunShot.json')
            .add('./json/bulletImpact.json')
            .add('./json/bulletTrail.json')
            .add('./json/blood.json')
            .add('./maps/01_intro.tmx')
            .add('./maps/03_sandwich.tmx')
            .load(function () { return _this.onLoaderComplete(); });
        Game.sounds.pistol = [];
        Game.sounds.pistol[0] = new Howl({
            src: ['./sounds/pistolShot1.mp3'],
            volume: 0.5,
            preload: true
        });
        Game.sounds.pistol[1] = new Howl({
            src: ['./sounds/pistolShot2.mp3'],
            volume: 0.5,
            preload: true
        });
        Game.sounds.machinegun = [];
        Game.sounds.machinegun[0] = new Howl({
            src: ['./sounds/machinegunShot1.mp3'],
            volume: 0.5,
            preload: true
        });
        Game.sounds.machinegun[1] = new Howl({
            src: ['./sounds/machinegunShot2.mp3'],
            volume: 0.5,
            preload: true
        });
        Game.sounds.machinegun[2] = new Howl({
            src: ['./sounds/machinegunShot3.mp3'],
            volume: 0.5,
            preload: true
        });
        Game.sounds.machinegun[3] = new Howl({
            src: ['./sounds/machinegunShot4.mp3'],
            volume: 0.5,
            preload: true
        });
        Game.sounds.machinegun[4] = new Howl({
            src: ['./sounds/machinegunShot5.mp3'],
            volume: 0.5,
            preload: true
        });
        Game.sounds.machinegun[5] = new Howl({
            src: ['./sounds/machinegunShot6.mp3'],
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
        Game.sounds.bulletImpactBody = [];
        Game.sounds.bulletImpactBody.push(new Howl({
            src: ['./sounds/bulletImpactBody1.wav'],
            volume: 1,
            preload: true
        }));
        Game.sounds.bulletImpactBody.push(new Howl({
            src: ['./sounds/bulletImpactBody2.wav'],
            volume: 1,
            preload: true
        }));
        Game.sounds.bulletImpactBody.push(new Howl({
            src: ['./sounds/bulletImpactBody3.wav'],
            volume: 1,
            preload: true
        }));
        Game.sounds.bulletImpactBody.push(new Howl({
            src: ['./sounds/bulletImpactBody4.wav'],
            volume: 1,
            preload: true
        }));
        Game.sounds.bulletImpactBody.push(new Howl({
            src: ['./sounds/bulletImpactBody5.wav'],
            volume: 1,
            preload: true
        }));
        Game.sounds.bulletImpactBody.push(new Howl({
            src: ['./sounds/bulletImpactBody6.wav'],
            volume: 1,
            preload: true
        }));
        Game.sounds.bulletImpactBody.push(new Howl({
            src: ['./sounds/bulletImpactBody7.wav'],
            volume: 1,
            preload: true
        }));
        Game.sounds.bulletImpactBody.push(new Howl({
            src: ['./sounds/bulletImpactBody8.wav'],
            volume: 1,
            preload: true
        }));
        Game.sounds.bulletImpactBody.push(new Howl({
            src: ['./sounds/bulletImpactBody9.wav'],
            volume: 1,
            preload: true
        }));
        Game.sounds.bulletImpactBody.push(new Howl({
            src: ['./sounds/bulletImpactBody10.wav'],
            volume: 1,
            preload: true
        }));
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
        Game.sounds.pistolReload = new Howl({
            src: ['./sounds/pistolReload.wav'],
            volume: 0.5,
            preload: true
        });
    }
    Init.prototype.onLoaderComplete = function () {
        MapLoader.initializeMapFiles();
        this.complete = true;
        Game.screen = new StartScreen();
    };
    Init.prototype.update = function () { };
    return Init;
}());
var Game = (function () {
    function Game() {
        Game.PIXI = new PIXI.Application({ width: Game.canvasWidth, height: Game.canvasHeight });
        Game.PIXI.stage.interactive = true;
        document.body.appendChild(Game.PIXI.view);
        Game.PIXI.stage.addChild(Game.tiledMapContainer);
        this.gameLoop();
    }
    Object.defineProperty(Game, "enemyCount", {
        get: function () {
            return Game._enemyCount;
        },
        set: function (count) {
            console.log('setting enemy count to: ', count);
            Game._enemyCount = count;
            if (count <= 0) {
                Game.state = new Complete();
            }
        },
        enumerable: true,
        configurable: true
    });
    Game.getInstance = function () {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    };
    Game.prototype.gameLoop = function () {
        var _this = this;
        if (Game.state != null) {
            Game.state.update();
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
    Game.removeGameObject = function (e) {
        var index = Game.gameObjects.indexOf(e);
        if (index !== -1) {
            Game.gameObjects.splice(index, 1);
        }
    };
    Game.removeWall = function (w) {
        var index = Game.walls.indexOf(w);
        if (index !== -1) {
            Game.walls.splice(index, 1);
        }
    };
    Object.defineProperty(Game, "player", {
        get: function () {
            for (var _i = 0, _a = Game.gameObjects; _i < _a.length; _i++) {
                var e = _a[_i];
                if (e instanceof Player) {
                    return e;
                }
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Game.canvasWidth = 1600;
    Game.canvasHeight = 896;
    Game.BUMP = new Bump(PIXI);
    Game.tiledMapContainer = new PIXI.Container();
    Game.bullets = [];
    Game.sounds = {};
    Game.walls = [];
    Game.emitters = [];
    Game.containers = [];
    Game.gameObjects = [];
    Game.points = 0;
    Game._enemyCount = 0;
    return Game;
}());
var Patrol = (function () {
    function Patrol(subject, direction) {
        this.subject = subject;
        switch (direction) {
            case "horizontal":
                this.direction = "horizontal";
                if (Math.random() > 0.5) {
                    this.subject.left = true;
                }
                else {
                    this.subject.right = true;
                }
                break;
            case "vertical":
                this.direction = "vertical";
                if (Math.random() > 0.5) {
                    this.subject.up = true;
                }
                else {
                    this.subject.down = true;
                }
                break;
            default:
                this.direction = "stationary";
                break;
        }
    }
    Patrol.prototype.setDirection = function () {
    };
    Patrol.prototype.onCollide = function () {
        switch (this.direction) {
            case "horizontal":
                if (this.subject.left) {
                    this.subject.left = false;
                    this.subject.right = true;
                }
                else {
                    this.subject.left = true;
                    this.subject.right = false;
                }
                break;
            case "vertical":
                if (this.subject.up) {
                    this.subject.up = false;
                    this.subject.down = true;
                }
                else {
                    this.subject.up = true;
                    this.subject.down = false;
                }
                break;
        }
    };
    return Patrol;
}());
var MovingState = (function () {
    function MovingState(subject) {
        this.speedMultiplier = 1;
        this.options = {
            runningSpeedMultiplier: 1.8,
            walkingSpeedMultiplier: 1
        };
        this._state = 'walking';
        this.subject = subject;
        subject.registerObserver(this);
    }
    Object.defineProperty(MovingState.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (state) {
            if (this._state == state)
                return;
            switch (state) {
                case 'walking':
                    this.speedMultiplier = this.options.walkingSpeedMultiplier;
                    this._state = state;
                    break;
                case 'running':
                    this.speedMultiplier = this.options.runningSpeedMultiplier;
                    this._state = state;
                    break;
            }
        },
        enumerable: true,
        configurable: true
    });
    MovingState.prototype.switchState = function (state) {
    };
    MovingState.prototype.update = function () {
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
            if (this.subject instanceof EnemySoldier)
                this.subject.AI.onCollide();
        }
        this.subject.sprite.y += this.subject.y_speed;
        if (Util.checkCollisionWithWalls(this.subject.sprite)) {
            this.subject.sprite.y -= this.subject.y_speed;
            this.subject.y_speed = 0;
            if (this.subject instanceof EnemySoldier)
                this.subject.AI.onCollide();
        }
        this.subject.x_speed *= 0.9;
        this.subject.y_speed *= 0.9;
    };
    return MovingState;
}());
var GameObject = (function () {
    function GameObject(stage, texture) {
        this._sprite = new PIXI.Sprite();
        stage.addChild(this.sprite);
        this.sprite.texture = texture;
    }
    GameObject.prototype.kill = function () {
        Game.removeGameObject(this);
        Game.PIXI.stage.removeChild(this.sprite);
    };
    Object.defineProperty(GameObject.prototype, "sprite", {
        get: function () {
            return this._sprite;
        },
        enumerable: true,
        configurable: true
    });
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
        _this.reload = false;
        _this.x_speed = 0;
        _this.y_speed = 0;
        _this.movement = new MovingState(_this);
        _this._baseSpeed = 0;
        _this._reloadBar = new ActionBar(_this, 100, 20, 25);
        _this._ammoBar = new ActionBar(_this, 50, 20, -75);
        _this._healthBar = new HealthBar(_this);
        _this._maxHealth = 100;
        _this._health = _this._maxHealth;
        _this._gun = new Unarmed(_this);
        _this.visionLine = new VisionLine(_this);
        _this.visionLine.visible = false;
        _this.update();
        return _this;
    }
    Entity.prototype.registerObserver = function (o) {
        this.observers.push(o);
    };
    Entity.prototype.removeObserver = function (o) {
        var index = this.observers.indexOf(o);
        this.observers.splice(index, 1);
    };
    Object.defineProperty(Entity.prototype, "gun", {
        get: function () {
            return this._gun;
        },
        set: function (gun) {
            this._gun.remove();
            this._gun = gun;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "health", {
        get: function () {
            return this._health;
        },
        set: function (health) {
            this._health = health;
            if (this._health <= 0) {
                this._health = 0;
                this.kill();
            }
            else if (this._health > this.maxHealth) {
                this._health = this.maxHealth;
            }
            this.healthBar.updateHealth();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "maxHealth", {
        get: function () {
            return this._maxHealth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "baseSpeed", {
        get: function () {
            return this._baseSpeed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "reloadBar", {
        get: function () {
            return this._reloadBar;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "healthBar", {
        get: function () {
            return this._healthBar;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "ammoBar", {
        get: function () {
            return this._ammoBar;
        },
        enumerable: true,
        configurable: true
    });
    Entity.prototype.update = function () {
        for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
            var observer = _a[_i];
            observer.update();
        }
        this.visionLine.update();
    };
    Entity.prototype.kill = function () {
        _super.prototype.kill.call(this);
        Game.removeGameObject(this);
        if (this.gun instanceof Gun) {
            this.gun.remove();
        }
        this.healthBar.remove();
        this.reloadBar.remove();
        this.ammoBar.remove();
        this.visionLine.remove();
    };
    return Entity;
}(GameObject));
var EnemySoldier = (function (_super) {
    __extends(EnemySoldier, _super);
    function EnemySoldier(stage, texture, patrolDirection) {
        var _this = _super.call(this, stage, texture) || this;
        _this._baseSpeed = 0.25;
        _this.pointsOnKill = 10;
        _this._maxHealth = 50;
        _this.AI = new Patrol(_this, patrolDirection);
        _this.gun = new Pistol(_this);
        _this.sprite.x = Game.canvasWidth - 300;
        _this.sprite.y = Game.canvasHeight / 2;
        _this.sprite.anchor.x = 0.5;
        _this.sprite.anchor.y = 0.5;
        Game.enemyCount++;
        return _this;
    }
    EnemySoldier.prototype.update = function () {
        _super.prototype.update.call(this);
        this.updateAim();
        if (this.gun instanceof Gun) {
            if (this.checkVisionOnPlayer()) {
                this.gun.visionLine.alpha = 0.7;
                var randomNumber = Math.random() * 100;
                if (randomNumber < 3) {
                    this.shoot();
                }
            }
            else {
                this.gun.visionLine.alpha = 0.2;
            }
        }
    };
    EnemySoldier.prototype.checkVisionOnPlayer = function () {
        var vision = false;
        var player = Game.player;
        if (this.gun instanceof Gun && player != null) {
            var visionLineEndPoint = this.gun.visionLine.getEndPoint();
            var barrelPosition = this.gun.getBarrelPosition();
            var line = {
                first: {
                    x: barrelPosition.x,
                    y: barrelPosition.y
                },
                second: {
                    x: visionLineEndPoint.x,
                    y: visionLineEndPoint.y
                }
            };
            var wallPoint = Util.checkCollisionLineWalls(line);
            if (wallPoint != false) {
                if (wallPoint.shortestDistance > math.distance([Game.player.sprite.x, Game.player.sprite.y], [barrelPosition.x, barrelPosition.y])) {
                    return true;
                }
            }
        }
        return false;
    };
    EnemySoldier.prototype.shoot = function () {
        if (this.gun instanceof Gun) {
            if (this.gun.ammo <= 0)
                this.gun.reload();
            this.gun.shoot();
        }
    };
    EnemySoldier.prototype.updateAim = function () {
        var angle = Util.rotateToPoint(Game.gameObjects[0].sprite.x, Game.gameObjects[0].sprite.y, this.sprite.x, this.sprite.y);
        this.sprite.rotation = angle;
    };
    EnemySoldier.prototype.kill = function () {
        _super.prototype.kill.call(this);
        if (Game.state instanceof Play) {
            Game.enemyCount--;
            Game.points = Game.points + this.pointsOnKill;
        }
    };
    return EnemySoldier;
}(Entity));
var Item = (function (_super) {
    __extends(Item, _super);
    function Item(type, stage, texture) {
        var _this = _super.call(this, stage, texture) || this;
        _this.maxScale = 1.5;
        _this.scalingState = 'expanding';
        _this._type = type;
        _this.sprite.anchor.x = 0.5;
        _this.sprite.anchor.y = 0.5;
        return _this;
    }
    Object.defineProperty(Item.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Item.prototype.update = function () {
        this.sprite.rotation = Util.toRadiant(Util.toDegrees(this.sprite.rotation) + 2);
        if (this.scalingState == 'expanding') {
            this.sprite.scale.x = this.sprite.scale.x + 0.005;
            this.sprite.scale.y = this.sprite.scale.y + 0.005;
            if (this.sprite.scale.x >= this.maxScale) {
                this.scalingState = 'shrinking';
            }
        }
        else {
            this.sprite.scale.x = this.sprite.scale.x - 0.005;
            this.sprite.scale.y = this.sprite.scale.y - 0.005;
            if (this.sprite.scale.x <= 1) {
                this.scalingState = 'expanding';
            }
        }
    };
    return Item;
}(GameObject));
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(stage, texture) {
        var _this = _super.call(this, stage, texture) || this;
        _this.mouseDown = false;
        _this._baseSpeed = 0.25;
        _this._maxHealth = 150;
        window.addEventListener("keydown", function (e) { return _this.keyListener(e); });
        window.addEventListener("keyup", function (e) { return _this.keyListener(e); });
        Game.PIXI.stage.on("mousedown", function (e) { return _this.mouseListener(e); });
        Game.PIXI.stage.on("mouseup", function (e) { return _this.mouseListener(e); });
        _this.sprite.x = 300;
        _this.sprite.y = Game.canvasHeight / 2;
        _this.sprite.anchor.x = 0.5;
        _this.sprite.anchor.y = 0.5;
        _this.health = _this._maxHealth;
        _this.gun.visionLine.visible = false;
        return _this;
    }
    Object.defineProperty(Player.prototype, "gun", {
        get: function () {
            return this._gun;
        },
        set: function (gun) {
            this._gun.remove();
            this._gun = gun;
            this.gun.visionLine.visible = false;
        },
        enumerable: true,
        configurable: true
    });
    Player.prototype.update = function () {
        _super.prototype.update.call(this);
        this.updateAim();
        this.pickupCheck();
        if (this.mouseDown) {
            this.shoot();
            if (this.gun instanceof Pistol) {
                this.mouseDown = false;
            }
        }
    };
    Player.prototype.pickupCheck = function () {
        for (var _i = 0, _a = Game.gameObjects; _i < _a.length; _i++) {
            var i = _a[_i];
            if (i instanceof Item) {
                if (Game.BUMP.hit(this.sprite, i.sprite)) {
                    if (i.type == 'Pistol') {
                        this.gun = new Pistol(this);
                        i.kill();
                    }
                    else if (i.type == 'MachineGun') {
                        this.gun = new MachineGun(this);
                        i.kill();
                    }
                }
            }
        }
    };
    Player.prototype.shoot = function () {
        if (this.gun) {
            this.gun.shoot();
        }
    };
    Player.prototype.reloadGun = function () {
        if (this.gun) {
            this.gun.reload();
        }
    };
    Player.prototype.mouseListener = function (event) {
        this.mouseDown = (event.type == "mousedown") ? true : false;
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
            case 82:
                this.reloadGun();
                break;
            case 16:
                if (key_state) {
                    this.movement.state = 'running';
                }
                else {
                    this.movement.state = 'walking';
                }
                break;
        }
    };
    Player.prototype.updateAim = function () {
        this.sprite.rotation = Util.rotateToPoint(Game.PIXI.renderer.plugins.interaction.mouse.global.x, Game.PIXI.renderer.plugins.interaction.mouse.global.y, this.sprite.x, this.sprite.y);
    };
    Player.prototype.kill = function () {
        _super.prototype.kill.call(this);
    };
    return Player;
}(Entity));
var Complete = (function () {
    function Complete() {
        MapLoader.unloadCurrentMap();
    }
    Complete.prototype.update = function () {
    };
    return Complete;
}());
var Play = (function () {
    function Play() {
        MapLoader.loadNextMap();
    }
    Play.prototype.update = function () {
        for (var _i = 0, _a = Game.bullets; _i < _a.length; _i++) {
            var b = _a[_i];
            b.update();
        }
        for (var _b = 0, _c = Game.emitters; _b < _c.length; _b++) {
            var e = _c[_b];
            e.update();
        }
        for (var _d = 0, _e = Game.gameObjects; _d < _e.length; _d++) {
            var g = _e[_d];
            g.update();
        }
    };
    return Play;
}());
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(gunShotContainer, attributes) {
        var _this = _super.call(this) || this;
        _this.speed = 1;
        _this.maxLifetime = 150;
        _this.bulletTrailContainer = new PIXI.Container;
        _this.lifeTime = 0;
        _this.shooter = attributes.shooter || null;
        _this.damage = attributes.damage || 1;
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
        var collisionCheck = Util.checkCollisionWithEntities(this);
        if (collisionCheck != false) {
            if (collisionCheck != this.shooter) {
                if ((this.shooter instanceof EnemySoldier && collisionCheck instanceof EnemySoldier) || collisionCheck instanceof Item) {
                    return;
                }
                collisionCheck.health -= this.damage;
                var bulletImpactContainer = new PIXI.Container();
                bulletImpactContainer.x = this.position.x;
                bulletImpactContainer.y = this.position.y;
                bulletImpactContainer.rotation = this.rotation;
                Game.containers.push(bulletImpactContainer);
                var indexOfContainer = Game.containers.indexOf(bulletImpactContainer);
                Game.PIXI.stage.addChild(Game.containers[indexOfContainer]);
                var bulletImpactEmitter = new Emitter(Game.containers[indexOfContainer], [
                    PIXI.loader.resources['./images/particles/particle.png'].texture
                ], PIXI.loader.resources['./json/blood.json'].data);
                var index2 = Game.emitters.indexOf(bulletImpactEmitter);
                Game.emitters[index2].start(100, true);
                var random = Math.floor(Math.random() * Math.floor(Game.sounds.bulletImpactBody.length));
                Game.sounds.bulletImpactBody[random].play();
                this.kill();
            }
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
var VisionLine = (function (_super) {
    __extends(VisionLine, _super);
    function VisionLine(subject) {
        var _this = _super.call(this) || this;
        _this.subject = subject;
        _this.beginFill(0xd63600);
        _this.drawRect(0, 0, 1, Game.canvasWidth);
        _this.endFill();
        _this.alpha = 1;
        Game.PIXI.stage.addChild(_this);
        return _this;
    }
    VisionLine.prototype.update = function () {
        var beginPosition = { x: 0, y: 0 };
        var rotation = 0;
        if (this.subject instanceof Entity) {
            beginPosition = { x: this.subject.sprite.x, y: this.subject.sprite.y };
            rotation = Util.toRadiant(Util.toDegrees(this.subject.sprite.rotation) - 90);
        }
        else if (this.subject instanceof Gun) {
            beginPosition = this.subject.getBarrelPosition();
            rotation = Util.toRadiant(Util.toDegrees(this.subject.subject.sprite.rotation) - 91);
            this.height = this.getMaxDistance();
        }
        this.position.x = beginPosition.x;
        this.position.y = beginPosition.y;
        this.rotation = rotation;
    };
    VisionLine.prototype.getEndPoint = function () {
        if (this.subject instanceof Gun) {
            return {
                x: this.subject.subject.sprite.x + Math.cos(Util.toRadiant(Util.toDegrees(this.rotation) + 91)) * Game.canvasWidth,
                y: this.subject.subject.sprite.y + Math.sin(Util.toRadiant(Util.toDegrees(this.rotation) + 91)) * Game.canvasWidth
            };
        }
        else if (this.subject instanceof Entity) {
            return {
                x: this.subject.sprite.x + Math.cos(Util.toRadiant(Util.toDegrees(this.rotation) + 90)) * Game.canvasWidth,
                y: this.subject.sprite.y + Math.sin(Util.toRadiant(Util.toDegrees(this.rotation) + 90)) * Game.canvasWidth
            };
        }
    };
    VisionLine.prototype.getMaxDistance = function () {
        var visionLineEndPoint = { x: 0, y: 0 };
        var beginPosition = { x: 0, y: 0 };
        if (this.subject instanceof Gun) {
            visionLineEndPoint = this.getEndPoint();
            beginPosition = this.subject.getBarrelPosition();
        }
        else if (this.subject instanceof Player) {
            visionLineEndPoint = this.getEndPoint();
            beginPosition = {
                x: this.subject.sprite.x,
                y: this.subject.sprite.y
            };
        }
        var line = {
            first: {
                x: beginPosition.x,
                y: beginPosition.y
            },
            second: {
                x: visionLineEndPoint.x,
                y: visionLineEndPoint.y
            }
        };
        var player = Game.player;
        if (player instanceof Player && this.subject instanceof Gun) {
            if (this.subject.subject instanceof EnemySoldier) {
                if (this.subject.subject.checkVisionOnPlayer()) {
                    return math.distance([beginPosition.x, beginPosition.y], [Game.player.sprite.x, Game.player.sprite.y]);
                }
            }
        }
        var wallPoint = Util.checkCollisionLineWalls(line);
        if (wallPoint != false) {
            return wallPoint.shortestDistance;
        }
        return -1;
    };
    VisionLine.prototype.remove = function () {
        Game.PIXI.stage.removeChild(this);
    };
    return VisionLine;
}(PIXI.Graphics));
var MapLoader = (function () {
    function MapLoader() {
    }
    MapLoader.initializeMapFiles = function () {
        MapLoader.maps = [
            new PIXI.extras.TiledMap("./maps/03_sandwich.tmx")
        ];
    };
    MapLoader.loadNextMap = function () {
        var nextMap = MapLoader.maps[MapLoader.currentMapIndex + 1];
        MapLoader.loadMap(nextMap);
    };
    MapLoader.loadMap = function (name) {
        this.unloadCurrentMap();
        var mapIndex = MapLoader.maps.indexOf(name);
        var map = MapLoader.maps[mapIndex];
        MapLoader.currentMapIndex = mapIndex;
        Game.tiledMapContainer.addChild(map);
        for (var _i = 0, _a = Game.tiledMapContainer.children[0].children; _i < _a.length; _i++) {
            var layer = _a[_i];
            console.log('loading layer (' + layer.name + ')');
            switch (layer.name) {
                case 'Pistols':
                    for (var _b = 0, _c = layer.children; _b < _c.length; _b++) {
                        var e = _c[_b];
                        var item = new Item('Pistol', Game.PIXI.stage, PIXI.loader.resources['./images/sprites/weapon_pistol.png'].texture);
                        Game.gameObjects.push(item);
                        console.log('Placed Pistol with index: ', Game.gameObjects.indexOf(item));
                        Game.gameObjects[Game.gameObjects.indexOf(item)].sprite.x = e.x + 32;
                        Game.gameObjects[Game.gameObjects.indexOf(item)].sprite.y = e.y + 32;
                    }
                    for (var _d = 0, _e = layer.children; _d < _e.length; _d++) {
                        var e = _e[_d];
                        e.visible = false;
                    }
                    break;
                case 'MachineGuns':
                    for (var _f = 0, _g = layer.children; _f < _g.length; _f++) {
                        var e = _g[_f];
                        var item = new Item('MachineGun', Game.PIXI.stage, PIXI.loader.resources['./images/sprites/weapon_machinegun.png'].texture);
                        Game.gameObjects.push(item);
                        console.log('Placed MachineGun with index: ', Game.gameObjects.indexOf(item));
                        Game.gameObjects[Game.gameObjects.indexOf(item)].sprite.x = e.x + 32;
                        Game.gameObjects[Game.gameObjects.indexOf(item)].sprite.y = e.y + 32;
                    }
                    for (var _h = 0, _j = layer.children; _h < _j.length; _h++) {
                        var e = _j[_h];
                        e.visible = false;
                    }
                    break;
                case 'Player':
                    for (var _k = 0, _l = layer.children; _k < _l.length; _k++) {
                        var p = _l[_k];
                        var player = new Player(Game.PIXI.stage, PIXI.loader.resources['./images/sprites/player.png'].texture);
                        Game.gameObjects.push(player);
                        console.log('Placed player with index: ', Game.gameObjects.indexOf(player));
                        Game.gameObjects[Game.gameObjects.indexOf(player)].sprite.x = p.x + 32;
                        Game.gameObjects[Game.gameObjects.indexOf(player)].sprite.y = p.y + 32;
                    }
                    for (var _m = 0, _o = layer.children; _m < _o.length; _m++) {
                        var p = _o[_m];
                        p.visible = false;
                    }
                    break;
                case 'EnemiesStationary':
                    for (var _p = 0, _q = layer.children; _p < _q.length; _p++) {
                        var e = _q[_p];
                        var enemy = new EnemySoldier(Game.PIXI.stage, PIXI.loader.resources['./images/sprites/soldier.png'].texture, 'stationary');
                        Game.gameObjects.push(enemy);
                        console.log('Placed EnemiesStationary with index: ', Game.gameObjects.indexOf(enemy));
                        Game.gameObjects[Game.gameObjects.indexOf(enemy)].sprite.x = e.x + 32;
                        Game.gameObjects[Game.gameObjects.indexOf(enemy)].sprite.y = e.y + 32;
                    }
                    for (var _r = 0, _s = layer.children; _r < _s.length; _r++) {
                        var e = _s[_r];
                        e.visible = false;
                    }
                    break;
                case 'EnemiesHorizontal':
                    for (var _t = 0, _u = layer.children; _t < _u.length; _t++) {
                        var e = _u[_t];
                        var enemy = new EnemySoldier(Game.PIXI.stage, PIXI.loader.resources['./images/sprites/soldier.png'].texture, 'horizontal');
                        Game.gameObjects.push(enemy);
                        console.log('Placed EnemiesHorizontal with index: ', Game.gameObjects.indexOf(enemy));
                        Game.gameObjects[Game.gameObjects.indexOf(enemy)].sprite.x = e.x + 32;
                        Game.gameObjects[Game.gameObjects.indexOf(enemy)].sprite.y = e.y + 32;
                    }
                    for (var _v = 0, _w = layer.children; _v < _w.length; _v++) {
                        var e = _w[_v];
                        e.visible = false;
                    }
                    break;
                case 'EnemiesVertical':
                    for (var _x = 0, _y = layer.children; _x < _y.length; _x++) {
                        var e = _y[_x];
                        var enemy = new EnemySoldier(Game.PIXI.stage, PIXI.loader.resources['./images/sprites/soldier.png'].texture, 'vertical');
                        Game.gameObjects.push(enemy);
                        console.log('Placed enemy with index: ', Game.gameObjects.indexOf(enemy));
                        Game.gameObjects[Game.gameObjects.indexOf(enemy)].sprite.x = e.x + 32;
                        Game.gameObjects[Game.gameObjects.indexOf(enemy)].sprite.y = e.y + 32;
                    }
                    for (var _z = 0, _0 = layer.children; _z < _0.length; _z++) {
                        var e = _0[_z];
                        e.visible = false;
                    }
                    break;
                case 'Walls':
                    for (var _1 = 0, _2 = layer.children; _1 < _2.length; _1++) {
                        var w = _2[_1];
                        Game.walls.push(w);
                    }
                    break;
            }
        }
    };
    MapLoader.unloadCurrentMap = function () {
        var gameObjectsArray = [];
        for (var _i = 0, _a = Game.gameObjects; _i < _a.length; _i++) {
            var g = _a[_i];
            gameObjectsArray.push(g);
        }
        for (var _b = 0, gameObjectsArray_1 = gameObjectsArray; _b < gameObjectsArray_1.length; _b++) {
            var g = gameObjectsArray_1[_b];
            g.kill();
        }
        var wallsArray = [];
        for (var _c = 0, _d = Game.walls; _c < _d.length; _c++) {
            var w = _d[_c];
            wallsArray.push(w);
        }
        for (var _e = 0, wallsArray_1 = wallsArray; _e < wallsArray_1.length; _e++) {
            var w = wallsArray_1[_e];
            Game.removeWall(w);
        }
        var containersArray = [];
        for (var _f = 0, _g = Game.containers; _f < _g.length; _f++) {
            var c = _g[_f];
            containersArray.push(c);
        }
        for (var _h = 0, containersArray_1 = containersArray; _h < containersArray_1.length; _h++) {
            var c = containersArray_1[_h];
            Game.removeContainer(c);
        }
        var bulletsArray = [];
        for (var _j = 0, _k = Game.bullets; _j < _k.length; _j++) {
            var b = _k[_j];
            bulletsArray.push(b);
        }
        for (var _l = 0, bulletsArray_1 = bulletsArray; _l < bulletsArray_1.length; _l++) {
            var b = bulletsArray_1[_l];
            Game.removeContainer(b);
        }
        Game.tiledMapContainer.removeChild(MapLoader.maps[this.currentMapIndex]);
    };
    MapLoader.maps = [];
    MapLoader.currentMapIndex = -1;
    return MapLoader;
}());
var Util = (function () {
    function Util() {
    }
    Util.rotateToPoint = function (mx, my, px, py) {
        var dist_Y = my - py;
        var dist_X = mx - px;
        var angle = Math.atan2(dist_Y, dist_X);
        return angle;
    };
    Util.checkCollisionWithWalls = function (object, returnSprite) {
        if (returnSprite === void 0) { returnSprite = false; }
        var colliding = false;
        for (var _i = 0, _a = Game.walls; _i < _a.length; _i++) {
            var w = _a[_i];
            if (Game.BUMP.hitTestRectangle(object, w)) {
                if (returnSprite) {
                    colliding = w;
                }
                else {
                    colliding = true;
                }
            }
        }
        return colliding;
    };
    Util.checkCollisionWithEntities = function (object) {
        var colliding = false;
        for (var _i = 0, _a = Game.gameObjects; _i < _a.length; _i++) {
            var e = _a[_i];
            if (Game.BUMP.hit(object, e.sprite)) {
                colliding = e;
                break;
            }
        }
        return colliding;
    };
    Util.checkCollisionLineRectangle = function (line1, rec) {
        var recLines = [
            {
                first: {
                    x: rec.x,
                    y: rec.y
                },
                second: {
                    x: rec.x,
                    y: rec.y + rec.heigth
                }
            },
            {
                first: {
                    x: rec.x + rec.width,
                    y: rec.y
                },
                second: {
                    x: rec.x + rec.width,
                    y: rec.y + rec.heigth
                }
            },
            {
                first: {
                    x: rec.x,
                    y: rec.y
                },
                second: {
                    x: rec.x + rec.width,
                    y: rec.y
                }
            },
            {
                first: {
                    x: rec.x,
                    y: rec.y + rec.heigth
                },
                second: {
                    x: rec.x + rec.width,
                    y: rec.y + rec.heigth
                }
            }
        ];
        var collidingSides = [];
        var shortestSidePosition = false;
        for (var _i = 0, recLines_1 = recLines; _i < recLines_1.length; _i++) {
            var side = recLines_1[_i];
            var result = Util.checkLineIntersection(line1.first.x, line1.first.y, line1.second.x, line1.second.y, side.first.x, side.first.y, side.second.x, side.second.y);
            if (result.onLine1 == true && result.onLine2 == true && result.x != null && result.y != null) {
                collidingSides.push({
                    x: result.x,
                    y: result.y
                });
            }
        }
        if (collidingSides.length > 1) {
            shortestSidePosition = collidingSides[0];
            shortestSidePosition.distance = math.distance([collidingSides[0].x, collidingSides[0].y], [line1.first.x, line1.first.y]);
            for (var i = 1; i < collidingSides.length; i++) {
                var side = collidingSides[i];
                var newDistance = math.distance([side.x, side.y], [line1.first.x, line1.first.y]);
                if (newDistance < shortestSidePosition.distance) {
                    shortestSidePosition = side;
                    shortestSidePosition.distance = newDistance;
                }
            }
        }
        return shortestSidePosition;
    };
    Util.checkLineIntersection = function (line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
        var denominator, a, b, numerator1, numerator2, result = {
            x: null,
            y: null,
            onLine1: false,
            onLine2: false
        };
        denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
        if (denominator == 0) {
            return result;
        }
        a = line1StartY - line2StartY;
        b = line1StartX - line2StartX;
        numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
        numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
        a = numerator1 / denominator;
        b = numerator2 / denominator;
        result.x = line1StartX + (a * (line1EndX - line1StartX));
        result.y = line1StartY + (a * (line1EndY - line1StartY));
        if (a > 0 && a < 1) {
            result.onLine1 = true;
        }
        if (b > 0 && b < 1) {
            result.onLine2 = true;
        }
        return result;
    };
    Util.checkCollisionLineWalls = function (line) {
        var colliding = false;
        var collidingPoints = [];
        for (var _i = 0, _a = Game.walls; _i < _a.length; _i++) {
            var w = _a[_i];
            var rec = {
                x: w.position.x,
                y: w.position.y,
                width: w.width,
                heigth: w.height
            };
            var checkWall = Util.checkCollisionLineRectangle(line, rec);
            if (checkWall != false) {
                collidingPoints.push(checkWall);
            }
        }
        if (collidingPoints.length > 0) {
            colliding = collidingPoints[0];
            var shortestDistance = math.distance([collidingPoints[0].x, collidingPoints[0].y], [line.first.x, line.first.y]);
            colliding.shortestDistance = shortestDistance;
            for (var i = 0; i < collidingPoints.length; i++) {
                var point = collidingPoints[i];
                var newDistance = math.distance([point.x, point.y], [line.first.x, line.first.y]);
                if (newDistance < shortestDistance) {
                    colliding = point;
                    shortestDistance = newDistance;
                    colliding.shortestDistance = shortestDistance;
                }
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
var Gun = (function () {
    function Gun(subject) {
        var _this = this;
        this._maxAmmo = 0;
        this._ammo = 0;
        this._damage = 0;
        this.shootingDelay = 0;
        this.gunShotContainer = new PIXI.Container;
        this.accuracy = 1;
        this.shootingSpread = 0;
        this.minShootingSpread = 3;
        this.reloadingTime = 2;
        this.reloading = false;
        this.shooting = false;
        this._visionLine = new VisionLine(this);
        this._subject = subject;
        subject.registerObserver(this);
        Game.PIXI.stage.addChild(this.gunShotContainer);
        this.gunShotEmitter = new Emitter(this.gunShotContainer, [
            PIXI.loader.resources['./images/particles/particle.png'].texture,
            PIXI.loader.resources['./images/particles/Fire.png'].texture
        ], PIXI.loader.resources['./json/gunShot.json'].data);
        setTimeout(function () {
            _this.updateAmmoBar();
        }, 500);
    }
    Object.defineProperty(Gun.prototype, "damage", {
        get: function () {
            return this._damage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gun.prototype, "maxAmmo", {
        get: function () {
            return this._maxAmmo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gun.prototype, "subject", {
        get: function () {
            return this._subject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gun.prototype, "visionLine", {
        get: function () {
            return this._visionLine;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gun.prototype, "ammo", {
        get: function () {
            return this._ammo;
        },
        set: function (ammo) {
            this._ammo = ammo;
            this.updateAmmoBar();
        },
        enumerable: true,
        configurable: true
    });
    Gun.prototype.update = function () {
        this.gunShotEmitter.update();
        this.visionLine.update();
    };
    Gun.prototype.reload = function () {
        var _this = this;
        if (!this.reloading && !this.shooting) {
            this.reloading = true;
            if (this.subject instanceof Player)
                this.reloadingSound.play();
            this.subject.reloadBar.setText('RELOADING');
            setTimeout(function () {
                _this.ammo = _this.maxAmmo;
                _this.subject.reloadBar.setText('');
                _this.reloading = false;
            }, this.reloadingTime * 1000);
        }
    };
    Gun.prototype.shoot = function () {
        var _this = this;
        if (this.reloading || this.shooting) {
            return;
        }
        else if (this.ammo <= 0) {
            if (this.subject instanceof Player)
                Game.sounds.emptyMagazine.play();
            this.shooting = true;
            setTimeout(function () {
                _this.shooting = false;
            }, this.shootingDelay * 1000);
            return;
        }
        this.shootingSound.play();
        this.ammo--;
        this.shooting = true;
        setTimeout(function () {
            _this.shooting = false;
        }, this.shootingDelay * 1000);
        var visionLineEndPoint = this.visionLine.getEndPoint();
        var perfectAngle = Util.rotateToPoint(visionLineEndPoint.x, visionLineEndPoint.y, this.gunShotContainer.x, this.gunShotContainer.y);
        var shootingSpread = this.minShootingSpread + this.shootingSpread * (this.subject.x_speed + this.subject.y_speed);
        var randomAngleAddition = Math.floor(Math.random() * shootingSpread) - shootingSpread / 2;
        var randomAngle = Util.toRadiant(Util.correctDegrees(Util.toDegrees(perfectAngle) + randomAngleAddition));
        new Bullet(this.gunShotContainer, {
            rotation: randomAngle,
            speed: 30,
            damage: this.damage,
            shooter: this.subject
        });
        this.gunShotEmitter.start(100);
    };
    Gun.prototype.remove = function () {
        Game.PIXI.stage.removeChild(this.gunShotContainer);
        this.visionLine.remove();
        this.subject.removeObserver(this);
    };
    Gun.prototype.updateAmmoBar = function () {
        this.subject.ammoBar.setText(this.ammo.toString() + '/' + this.maxAmmo.toString());
    };
    return Gun;
}());
var MachineGun = (function (_super) {
    __extends(MachineGun, _super);
    function MachineGun(subject) {
        var _this = _super.call(this, subject) || this;
        _this.textureForPlayer = PIXI.loader.resources['./images/sprites/player_machinegun.png'].texture;
        _this.textureForEnemy = PIXI.loader.resources['./images/sprites/soldier_machinegun.png'].texture;
        _this._maxAmmo = 30;
        _this.ammo = _this.maxAmmo;
        _this._damage = 10;
        _this.shootingDelay = 0.1;
        _this.reloadingTime = 4;
        _this.shootingSpread = 9;
        _this.minShootingSpread = 7;
        _this.gunOffset = {
            angle: 19.20,
            distance: 27
        };
        _this.shootingSound = Game.sounds.machinegun[Math.round(Math.random() * 5)];
        _this.reloadingSound = Game.sounds.pistolReload;
        if (_this.subject instanceof Player) {
            _this.subject.sprite.texture = _this.textureForPlayer;
        }
        else if (_this.subject instanceof EnemySoldier) {
            _this.subject.sprite.texture = _this.textureForEnemy;
        }
        return _this;
    }
    MachineGun.prototype.shoot = function () {
        _super.prototype.shoot.call(this);
        this.shootingSound = Game.sounds.machinegun[Math.round(Math.random() * 5)];
    };
    MachineGun.prototype.update = function () {
        _super.prototype.update.call(this);
        var barrelPosition = this.getBarrelPosition();
        this.gunShotContainer.x = barrelPosition.x;
        this.gunShotContainer.y = barrelPosition.y;
        this.gunShotContainer.rotation = this.subject.sprite.rotation - 30;
    };
    MachineGun.prototype.getBarrelPosition = function () {
        return {
            x: this.subject.sprite.x + Math.cos(this.subject.sprite.rotation + this.gunOffset.angle) * this.gunOffset.distance,
            y: this.subject.sprite.y + Math.sin(this.subject.sprite.rotation + this.gunOffset.angle) * this.gunOffset.distance
        };
    };
    return MachineGun;
}(Gun));
var Pistol = (function (_super) {
    __extends(Pistol, _super);
    function Pistol(subject) {
        var _this = _super.call(this, subject) || this;
        _this.textureForPlayer = PIXI.loader.resources['./images/sprites/player_pistol.png'].texture;
        _this.textureForEnemy = PIXI.loader.resources['./images/sprites/soldier_pistol.png'].texture;
        _this._maxAmmo = 6;
        _this.ammo = _this.maxAmmo;
        _this._damage = 10;
        _this.shootingDelay = 0.2;
        _this.reloadingTime = 2;
        _this.shootingSpread = 7;
        _this.gunOffset = {
            angle: 19.20,
            distance: 27
        };
        _this.shootingSound = Game.sounds.pistol[Math.round(Math.random() * 1)];
        _this.reloadingSound = Game.sounds.pistolReload;
        if (_this.subject instanceof Player) {
            _this.subject.sprite.texture = _this.textureForPlayer;
        }
        else if (_this.subject instanceof EnemySoldier) {
            _this.subject.sprite.texture = _this.textureForEnemy;
        }
        return _this;
    }
    Pistol.prototype.shoot = function () {
        _super.prototype.shoot.call(this);
    };
    Pistol.prototype.update = function () {
        _super.prototype.update.call(this);
        var barrelPosition = this.getBarrelPosition();
        this.gunShotContainer.x = barrelPosition.x;
        this.gunShotContainer.y = barrelPosition.y;
        this.gunShotContainer.rotation = this.subject.sprite.rotation - 30;
    };
    Pistol.prototype.getBarrelPosition = function () {
        return {
            x: this.subject.sprite.x + Math.cos(this.subject.sprite.rotation + this.gunOffset.angle) * this.gunOffset.distance,
            y: this.subject.sprite.y + Math.sin(this.subject.sprite.rotation + this.gunOffset.angle) * this.gunOffset.distance
        };
    };
    return Pistol;
}(Gun));
var Unarmed = (function (_super) {
    __extends(Unarmed, _super);
    function Unarmed(subject) {
        var _this = _super.call(this, subject) || this;
        _this.textureForPlayer = PIXI.loader.resources['./images/sprites/player.png'].texture;
        _this.textureForEnemy = PIXI.loader.resources['./images/sprites/soldier.png'].texture;
        if (_this.subject instanceof Player) {
            _this.subject.sprite.texture = _this.textureForPlayer;
        }
        else if (_this.subject instanceof EnemySoldier) {
            _this.subject.sprite.texture = _this.textureForEnemy;
        }
        return _this;
    }
    Unarmed.prototype.shoot = function () { };
    Unarmed.prototype.update = function () { };
    Unarmed.prototype.reload = function () { };
    Unarmed.prototype.getBarrelPosition = function () {
        return {
            x: this.subject.sprite.x,
            y: this.subject.sprite.y
        };
    };
    return Unarmed;
}(Gun));
var ActionBar = (function (_super) {
    __extends(ActionBar, _super);
    function ActionBar(entity, width, heigth, offset) {
        var _this = _super.call(this) || this;
        _this.actionBarContainer = new PIXI.Container;
        _this._width = 50;
        _this._heigth = 10;
        _this._offset = 25;
        _this.entity = entity;
        _this._width = width;
        _this._heigth = heigth;
        _this._offset = offset;
        entity.registerObserver(_this);
        _this.actionBarContainer.addChild(_this);
        Game.PIXI.stage.addChild(_this.actionBarContainer);
        _this.beginFill(0x000000);
        _this.drawRect(0, 0, _this._width, _this._heigth);
        _this.alpha = 0.2;
        _this.endFill();
        _this.visible = false;
        return _this;
    }
    ActionBar.prototype.setText = function (text) {
        for (var _i = 0, _a = this.actionBarContainer.children; _i < _a.length; _i++) {
            var c = _a[_i];
            if (c instanceof PIXI.Text) {
                this.actionBarContainer.removeChild(c);
            }
        }
        var textObject = new PIXI.Text(text.toString(), {
            fontFamily: 'Montserrat',
            fontSize: 16,
            fill: 0xffffff,
            align: 'center'
        });
        textObject.position.set(this._width / 2, this._heigth / 2);
        textObject.anchor.set(0.5, 0.5);
        this.actionBarContainer.addChild(textObject);
        if (text == '') {
            this.visible = false;
        }
        else {
            this.visible = true;
        }
    };
    ActionBar.prototype.update = function () {
        if (this.actionBarContainer.children.length > 0) {
            this.actionBarContainer.position.x = this.entity.sprite.x - this._width / 2;
            this.actionBarContainer.position.y = this.entity.sprite.y + this._offset;
        }
    };
    ActionBar.prototype.remove = function () {
        Game.PIXI.stage.removeChild(this.actionBarContainer);
    };
    return ActionBar;
}(PIXI.Graphics));
var HealthBar = (function (_super) {
    __extends(HealthBar, _super);
    function HealthBar(entity) {
        var _this = _super.call(this) || this;
        _this.options = {
            width: 75,
            heigth: 10,
            bottomMargin: 50
        };
        _this.entity = entity;
        entity.registerObserver(_this);
        Game.PIXI.stage.addChild(_this);
        _this.maxHealthObject = new PIXI.Graphics;
        _this.maxHealthObject.beginFill(0xc80000);
        _this.maxHealthObject.lineStyle(2);
        _this.maxHealthObject.drawRect(0, 0, _this.options.width, _this.options.heigth);
        _this.maxHealthObject.endFill();
        _this.maxHealthObject.alpha = 0.8;
        _this.addChild(_this.maxHealthObject);
        _this.healthObject = new PIXI.Graphics;
        _this.healthObject.beginFill(0x00c62e);
        _this.healthObject.lineStyle(2);
        _this.healthObject.drawRect(0, 0, _this.options.width, _this.options.heigth);
        _this.healthObject.endFill();
        _this.healthObject.alpha = 0.8;
        _this.addChild(_this.healthObject);
        return _this;
    }
    HealthBar.prototype.update = function () {
        this.maxHealthObject.position.x = this.entity.sprite.x - this.options.width / 2;
        this.maxHealthObject.position.y = this.entity.sprite.y - this.options.bottomMargin;
        this.healthObject.position.x = this.entity.sprite.x - this.options.width / 2;
        this.healthObject.position.y = this.entity.sprite.y - this.options.bottomMargin;
    };
    HealthBar.prototype.updateHealth = function () {
        this.removeChild(this.healthObject);
        var percHealth = this.entity.health / this.entity.maxHealth;
        var correctWidth = this.options.width * percHealth;
        this.healthObject = new PIXI.Graphics;
        this.healthObject.beginFill(0x00c62e);
        this.healthObject.lineStyle(2);
        this.healthObject.drawRect(0, 0, correctWidth, this.options.heigth);
        this.healthObject.endFill();
        this.healthObject.alpha = 0.8;
        this.addChild(this.healthObject);
    };
    HealthBar.prototype.remove = function () {
        Game.PIXI.stage.removeChild(this);
    };
    return HealthBar;
}(PIXI.Container));
var UIScreen = (function () {
    function UIScreen() {
        var _this = this;
        this.domElement = document.createElement('div');
        this.domElement.classList.add('UIScreen');
        this.domElement.style.width = Game.canvasWidth.toString() + 'px';
        this.domElement.style.height = Game.canvasHeight.toString() + 'px';
        document.body.appendChild(this.domElement);
        document.addEventListener('click', function (e) { return _this.clickHandler(e); });
    }
    UIScreen.prototype.remove = function () {
        document.body.removeChild(this.domElement);
    };
    return UIScreen;
}());
var StartScreen = (function (_super) {
    __extends(StartScreen, _super);
    function StartScreen() {
        var _this = _super.call(this) || this;
        var startBtn = document.createElement('button');
        startBtn.classList.add('btn');
        startBtn.innerHTML = 'START';
        _this.domElement.appendChild(startBtn);
        var controlsImg = document.createElement('controls');
        _this.domElement.appendChild(controlsImg);
        return _this;
    }
    StartScreen.prototype.remove = function () {
        _super.prototype.remove.call(this);
    };
    StartScreen.prototype.clickHandler = function (e) {
        var target = e.target;
        if (target.nodeName === 'BUTTON') {
            Game.screen.remove();
            Game.state = new Play();
        }
    };
    return StartScreen;
}(UIScreen));
//# sourceMappingURL=bundle.js.map