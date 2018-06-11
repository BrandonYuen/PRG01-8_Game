abstract class UIScreen {
    protected domElement : HTMLElement

    constructor(){
        this.domElement = document.createElement('div')
        this.domElement.classList.add('UIScreen')
        this.domElement.style.width = Game.canvasWidth.toString() + 'px'
        this.domElement.style.height = Game.canvasHeight.toString() + 'px'
        document.body.appendChild(this.domElement)

        document.addEventListener('click', (e : MouseEvent) => this.clickHandler(e))
    }

    public remove() : void {
        document.body.removeChild(this.domElement)
    }

    abstract clickHandler(e : MouseEvent): void
}