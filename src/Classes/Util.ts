class Util {
	
	static rotateToPoint(mx:number, my:number, px:number, py:number){  
		var dist_Y = my - py;
		var dist_X = mx - px;
		var angle = Math.atan2(dist_Y,dist_X);
		//var degrees = angle * 180/ Math.PI;
		return angle;
	}

	static checkCollisionWithWalls(object: any){  
		let colliding = false;

		// Check all walls for collision with object
		for (let w of Game.walls) {
			if (Game.BUMP.hitTestRectangle(object, w)) {
				colliding = true
				break
			}
		}

		return colliding;
	}

	static toRadiant(degrees: any) {  
		return degrees * Math.PI / 180
	}

	static toDegrees(radians: any) {  
		return radians * 180 / Math.PI
	}

	static correctDegrees(degrees:number) {
		// degrees = 200 (20 over 180)
		let correctDegrees = degrees
		if (degrees > 180) {
			let rest = degrees - 180
			correctDegrees = -180 + rest
		} else if (degrees < -180) {
			let rest = degrees + 180
			correctDegrees = 180 + rest
		}

		return correctDegrees
	}
}