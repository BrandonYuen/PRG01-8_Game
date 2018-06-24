# PRG01-8_Game
Typescript game made for a school project.

## UML
Onderstaand de Klassendiagram (UML), klik voor groter scherm.
![UML](https://imgur.com/rySGpIw)

## H2 Singleton
De class `Game` is een singleton omdat er maar 1 instantie van kan bestaan in het spel. Door de private constructor kan hij niet ge-instantiate worden vanuit andere classes dan zichzelf.

## H2 Polymorphism
Polymorfisme word op vele plekken toegepast. Zo zijn `Player` en `EnemySoldier` een extension van een abstract `Entity`, en een `Entity` een extension van een abstract `GameObject`. Ook is heeft een `Entity` een `Gun`, welke zowel een `Pistol` als een `Machinegun` kan zijn. Deze `Gun` weet wie zijn `subject` (eigenaar is) en roept bijvoorbeeld de `ReloadBar` en `AmmoBar` van zijn `subject` aan als de `Gun` schiet.

Ook heeft `Game` een Array met `gameObjects[]`, dit kunnen zowel `Entity`'s zijn (`Player` en `EnemyPlayer`) als `Item`'s (pickups).

## H2 Strategy
Een `Entity` kan een `Gun` hebben. Er zijn 2 soorten Gun's in het spel: `Pistol` en `MachineGun`, deze extenden de abstracte class `Gun`. Als een entity zijn `shoot()` method word aangeroepen word de `Gun.shoot()` aangeroepen. Deze verschilt per `Gun` want een `Pistol` heeft bijvoorbeeld minder kogels dan een `MachineGun` en kan sneller achter elkaar schieten, maar heeft ook een grotere fire spread (minder accuraat).

Ook kan de speler d.m.v pickups `Item`'s oppakken. Hierdoor kan hij zowel een `Pistol` als een `MachineGun` oppakken en veranderd de speler (en EnemySoldier's) zijn `Gun` property.

## H2 Observer
Een `Entity` heeft meerdere classes die afhankelijk van hem zijn. Daarop heeft de `Entity` een `Subject interface` en heeft hij meerdere `Observers[]`. Elke keer als een `Entity` zijn `update()` method uitvoerd, voert hij ook de `Observer.update()` uit voor elke observer.

## Game Compontenten
De game bevat meerdere game componenten.

### Canvas / WebGL
Ik gebruik **PixiJS** om de game te renderen. WebGL zorgt ervoor dat de browser de GPU kan gebruiken om betere resultaten te leveren.

### Externe Library
Ik gebruik de **[TiledMap](https://github.com/riebel/pixi-tiledmap)**, **[Bump](https://github.com/kittykatattack/bump)** en **[Pixi-Particles](https://github.com/pixijs/pixi-particles)** libraries. Tiledmap zorgt ervoor dat ik **[Tiled](https://www.mapeditor.org/)* levels kan maken vanuit een spritesheet. Deze levels zijn `.tsx` bestanden welke automatisch ingeladen worden door de game en zorgt ervoor dat alle tiles (vanuit de spritesheet) als game objecten door `Pixi` worden gezien. Dit werkt ook met verschillende layers van tiles, hierdoor kan ik onderscheid maken tussen muren en vloeren. Muren worden namelijk automatisch herkent als muur waardoor de collision scripts hier rekening mee houden.

Bump gebruik ik voor de collision tussen `bullets`, `players` en `walls`. 

Pixi-particles gebuik ik voor alle particles die te zien zijn: bloed, bullet traces, bullet impact en een gunshot animation. Dit zijn allemaal particle emitters waarvoor ik een speciale class heb gemaakt: `Emitter`

### Bots met AI
De enemies zijn "slim", ze kunnen lopen en detecteren wanneer ze zicht hebben op de speler.

## Pull Request & Code Review
*Pull request Week 4 for Milan's game: [Link](https://github.com/milansosef/TypescriptGame_PRG01-8/pull/1)*
*Code review Week 6 for Imani's game: [Link](https://github.com/maniflames/dodge/issues/2)*
