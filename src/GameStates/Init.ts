
/// <reference path="../Game.ts"/>

class Init implements GameState {
    private complete: boolean = false

    constructor() {
        console.log('Loading all assets...')
		// Load textures
		PIXI.loader
			// Images
			.add('./images/sprites/player.png')
			.add('./images/sprites/soldier.png')
			.add('./images/sprites/player_pistol.png')
			.add('./images/sprites/soldier_pistol.png')
			.add('./images/sprites/player_machinegun.png')
			.add('./images/sprites/soldier_machinegun.png')
			.add('./images/sprites/weapon_pistol.png')
			.add('./images/sprites/weapon_machinegun.png')
			.add('./images/sprites/powerup_speed.png')
			.add('./images/sprites/powerup_health.png')
			// Particles
			.add('./images/particles/Fire.png')
			.add('./images/particles/particle.png')
			// Json
			.add('./json/gunShot.json')
			.add('./json/bulletImpact.json')
			.add('./json/bulletTrail.json')
			.add('./json/blood.json')
			// TileMaps
			.add('./maps/01_intro.tmx')
			.add('./maps/02_square.tmx')
			.add('./maps/03_machinegun.tmx')
			.add('./maps/04_sandwich.tmx')
			.add('./maps/05_milan.tmx')
			.add('./maps/06_raid.tmx')
			.add('./maps/07_idk.tmx')
			.add('./maps/08_surrounded.tmx')
			.load(() => this.onLoaderComplete())

		// Load sounds
		Game.sounds.pistol = []
		Game.sounds.pistol[0] = new Howl({
			src: ['./sounds/pistolShot1.mp3'],
			volume: 0.5,
			preload: true
		})
		Game.sounds.pistol[1] = new Howl({
			src: ['./sounds/pistolShot2.mp3'],
			volume: 0.5,
			preload: true
		})
		Game.sounds.machinegun = []
		Game.sounds.machinegun[0] = new Howl({
			src: ['./sounds/machinegunShot1.mp3'],
			volume: 0.5,
			preload: true
		})
		Game.sounds.machinegun[1] = new Howl({
			src: ['./sounds/machinegunShot2.mp3'],
			volume: 0.5,
			preload: true
		})
		Game.sounds.machinegun[2] = new Howl({
			src: ['./sounds/machinegunShot3.mp3'],
			volume: 0.5,
			preload: true
		})
		Game.sounds.machinegun[3] = new Howl({
			src: ['./sounds/machinegunShot4.mp3'],
			volume: 0.5,
			preload: true
		})
		Game.sounds.machinegun[4] = new Howl({
			src: ['./sounds/machinegunShot5.mp3'],
			volume: 0.5,
			preload: true
		})
		Game.sounds.machinegun[5] = new Howl({
			src: ['./sounds/machinegunShot6.mp3'],
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
		// Load maps (initialize)
		MapLoader.initializeMapFiles()

        // Set gamestate to complete
        this.complete = true
        Game.screen = new StartScreen()
    }
    
    public update(): void {}
}