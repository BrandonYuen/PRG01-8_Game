class Util {
  
	static rotateToPoint(mx:number, my:number, px:number, py:number){  
        var dist_Y = my - py;
        var dist_X = mx - px;
        var angle = Math.atan2(dist_Y,dist_X);
        //var degrees = angle * 180/ Math.PI;
        return angle;
      }
}