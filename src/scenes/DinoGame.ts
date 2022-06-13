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
    private startTrigger!: Phaser.GameObjects.Sprite;

    private scoreLabel!: Phaser.GameObjects.Text;
    private highScoreLabel!: Phaser.GameObjects.Text;

    private score = 0;
    private gameSpeed = 10;
    private isGameRunning = false;

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    private dinoState = DinoState.Idle;

    constructor() {
        super(DinoSceneKeys.Game);
    }

    init() {
        this.score = 0;
        this.gameSpeed = 10;
        this.isGameRunning = false;
    }

    create() {
        const { width, height } = this.scale;

        // audio
        this.jumpSound = this.sound.add(DinoAudioKeys.Jump, { volume: 0.2 });
        this.hitSound = this.sound.add(DinoAudioKeys.Hit, { volume: 0.2 });
        this.reachSound = this.sound.add(DinoAudioKeys.Reach, { volume: 0.2 });

        this.startTrigger = this.physics.add.sprite(1, 10, "").setOrigin(0, 0).setImmovable().setVisible(false);

        // ground
        this.ground = this.add.tileSprite(0, height, 88, 26, DinoTextureKeys.Ground).setOrigin(0, 1);
        this.dino = this.physics.add
            .sprite(1, height, DinoTextureKeys.Dino)
            .play(DinoAnimationKeys.DinoIdle)
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
        this.physics.add.overlap(this.dino, this.startTrigger, this.handleStartTrigger, undefined, this);
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

    /**
     * Turn off start trigger when start the game
     * @returns None
     */
    handleStartTrigger() {
        const { width, height } = this.scale;
        const startTriggerBody = this.startTrigger.body as Phaser.Physics.Arcade.Body;
        if (this.startTrigger.y == 10) {
            this.startTrigger.setOrigin(0, 1);
            startTriggerBody.reset(0, height); // bring trigger start to foot of dino for else branch
            return;
        }

        this.startTrigger.setActive(false);
        const body = this.dino.body as Phaser.Physics.Arcade.Body;

        const startEvent = this.time.addEvent({
            delay: 1000 / 60,
            loop: true,
            callbackScope: this,
            callback: () => {
                body.setVelocityX(80);
                this.dino.play(DinoAnimationKeys.DinoRun, true);

                if (this.ground.width < width) {
                    console.log("grow");
                    this.ground.width += 17 * 2;
                }

                if (this.ground.width >= 1000) {
                    this.ground.width = width;
                    this.isGameRunning = true;
                    body.setVelocityX(0);
                    startEvent.remove();
                }
            },
        });
    }

    update() {
        // if (!this.isGameRunning) return;
        this.ground.tilePositionX += this.gameSpeed;
        this.handleInputs();
    }
}
