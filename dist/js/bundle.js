"use strict";
var Car = (function () {
    function Car() {
        console.log("car created");
    }
    Car.prototype.update = function () {
        console.log("vroooom!");
    };
    return Car;
}());
var Game = (function () {
    function Game() {
        console.log("new game created!");
        var c = new Car();
        c.update();
    }
    return Game;
}());
window.addEventListener("load", function () { return new Game(); });
//# sourceMappingURL=bundle.js.map