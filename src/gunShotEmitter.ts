/// <reference path="../node_modules/pixi-particles/ambient.d.ts" />

class gunShotEmitter extends PIXI.particles.Emitter {
    private elapsed: number

    constructor (container: PIXI.Container, particleTextures: Array<PIXI.Texture>, config: any) {
		super(container, particleTextures, config)
		
		// Add properties
        this.elapsed = Date.now();
		this.emit = false
	}
	
	public start(time: number): void {
        // Start emitting
		this.emit = true
		setTimeout(() => { 
			this.emit = false;
		}, time)
	}
            
    // Update function every frame
    public update(): void {
        let now = Date.now();

        // The emitter requires the elapsed
        // number of seconds since the last update
        super.update((now - this.elapsed) * 0.001);

        this.elapsed = Date.now();
    }
}