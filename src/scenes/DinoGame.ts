import DinoAnimationKeys from "~/consts/DinoAnimationKeys";
import Phaser, { HEADLESS } from "phaser";
import DinoSceneKeys from "~/consts/DinoSceneKeys";
import DinoAudioKeys from "~/consts/DinoAudioKeys";
import DinoTextureKeys from "~/consts/DinoTextureKeys";

export default class DinoGame extends Phaser.Scene {
    // audio
    private jumpSound!: Phaser.Sound.BaseSound;
    private hitSound!: Phaser.Sound.BaseSound;
    private reachSound!: Phaser.Sound.BaseSound;

    private ground!: Phaser.GameObjects.TileSprite;
    private dino!: Phaser.GameObjects.Sprite;

    private scoreLabel!: Phaser.GameObjects.Text;
    private highScoreLabel!: Phaser.GameObjects.Text;

    private score = 0;
    private gameSpeed = 10;

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super(DinoSceneKeys.Game);
    }

    init() {
        this.score = 0;
        this.gameSpeed = 10;
    }

    create() {
        const { width, height } = this.scale;

        // audio
        this.jumpSound = this.sound.add(DinoAudioKeys.Jump, { volume: 0.2 });
        this.hitSound = this.sound.add(DinoAudioKeys.Hit, { volume: 0.2 });
        this.reachSound = this.sound.add(DinoAudioKeys.Reach, { volume: 0.2 });

        // ground

        this.ground = this.add.tileSprite(0, height, width, 26, DinoTextureKeys.Ground).setOrigin(0, 1);
        this.dino = this.physics.add
            .sprite(1, height, DinoTextureKeys.Dino)
            .play(DinoAnimationKeys.DinoRun)
            .setCollideWorldBounds(true)
            .setGravityY(5000)
            .setBodySize(88, 92)
            .setDepth(1)
            .setOrigin(0, 1);
        this.physics.world.setBounds(0,0, Number.MAX_SAFE_INTEGER, height - 50)
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    handleInputs() {
        const body = this.dino.body as Phaser.Physics.Arcade.Body;
        if (this.cursors.space?.isDown || this.cursors.up?.isDown) {
            if (!body.blocked.down || body.velocity.x > 0) return;
            this.jumpSound.play();
            body.setVelocityY(-1600);
            // body.offset.y = 0
            console.log("jump");
            this.dino.anims.stop();
        } else if (this.cursors.down?.isDown) {
            body.setVelocityY(1600);
            this.dino.play(DinoAnimationKeys.DinoDown, true);
            body.setSize(118, 58);
            body.offset.y = 34
        } else {
            this.dino.play(DinoAnimationKeys.DinoRun, true);
            body.setSize(88, 92);
            body.offset.y = 0
        }
    }

    update() {
        this.ground.tilePositionX += this.gameSpeed;
        this.handleInputs();
    }
}
