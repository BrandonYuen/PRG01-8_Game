class Game {
    public static canvasWidth = 1280;
    public static canvasHeigth = 768;

    private static instance:Game;
    public static PIXI:any;

    public static getInstance() {
        if (! Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }

    constructor() {
        Game.PIXI = new PIXI.Application({width: Game.canvasWidth, height: Game.canvasHeigth});
        document.body.appendChild(Game.PIXI.view);

        // Load textures
        Game.PIXI.loader
            .add('./images/player/manBlue_gun.png')
            .add('./images/level/level1.png')
            .load(setup);

        // Run setup when textures are loaded
        function setup() {

            // Add background
            let background = new PIXI.Sprite(
                Game.PIXI.loader.resources["./images/level/level1.png"].texture
            );
            Game.PIXI.stage.addChild(background);

            // Add player
            let player = new Player(Game.PIXI.stage);

            // Start gameloop
            requestAnimationFrame(gameLoop);
        }
    
        function gameLoop() {
            // Render stage
            Game.PIXI.renderer.render(Game.PIXI.stage);
                requestAnimationFrame(gameLoop);
            }
        }
    }

window.addEventListener("load", ()=> {
    Game.getInstance()
})
