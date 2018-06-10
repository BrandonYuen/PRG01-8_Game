interface Movement {
    subject: Entity
    speedMultiplier: number
    update(): void
}