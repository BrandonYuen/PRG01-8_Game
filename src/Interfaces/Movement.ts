interface Movement {
    subject: Entity
    speedMultiplier: number
    state: string
    update(): void
}