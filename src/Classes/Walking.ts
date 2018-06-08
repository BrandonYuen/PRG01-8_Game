class Walking implements Movement {
    entity: any
    speedMultiplier: number = 1

    constructor(entity: any) {
        this.entity = entity
    }

    move(): void {
		let actualSpeed = this.entity.baseSpeed * this.speedMultiplier

		// Reduce speed if moving in multiple directions
		if ((this.entity.right && this.entity.down) || (this.entity.right && this.entity.up) || (this.entity.left && this.entity.down) || (this.entity.left && this.entity.up)) {
			actualSpeed = actualSpeed * 0.8
			actualSpeed = actualSpeed * 0.8
		}

		if (this.entity.up) {
			this.entity.y_speed -= actualSpeed
		}

		if (this.entity.left) {
			this.entity.x_speed -= actualSpeed
		}

		if (this.entity.right) {
			this.entity.x_speed += actualSpeed
		}

		if (this.entity.down) {
			this.entity.y_speed += actualSpeed
        }
        
		this.entity.sprite.x += this.entity.x_speed

        // If colliding with a wall, undo position X change
        if (Util.checkCollisionWithWalls(this.entity.sprite)) {
			this.entity.sprite.x -= this.entity.x_speed
			this.entity.x_speed = 0
		}

		this.entity.sprite.y += this.entity.y_speed

        // If colliding with a wall, undo position Y change
        if (Util.checkCollisionWithWalls(this.entity.sprite)) {
			this.entity.sprite.y -= this.entity.y_speed
			this.entity.y_speed = 0
		}

		// Friction
		this.entity.x_speed *= 0.9
		this.entity.y_speed *= 0.9
    }

}