/// <reference path="../node_modules/pixi-particles/ambient.d.ts" />

class gunShotEmitter extends PIXI.particles.Emitter {
    private elapsed: number

    constructor (container: PIXI.Container) {
		super(container,
			[
				PIXI.loader.resources['./images/particles/particle.png'].texture,
				PIXI.loader.resources['./images/particles/Fire.png'].texture
			],
			{
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
			})
		
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