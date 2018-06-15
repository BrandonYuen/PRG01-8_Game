
class Util {
	
	static rotateToPoint(mx:number, my:number, px:number, py:number){  
		var dist_Y = my - py;
		var dist_X = mx - px;
		var angle = Math.atan2(dist_Y,dist_X);
		//var degrees = angle * 180/ Math.PI;
		return angle;
	}

	static checkCollisionWithWalls(object: any, returnSprite:boolean=false){  
		let colliding:any = false;

		// Check all walls for collision with object
		for (let w of Game.walls) {
			if (Game.BUMP.hitTestRectangle(object, w)) {
				if (returnSprite) {colliding=w} else {colliding=true}
			}
		}

		return colliding
	}

	static checkCollisionWithEntities(object: any){  
		let colliding:boolean | Entity = false;

		// Check all walls for collision with object
		for (let e of Game.entities) {
			if (Game.BUMP.hit(object, e.sprite)) {
				colliding = e
				break
			}
		}

		return colliding;
	}

	static checkCollisionLineRectangle(line1: any, rec: any){

		let recLines = [
			{ // Left
				first: {
					x: rec.x,
					y: rec.y
				},
				second: {
					x: rec.x,
					y: rec.y + rec.heigth
				}
			},
			{ // Right
				first: {
					x: rec.x + rec.width,
					y: rec.y
				},
				second: {
					x: rec.x + rec.width,
					y: rec.y + rec.heigth
				}
			},
			{ // Bottom
				first: {
					x: rec.x,
					y: rec.y
				},
				second: {
					x: rec.x + rec.width,
					y: rec.y
				}
			},
			{ // Top
				first: {
					x: rec.x,
					y: rec.y + rec.heigth
				},
				second: {
					x: rec.x + rec.width,
					y: rec.y + rec.heigth
				}
			}
		]

		let collidingSides:any = []
		let shortestSidePosition:any= false

		// Collect all sides that collide with the line
		for (let side of recLines) {
			let result = Util.checkLineIntersection(line1.first.x, line1.first.y, line1.second.x, line1.second.y, side.first.x, side.first.y, side.second.x, side.second.y)
			// If intersection is within the lines (so not extended..)
			if (result.onLine1 == true && result.onLine2 == true && result.x != null && result.y != null) {
				collidingSides.push({
					x: result.x,
					y: result.y
				})
			}
		}
		
		if (collidingSides.length > 1) {
			// Get the side that is closest to the start of line
			shortestSidePosition = collidingSides[0]
			shortestSidePosition.distance = math.distance([collidingSides[0].x, collidingSides[0].y], [line1.first.x, line1.first.y])

			for (let i=1; i<collidingSides.length; i++) {
				let side = collidingSides[i]
				let newDistance = math.distance([side.x, side.y], [line1.first.x, line1.first.y])
				if (newDistance < shortestSidePosition.distance) {
					shortestSidePosition = side
					shortestSidePosition.distance = newDistance
				}
			}
		}

		return shortestSidePosition
	}

	static checkLineIntersection(line1StartX: any, line1StartY: any, line1EndX: any, line1EndY: any, line2StartX: any, line2StartY: any, line2EndX: any, line2EndY: any) {
		// if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
		var denominator, a, b, numerator1, numerator2, result = {
			x: null,
			y: null,
			onLine1: false,
			onLine2: false
		};
		denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
		if (denominator == 0) {
			return result;
		}
		a = line1StartY - line2StartY;
		b = line1StartX - line2StartX;
		numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
		numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
		a = numerator1 / denominator;
		b = numerator2 / denominator;
	
		// if we cast these lines infinitely in both directions, they intersect here:
		result.x = line1StartX + (a * (line1EndX - line1StartX));
		result.y = line1StartY + (a * (line1EndY - line1StartY));
			/*
			// it is worth noting that this should be the same as:
			x = line2StartX + (b * (line2EndX - line2StartX));
			y = line2StartX + (b * (line2EndY - line2StartY));
			*/
		// if line1 is a segment and line2 is infinite, they intersect if:
		if (a > 0 && a < 1) {
			result.onLine1 = true;
		}
		// if line2 is a segment and line1 is infinite, they intersect if:
		if (b > 0 && b < 1) {
			result.onLine2 = true;
		}
		// if line1 and line2 are segments, they intersect if both of the above are true
		return result;
	}

	static checkCollisionLineWalls(line: any) {
		let colliding:any = false;
		let collidingPoints:any = []

		// Check all walls for collision with object
		for (let w of Game.walls) {
			let rec = {
				x: w.position.x,
				y: w.position.y,
				width: w.width,
				heigth: w.height
			}
			let checkWall = Util.checkCollisionLineRectangle(line, rec)
			if (checkWall != false) {
				collidingPoints.push(checkWall)
			}
		}

		// Check which of the colliding points is closest to the start of line
		if (collidingPoints.length > 0) {
			colliding = collidingPoints[0]
			let shortestDistance = math.distance([collidingPoints[0].x, collidingPoints[0].y], [line.first.x, line.first.y])
			colliding.shortestDistance = shortestDistance

			for (let i=0; i<collidingPoints.length; i++) {
				let point = collidingPoints[i]
				let newDistance = math.distance([point.x, point.y], [line.first.x, line.first.y])
				if (newDistance < shortestDistance) {
					colliding = point
					shortestDistance = newDistance
					colliding.shortestDistance = shortestDistance
				}
			}
			
		}

		return colliding
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