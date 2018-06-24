abstract class UIScreen {
    protected domElement : HTMLElement
    private clickCb = (e : MouseEvent) => { this.clickHandler(e) } 

    constructor(){
        window.addEventListener('click', this.clickCb)
        this.domElement = document.createElement('div')
        this.domElement.classList.add('UIScreen')
        this.domElement.style.width = Game.canvasWidth.toString() + 'px'
        this.domElement.style.height = Game.canvasHeight.toString() + 'px'
        document.body.appendChild(this.domElement)
    }

    public remove() : void {
        document.body.removeChild(this.domElement)
        window.removeEventListener('click', this.clickCb)
    }

    abstract clickHandler(e : MouseEvent): void
}