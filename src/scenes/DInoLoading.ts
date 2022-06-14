import Phaser from "phaser";
import DinoSceneKeys from "~/consts/DinoSceneKeys";
import DinoTextureKeys from "~/consts/DinoTextureKeys";
import DinoAudioKeys from "~/consts/DinoAudioKeys";
import DinoAnimationKeys from "~/consts/DinoAnimationKeys";

export default class DinoLoading extends Phaser.Scene {
    private debug!: Phaser.GameObjects.Graphics;
    private progress = 0;
    private percentageLabel!: Phaser.GameObjects.Text;
    private loadingLabel!: Phaser.GameObjects.Text;

    constructor() {
        super(DinoSceneKeys.Loading);
    }

    create() {
        this.debug = this.add.graphics();
        this.createPercentageLabel();
        this.createLoadingLabel();
    }

    createPercentageLabel() {
        const { width, height } = this.scale;
        this.percentageLabel = this.add
            .text(width, 0, "0%", {
                color: "#535353",
                font: "900 35px Courier",
                resolution: 5,
            })
            .setOrigin(1, 0);
    }

    createLoadingLabel() {
        this.loadingLabel = this.add
            .text(0, 0, "LOADING...", {
                color: "#535353",
                font: "900 35px Courier",
                resolution: 5,
            })
            .setOrigin(0, 0);
        
        this.tweens.add({
            targets: this.loadingLabel,
            duration: 1000,
            repeat: -1,
            ease: Phaser.Math.Easing.Sine.InOut,
            alpha: 0.6,
            yoyo: true,
        })
    }

    update(time: number, deltaTime: number) {
        const { width, height } = this.scale;
        const displayProgress = this.progress > 1 ? 1 : this.progress;
        this.debug.clear();
        const barWidth = 600;
        const barHeight = 48;
        this.debug.fillStyle(0x2d2d2d);
        this.debug.fillRect(width / 2 - barWidth / 2, height / 2 - barHeight / 2, barWidth, barHeight);

        this.debug.fillStyle(0x2dff2d);
        this.debug.fillRect(
            width / 2 - barWidth / 2,
            height / 2 - barHeight / 2,
            barWidth * displayProgress,
            barHeight
        );

        this.progress += deltaTime * 0.0003;
        if (this.progress > 1.5) {
            this.scene.start(DinoSceneKeys.Game);
        }
        this.percentageLabel.setText(`${Math.round(displayProgress * 100)}%`);
    }
}
