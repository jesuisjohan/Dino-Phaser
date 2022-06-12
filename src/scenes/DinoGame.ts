import Phaser from "phaser";
import SceneKeys from "~/consts/SceneKeys";
import DinoAudioKeys from "~/consts/DinoAudioKeys";

export default class DinoGame extends Phaser.Scene {
    // audio
    private jumpSound!: Phaser.Sound.BaseSound;
    private hitSound!: Phaser.Sound.BaseSound;
    private reachSound!: Phaser.Sound.BaseSound;

    private ground!: Phaser.GameObjects.TileSprite;

    private scoreLabel!: Phaser.GameObjects.Text;
    private highScoreLabel!: Phaser.GameObjects.Text;

    private score = 0;

    constructor() {
        super(SceneKeys.Game);
    }

    init() {
        this.score = 0;
    }

    create() {
        const { width, height } = this.scale;

        // audio
        this.jumpSound = this.sound.add(DinoAudioKeys.Jump, { volume: 0.2 });
        this.hitSound = this.sound.add(DinoAudioKeys.Hit, { volume: 0.2 });
        this.reachSound = this.sound.add(DinoAudioKeys.Reach, { volume: 0.2 });

        // text
        this.scoreLabel = this.add
            .text(width, 0, "00000", { fill: "#535353", font: "900 35px Courier", resolution: 5 })
            .setOrigin(1, 0)
            .setAlpha(0);

        this.highScoreLabel = this.add
            .text(0, 0, "00000", { fill: "#535353", font: "900 35px Courier", resolution: 5 })
            .setOrigin(1, 0)
            .setAlpha(0);
    }

    update() {}
}
