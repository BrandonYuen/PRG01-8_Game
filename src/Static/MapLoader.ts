class MapLoader {
    private static instance: MapLoader
    private static maps: Array <any> = []
    public static currentMapIndex: number = -1

    private constructor() {}
    
    static initializeMapFiles() {
        MapLoader.maps = [
            new PIXI.extras.TiledMap("./maps/01_intro.tmx"),
            new PIXI.extras.TiledMap("./maps/03_sandwich.tmx")
        ]
    }

    static loadNextMap() {
        let nextMap = MapLoader.maps[MapLoader.currentMapIndex+1]
        MapLoader.loadMap(nextMap)
    }

    static loadMap(name: string) {
        // Remove old map if existing
        this.unloadCurrentMap()

        let mapIndex = MapLoader.maps.indexOf(name)
        let map = MapLoader.maps[mapIndex]
        MapLoader.currentMapIndex = mapIndex

		// Add tiled map as pixi objects to stage
		Game.tiledMapContainer.addChild(map)

        // Load all objects from tilemap
		for (let layer of Game.tiledMapContainer.children[0].children) {
			console.log('loading layer ('+layer.name+')')
			switch (layer.name) {
				case 'Pistols':
					for (let e of layer.children) {
						let item = new Item('Pistol', Game.PIXI.stage, PIXI.loader.resources['./images/sprites/weapon_pistol.png'].texture)
						Game.gameObjects.push(item)
						console.log('Placed Pistol with index: ', Game.gameObjects.indexOf(item))
						Game.gameObjects[Game.gameObjects.indexOf(item)].sprite.x = e.x + 32
						Game.gameObjects[Game.gameObjects.indexOf(item)].sprite.y = e.y + 32
					} for (let e of layer.children) {
						// Remove dummy object
						e.visible = false
					}
					break
				case 'MachineGuns':
					for (let e of layer.children) {
						let item = new Item('MachineGun', Game.PIXI.stage, PIXI.loader.resources['./images/sprites/weapon_machinegun.png'].texture)
						Game.gameObjects.push(item)
						console.log('Placed MachineGun with index: ', Game.gameObjects.indexOf(item))
						Game.gameObjects[Game.gameObjects.indexOf(item)].sprite.x = e.x + 32
						Game.gameObjects[Game.gameObjects.indexOf(item)].sprite.y = e.y + 32
					} for (let e of layer.children) {
						// Remove dummy object
						e.visible = false
					}
					break
				case 'Player':
					for (let p of layer.children) {
						let player = new Player(Game.PIXI.stage, PIXI.loader.resources['./images/sprites/player.png'].texture)
						Game.gameObjects.push(player)
						console.log('Placed player with index: ', Game.gameObjects.indexOf(player))
						Game.gameObjects[Game.gameObjects.indexOf(player)].sprite.x = p.x + 32
						Game.gameObjects[Game.gameObjects.indexOf(player)].sprite.y = p.y + 32
					} for (let p of layer.children) {
						// Remove dummy object
						p.visible = false
					}
					break
				case 'EnemiesStationary':
					for (let e of layer.children) {
						let enemy = new EnemySoldier(Game.PIXI.stage, PIXI.loader.resources['./images/sprites/soldier.png'].texture, 'stationary')
						Game.gameObjects.push(enemy)
						console.log('Placed EnemiesStationary with index: ', Game.gameObjects.indexOf(enemy))
						Game.gameObjects[Game.gameObjects.indexOf(enemy)].sprite.x = e.x + 32
						Game.gameObjects[Game.gameObjects.indexOf(enemy)].sprite.y = e.y + 32
					} for (let e of layer.children) {
						// Remove dummy object
						e.visible = false
					}
					break
				case 'EnemiesHorizontal':
					for (let e of layer.children) {
						let enemy = new EnemySoldier(Game.PIXI.stage, PIXI.loader.resources['./images/sprites/soldier.png'].texture, 'horizontal')
						Game.gameObjects.push(enemy)
						console.log('Placed EnemiesHorizontal with index: ', Game.gameObjects.indexOf(enemy))
						Game.gameObjects[Game.gameObjects.indexOf(enemy)].sprite.x = e.x + 32
						Game.gameObjects[Game.gameObjects.indexOf(enemy)].sprite.y = e.y + 32
					} for (let e of layer.children) {
						// Remove dummy object
						e.visible = false
					}
					break
				case 'EnemiesVertical':
					for (let e of layer.children) {
						let enemy = new EnemySoldier(Game.PIXI.stage, PIXI.loader.resources['./images/sprites/soldier.png'].texture, 'vertical')
						Game.gameObjects.push(enemy)
						console.log('Placed enemy with index: ', Game.gameObjects.indexOf(enemy))
						Game.gameObjects[Game.gameObjects.indexOf(enemy)].sprite.x = e.x + 32
						Game.gameObjects[Game.gameObjects.indexOf(enemy)].sprite.y = e.y + 32
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
    }

    static unloadCurrentMap() {
        // Kill gameobjects (also removes from memory)
        let gameObjectsArray: Array<GameObject> = []
        for (let g of Game.gameObjects) {
            gameObjectsArray.push(g)
        }
        for (let g of gameObjectsArray) {
			if (g instanceof EnemySoldier) g.kill('map')
			else g.kill()
        }

        // Remove walls from memory
        let wallsArray: Array<PIXI.extras.AnimatedSprite> = []
        for (let w of Game.walls) {
            wallsArray.push(w)
        }
        for (let w of wallsArray) {
            Game.removeWall(w)
        }

        // Remove containers from memory and stage
        let containersArray: Array<PIXI.Container> = []
        for (let c of Game.containers) {
            containersArray.push(c)
        }
        for (let c of containersArray) {
            Game.removeContainer(c)
        }

        // Remove bullets from memory and stage
        let bulletsArray: Array<PIXI.Graphics> = []
        for (let b of Game.bullets) {
            bulletsArray.push(b)
        }
        for (let b of bulletsArray) {
            Game.removeContainer(b)
        }

        // Remove tiles
        Game.tiledMapContainer.removeChild(MapLoader.maps[this.currentMapIndex])
    }
}