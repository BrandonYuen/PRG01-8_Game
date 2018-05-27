
class Player {
	public sprite = new PIXI.Sprite();
	private left: boolean = false
	private right: boolean = false
	private up: boolean = false
	private down: boolean = false
	private x_speed: number = 0
	private y_speed: number = 0

	constructor() {
		window.addEventListener("keydown", (e: KeyboardEvent) => this.keyListener(e))
		window.addEventListener("keyup", (e: KeyboardEvent) => this.keyListener(e))
	}

	private reset(): void {
		this.sprite.x = Game.canvasWidth / 2;
		this.sprite.y = Game.canvasHeigth / 2;
	}

	public updateTexture(stage: PIXI.Container): void {
		this.sprite.texture = Game.PIXI.loader.resources['./images/player/manBlue_gun.png'].texture;
		this.reset()
		stage.addChild(this.sprite);
	}

	public update(): void {
		this.movementController()
	}

	private keyListener(event: KeyboardEvent): void {
		let key_state: boolean = (event.type == "keydown") ? true : false

		switch (event.keyCode) {
			//W; walk up
			case 87:
				this.up = key_state
				console.log("up")
				break
			//S; Walk down
			case 83:
				this.down = key_state
				console.log("down")
				break
			//A; Walk left
			case 65:
				this.left = key_state
				console.log("left")
				break
			//D; Walk right
			case 68:
				console.log("right")
				this.right = key_state
				break
		}
	}

	private movementController(): void {
		if (this.up) {
			this.y_speed -= 0.5
		}

		if (this.left) {
			this.x_speed -= 0.5
		}

		if (this.right) {
			this.x_speed += 0.5
		}

		if (this.down) {
			this.y_speed += 0.5
		}

		this.sprite.x += this.x_speed
		this.sprite.y += this.y_speed
		this.x_speed *= 0.9 // friction
		this.y_speed *= 0.9 // friction
	}

}
