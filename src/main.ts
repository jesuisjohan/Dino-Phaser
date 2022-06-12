import Phaser from "phaser";

// import HelloWorldScene from './scenes/HelloWorldScene'

// import Preloader from "./scenes/Preloader";
// import Game from "./scenes/Game";
// import GameOver from "./scenes/GameOver";
import DinoPreloader from "./scenes/DinoPreloader";
import DinoGame from "./scenes/DinoGame";
import DinoGameOver from "./scenes/DinoGameOver";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1000, // 800,
    height: 340, //640,
    pixelArt: true,
    transparent: true, // light - true, dark - false
    physics: {
        default: "arcade",
        arcade: {
            // gravity: { y: 400 },
            debug: true,
        },
    },
    // scene: [HelloWorldScene]
    // scene: [Preloader, Game, GameOver],
    scene: [DinoPreloader, DinoGame, DinoGameOver]
};

export default new Phaser.Game(config);
