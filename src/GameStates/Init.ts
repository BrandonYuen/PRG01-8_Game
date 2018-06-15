
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

		// Add tiled map as pixi objects to stage
		Game.tiledMap.addChild(new PIXI.extras.TiledMap("./maps/01_intro.tmx"));

		// Load all objects from tilemap
		for (let layer of Game.tiledMap.children[0].children) {
			console.log('loading layer ('+layer.name+')')
			switch (layer.name) {
				case 'Player':
					for (let p of layer.children) {
						let player = Player.getInstance(Game.PIXI.stage, PIXI.loader.resources['./images/sprites/player.png'].texture)
						Game.entities.push(player)
						console.log('Placed player with index: ', Game.entities.indexOf(player))
						Game.entities[Game.entities.indexOf(player)].sprite.x = p.x + 32
						Game.entities[Game.entities.indexOf(player)].sprite.y = p.y + 32
					} for (let p of layer.children) {
						// Remove dummy object
						p.visible = false
					}
					break
				case 'Enemies':
					console.log('Amount Enemies: ', layer.children.length)
					for (let e of layer.children) {
						let enemy = new EnemySoldier(Game.PIXI.stage, PIXI.loader.resources['./images/sprites/soldier.png'].texture)
						Game.entities.push(enemy)
						console.log('Placed enemy with index: ', Game.entities.indexOf(enemy))
						Game.entities[Game.entities.indexOf(enemy)].sprite.x = e.x + 32
						Game.entities[Game.entities.indexOf(enemy)].sprite.y = e.y + 32
					} for (let e of layer.children) {
						// Remove dummy object
						e.visible = false
					}
					break
				case 'Walls':
					for (let w of layer.children) {
						Game.walls.push(w)
					}
					break
			}
		}

        // Set gamestate to complete
        this.complete = true
        Game.screen = new StartScreen()
    }
    
    public update(): void {}
}