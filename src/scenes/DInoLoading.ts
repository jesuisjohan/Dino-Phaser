import Phaser from "phaser";
import DinoSceneKeys from "~/consts/DinoSceneKeys";
import DinoTextureKeys from "~/consts/DinoTextureKeys";
import DinoAudioKeys from "~/consts/DinoAudioKeys";
import DinoAnimationKeys from "~/consts/DinoAnimationKeys";

export default class DinoLoading extends Phaser.Scene {
    private debug!: Phaser.GameObjects.Graphics;
    private progress = 0;

    constructor() {
        super(DinoSceneKeys.Loading);
    }

    create() {
        this.debug = this.add.graphics();
    }

    update(time: number, deltaTime: number) {
        const { width, height } = this.scale;
        this.debug.clear();
        const barWidth = 600;
        const barHeight = 48
        this.debug.fillStyle(0x2d2d2d);
        this.debug.fillRect(width / 2 - barWidth / 2, height / 2 - barHeight / 2, barWidth, barHeight);

        this.debug.fillStyle(0x2dff2d);
        this.debug.fillRect(width / 2 - barWidth / 2, height / 2 - barHeight / 2, barWidth * this.progress, barHeight);

        this.progress += deltaTime * 0.0003;
        if (this.progress > 1) {
            this.progress = 1;
            this.scene.start(DinoSceneKeys.Game);
        }
    }
}
