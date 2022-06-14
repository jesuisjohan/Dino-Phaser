import DinoTextureKeys from "~/consts/DinoTextureKeys"
import Phaser from "phaser"
import DinoSceneKeys from "~/consts/DinoSceneKeys"
import DinoAudioKeys from "~/consts/DinoAudioKeys"

export default class DinoGameOver extends Phaser.Scene {
    constructor() {
        super(DinoSceneKeys.GameOver)
    }

    private create() {
        this.createGameOverScreen()
    }

    private createGameOverScreen() {
        const { width, height } = this.scale

        const gameOverScreen = this.add.container(width / 2, height / 2 - 50).setAlpha(1)
        const gameOverText = this.add.image(0, 0, "game-over")
        const restart = this.add.image(0, 80, DinoTextureKeys.Restart).setInteractive()
        gameOverScreen.add([gameOverText, restart])

        restart.on("pointerdown", () => {
            this.scene.stop(DinoSceneKeys.GameOver)
            this.scene.stop(DinoSceneKeys.Game)
            this.scene.start(DinoSceneKeys.Game)
        })
    }
}
