# PRG01-8_Game
This project is a top-down shooter made in Typescript. It was made as a school assignment with the purpose of learning OOP Design patterns and principles.

I really like games with smooth mechanics so I've put extra attention on that in this game. For example, if you pay close attention the bullets and gunshot effect actually originate from the gun barrels and the enemy AI's vision comes from their heads. If they can't see you, they won't shoot you. Next to that I've also added blood, bullet trace and bullet impact particles, because it looks nice.

## Goal
The goal of the game is to kill all the enemies and complete all levels. Some enemies move vertically or horizontally and some have a better gun than others. Plan your moves carefully and try to expose yourself as less as possible. The levels become harder as you complete them and if you die you need to start at level 1.

## How to play
You can play the game on these [Github Docs](https://brandonyuen.github.io/PRG01-8_Game).

## How to install
1. Clone / Fork the project
2. Install using NPM
```
npm install
```
3. Edit code & build using Typescript compiler of Visual Studio Code with `ctrl+b`
4. Start express web server
5. You can also create levels yourself by installing **[Tiled](https://www.mapeditor.org/)* and using the **.tsx** files in `docs/maps/*` as examples. (However, currently the levels are hard-coded in `Init.ts` and `MapLoader.ts`. So you would need your custom levels there too, you'll figure it out.)
```
node app
```
5. Local game can be played at `localhost`

# For the teachers (in Dutch)

## UML
Onderstaand de Klassendiagram (UML), klik voor groter scherm.
![UML](https://i.imgur.com/rySGpIw.png)

## Singleton
De class `Game` is een singleton omdat er maar 1 instantie van kan bestaan in het spel. Door de private constructor kan hij niet ge-instantiate worden vanuit andere classes dan zichzelf.

## Polymorphism
Polymorfisme word op vele plekken toegepast. Zo zijn `Player` en `EnemySoldier` een extension van een abstract `Entity`, en een `Entity` een extension van een abstract `GameObject`. Ook is heeft een `Entity` een `Gun`, welke zowel een `Pistol` als een `Machinegun` kan zijn. Deze `Gun` weet wie zijn `subject` (eigenaar is) en roept bijvoorbeeld de `ReloadBar` en `AmmoBar` van zijn `subject` aan als de `Gun` schiet.

Ook heeft `Game` een Array met `gameObjects[]`, dit kunnen zowel `Entity`'s zijn (`Player` en `EnemyPlayer`) als `Item`'s (pickups), want die zijn allemaal `gameObject`.

## Strategy
Een `Entity` kan een `Gun` hebben. Er zijn 2 soorten Gun's in het spel: `Pistol` en `MachineGun`, deze extenden de abstracte class `Gun`. Als een entity zijn `shoot()` method word aangeroepen word de `Gun.shoot()` aangeroepen. Deze verschilt per `Gun` want een `Pistol` heeft bijvoorbeeld minder kogels dan een `MachineGun` en kan sneller achter elkaar schieten, maar heeft ook een grotere fire spread (minder accuraat).

Ook kan de speler d.m.v pickups `Item`'s oppakken. Hierdoor kan hij zowel een `Pistol` als een `MachineGun` oppakken en veranderd de speler (en EnemySoldier's) zijn `Gun` property.

## Observer
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

### Visueel aantrekkelijk
Gebruik van spritesheet, dus consistent en ook meerdere particle effect. Ook zijn er UI's, zoals Startscherm, eindscherm, level complete scherm, etc.

### Geluid en muziek
De game heeft meerdere geluiden.

### Levels met oplopende moeilijkheidsgraad
Er zijn een aantal levels in het spel die moeilijker worden per level.

## Pull Request & Code Review
*Pull request Week 4 for Milan's game: [Link](https://github.com/milansosef/TypescriptGame_PRG01-8/pull/1)*
*Code review Week 6 for Imani's game: [Link](https://github.com/maniflames/dodge/issues/2)*
