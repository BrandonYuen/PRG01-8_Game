
// FACTORY PATTERN

class GunFactory {
    public static getGun(type:string, subject:Entity): Gun {
        console.log('gunFactory: getting a ', type.toUpperCase())
        switch (type.toUpperCase()) {
            case 'PISTOL':
                return new Pistol(subject)
            case 'MACHINEGUN':
                return new MachineGun(subject)
            default:
                return new Unarmed(subject)
        }
    }
}