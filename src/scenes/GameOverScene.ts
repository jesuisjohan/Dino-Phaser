import Phaser from "phaser"
import DinoTextureKeys from "~/consts/TextureKeys"
import DinoSceneKeys from "~/consts/SceneKeys"
import DinoAudioKeys from "~/consts/AudioKeys"

export default class DinoGameOver extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

    constructor() {
        super(DinoSceneKeys.GameOver)
    }

    create() {
        this.createGameOverScreen()
        this.createInput()
    }

    private createInput() {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    private createGameOverScreen() {
        const { width, height } = this.scale

        const gameOverScreen = this.add.container(width / 2, height / 2 - 50).setAlpha(1)
        const gameOverText = this.add.image(0, 0, "game-over")
        const restart = this.add.image(0, 80, DinoTextureKeys.Restart).setInteractive()
        gameOverScreen.add([gameOverText, restart])

        restart.on("pointerdown", () => {
            this.restartGame()
        })
    }
    
    private restartGame() {
        this.scene.stop(DinoSceneKeys.GameOver)
        this.scene.stop(DinoSceneKeys.Game)
        this.scene.start(DinoSceneKeys.Game)    
    }

    update() {
        if (this.cursors.space?.isDown) {
            this.restartGame()
        }
    }
}
