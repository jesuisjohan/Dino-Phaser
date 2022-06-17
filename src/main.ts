import Phaser from "phaser"

import DinoPreloader from "./scenes/PreloaderScene"
import DinoGame from "./scenes/GameScene"
import DinoGameOver from "./scenes/GameOverScene"
import DinoLoading from "./scenes/LoadingScene"

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1000, // 800,
    height: 400, //640,
    pixelArt: true,
    transparent: true, // light - true, dark - false
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
        },
    },
    scene: [DinoPreloader, DinoLoading, DinoGame, DinoGameOver],
}

export default new Phaser.Game(config)
