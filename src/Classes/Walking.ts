class Walking implements Movement, Observer {
    public subject:Entity
    speedMultiplier: number = 1

    constructor(subject: Entity) {
		this.subject = subject
		subject.registerObserver(this)
    }

    update(): void {
		let actualSpeed = this.subject.baseSpeed * this.speedMultiplier

		// Reduce speed if moving in multiple directions
		if ((this.subject.right && this.subject.down) || (this.subject.right && this.subject.up) || (this.subject.left && this.subject.down) || (this.subject.left && this.subject.up)) {
			actualSpeed = actualSpeed * 0.8
			actualSpeed = actualSpeed * 0.8
		}

		if (this.subject.up) {
			this.subject.y_speed -= actualSpeed
		}

		if (this.subject.left) {
			this.subject.x_speed -= actualSpeed
		}

		if (this.subject.right) {
			this.subject.x_speed += actualSpeed
		}

		if (this.subject.down) {
			this.subject.y_speed += actualSpeed
        }
        
		this.subject.sprite.x += this.subject.x_speed

        // If colliding with a wall, undo position X change
        if (Util.checkCollisionWithWalls(this.subject.sprite)) {
			this.subject.sprite.x -= this.subject.x_speed
			this.subject.x_speed = 0
		}

		this.subject.sprite.y += this.subject.y_speed

        // If colliding with a wall, undo position Y change
        if (Util.checkCollisionWithWalls(this.subject.sprite)) {
			this.subject.sprite.y -= this.subject.y_speed
			this.subject.y_speed = 0
		}

		// Friction
		this.subject.x_speed *= 0.9
		this.subject.y_speed *= 0.9
    }

}