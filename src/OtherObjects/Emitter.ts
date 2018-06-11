/// <reference path="../../node_modules/pixi-particles/ambient.d.ts" />

class Emitter extends PIXI.particles.Emitter {
	private elapsed: number
	private container: PIXI.Container

    constructor (container: PIXI.Container, particleResourceTextures: Array<PIXI.Texture>, config: any, repeat:boolean=false) {
		super(container, particleResourceTextures, config)
		
		// Add properties
		this.container = container
        this.elapsed = Date.now();

        if (!repeat) {
            this.emit = false
		}
		
		// Add to game data
		Game.emitters.push(this)
	}
	
	public start(duration: number=0, deleteAfter: boolean=false): void {
        // Start emitting
		this.emit = true

		// If duration is 0, the emitter will keep emitting
		if (duration > 0) {
			setTimeout(() => { 
				this.emit = false
			}, duration)

			if (deleteAfter) {
				// Delete after max particle lifetime
				let maxLifeTime = PIXI.loader.resources['./json/bulletImpact.json'].data.lifetime.max * 1000 // in milliseconds
				setTimeout(() => { 
					this.kill()
				}, maxLifeTime)
			}
		}
	}
            
    // Update function every frame
    public update(): void {
        let now = Date.now();

        // The emitter requires the elapsed
        // number of seconds since the last update
        super.update((now - this.elapsed) * 0.001);

        this.elapsed = Date.now();
	}
	
	public kill(): void {
		Game.removeEmitter(this)
		Game.removeContainer(this.container)
	}
}