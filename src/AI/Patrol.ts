class Patrol implements AI {
    private direction:string
    public subject:Entity

    constructor(subject:Entity, direction:string) {
        this.subject = subject

        switch (direction) {
            case "horizontal":
                this.direction = "horizontal"
                if (Math.random() > 0.5) {this.subject.left = true} else { this.subject.right = true}
                break
            case "vertical":
                this.direction = "vertical"
                if (Math.random() > 0.5) {this.subject.up = true} else { this.subject.down = true}
                break
            default:
                this.direction = "stationary"
                break
        }
    }
    private setDirection(): void {

    }
    public onCollide(): void {
        switch (this.direction) {
            case "horizontal":
                if (this.subject.left) {
                    this.subject.left = false
                    this.subject.right = true
                } else {
                    this.subject.left = true
                    this.subject.right = false
                }
                break
            case "vertical":
                if (this.subject.up) {
                    this.subject.up = false
                    this.subject.down = true
                } else {
                    this.subject.up = true
                    this.subject.down = false
                }
                break
        }
    }
}