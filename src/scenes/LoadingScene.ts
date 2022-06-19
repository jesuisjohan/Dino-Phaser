import Phaser from "phaser"
import DinoSceneKeys from "~/consts/SceneKeys"
import DinoAudioKeys from "~/consts/AudioKeys"

export default class DinoLoading extends Phaser.Scene {
    private debug!: Phaser.GameObjects.Graphics
    private progress = 0
    private percentageLabel!: Phaser.GameObjects.Text
    private loadingLabel!: Phaser.GameObjects.Text
    private intro!: Phaser.Sound.BaseSound

    constructor() {
        super(DinoSceneKeys.Loading)
    }

    create() {
        this.debug = this.add.graphics()
        this.createSounds()
        this.createPercentageLabel()
        this.createLoadingLabel()
    }

    private createSounds() {
        this.intro = this.sound.add(DinoAudioKeys.Intro, { volume: 0.2 })
        this.intro.play()
    }

    private createPercentageLabel() {
        const { width } = this.scale
        this.percentageLabel = this.add
            .text(width, 0, "0%", {
                color: "#535353",
                font: "900 35px Courier",
                resolution: 5,
            })
            .setOrigin(1, 0)
    }

    private createLoadingLabel() {
        this.loadingLabel = this.add
            .text(0, 0, "VER 1.1 LOADING...", {
                color: "#535353",
                font: "900 35px Courier",
                resolution: 5,
            })
            .setOrigin(0, 0)

        this.tweens.add({
            targets: this.loadingLabel,
            duration: 500,
            repeat: -1,
            ease: Phaser.Math.Easing.Sine.InOut,
            alpha: 0.5,
            yoyo: true,
        })
    }

    update(time: number, deltaTime: number) {
        // this.scene.start(DinoSceneKeys.Game)
        // return
        const { width, height } = this.scale
        const displayProgress = this.progress > 1 ? 1 : this.progress
        this.debug.clear()
        const barWidth = 600
        const barHeight = 48
        // housing
        this.debug.fillStyle(0x2d2d2d)
        this.debug.fillRect(width / 2 - barWidth / 2, height / 2 - barHeight / 2, barWidth, barHeight)
        // filling
        this.debug.fillStyle(0x2dff2d)
        this.debug.fillRect(width / 2 - barWidth / 2, height / 2 - barHeight / 2, barWidth * displayProgress, barHeight)

        this.progress += deltaTime * 0.0003
        if (this.progress > 1 
            && !this.intro.isPlaying
            ) {
            this.scene.start(DinoSceneKeys.Game)
        }
        this.percentageLabel.setText(`${Math.round(displayProgress * 100)}%`)
    }
}
