class Patrol implements AI {
    private direction:string
    public subject:Entity

    constructor(subject:Entity, direction:string) {
        this.subject = subject

        switch (direction) {
            case "horizontal":
                this.direction = "horizontal"
            case "vertical":
                this.direction = "vertical"
            default:
                this.direction = "horizontal"
        }
    }
    private setDirection(): void {

    }
    public onCollide(): void {

    }
}