
// FACTORY PATTERN

class GunFactory {
    public static getGun(type:string, subject:Entity): Gun {
        console.log('gunFactory: getting a ', type.toUpperCase())
        switch (type.toUpperCase()) {
            case 'PISTOL':
                return new Pistol(subject)
                break
            case 'MACHINEGUN':
                return new MachineGun(subject)
                break
            default:
                return new Unarmed(subject)
        }
    }
}