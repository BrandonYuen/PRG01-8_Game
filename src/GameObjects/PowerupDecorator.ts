/// <reference path="PowerupItem.ts"/>

// DECORATOR PATTERN
abstract class PowerupDecorator extends PowerupItem {
    private powerupItem: PowerupItem 

    constructor(p: PowerupItem, stage: PIXI.Container, texture: PIXI.Texture) {
        super(p.type, stage, texture);
        this.powerupItem = p
    }

    public pickup(subject: Entity) {
        this.powerupItem.pickup(subject)
    }
}

class SpeedPowerupEffect extends PowerupDecorator {

    public pickup(subject: Entity) {
        super.pickup(subject)
        console.log('Picked up a SPEED powerup (+0.10 BaseSpeed).')
        subject.baseSpeed += 0.10
    }
}

class HealthPowerupEffect extends PowerupDecorator {

    public pickup(subject: Entity) {
        super.pickup(subject)
        console.log('Picked up a HEALTH powerup (+50 MaxHealth).')
        subject.health += 50
    }
}