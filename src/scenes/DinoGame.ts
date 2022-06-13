import DinoAnimationKeys from "~/consts/DinoAnimationKeys";
import Phaser from "phaser";
import DinoSceneKeys from "~/consts/DinoSceneKeys";
import DinoAudioKeys from "~/consts/DinoAudioKeys";
import DinoTextureKeys from "~/consts/DinoTextureKeys";

enum DinoState {
    Idle,
    Run,
    Jump,
    Duck,
    Dead,
}

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

    private dinoState = DinoState.Idle;

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

        const startTrigger= this.physics.add.sprite(1, 10, "").setOrigin(0, 0).setImmovable().setVisible(false);

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

        this.scoreLabel = this.add
            .text(width, 0, "00000", {
                color: "#535353",
                font: "900 35px Courier",
                resolution: 5,
            })
            .setOrigin(1, 0)
            .setAlpha(1);

        this.highScoreLabel = this.add
            .text(0, 0, "00000", {
                color: "#535353",
                font: "900 35px Courier",
                resolution: 5,
            })
            .setOrigin(0, 0)
            .setAlpha(1);

        this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height - 1);
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    handleInputs() {
        const body = this.dino.body as Phaser.Physics.Arcade.Body;
        const vy = 1600;
        if (this.cursors.space?.isDown || this.cursors.up?.isDown) {
            if (!body.blocked.down || body.velocity.x > 0 || this.cursors.down.isDown) return;
            this.jumpSound.play();
            body.setVelocityY(-vy);
            console.log("jump");
            this.dino.anims.stop();
        } else if (this.cursors.down?.isDown) {
            body.setVelocityY(vy);
            this.dino.play(DinoAnimationKeys.DinoDown, true);
            body.setSize(118, 58);
            body.offset.y = 34;
        } else {
            this.dino.play(DinoAnimationKeys.DinoRun, true);
            body.setSize(88, 92);
            body.offset.y = 0;
        }

        switch (this.dinoState) {
            case DinoState.Idle: {
                break;
            }
            case DinoState.Run: {
                break;
            }
            case DinoState.Jump: {
                break;
            }
            case DinoState.Duck: {
                break;
            }
            case DinoState.Dead: {
                break;
            }
        }
    }

    update() {
        this.ground.tilePositionX += this.gameSpeed;
        this.handleInputs();
    }
}
