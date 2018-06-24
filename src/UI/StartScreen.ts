/// <reference path="UIScreen.ts"/>

class StartScreen extends UIScreen {

    constructor() {
        super()

        // Create and place start button
        let startBtn = document.createElement('button')
        startBtn.classList.add('btn')
        startBtn.innerHTML = 'START'
        this.domElement.appendChild(startBtn)

        // Create and place controls image
        let controlsImg = document.createElement('controls')
        this.domElement.appendChild(controlsImg)
    }

    public remove() : void {
        super.remove()
    }

    public clickHandler(e: MouseEvent): void {
        let target = e.target as HTMLElement
        if (target.nodeName === 'BUTTON') {
            console.log('StartScreen ClickHandler')
            Game.screen.remove()
            Game.state = new Play()
        }
    }
}