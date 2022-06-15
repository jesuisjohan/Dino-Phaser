import Phaser from "phaser";

import DinoPreloader from "./scenes/DinoPreloader";
import DinoGame from "./scenes/DinoGame";
import DinoGameOver from "./scenes/DinoGameOver";
import DinoLoading from "./scenes/DinoLoading";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1000, // 800,
    height: 350, //640,
    pixelArt: true,
    transparent: true, // light - true, dark - false
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
        },
    },
    scene: [DinoPreloader, DinoLoading, DinoGame, DinoGameOver],
};

export default new Phaser.Game(config);
