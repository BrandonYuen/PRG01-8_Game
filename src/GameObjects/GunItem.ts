/// <reference path="Item.ts"/>

class GunItem extends Item {

    public pickup(subject: Entity) {
        subject.gun = GunFactory.getGun(this.type, subject)
    }
}