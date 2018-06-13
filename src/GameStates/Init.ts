
/// <reference path="../Game.ts"/>

class Init implements GameState {
    private complete: boolean = false

    constructor() {
        console.log('Loading all assets...')
		// Load textures
		PIXI.loader
			// Images
			.add('./images/sprites/manBlue_gun.png')
			.add('./images/sprites/soldier1_gun.png')
			// Particles
			.add('./images/particles/Fire.png')
			.add('./images/particles/particle.png')
			// Json
			.add('./json/gunShot.json')
			.add('./json/bulletImpact.json')
			.add('./json/bulletTrail.json')
			.add('./json/blood.json')
			// TileMaps
			.add('./maps/01_empty.tmx')
			.add('./maps/01_intro.tmx')
			.load(() => this.onLoaderComplete())

		// Load sounds
		Game.sounds.pistol1 = new Howl({
			src: ['./sounds/pistolShot1.mp3'],
			volume: 0.5,
			preload: true
		})
		Game.sounds.pistol2 = new Howl({
			src: ['./sounds/pistolShot2.mp3'],
			volume: 0.5,
			preload: true
		})
		Game.sounds.bulletImpact = []
		Game.sounds.bulletImpact[0] = new Howl({
			src: ['./sounds/bulletImpact1.wav'],
			volume: 1,
			preload: true
		})
		Game.sounds.bulletImpact[1] = new Howl({
			src: ['./sounds/bulletImpact2.wav'],
			volume: 1,
			preload: true
		})
		Game.sounds.bulletImpact[2] = new Howl({
			src: ['./sounds/bulletImpact3.wav'],
			volume: 1,
			preload: true
		})
		Game.sounds.bulletImpactBody = []
		Game.sounds.bulletImpactBody.push(new Howl({
			src: ['./sounds/bulletImpactBody1.wav'],
			volume: 1,
			preload: true
		}))
		Game.sounds.bulletImpactBody.push(new Howl({
			src: ['./sounds/bulletImpactBody2.wav'],
			volume: 1,
			preload: true
		}))
		Game.sounds.bulletImpactBody.push(new Howl({
			src: ['./sounds/bulletImpactBody3.wav'],
			volume: 1,
			preload: true
		}))
		Game.sounds.bulletImpactBody.push(new Howl({
			src: ['./sounds/bulletImpactBody4.wav'],
			volume: 1,
			preload: true
		}))
		Game.sounds.bulletImpactBody.push(new Howl({
			src: ['./sounds/bulletImpactBody5.wav'],
			volume: 1,
			preload: true
		}))
		Game.sounds.bulletImpactBody.push(new Howl({
			src: ['./sounds/bulletImpactBody6.wav'],
			volume: 1,
			preload: true
		}))
		Game.sounds.bulletImpactBody.push(new Howl({
			src: ['./sounds/bulletImpactBody7.wav'],
			volume: 1,
			preload: true
		}))
		Game.sounds.bulletImpactBody.push(new Howl({
			src: ['./sounds/bulletImpactBody8.wav'],
			volume: 1,
			preload: true
		}))
		Game.sounds.bulletImpactBody.push(new Howl({
			src: ['./sounds/bulletImpactBody9.wav'],
			volume: 1,
			preload: true
		}))
		Game.sounds.bulletImpactBody.push(new Howl({
			src: ['./sounds/bulletImpactBody10.wav'],
			volume: 1,
			preload: true
		}))
		Game.sounds.glassBreak = new Howl({
			src: ['./sounds/glassBreak.wav'],
			volume: 1,
			preload: true
		})
		Game.sounds.emptyMagazine = new Howl({
			src: ['./sounds/emptyMagazine.wav'],
			volume: 0.5,
			preload: true
        })
		Game.sounds.pistolReload = new Howl({
			src: ['./sounds/pistolReload.wav'],
			volume: 0.5,
			preload: true
        })
    }

	private onLoaderComplete(): void {

		// Add tiled map as pixi objects to stage
		Game.tiledMap.addChild(new PIXI.extras.TiledMap("./maps/01_intro.tmx"));

		// Save all walls to alias
		for (let w of Game.tiledMap.children[0].children[2].children) {
			Game.walls.push(w)
		}

		// Add player TODO: get location from tilemap
        Game.entities.push(Player.getInstance(Game.PIXI.stage, PIXI.loader.resources['./images/sprites/manBlue_gun.png'].texture))
		
		// Add enemy TODO: get location from tilemap
        Game.entities.push(new EnemySoldier(Game.PIXI.stage, PIXI.loader.resources['./images/sprites/soldier1_gun.png'].texture))

        // Set gamestate to complete
        this.complete = true
        Game.screen = new StartScreen()
    }
    
    public update(): void {
        if (this.complete) {
        }
    }
}