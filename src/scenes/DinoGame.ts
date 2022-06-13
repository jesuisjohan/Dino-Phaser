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
    private gameSpeed = 5;
    private isGameRunning = false;
    private respawnTime = 0;

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    private dinoState = DinoState.Idle;

    private clouds!: Phaser.GameObjects.Group;

    private obstacles!: Phaser.Physics.Arcade.Group;

    constructor() {
        super(DinoSceneKeys.Game);
    }

    init() {
        this.score = 0;
        this.gameSpeed = 5;
        this.isGameRunning = false;
        this.respawnTime = 0;
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
            .setAlpha(0);

        this.highScoreLabel = this.add
            .text(0, 0, "00000", {
                color: "#535353",
                font: "900 35px Courier",
                resolution: 5,
            })
            .setOrigin(0, 0)
            .setAlpha(0);

        this.clouds = this.add.group();
        this.clouds.addMultiple([
            this.add.image(width / 2, 170, DinoTextureKeys.Cloud),
            this.add.image(width - 80, 80, DinoTextureKeys.Cloud),
            this.add.image(width / 1.3, 100, DinoTextureKeys.Cloud),
        ]);
        this.clouds.setAlpha(0);

        this.obstacles = this.physics.add.group();

        this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height - 1);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.overlap(this.dino, this.startTrigger, this.handleStartTrigger, undefined, this);

        this.physics.add.collider(
            this.dino,
            this.obstacles,
            () => {
                this.highScoreLabel.x = this.scoreLabel.x - this.scoreLabel.width - 20;
                const scoreNum = parseInt(this.scoreLabel.text);
                const highScoreNum = parseInt(this.highScoreLabel.text);
                const newScore = scoreNum > highScoreNum ? scoreNum : highScoreNum;

                this.highScoreLabel.text = newScore.toString();
                this.highScoreLabel.setAlpha(1);
            },
            undefined,
            this
        );
    }

    handleInputs() {
        const body = this.dino.body as Phaser.Physics.Arcade.Body;
        const vy = 1600;
        if (this.cursors.down?.isDown) {
            console.log("press down");
            body.setVelocityY(vy);
            this.dino.play(DinoAnimationKeys.DinoDown, true);
            body.setSize(118, 58);
            body.offset.y = 34;
        } else if (this.cursors.space?.isDown || this.cursors.up?.isDown) {
            console.log("press up");
            if (!body.blocked.down || body.velocity.x > 0 || this.cursors.down.isDown) return;
            this.jumpSound.play();
            body.setVelocityY(-vy);
            console.log("jump");
            this.dino.anims.stop();
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
                    this.ground.width += 5;
                }

                if (this.ground.width >= 1000) {
                    this.ground.width = width;
                    this.isGameRunning = true;
                    body.setVelocityX(0);
                    this.clouds.setAlpha(1);
                    startEvent.remove();
                }
            },
        });
    }

    pressSpace2Start() {
        const body = this.dino.body as Phaser.Physics.Arcade.Body;
        if (this.cursors.space?.isDown || this.cursors.up?.isDown) {
            this.jumpSound.play();
            body.setVelocityY(-1600);
            console.log("start game");
        }
    }
    /**
     * get random integer
     * @param max not include this max
     * @returns all numbers less than max
     */
    getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }

    spawnObstacles() {
        const { width, height } = this.scale;
        const numObstacles = this.getRandomInt(6) + 1;
        const distance = Phaser.Math.Between(600, 900);

        let obstacle: Phaser.Physics.Arcade.Sprite;
        if (numObstacles > 5) {
            const enemyHeight = [20, 50];
            obstacle = this.obstacles
                .create(width + distance, height - enemyHeight[this.getRandomInt(2)], DinoTextureKeys.EnemyBird)
                .setOrigin(0, 1);
            obstacle.play(DinoAnimationKeys.EnemyBird, true);
        } else {
            let textureKey!: DinoTextureKeys;
            let cactusHeight!: number
            switch (numObstacles) {
                case 1: {
                    textureKey = DinoTextureKeys.Obstacle1;
                    cactusHeight = 70
                    break;
                }
                case 2: {
                    textureKey = DinoTextureKeys.Obstacle2;
                    cactusHeight = 70
                    break;
                }
                case 3: {
                    textureKey = DinoTextureKeys.Obstacle3;
                    cactusHeight = 70
                    break;
                }
                case 4: {
                    textureKey = DinoTextureKeys.Obstacle4;
                    cactusHeight = 96
                    break;
                }
                case 5: {
                    textureKey = DinoTextureKeys.Obstacle5;
                    cactusHeight = 96
                    break;
                }
                case 6: {
                    textureKey = DinoTextureKeys.Obstacle6;
                    cactusHeight = 98
                    break;
                }
            }
            obstacle = this.obstacles.create(width + distance, height - cactusHeight + 34, textureKey)
            // const obstacleBody = obstacle.body as Phaser.Physics.Arcade.StaticBody;
        }
        const obstacleBody = obstacle.body as Phaser.Physics.Arcade.Body;
        obstacleBody.setImmovable();
    }

    update(t: number, dt: number) {
        if (!this.isGameRunning) {
            this.pressSpace2Start();
            return;
        }
        this.ground.tilePositionX += this.gameSpeed;
        this.handleInputs();
        Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed);
        Phaser.Actions.IncX(this.clouds.getChildren(), -0.5);
        this.respawnTime += dt * this.gameSpeed * 0.05;
        if (this.respawnTime >= 1500) {
            this.spawnObstacles();
            this.respawnTime = 0;
        }
        this.handleExcessObstacles();
        this.wrapClouds();
    }

    handleExcessObstacles() {
        this.obstacles.getChildren().forEach((obstacle) => {
            const body = obstacle.body as Phaser.Physics.Arcade.Body;
            const rightEdge = body.x + body.width;
            if (rightEdge < 0) {
                console.log('killed')
                this.obstacles.killAndHide(obstacle);
            }
        });
    }

    wrapClouds() {
        // this.clouds.getChildren().forEach((cloud) => {
        //     const body = cloud.body as Phaser.Physics.Arcade.Body;
        //     const rightEdge = body.x + body.width;
        //     if (rightEdge < 0) {
        //         const { width, height } = this.scale;
        //         body.position.x = width + 30;
        //     }
        // });
    }
}
