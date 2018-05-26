class Game {
    constructor(){
        console.log("new game created!")

        let c = new Car()
        c.update()
    }
}

window.addEventListener("load", () => new Game())
